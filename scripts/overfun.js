(function(global, factory) {
  if (typeof module == "object" && typeof module.exports == "object") {
    module.exports = factory(global);
  } else {
    global.OFun = global.OFUN = factory(global);
  }

})(self, function(global) {
  var OFun, IsBadTypes;

  IsBadTypes = function(types, match) {
    if (typeof types == "object") {
      if (Array.isArray(types)) {
        if (types?.length != match?.length) return true;
        return match.some((e, i) => {
          return IsBadTypes(types[i], e);
        });
      } else {
        let keys_ = Object.keys(types);
        return keys_.some((e, i) => {
          if (types[e] == 0 || types[e] == "any") {
            return false;
          }

          if (!types[e]) return true;

          if (typeof match[e] == types[e]) {
            
            return false;
          }

          return true;

        });
      }
    } else if (types == "any" || types == 0) { 
      return false;
    } else {
      return !(typeof match == types);
    }
  }

  OFun = function(...o) {
    let fns = [];
    for (let i = 0; i < o.length; i+=2) {
      if (Array.isArray(o[i]) && typeof o[i+1] == "function") {
        fns.push({
          types: o[i],
          fn: o[i+1]
        });
      }
    }

    return function(...args) {
      let function_ = fns.find(({types, fn}) => {
        let isMatched = IsBadTypes(types, args);
        return !isMatched;
      });

      if (!function_ || !function_?.fn) {
        throw Error("function is undefined");
      }

      return function_.fn(...args);
    }
  }

  
  return OFun;
  
});
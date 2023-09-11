(function(global, factory) {

  if (!global?.OFUN) {
    throw Error("Module 'overfun' is not include");
  }

  const SimpleTranslator = factory(global);
  if (typeof module == "object" && typeof module.exports == "object") {
    module.exports = {SimpleTranslator};
    return;
  }
  if (!SimpleTranslator) {
    throw Error("SimpleTranslator is undefined");
  }
  global.SimpleTranslator = SimpleTranslator;

})(self, function(global) {
  var SimpleTranslator, CustormInput;

  

  CustormInput = function (o) {
    const mainElement = OFUN(
      ["string"],
      function(selector) {
        return global.document.querySelector(selector);
      },
      [0],
      function(element) {
        return element;
      }
    )(o);
    mainElement.addEventListener("keypress", function(ev) {

    });
  }

  SimpleTranslator = function(o) {
    this.mainElement = OFUN(
      ["string"],
      function(selector) {
        return {e:global.document.querySelector(selector)};
      },
      [0],
      function(element) {
        return {e:element};
      }
    )(o).e;

    if (!this.mainElement) throw Error("Element undefined");
    this.links = {};

    this.links.type = this.mainElement.dataset.translatated;
  }

  SimpleTranslator.prototype.initDB = async function(path) {
    var fetch_ = await fetch(path),
      json = await fetch_.json();
    this.db = json;

    this.setDBLang();
  }

  SimpleTranslator.prototype.setDBLang = async function(lang = this.links.type) {
    this.links.localDB  = this.db.find(e=>e.type.includes(lang));
    this.links.fromLang = lang.split("-")[0];
    this.links.toLang   = lang.split("-")[1];
  }

  SimpleTranslator.prototype.translate = async function(text) {
    var listOfWords, matched, word, listOfMatched, translatated = [], circleCount;
    listOfWords = [...text.matchAll(/(\w+)/gm)].map(e=>e[1]);

    while(listOfWords.length > 0 || circleCount <= 1000) {
      word = listOfWords.shift();

      matched = this.links.localDB.words.filter(
        w => w[this.links.fromLang].split(" ")[0] == word
        ).sort(
          (a, b) => b[this.links.fromLang].length - a[this.links.fromLang].length
          );

      listOfWords.unshift(word);
      let one = matched.find((m)=>{
        listOfMatched = [...m[this.links.fromLang].matchAll(/(\w+)/gm)].map(e=>e[1]);
        let temp = [...listOfWords];

        let r = !listOfMatched.some((e) => {
          word = listOfWords.shift();
          if (e==word) {
            return false;
          } else {
            listOfWords.unshift(word);
            return true;
          }

        });
        if (r) return true; 
        else {
          listOfWords = [...temp];
          return false;
        };
      });
      if (!!one) {
        translatated.push(...one[this.links.toLang].split(" "));
      } else {
        return undefined;
      }
      circleCount++;
    }

    return translatated.join(" ");
  }



  SimpleTranslator.prototype.reverseDirection = async function() {
    [this.links.toLang, this.links.fromLang] = [this.links.fromLang, this.links.toLang];
  }


  SimpleTranslator.prototype.start = async function() {
    
  }

  return SimpleTranslator;

});
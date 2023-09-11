// var fn = OFun(
//   ["string"], 
//   function(selector) {
//     console.log(selector);
//   },
//   [{element: "any"}], 
//   function({element}) {
//     console.log(element);
//   }
// );

// fn("some selector");
// fn({element: {msg: "some element"}});

window.addEventListener("load", function() {
  
  const translator = new SimpleTranslator(".translator");
  
  translator.initDB("./db/index.json");
  
  translator.start();

  this.document.querySelector(".translator .reverse")
    .addEventListener("click", async function(ev) {
      [
        document.querySelector(".translator .right").querySelector("textarea").value,
        document.querySelector(".translator .left").querySelector("textarea").value,
      ] = [
        document.querySelector(".translator .left").querySelector("textarea").value,
        document.querySelector(".translator .right").querySelector("textarea").value,
      ];

      if (document.querySelector(".translator .right").querySelector("textarea").getAttribute("placeholder") == "ru") {
        document.querySelector(".translator .right").querySelector("textarea").setAttribute("placeholder", "trt");
        document.querySelector(".translator .left").querySelector("textarea").setAttribute("placeholder", "ru");
      } else {
        document.querySelector(".translator .left").querySelector("textarea").setAttribute("placeholder", "trt");
        document.querySelector(".translator .right").querySelector("textarea").setAttribute("placeholder", "ru");
      }

      translator.reverseDirection();
    });

  this.document.querySelector(".translator .left")
    .addEventListener("input", async function(ev) {
      let result = await translator.translate(this.querySelector("textarea").value);
      // if (!result) return;
      document.querySelector(".translator .right").querySelector("textarea").value = result??"";
      // console.log(result);
    });

});
// console.log(translator.db)
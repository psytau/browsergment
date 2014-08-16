// Read the Phantom webpage '#intro' element text using jQuery and "includeJs"

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open("http://localhost:8080/test-text.html", function(status) {
    if ( status === "success" ) {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
          page.includeJs("http://localhost:8080/brow-segment.js", function() {
              page.evaluate(function() {
                  //console.log("$(\"#intro\").text() -> " + $("p").text());
                var getTextNodes = function (elm) {
                  return elm.contents().filter(function() {
                    return this.nodeType == 3;
                  });
                };
                wordRange = function (elm, offset) {
                  var text = $("p").text();
                  console.log(text);
                  var start;
                  var range;
                  range = document.createRange();
                  range.setStart(elm, offset);
                  range.expand('word');
                  start = range.startOffset;
                  end = range.endOffset;
                  // var seg = BrowSegment.fullWord($("p")[0], 0);
                  console.log("len: " + text.length);
                  console.log("start: " + start + "end: " + end);
                };
              });
              phantom.exit();
          });
        });
    }
});

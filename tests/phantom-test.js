// http://www.phantomjs.org/
//
//
phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};

var BrowSegment = {};
(function (exports) {
  exports.fullWord = function (node, offset) {
    var word, end, start;
    var range = document.createRange();
    range.setStart(offset).expand('word');
    start = range.startOffset;
    end = range.endOffset;
    return {
      word: word,
      start: start,
      end: end
    };
  };
}(BrowSegment));


var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

console.log('[phantomjs] Loading page...');
var x = 1;

page.open('http://localhost:8080/test-text.html', function(status){
  if (status !== 'success') {
    console.log('could not retrieve!');
  } else {
    console.log('opend');
      page.evaluate(function(){
        console.log('[phantomjs] Querying for post titles...');
      });
     page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js', function () {
       console.log('included');
       page.evaluate(function(){
         console.log('[phantomjs] Querying for post titles...');
       });
       phantom.exit();
     });
  }
  phantom.exit();
});

/*jshint indent: 2*/
(function ($) {
  var nextWord = function nextWord (range, words) {
    var word = null;
    range.setStart(range.endContainer, range.endOffset);
    try {
      // range.setEnd(range.endContainer, range.endOffset+1);
      range.expand('word');
      words.push(range.toString());
      word = range.toString();
    }
    catch (e) {
      // find out what went wrong...
      console.log(e);
      return null;
    }
    return word;
  }

  // segment the node, stop, and return tokens
  // store tokens in words array
  var segmentNode = function segmentNode (node) {
    var words = [];
    var range = document.createRange();
    var initialPos = 0;
    var len = $(node).text().length;
    range.setStart(node, initialPos);
    //range.setEnd(p, initial_pos+1);
    range.setEnd(node, initialPos);
    // var parentNode = range.parentNode;
    var word = nextWord(range, word);
    // for some reason, ranges allow runover into the next node, but not the node following that.
    // when it bleeds into the next, it pops up a level to a non-text node type
    // check for nodeType 3 to make sure we never leave our text node
    // while (word && range.commonAncestorContainer.nodeType === 3) {
    // while (word && parentNode === range.parentNode) {
    //
    // we need to stop when we get to the end of the text node.
    while (word && range.endOffset < len-1) {
      word = nextWord(range, words);
    }
    return words;
  };

  // apply fn to each node
  var eachTextNode = function eachTextNode (node, fn) {
    console.log('eachTextNode');
    console.dir(node);
    var contents = $(node).contents();
    var contentLength = contents.length;
    // itterate over each of the elements in the contents
    // if it is a textNode, 
    contents.each(function () {
      console.log('*** each: ' + this.nodeType);
      if (this.nodeType === 3) {
        console.log('*** node: ' + $(this).text() + $(this).text().length);
        console.log('***' + $(this).text());
        fn(this);
      }
      else {
        eachTextNode(this, fn);
      }
    });
    return node;
  };

  var replaceTextNodeWithSpans = function (node) {
    var tokens, spans, i;
    tokens = segmentNode(node);
    console.log('in replaceTextNodeWithSpans');
    console.log(tokens);
    spans = [];
    for(i=0; i<tokens.lenght; i++){
      // go and see how we do it in read-nose
      spans.push('<span class="word-' + tokens[i] + '">' + tokens[i] + '</span>');
    }
    console.log(node);
    node.html(spans.join(''));
  };

  // return words, and optionally call the passed fn on each word
  $.fn.broSegment = function (options) {
    var n, i, words;
    var nodes = this;
    console.log('bro!');
    for(i=0; i<nodes.length; i++) {
      console.log(n);
      n = nodes[i];
      // segmentNode(n, words);
      eachTextNode(n, replaceTextNodeWithSpans);
    }
    return this;
  };
})(jQuery);

/* global $, jQuery */
"use strict";

(function($) {
  var nextWord = function nextWord (range) {
    var word = null;
    range.setStart(range.endContainer, range.endOffset);
    try {
      range.expand('word');
      word = range.toString();
    }
    catch (e) {
      // TODO: test for type of error e.g. IndexSizeError
      // it is better to return null than to crash!
      console.log(e);
      return null;
    }
    return word;
  }

  // segment the node, stop, and return tokens
  var segmentNode = function segmentNode (node) {
    var toks, range, initialPosition, len;
    toks = [];
    range = document.createRange();
    initialPosition = 0;
    len = $(node).text().length;
    range.setStart(node, initialPosition);
    range.setEnd(node, initialPosition);
    var word = nextWord(range);
    toks.push(word);
    // for some reason, the ' ' in the front of some will bleed into the word
    // could hack it by trimming the word before adding it as a css name
    while(word && range.endOffset < len){
      word = nextWord(range);
      toks.push(word);
    }
    return toks;
  };

  // we don't want IFrames
  // contents() behaves strangely on IFrames
  var isUnwantedNode = function(node) {
    return $(node).prop('tagName') === 'IFRAME';
  };

  // apply fn to each textNode
  // traverse the tree until all textNodes are reached
  var eachTextNode = function eachTextNode (node, fn) {
    $(node).contents().each(function () {
      if (this.nodeType === 3) {
        fn(this);
      }
      else if ( ! isUnwantedNode(node) ) {
        eachTextNode(this, fn);
      }
      // else don't decend into IFrames.
      // $().contents() acts differently on IFrames, 
      // In short, we dont' want it.
    });
    return node;
  }

  var invalidCSSRegEx = /[\s~!@$%^&\*\(\)_+\-=,\.\/';:"\?><\[\]\\{\}|`\#]/;
  var isInvalidCSS = function (str) {
    return invalidCSSRegEx.test(str);
  };

  var defaultSurrounder = function (tok) {
    var trimmedToken = $.trim(tok); // range.expand('word') includes the next word with
                                    // the current whitespace under some circumstances.
    if( ! isInvalidCSS(trimmedToken) ) {
      return '<span class="word-' + trimmedToken + '">' + tok + '</span>';
    }
    else {
      return '<span>' + tok + '</span>';
    }
  };

  // node needs to be a text node (nodeType === 3)
  // uses replaceWith to replace the node with spans that contain classes
  // to help you find and manipulate the tokens later
  var replaceWordsWithSpans = function replaceWordsWithSpans(node, surrounder) {
    var toks, i, elms;
    toks = segmentNode(node);
    elms = [];
    surrounder = surrounder || defaultSurrounder;
    for(i=0; i<toks.length; i++) {
      elms.push(surrounder(toks[i]));
    }
    $(node).replaceWith($(elms.join('')));
  }

  var findTokens = function findTokens (rootNode) {
    var toks, tokenizeAndPush;
    toks = [];
    tokenizeAndPush = function(textNode) {
      var toksPartial;
      toksPartial = segmentNode(textNode);
      Array.prototype.push.apply(toks, toksPartial); // append toksPartial to toks
    };
    eachTextNode(rootNode, tokenizeAndPush);
    return toks;
  }

  $.fn.findAndSpanTokens = function (options) {
    var surrounder, nodes, i, fn;
    if(options){
      surrounder = options.surrounder;
      fn = function(rootNode) {
        return replaceWordsWithSpans(rootNode, surrounder);
      }
    }
    else {
      fn = replaceWordsWithSpans;
    }
    nodes = this;
    for(i=0; i<nodes.length; i++) {
      eachTextNode(nodes[i], fn);
    }
    return this;
  };
  $.fn.findTokens = function () {
    var nodes, i, toks, toksPartial;
    toks = [];
    nodes = this;
    for(i=0; i<nodes.length; i++) {
      toksPartial = findTokens(nodes[i]);
      Array.prototype.push.apply(toks, toksPartial); // append toksPartial to toks
    }
    return toks;
  };

  // for unit tests
  $._test = {};
  $._test.nextWord = nextWord;

}(jQuery));
  /* Example:

  $(function () {
    // get an array of words
    console.dir($('p').findTokens());
    // tag each word with a span
    $('p').findAndSpanTokens();
  });

  */

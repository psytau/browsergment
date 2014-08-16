/* global $ */
"use strict";


function nextWord (range) {
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
function segmentNode (node) {
  var toks, range, initialPosition, len;
  toks = [];
  range = document.createRange();
  initialPosition = 0;
  len = $(node).text().length;
  range.setStart(node, initialPosition);
  range.setEnd(node, initialPosition);
  var word = nextWord(range);
  toks.push(word);
  while(word && range.endOffset < len-1){
    word = nextWord(range);
    toks.push(word);
  }
  return toks;
}


// apply fn to each textNode
// traverse the tree until all textNodes are reached
function eachTextNode (node, fn) {
  $(node).contents().each(function () {
    if (this.nodeType === 3) {
      fn(this);
    }
    else {
      eachTextNode(this, fn);
    }
  });
  return node;
}

// node needs to be a text node (nodeType === 3)
// uses replaceWith to replace the node wit hspans that contain classes
// to help you find and manipulate the tokens later
function replaceWordsWithSpans(node, surrounder) {
  var toks, i, elms;
  toks = segmentNode(node);
  elms = [];
  surrounder = surrounder || function(tok) {
    // TODO: safety check tok before putting it into a class name
    return '<span class="word-' + tok + '">' + tok + '</span>';
  }
  for(i=0; i<toks.length; i++) {
    elms.push(surrounder(toks[i]));
  }
  $(node).replaceWith($(elms.join('')));
}

function findTokens (rootNode) {
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

$(function () {
  var p = $($('p')[0]);

  eachTextNode(p, replaceWordsWithSpans);
  eachTextNode($($('p')[1]), replaceWordsWithSpans);

  console.dir(findTokens(p));
});

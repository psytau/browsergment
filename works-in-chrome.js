

// // grab a node
// var p = $('p')[0];

// var words = [];

// // initial pos
// var initial_pos = 0;

// // set up initial range
// var range = document.createRange();
// range.setStart(p, initial_pos);
// //range.setEnd(p, initial_pos+1);
// range.setEnd(p, initial_pos);

// range.expand('word');

function initializeRange(node){
  var range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 1);
  return range;
}

function nextWord (range, words) {
  var word = null;
  console.log('in nextWord');
  range.setStart(range.endContainer, range.endOffset);
  console.log('range: ' + range.toString());
  try {
    // range.setEnd(range.endContainer, range.endOffset+1);
    range.expand('word');
    console.log('^^^^^^^' + range.toString());
    words.push(range.toString());
    word = range.toString();
  }
  catch (e) {
    console.log(e);
    return null;
    // if (e instanceof IndexSizeError) {
    //   return null;
    // }
  }
  return word;
}

// segment the node, stop, and return tokens
// IDEA: create a word array, and keep track of how many chars are in it
//       when the number of chars equals the number of chars in the textnode,
//       end.
function segmentNode (node) {
  console.log('in segmentNode');
  console.dir(node);
  var range = document.createRange();
  var initial_pos = 0;
  var len = $(node).text().length;
  range.setStart(node, initial_pos);
  //range.setEnd(p, initial_pos+1);
  range.setEnd(node, initial_pos);
  var parentNode = range.parentNode;
  var currentOffset = 0;
  var word = nextWord(range, words);
  console.log(word)
  // for some reason, ranges allow runover into the next node, but not the node following that.
  // when it bleeds into the next, it pops up a level to a non-text node type
  // check for nodeType 3 to make sure we never leave our text node
  while(word && range.endOffset < len-1){
  // while (word && range.commonAncestorContainer.nodeType === 3) {
  // while (word && parentNode === range.parentNode) {
    console.log('in segmentNode');
    console.log('nodeValue: ' + range.commonAncestorContainer.nodeValue + ' ' +
               range.commonAncestorContainer.nodeType + ' ' +
               range.collapsed);
    console.dir(range);
    console.log('>>>>>>>>>' + word);
    word = nextWord(range, words);
    console.log('>>>>>>>>> next word: ' + word);
  }
  return words;
}


// apply fn to each node
function eachTextNode (node, fn) {
  console.log('eachTextNode');
  console.dir(node);
  $(node).contents().each(function () {
    console.log('*** each: ' + this.nodeType);
    if (this.nodeType == 3) {
      console.log('*** node: ' + $(this).text() + $(this).text().length);
      console.log('***' + $(this).text());
      fn(this);
    }
    else {
      eachTextNode(this, fn);
    }
  });
  return node;
}

// words.forEach( function (w) {
//   console.log(w);
// });
var words = [];

$(function () {
  // p = $($('p')[0]).contents()[0];
  var p = $($('p')[0]);

  // range = initializeRange(p);
    eachTextNode(p, segmentNode);
    // eachTextNode($($('p')[1]), segmentNode);
  //segmentNode($('p')[0]);
  //segmentNode($('p')[1]);
    console.log(words);
});

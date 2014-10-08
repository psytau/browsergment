/*global $, describe, it, expect*/
'use strict';
var helpers = {};

(function () {
  var n = 0;
  var addTextHelper = function (content) {
    n++;
    return $('<div id="test-div-' + n + '"></div>').appendTo('body')
     .append(content);
  };
  helpers.addText = addTextHelper;
})();

// var removeTextHelper = function () {
//   $('#test-div').remove();
// };


describe('Unit tests', function() {
  var nodeCounter = 0;
  var setUp = function(testText) {
    var testDiv, node, nodeId;
    nodeCounter++;
    nodeId = 'test-u-' + nodeCounter;
    testDiv = helpers.addText('<p id="' + nodeId + '">' + testText + '</p>');
    node = testDiv.find('#' + nodeId).contents()[0];
    expect(node.nodeType).toBe(3);

    var toks, range, initialPosition, len;
    toks = [];
    range = document.createRange();
    initialPosition = 0;
    len = $(node).text().length;
    range.setStart(node, initialPosition);
    range.setEnd(node, initialPosition);

    return {node: node, range: range, testDiv: testDiv};
  };
  it('can move to the next word', function() {

    var o = setUp('test segment');

    var word = $._test.nextWord(o.range);

    expect(word).toBe('test');

    expect($._test.nextWord(o.range)).toBe(' ');
    expect($._test.nextWord(o.range)).toBe('segment');

    o.testDiv.remove();

  });

  it('contains the first whitespace in a span because that is how range.expand functions', function () {
    var testDiv, node;
    testDiv = helpers.addText('<p><span> a </span> <span id="test-span"> dog walked. </span></p>');
    node = testDiv.find('#test-span').contents()[0];
    expect(node.nodeType).toBe(3);

    var toks, range, initialPosition, len;
    toks = [];
    range = document.createRange();
    initialPosition = 0;
    len = $(node).text().length;
    range.setStart(node, initialPosition);
    range.setEnd(node, initialPosition);

    expect($._test.nextWord(range)).toBe('  dog');
    expect($._test.nextWord(range)).toBe(' ');
    expect($._test.nextWord(range)).toBe('walked');
    expect($._test.nextWord(range)).toBe('.');

    testDiv.remove();
  });
});


describe('Segmenting Simple Sentences', function() {

  it('Can segment an English sentence in a <p>', function() {
    var text = '<p id="test-simple-eng-p">Ladybugs lounge in hamocks made for them.</p>';
    var testDiv = helpers.addText(text);

    var tokens = $('#test-simple-eng-p').findTokens();
    expect(tokens.length).toBe(14);
    expect(tokens[0]).toBe('Ladybugs');
    expect(tokens[1]).toBe(' ');
    expect(tokens[2]).toBe('lounge');
    expect(tokens[12]).toBe('them');
    expect(tokens[13]).toBe('.');

    testDiv.remove();
  });

  it('Can segment a Chinese sentence in a <p>', function() {
    var text = '<p id="test-simple-zh-p">毛毛蟲是一種蟲子啦。</p>';
    var testDiv = helpers.addText(text);
    var tokens = $('#test-simple-zh-p').findTokens();

    expect(tokens.length).toBe(6);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');
    expect(tokens[5]).toBe('。');

    testDiv.remove();
  });

  it('Can segment a Chinese sentence with several tags', function() {
    var text = '<p id="test-complex-zh-p">毛毛蟲<b>是<u>一種</u>蟲子</b>啦。</p>';
    var testDiv = helpers.addText(text);
    var tokens = $('#test-complex-zh-p').findTokens();

    expect(tokens.length).toBe(6);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');
    expect(tokens[5]).toBe('。');

    testDiv.remove();
  });
});

describe('Tagging Simple Sentences', function() {

  it('Can tag an English sentence', function() {
    var text, testDiv;
    text = '<p id="test-tags-eng">Ladybugs in <b> red are <i> lounging in </i> hamocks made </b> for them.</p>';
    testDiv = helpers.addText(text);

    $('#test-tags-eng').findAndSpanTokens();

    expect(testDiv.find('.word-Ladybugs').text()).toBe('Ladybugs');
    expect(testDiv.find('.word-in').length).toBe(2);
    expect(testDiv.find('.word-red').text().trim()).toBe('red'); // trim initial whitespace
    expect(testDiv.find('.word-are').text()).toBe('are');
    expect(testDiv.find('.word-lounging').text().trim()).toBe('lounging');
    expect(testDiv.find('.word-hamocks').text().trim()).toBe('hamocks');
    expect(testDiv.find('.word-made').text()).toBe('made');
    expect(testDiv.find('.word-for').text().trim()).toBe('for');  // trim initial whitespace
    expect(testDiv.find('.word-them').text()).toBe('them');

    testDiv.remove();
  });

  it('Can tag a Chinese sentence', function() {
    var text, testDiv;
    text = '<p id="test-tags-zh">你知道嗎？毛毛蟲<i>是<b>一種</b>蟲子。</i></p>';
    testDiv = helpers.addText(text);

    $('#test-tags-zh').findAndSpanTokens();

    expect(testDiv.find('.word-你').text()).toBe('你');
    expect(testDiv.find('.word-知道').text()).toBe('知道');
    expect(testDiv.find('.word-嗎').text()).toBe('嗎');
    expect(testDiv.find('.word-毛毛蟲').text()).toBe('毛毛蟲');
    expect(testDiv.find('.word-是').text()).toBe('是');
    expect(testDiv.find('.word-一種').text()).toBe('一種');
    expect(testDiv.find('.word-蟲子').text()).toBe('蟲子');

    testDiv.remove();
  });

});

describe('Using a custom segmenter', function() {

  iit('it can use a supplied segmentation function', function() {
    // Note that this segmenter will trim out all whitespace, should it
    // would not be a good idea to use it other than for tests.
    var segmenter = function(textNode) {
      return $(textNode).text().split(/\W/);
    };
    var text, testDiv;
    text = '<p id="test_custom_seg">Ladybugs in <b> red are <i> lounging in </i> hamocks made </b> for them.</p>';
    testDiv = helpers.addText(text);

    $('#test_custom_seg').findAndSpanTokens({segmenter: segmenter});

    expect(testDiv.find('.word-Ladybugs').text()).toBe('Ladybugs');
    expect(testDiv.find('.word-in').length).toBe(2);
    expect(testDiv.find('.word-red').text().trim()).toBe('red'); // trim initial whitespace
    expect(testDiv.find('.word-are').text()).toBe('are');
    expect(testDiv.find('.word-lounging').text().trim()).toBe('lounging');
    expect(testDiv.find('.word-hamocks').text().trim()).toBe('hamocks');
    expect(testDiv.find('.word-made').text()).toBe('made');
    expect(testDiv.find('.word-for').text().trim()).toBe('for');  // trim initial whitespace
    expect(testDiv.find('.word-them').text()).toBe('them');

    // testDiv.remove();
  });
});

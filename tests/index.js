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


describe('Segmenting Simple Sentences', function() {

  it('Can segment an English sentence in a <p>', function() {
    var text = '<p id="test-simple-eng-p">Ladybugs lounge in hamocks made for them.</p>';
    var testDiv = helpers.addText(text);

    var tokens = $('#test-simple-eng-p').findTokens();
    expect(tokens.length).toBe(13);
    expect(tokens[0]).toBe('Ladybugs');
    expect(tokens[1]).toBe(' ');
    expect(tokens[2]).toBe('lounge');
    expect(tokens[12]).toBe('them');

    testDiv.remove();
    // removeTextHelper();
  });

  it('Can segment a Chinese sentence in a <p>', function() {
    var text = '<p id="test-simple-zh-p">毛毛蟲是一種蟲子啦。</p>';
    var testDiv = helpers.addText(text);
    var tokens = $('#test-simple-zh-p').findTokens();

    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');

    // removeTextHelper();
    testDiv.remove();
  });

  it('Can segment a Chinese sentence with several tags', function() {
    var text = '<p id="test-complex-zh-p">毛毛蟲<b>是<u>一種</u>蟲子</b>啦。</p>';
    var testDiv = helpers.addText(text);
    var tokens = $('#test-complex-zh-p').findTokens();

    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');

    testDiv.remove();
    // removeTextHelper();
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
    expect(testDiv.find('.word-red').text()).toBe('red');
    expect(testDiv.find('.word-are').text()).toBe('are');
    expect(testDiv.find('.word-lounging').text()).toBe('lounging');
    expect(testDiv.find('.word-hamocks').text()).toBe('hamocks');
    expect(testDiv.find('.word-made').text()).toBe('made');
    expect(testDiv.find('.word-for').text()).toBe('for');
    expect(testDiv.find('.word-them').text()).toBe('them');

    testDiv.remove();
  });
  
  it('Can tag an English sentence', function() {
    var text, testDiv;
    text = '<p id="test-tags-zh">毛毛蟲<i>是<b>一種</b>蟲子</i></p>';
    testDiv = helpers.addText(text);

    $('#test-tags-zh').findAndSpanTokens();

    expect(testDiv.find('.word-毛毛蟲').text()).toBe('毛毛蟲');
    expect(testDiv.find('.word-是').text()).toBe('是');
    expect(testDiv.find('.word-一種').text()).toBe('一種');
    expect(testDiv.find('.word-蟲子').text()).toBe('蟲子');

    testDiv.remove();
  });

});

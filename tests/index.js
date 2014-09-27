/*global $, describe, it, expect*/
'use strict';


var addTextHelper = function (content) {
  $('<div id="test-div"></div>').appendTo('body')
   .append(content);
};

var removeTextHelper = function () {
  $('#test-div').remove();
};


describe('Segmenting Simple Sentences', function() {

  it('Can segment an English sentence in a <p>', function() {
    var text = '<p id="test-simple-eng-p">Ladybugs lounge in hamocks made for them.</p>';
    addTextHelper(text);

    var tokens = $('#test-simple-eng-p').findTokens();
    expect(tokens.length).toBe(13);
    expect(tokens[0]).toBe('Ladybugs');
    expect(tokens[1]).toBe(' ');
    expect(tokens[2]).toBe('lounge');
    expect(tokens[12]).toBe('them');

    removeTextHelper();
  });

  it('Can segment a Chinese sentence in a <p>', function() {
    var text = '<p id="test-simple-zh-p">毛毛蟲是一種蟲子啦。</p>';
    addTextHelper(text);
    var tokens = $('#test-simple-zh-p').findTokens();

    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');

    removeTextHelper();
  });

  it('Can segment a Chinese sentence with several tags', function() {
    var text = '<p id="test-complex-zh-p">毛毛蟲<b>是<u>一種</u>蟲子</b>啦。</p>';
    addTextHelper(text);
    var tokens = $('#test-complex-zh-p').findTokens();

    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBe('毛毛蟲');
    expect(tokens[1]).toBe('是');
    expect(tokens[2]).toBe('一種');
    expect(tokens[3]).toBe('蟲子');
    expect(tokens[4]).toBe('啦');

    removeTextHelper();
  });
});

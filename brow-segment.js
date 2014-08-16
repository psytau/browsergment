

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

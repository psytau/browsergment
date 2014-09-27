describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("Segmenting Simple English Sentences", function() {
  it("Can segment a sentence in a <p>", function() {
    $('<div id="test-simple-eng"></div>').appendTo('body')
     .append('<p id="test-simple-eng-p">Ladybugs lounge in hamocks made for them.</p>');

     var tokens = $('#test-simple-eng-p').findTokens();
     console.log(tokens);
     expect(tokens.length).toBe(13);
     expect(tokens[0]).toBe('Ladybugs');
     expect(tokens[1]).toBe(' ');
     expect(tokens[2]).toBe('lounge');
     expect(tokens[12]).toBe('them');


     $('#test-simple-eng').remove();
  });
});

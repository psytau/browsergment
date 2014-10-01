##BROWSER GMENTATION

This is a simple project that attempts to expose Chrome's natural language segmentation to JavaScript.
It's particularly useful for languages like chinese that aren't easily parsed in to 'words'.

中文分词模块

## Usage

This is a jQuery plugin.

To tokenize text in all 'p' tags on a page use...

    var tokens = $('p').findTokens();
    console.log(tokens);

To surround each token in a span so you can access them later...

    $('p').findAndSpanTokens();
    // $('.word-watermelon').text() === 'watermelon';

Example here: http://codepen.io/psytau/pen/sjJKl

### Dev Setup

clone then...

    npm install
    karma run tests/karma.conf.js

to install karma and run tests


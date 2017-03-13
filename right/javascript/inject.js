/* global ace removeAllVCMarkers */

var createEditor;
var author;

function injectCreate(id) {
    $("#" + id).load("right/html/rightHTML", function () {
        injectCreateEditor();

        // Check to see if we already have an author ID
        if (localStorage.getItem("author")) {
            // Reuse the same author ID
            author = localStorage.getItem("author");
        } else {
            // Generate a random number from 1 to 10000
            author = Math.floor(Math.random() * 10000 + 1);
            localStorage.setItem("author", author);
        }
    });
}

function injectCreateEditor() {
    var ResolveMode = ace.require("ace/mode/resolve").Mode;

    Range = ace.require("ace/range").Range;
    createEditor = ace.edit("editor");
    createEditor.setTheme("ace/theme/github");

    // Set this to RESOLVE mode
    createEditor.session.setMode(new ResolveMode());

    // Gets rid of a weird Ace Editor bug
    // createEditor.$blockScrolling = Infinity;

    createEditor.setFontSize(18);
    createEditor.on("change", removeAllVCMarkers);
}

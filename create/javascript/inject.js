var createEditor;
var author;

function injectCreate(id) {
    $("#" + id).load("create/html/createHTML", function() {
        injectCreateEditor();
		
	// Generate a random number from 1 to 10000
        author = Math.floor((Math.random() * 10000) + 1);
    });
}

function injectCreateEditor() {
    Range = ace.require('ace/range').Range;

    createEditor = ace.edit("editor");
    createEditor.setTheme("ace/theme/github");

    // Set this to RESOLVE mode
    var ResolveMode = ace.require("ace/mode/resolve").Mode;
    createEditor.session.setMode(new ResolveMode());

    // Gets rid of a weird Ace Editor bug
    createEditor.$blockScrolling = Infinity;

    createEditor.getSession().on('change', removeAllVCMarkers);
    createEditor.setFontSize(18);
}

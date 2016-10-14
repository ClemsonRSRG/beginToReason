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
	
	var EditSession = require("ace/edit_session").EditSession;
	var ResolveMode = require("ace/mode/resolve").Mode;
	createEditor.setSession(new EditSession("", new ResolveMode));

    createEditor.getSession().on('change', removeAllVCMarkers);
    createEditor.setFontSize(18);
}

/* global ace currentLesson removeAllVCMarkers */

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
    createEditor.on("change", checkEdit);
}

function checkEdit(change) {
    var manager = createEditor.getSession().getUndoManager();

    // Must wait for the change to filter through the event system. There is
    // probably a way to catch it, but I couldn't find it.
    setTimeout(function () {
        // If it is a multiline change, including removing or adding a line break
        if (change.lines.length > 1) {
            manager.undo(true);
            return;
        }

        // If the line does not have "Confirm" in it somewhere
        // or it's not configured in the "lines". (added by the FAU team)
        if (typeof currentLesson.lines !== "undefined") {
            var rowNum = change.start.row + 1;
            if (!currentLesson.lines.includes(rowNum)) {
                manager.undo(true);
                return;
            }
        } else {
            var line = createEditor.getSession().getLine(change.start.row);
            if (!line.includes("Confirm")) {
                manager.undo(true);
                return;
            }
        }
        // Make sure we do not collate undos. Downside: there is no real undo functionality
        manager.reset();
    }, 0);
}

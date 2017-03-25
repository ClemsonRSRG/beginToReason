/* global ace approved author createEditor resetTime verifying */

// The current lesson (the lesson students see)
var currentLesson;
// Base lesson (the lesson to be sent to WebIDE)
var baseLesson;
var baseLessonCode;
var baseLessonCodeLines;
function loadLesson(filePath) {
    $.getJSON(filePath, function (data) {
        currentLesson = data;
        // If the lesson has a base lesson, load it.
        if (data.base !== null) {
            // Load base lesson json
            $.get(data.base, function (data) {
                baseLesson = data;         
                if(baseLesson != null){
                    // Load base lesson code
                    $.get(baseLesson.code, function (data) {
                        baseLessonCode = data;
                        baseLessonCodeLines = baseLessonCode.split("\n");
                    });
                }
            });

        }

        $("#left .header td").html(data.lesson);

        $("#left .reference td").html(data.referenceMaterial);
        if (data.type == "tutorial") {
            $("#left .activity td").html(data.activity);
            $("#right .headette").addClass("button");
            $("#right .headette td")
                .html("Click here for quick video instructions")
                .off("click")
                .click(function () {
                    window.open(data.screenCapture, "_blank");
                });

        } else if (data.type == "lesson" || data.type == "challenge") {
            if (data.activity === null) {
                $("#left .activity td").html("Please complete the <b>Confirm</b> assertion(s) and check correctness.");
            } else {
                $("#left .activity td").html(data.activity);              
            }
            $("#right .headette").removeClass("button");
            $("#right .headette td").html("").off("click");

        } else if (data.type == "end") {
            $("#left .activity td").html(data.activity);
            $("#endSurvey").click();
        } else {
            $("#left .activity td").html("This should never appear.");
            $("#right .headette").removeClass("button");
            $("#right .headette td").html("").off("click");
        }

        $.get(data.code, function (data) {
            createEditor.setValue(data);
            createEditor.selection.moveCursorToPosition({
                row: 0,
                column: 0
            });

            createEditor.getSession().setUndoManager(new ace.UndoManager());
            createEditor.getSession().getUndoManager().reset();
        });
    });
}

function endSurvey() {
    $("#dialog-message").html("<b>AuthorID:</b> " + author + "</br></br><b>Instructions:</b></br>Use the number above and complete the survey on Canvas.");
    $("#dialog-box").dialog("open");
}

function reloadLesson() {
    loadLesson(currentLesson.self);
}

function nextLessonButton() {
    if (!approved) {
        $("#dialog-message").html("You may only progress when your code has been approved.");
        $("#dialog-box").dialog("open");
        createEditor.focus();
        return;
    }

    nextLessonAndSuccess();
}

function nextLessonAndFailure() {
    if (currentLesson.nextLessonOnFailure == "") {
        return;
    }

    if (currentLesson.nextLessonOnFailure == currentLesson.self) {
        return;
    }

    loadLesson(currentLesson.nextLessonOnFailure);
    resetTime();
}

function nextLessonAndSuccess() {
    if (currentLesson.nextLessonOnSuccess == "") {
        return;
    }
    loadLesson(currentLesson.nextLessonOnSuccess);
    resetTime();
}

function prevLesson() {
    verifying = false;
    if (currentLesson.previousLesson == "") {
        return;
    }

    loadLesson(currentLesson.previousLesson);
    resetTime(); // Might need to remove this when we change the "next" button.
}

function checkLines() {
    var rowNum = createEditor.getCursorPosition().row + 1;

    if (createEditor.selection.isMultiLine()) {
        createEditor.setReadOnly(true);
    } else if ($.inArray(rowNum, currentLesson.lines) != -1) {
        createEditor.setReadOnly(false);
    } else {
        createEditor.setReadOnly(true);
    }
}

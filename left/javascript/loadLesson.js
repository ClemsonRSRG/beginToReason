var currentLesson;

function loadLesson(filePath) {
    $.getJSON(filePath, function(data) {
        currentLesson = data;

        $("#left .header td").html(data.lesson);

        $("#left .objective td").html(data.learningObjective);
        $("left .reference td").html(data.referenceMaterial);

        $.get(data.code, function (data) {
            createEditor.setValue(data);
            createEditor.selection.moveCursorToPosition({row: 0, column: 0});

            createEditor.getSession().setUndoManager(new ace.UndoManager());
            createEditor.getSession().getUndoManager().reset();
        });
    });
}

function endSurvey() {
	$( "#dialog-message" ).html("<b>AuthorID:</b> " + author + "</br><b>Survey Link:</b> https://www.surveymonkey.com/r/F7KF6F8");
	$( "#dialog-box" ).dialog( "open" );
}

function reloadLesson() {
    loadLesson(currentLesson.self);
}

function nextLessonButton() {
    if(!approved) {
        alert("You may only progress when your code has been approved.");
        createEditor.focus();
        return;
    }

    nextLessonAndSuccess();
}

function nextLessonAndFailure() {
    if (currentLesson.nextLessonOnFailure == "") return;
    if (currentLesson.nextLessonOnFailure == currentLesson.self) return;
    
    resetTime();
    loadLesson(currentLesson.nextLessonOnFailure);
}

function nextLessonAndSuccess() {
    if (currentLesson.nextLessonOnSuccess == "") return;
    
    resetTime();
    loadLesson(currentLesson.nextLessonOnSuccess);
}

function prevLesson() {
    verifying = false;
    if(currentLesson.previousLesson == "") return;
    loadLesson(currentLesson.previousLesson);
}

function checkLines() {
    var rowNum = createEditor.getCursorPosition().row + 1;
    
    if (createEditor.selection.isMultiLine())
        createEditor.setReadOnly(true);
    else if ($.inArray(rowNum, currentLesson.lines) != -1)
        createEditor.setReadOnly(false);
    else
        createEditor.setReadOnly(true);
}

var currentLesson;

function loadLesson(filePath) {
    $.getJSON(filePath, function(data) {
        currentLesson = data;

        $("#header.teach td").html(data.lesson);

        $("#objective.teach td").html(data.learningObjective);
        $("#problem.teach td").html(data.referenceMaterial);

        $.get(data.code, function (data) {
            createEditor.setValue(data);
            createEditor.selection.moveCursorToPosition({row: 0, column: 0});

            createEditor.getSession().setUndoManager(new ace.UndoManager());
            createEditor.getSession().getUndoManager().reset();
        });
    });
}

function endSurvey() {
	$( "#dialog-message" ).html("<b>AuthorID:</b> " + author + "</br><b>Survey Link:</b> https://www.surveymonkey.com/r/9N79RK9");
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
    if(currentLesson.nextLessonOnFailure == "") return;
    
    resetTime();
    loadLesson(currentLesson.nextLessonOnFailure);
}

function nextLessonAndSuccess() {
    if(currentLesson.nextLessonOnSuccess == "") return;
    
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
    if ($.inArray(rowNum, currentLesson.lines) != -1) createEditor.setReadOnly(false);
    else createEditor.setReadOnly(true);
}

function doChecks() {
    var i = -1;
    var toReturn = true;

    $.each(currentLesson.lines, function(index, value) {
        i += 1;
        var lineText = createEditor.session.getLine(value - 1);

        var passes = false;
        $.each(currentLesson.checks[i], function(index, value) {
            if(lineText.indexOf(value) > -1) passes = true;
        });
        if(!passes) toReturn = false;
    });

    return toReturn;
}

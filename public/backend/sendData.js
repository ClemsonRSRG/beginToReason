/* global approved author createEditor currentLesson getTime */

function sendData() {
    var data = {};

    data.type = currentLesson.type;
    data.module = currentLesson.module;
    data.name = currentLesson.name;

    data.author = author;
    data.code = createEditor.getValue();
    data.time = getTime();
    data.correct = approved;

    $.post("/log", JSON.stringify(data));
}

/* global approved author createEditor currentLesson getTime */

function sendData() {
    var data = {};

    data.code = createEditor.getValue();
    data.time = getTime();
    data.author = author;
    data.module = currentLesson.module;
    data.lesson = currentLesson.self;
    data.correct = approved;
    data.points = "0";

    $.post("https://resolve.cs.clemson.edu/teaching/bydesign", JSON.stringify(data));
}

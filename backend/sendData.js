/* global approved createEditor currentLesson getTime */

var author = Math.floor(Math.random() * 1000000000);

function sendData() {
    var data = {};

    data.code = createEditor.getValue();
    data.time = getTime();
    data.author = author;
    data.module = currentLesson.module;
    data.lesson = currentLesson.self;
    data.correct = approved;
    data.points = "0";

    $.post("https://resolve.cs.clemson.edu/testing/bydesign", JSON.stringify(data));
}

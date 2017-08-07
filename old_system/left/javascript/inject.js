/* global loadLesson */

function injectTeach(id, lessonLink) {
    $("#" + id).load("left/html/leftHTML", function () {
        loadLesson(lessonLink);
    });
}

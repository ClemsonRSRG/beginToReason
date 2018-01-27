/* global loadLesson */

function injectTeach(id, module, problem) {
    $("#" + id).load("/left/html/leftHTML", function () {
        loadLesson(module, problem);
    });
}

/* global loadLesson */

function injectTeach(id) {
    $("#" + id).load("left/html/leftHTML", function () {
        loadLesson("problems/tutorial0.json");
    });
}

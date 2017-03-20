/* global loadLesson */

function injectTeach(id) {
    $("#" + id).load("left/html/leftHTML", function () {
        loadLesson("problems/tutorial0_v1.json");
    });
}

/*global loadLesson*/
/*eslint no-undef: "error"*/

function injectTeach(id) {
    $("#" + id).load("left/html/leftHTML", function() {
        loadLesson("problems/tutorial0.json");
    });
}

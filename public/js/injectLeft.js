/* global loadLessonFromUrl */

function injectTeach(id, module) {
    $("#" + id).load("/html/left.html", function () {
        var url = "/section/" + module + "/initial";
        loadLessonFromUrl(url);
    });
}

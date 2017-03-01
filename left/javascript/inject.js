function injectTeach(id) {
    $("#" + id).load("left/html/leftHTML", function() {
        loadLesson("problems/tutorial0.json");
        createEditor.session.selection.on("changeCursor", checkLines);
        createEditor.getSession().on("change", checkLines);
    });
}

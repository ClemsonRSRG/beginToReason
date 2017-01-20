function injectTeach(id) {
    $("#" + id).load("left/html/leftHTML", function() {
        loadLesson("tutorial/tutorial1.json");
        createEditor.session.selection.on("changeCursor", checkLines);
        createEditor.getSession().on("change", checkLines);
    });
}

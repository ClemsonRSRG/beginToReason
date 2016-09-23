function injectTeach(id) {
    $("#" + id).load("teach/html/teachHTML", function() {
        loadLesson("tutorial/tutorial1.json");
        createEditor.session.selection.on("changeCursor", checkLines);
        createEditor.getSession().on("change", checkLines);
    });
}

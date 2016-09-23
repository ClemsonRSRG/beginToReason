function loadCode(filepath, callback) {
    $.get(filepath, function(data) {
        editor.setValue(data);
        editor.selection.moveCursorToPosition({row: 0, column: 0});
        editor.getSession().setUndoManager(new ace.UndoManager());
        editor.getSession().getUndoManager().reset();

        callback();
    });
}
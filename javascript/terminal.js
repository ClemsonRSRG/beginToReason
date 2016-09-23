var showCursor = false;
var terminalTimer = new Date().getTime();
var terminalQueue = [];

function terminalUpdate() {
    if(new Date().getTime() - terminalTimer > 500) {
        cursorBlink();
    }
    else {
        if(terminalQueue.length > 0) {
            terminalQueue.pop()();
        }
    }

    setTimeout(terminalUpdate, 0);
}

function terminalRequest(terminalAction) {
    terminalQueue.push(terminalAction);
}

function cursorBlink() {
    terminalTimer = new Date().getTime();

    var text = $("#terminal").html();
    if(showCursor) {
        showCursor = false;
        text = text.substring(0, text.length - 1);
    }
    else {
        showCursor = true;
        text += "_";
    }
    $("#terminal").html(text);
}

function appendTerminal(appendation) {
    if(showCursor) cursorBlink();

    var text = $("#terminal").html();
    text += appendation + "<br>$ ";
    $("#terminal").html(text);
}

function clearTerminal() {
    showCursor = false;
    $("#terminal").html("TERMINAL OUTPUT<br>$ ")
}

function replaceTerminal(text) {
    clearTerminal();
    appendTerminal(text);
}
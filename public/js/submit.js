/* global addVCMarkers author createEditor currentLesson parseLesson
   removeAllVCMarkers updateMarker addVCMarker */

var verifying = false;
var time = new Date();

function submit() {
    /* Protect against multiple requests */
    if (verifying) {
        return;
    }
    lock();

    var data = {};
    data.module = currentLesson.module;
    data.name = currentLesson.name;
    data.author = author;
    data.milliseconds = getTime();
    data.code = createEditor.getValue();
    $.postJSON("/verify", data, (results) => {
        if (results.lines !== undefined) {
            addLines(results.lines);
        }

        if (results.status == "trivial") {
            unlock("Sorry, not the intended answer. Try again!");
        } else if (results.status == "unparsable") {
            unlock("Sorry, can't parse your answer. Try again!");
        } else if (results.status == "failure") {
            if ("problem" in results) {
                unlock("Sorry, not correct. Try this other lesson!");
                parseLesson(results.problem);
            } else {
                unlock("Sorry, not correct. Try again!");
            }
        } else if (results.status == "success") {
            unlock("Correct! On to the next lesson.");
            parseLesson(results.problem);
        } else {
            unlock("Something went wrong.");
        }
    });
}

function lock() {
    verifying = true;
    $("#right .footette").attr("class", "footetteDisabled");
}

function unlock(message) {
    $("#dialog-message").html(message);
    $("#dialog-box").dialog("open");
    verifying = false;
    $("#right .footetteDisabled").attr("class", "footette");
    createEditor.focus();
}

/*
    Gets the number of milliseconds since the last time this function was
    called, or since the page loaded if it is the first call.
*/
function getTime() {
    var endTime = new Date();
    var result = endTime.getTime() - time.getTime();
    time = endTime;
    return result;
}

/*
    Really, why does this not exist?
*/
$.postJSON = (url, data, callback) => {
    return $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: callback
    });
};

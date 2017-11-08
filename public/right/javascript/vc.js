/* global addVCMarkers approved baseLesson baseLessonCode baseLessonCodeLines createEditor
   currentLesson decode encode nextLessonAndFailure nextLessonAndSuccess
   removeAllVCMarkers resetTime succeed sendData toJSON updateMarker addVCMarker */

var VCs;
var verifying = false;
// The content to be sent to WebIDE
var contentToServer;
var replacedLines = [];
function submitAnswer() {
    /* Protect against multiple requests */
    if (verifying) {
        return;
    }
    verifying = true;
    $("#right .footette").attr("class", "footetteDisabled");

    // Check if this lesson has a base lesson.
    if (typeof currentLesson.base !== "undefined") {
        // If it does, the base lesson content with replaced lines will be sent to WebIDE.
        contentToServer = baseLessonCode;
        // This index starts from 0
        var currentLessonReplaceContentIndex = 0;
        // Iterate through the base lesson line by line
        $.each(baseLessonCodeLines, function (index, obj) {
            // If a line contains the text needed to be replaced,
            if (obj.includes(currentLesson.replaces[currentLessonReplaceContentIndex])) {
                // Step 1: find the line used to replace
                var replaceLine = createEditor.session.getLine(currentLesson.lines[currentLessonReplaceContentIndex] - 1);
                // Step 2: replace the line
                contentToServer = contentToServer.replace(currentLesson.replaces[currentLessonReplaceContentIndex], replaceLine);
                // Step 3: record the line that gets replaced
                replacedLines.push(index);
                // Step 4: increase the index pointing to current lession
                currentLessonReplaceContentIndex++;
            }
        });

    } else {
        // If not, the content in the editor will be sent to WebIDE.
        contentToServer = createEditor.getValue();
    }

    if (checkForTrivials(contentToServer)) {
        getVCLines(contentToServer);
    } else {
        $("#dialog-message").html("Sorry, not the intended answer. Try again!");
        $("#dialog-box").dialog("open");
        verifying = false;
        $("#right .footetteDisabled").attr("class", "footette");
        createEditor.focus();
    }
}

function checkForTrivials(content) {
	// Find all the confirm statements, with their line numbers
    var regex = new RegExp("Confirm [^;]*;", "mg");
    var lines = content.split("\n");
    var confirms = [];
    var i;
    for (i = 0; i < lines.length; i++) {
        var confirm = lines[i].match(regex);
        if (confirm) {
            var obj = {
                line: i + 1,
                text: confirm[0]
            };
            confirms.push(obj);
        }
    }

    for (i = 0; i < confirms.length; i++) {
        // Remove the "Confirm " so that we can find the variable names
        var statement = confirms[i].text;
        statement = statement.substr(8);

        // Search for an illegal "/="
        regex = new RegExp("/=");
        if (statement.search(regex) > -1) {
            addVCMarker({
                lineNum: confirms[i].line
            }, "vc_failed");
            return false;
        }

        // Split the string at the conditional, first looking for >= and <=
        regex = new RegExp(">=|<=");
        var parts = statement.split(regex);
        if (parts.length > 2) {
            addVCMarker({
                lineNum: confirms[i].line
            }, "vc_failed");
            return false;
        }
        if (parts.length == 1) { // If there is no >= or <=
            regex = new RegExp("[=]");
            parts = statement.split(regex);
            if (parts.length > 2) {
                addVCMarker({
                    lineNum: confirms[i].line
                }, "vc_failed");
                return false;
            }
        }
        if (parts.length == 1) { // If there is no >=, <=, or =
            regex = new RegExp("[<>]");
            parts = statement.split(regex);
            if (parts.length != 2) {
                addVCMarker({
                    lineNum: confirms[i].line
                }, "vc_failed");
                return false;
            }
        }

        // Find the variables used on the left side
        var left = parts[0];
        var right = parts[1];
        regex = new RegExp("[a-zA-Z]", "g");
        var variables = left.match(regex);
        if (variables === null) {
            continue;
        }

        // Search for these variables on the right side
        var j;
        for (j = 0; j < variables.length; j++) {
            var variable = variables[j];
            regex = new RegExp(" " + variable + " ", "g");
            if (right.search(regex) > -1) {
                addVCMarker({
                    lineNum: confirms[i].line
                }, "vc_failed");
                return false;
            }
        }
    }

    return true;
}

function getVCLines(content) {
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=genVCs&project=Teaching_Project");
    removeAllVCMarkers();

    socket.onmessage = function (message) {
        if (!verifying) {
            return;
        }

        // Extract the array of VCs from the message (trust me, this works)
        message = JSON.parse(message.data);
        if (message.status == "error") {
        	console.log(message);
            $("#dialog-message").html("Sorry, can't parse your answer. Try again!");
            $("#dialog-box").dialog("open");
            verifying = false;
            $("#right .footetteDisabled").attr("class", "footette");

            createEditor.focus();
            return;
        }

        if (message.status != "complete") {
            return;
        }

        if (message.result == "") {
            $("#dialog-message").html("Sorry, can't parse your answer. Try again!");
            $("#dialog-box").dialog("open");
            verifying = false;
            $("#right .footetteDisabled").attr("class", "footette");

            createEditor.focus();
            return;
        }

        message = decode(message.result);
        message = $(message).text();
        message = JSON.parse(message);

        // Simplify the VC information
        VCs = [];
        $.each(message.vcs, function (index, obj) {
            // Push to VCs only if that line is not "undefined" and it's one of the replaced lines.
            // - YS: parseInt() function requires a radix parameter that helps it determine what kind of
            //       integer we are trying to parse. Although we know our line numbers are always a decimal,
            //       it is best to put it in!
            if (typeof obj.vc !== "undefined") {
                if (typeof currentLesson.base !== "undefined" && replacedLines.includes(parseInt(obj.lineNum, 10) - 1)) {
                    // Set the line number to be the line in current lesson, so that this line will be highlighted.
                    obj.lineNum = currentLesson.lines[index];
                    VCs.push(obj);
                } else if (typeof currentLesson.base === "undefined") {
                    VCs.push(obj);
                }
            }
        });

        addVCMarkers();
        verifyVCs(contentToServer);
    };

    content = encode(content);
    content = toJSON(content);

    socket.onopen = function () {
        socket.send(content);
    };
}

function verifyVCs(content) {
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project");

    socket.onmessage = function (message) {
        message = JSON.parse(message.data);
        if (message.status !== "processing") {
            return;
        }

        updateMarker(message.result);
    };

    content = encode(content);
    content = toJSON(content);

    socket.onopen = function () {
        socket.send(content);
    };

    socket.onclose = function () {
        if (succeed) {
            approved = true;
            $("#dialog-message").html("Correct. On to the next lesson!");
            $("#dialog-box").dialog("open");

            sendData(); // Need to send the data before we reset the time! (Need new "approved")
            nextLessonAndSuccess();
        } else {
            if (currentLesson.self != currentLesson.nextLessonOnFailure) {
                $("#dialog-message").html("Sorry, not correct. Try this other lesson!");
                $("#dialog-box").dialog("open");

                sendData(); // Need to send the data before we reset the time! ("approved" should be false)
                nextLessonAndFailure();
            } else {
                if (currentLesson.type == "tutorial") {
                    if (typeof currentLesson.base !== "undefined") {
                        $("#dialog-message").html("Sorry, not correct. Try again! " + baseLesson.solution);
                    } else {
                        $("#dialog-message").html("Sorry, not correct. Try again! " + currentLesson.solution);
                    }
                } else {
                    $("#dialog-message").html("Sorry, not correct. Try again!");
                }
                $("#dialog-box").dialog("open");

                sendData(); // Need to send the data before we reset the time! ("approved" should be false)
                resetTime(); // Reset the time because it is a new attempt!
            }
        }

        verifying = false;
        $("#right .footetteDisabled").attr("class", "footette");
    };
}

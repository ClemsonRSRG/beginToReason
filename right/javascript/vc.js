var VCs;
var verifying = false;

function submitAnswer() {
    /* Protect against multiple requests */
    if(verifying)
        return;
    verifying = true;
    $("#right .footette").attr("class", "footetteDisabled");

    getVCLines(createEditor.getValue());
}

function getVCLines(content) {
    removeAllVCMarkers();
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=genVCs&project=Teaching_Project");

    socket.onmessage = function(message) {
        if(!verifying) return;

        // Extract the array of VCs from the message (trust me, this works)
        message = JSON.parse(message.data);
        if(message.status == "error") {
            $("#dialog-message").html("Sorry, can't parse your answer. Try again!");
            $("#dialog-box").dialog("open");
            verifying = false;
            $("#right .footetteDisabled").attr("class", "footette");
            
            createEditor.focus();
            return;
        }
        if(message.status != "complete") {
            return;
        }

	if(message.result == "") {
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
            if (typeof obj.vc !== "undefined") VCs.push(obj);
        });

        addVCMarkers();
        verifyVCs(createEditor.getValue());
    };

    content = encode(content);
    content = toJSON(content);

    socket.onopen = function() { socket.send(content); };
}

function verifyVCs(content) {
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project");

    socket.onmessage = function(message) {
        message = JSON.parse(message.data);
        if(message.status !== "processing") return;

        updateMarker(message.result);
    };

    content = encode(content);
    content = toJSON(content);

    socket.onopen = function() { socket.send(content); };
    socket.onclose = function() {
        if(doChecks() && succeed) {
            approved = true;
            $("#dialog-message").html("Correct. On to the next lesson!");
            $("#dialog-box").dialog("open");
            nextLessonAndSuccess();
        }
        if(!doChecks() && succeed) { // Should soon be obsolete
            approved = false;
            $("#dialog-message").html("Sorry, not the intended answer. Try again!");
            $("#dialog-box").dialog("open");
            createEditor.focus();
        }
        if(!succeed) {
            if (currentLesson.self != currentLesson.nextLessonOnFailure) {
                $("#dialog-message").html("Sorry, not correct. Try this other lesson!");
                $("#dialog-box").dialog("open");
                nextLessonAndFailure();
            }
            else {
                $("#dialog-message").html("Sorry, not correct. Try again!");
                $("#dialog-box").dialog("open");
            }
        }

        verifying = false;
        $("#right .footetteDisabled").attr("class", "footette");
        sendData();
    }
}

var VCs;

var getLinesSocket = null;
var verifySocket = null;

function submitAnswer() {
    /* Wipe the slate cleaned! */
    vcCleanUp();

    getVCLines(editor.getValue());
}

function vcCleanUp() {
    /* Wipe the slate cleaned! */
    if(getLinesSocket != null) getLinesSocket.close();
    if(verifySocket != null) verifySocket.close();

    removeAllVCMarkers();
    clearTerminal();
}

function getVCLines(content) {
    appendTerminal("Sending a request for code analysis...");

    getLinesSocket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=genVCs&project=Teaching_Project");
    getLinesSocket.onerror = function() { appendTerminal("<span style='color: #e74c3c'>A network error has prevented your request from being fulfilled.</span><br>"); };
    getLinesSocket.onmessage = function(message) {
        message = JSON.parse(message.data);
        if(message.status == "info") {
            appendTerminal("<span style='color: #2ecc71'>Your request for analysis has been received.</span><br>");
            appendTerminal("Now awaiting for analysis results...");
            return;
        }
        if(message.status == "error") {
            appendTerminal("An error was received when processing your request.");
            getLinesSocket.close();
            return;
        }
        if(message.status == "complete") {
            appendTerminal("<span style='color: #2ecc71'>Your code has been analyzed --- now displaying VCs.</span><br>");
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
        verifyVCs(editor.getValue());
    };

    getLinesSocket.onopen = function() {
        content = encode(content);
        content = toJSON(content);
        getLinesSocket.send(content);
    };
}

function verifyVCs(content) {
    appendTerminal("Sending a request for code verification...");

    verifySocket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project");
    verifySocket.onerror = function() { appendTerminal("<span style='color: #e74c3c'>A network error has prevented your request from being fulfilled.</span><br>"); };

    verifySocket.onmessage = function(message) {
        message = JSON.parse(message.data);
        if(message.status == "info") {
            appendTerminal("<span style='color: #2ecc71'>Your request for verification has been received.</span><br>");
            appendTerminal("Now awaiting for analysis results...");
            return;
        }
        if(message.status == "error") {
            appendTerminal("An error was received when processing your request.");
            getLinesSocket.close();
            return;
        }

        updateMarker(message.result);
    };

    verifySocket.onopen = function() {
        content = encode(content);
        content = toJSON(content);

        verifySocket.send(content);
    };
    verifySocket.onclose = function() {
        if(doChecks() && succeed) {
            approved = true;
            alert("Your answer was verified and was semantically meaningful. You may move on to the next lesson.");
        }
        if(!doChecks() && succeed) {
            approved = false;
            alert("Your answer was verified but semantically insufficient; try providing a more descriptive answer.");
        }

        sendData();
    }
}
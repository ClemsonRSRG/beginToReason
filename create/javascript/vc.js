var VCs;
var verifying = false;

function submitAnswer() {
    if(verifying) return;
    getVCLines(createEditor.getValue());
}

function getVCLines(content) {
    verifying = true;

    removeAllVCMarkers();
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/teaching/Compiler?job=genVCs&project=Teaching_Project");

    socket.onmessage = function(message) {
        if(!verifying) return;

        // Extract the array of VCs from the message (trust me, this works)
        message = JSON.parse(message.data);
        if(message.status == "error") {
            alert("Your code is syntactically incorrect and thus could not be verified.");
            verifying = false;
            
            createEditor.focus();
            return;
        }
        if(message.status != "complete") {
            return;
        }

	if(message.result == "") {
	    alert("Your code could not be verified; try a simpler answer and only use declared variables.");
	    verifying = false;
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
        verifying = false;

        if(doChecks() && succeed) {
            approved = true;
            alert("Your answer was verified and was semantically meaningful. You may move on to the next lesson.");
            createEditor.focus();
        }
        if(!doChecks() && succeed) {
            approved = false;
            alert("Your answer was verified but semantically insufficient; try providing a more descriptive answer.");
            createEditor.focus();
        }
	if(!succeed) {
            alert("Your answer was syntactically correct but unverifiable; the statement you are trying to prove is not true.");
            createEditor.focus();
	}

        sendData();
    }
}

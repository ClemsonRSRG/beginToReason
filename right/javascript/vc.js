var VCs;
var verifying = false;
var contentToServer;
function submitAnswer() {
    /* Protect against multiple requests */
    if(verifying)
        return;
    verifying = true;
    $("#right .footette").attr("class", "footetteDisabled");
    
    if(currentLesson.base != null){
        contentToServer = baseLessonCode;
        $.each(currentLesson.lines, function (index, obj) {
            var line = createEditor.session.getLine(obj - 1);
            contentToServer = contentToServer.replace(currentLesson.replaces[index], line);            
        });
    } else {
        contentToServer = createEditor.getValue();
    }
   
    // Get student's code
    //var content = createEditor.getValue();
    
    // Find all the confirm statements
    var regex = new RegExp("Confirm [^;]*;", "mg");
    var confirms = contentToServer.match(regex);
    if (confirms.length == 0) {
        alert(1);
        $("#dialog-message").html("Sorry, can't parse your answer. Try again!");
        $("#dialog-box").dialog("open");
        verifying = false;
        $("#right .footetteDisabled").attr("class", "footette");
            
        createEditor.focus();
        return;
    }
    
    var i;
    for (i = 0 ; i < confirms.length ; i++) {
        // Remove the "Confirm " so that we can find the variable names
        var statement = confirms[i];
        statement = statement.substr(8);
        
        // Split the string at the conditional
        regex = new RegExp("[<>=]");
        var parts = statement.split(regex);
        if (parts.length != 2) {
            alert(2);
            $("#dialog-message").html("Sorry, not the intended answer. Try again!");
            $("#dialog-box").dialog("open");
            verifying = false;
            $("#right .footetteDisabled").attr("class", "footette");
                
            createEditor.focus();
            return;
        }
        
        // Find the variables used on the left side
        var left = parts[0];
        var right = parts[1];
        regex = new RegExp("[a-zA-Z]", "g");
        var variables = left.match(regex);
        if (variables == null)
            continue;
        
        // Search for these variables on the right side
        var j;
        for (j = 0 ; j < variables.length ; j++) {
            variable = variables[j];
            regex = new RegExp("[^#]" + variable, "g");
            if (right.search(regex) > -1) {
                alert(3);
                $("#dialog-message").html("Sorry, not the intended answer. Try again!");
                $("#dialog-box").dialog("open");
                verifying = false;
                $("#right .footetteDisabled").attr("class", "footette");
                
                createEditor.focus();
                return;
            }
        }
    }

    //getVCLines(createEditor.getValue());
    getVCLines(contentToServer);
}

function getVCLines(content) {
    removeAllVCMarkers();
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/testing/Compiler?job=genVCs&project=Teaching_Project");

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
            if (typeof obj.vc != "undefined" && baseLesson.lines.includes(parseInt(obj.lineNum))) {
                obj.lineNum = currentLesson.lines[index];
                VCs.push(obj);
            }
        });
        addVCMarkers();
        //verifyVCs(createEditor.getValue());
        verifyVCs(contentToServer);
    };

    content = encode(content);
    content = toJSON(content);
    socket.onopen = function() { socket.send(content); };
}

function verifyVCs(content) {
    var socket = new WebSocket("wss://resolve.cs.clemson.edu/testing/Compiler?job=verify2&project=Teaching_Project");

    socket.onmessage = function(message) {
        message = JSON.parse(message.data);
        if(message.status !== "processing") return;
        updateMarker(message.result);
    };
    content = encode(content);
    content = toJSON(content);
    socket.onopen = function() { socket.send(content); };
    
    socket.onclose = function() {
        if(succeed) {
            approved = true;
            $("#dialog-message").html("Correct. On to the next lesson!");
            $("#dialog-box").dialog("open");
            nextLessonAndSuccess();
        }
        else {
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

var express = require('express')
var router = express.Router()

router.post('/verify', (req, res) => {
    // Check for all necessary fields
    if ( !('authorID' in req.body && 'milliseconds' in req.body && 'code' in req.body) ) {
        res.status(400)
        res.send('Requires authorID, milliseconds, and code fields.')
        return
    }

    // Check for trivials
    var trivials = checkForTrivials(req.body.code)
    if (!trivials.allCorrect) {
        res.status(400)
        res.json({
            'status': 'failure',
            'message': 'Sorry, not the intended answer. Try again!',
            'lines': trivials.confirms,
            'problem': ''
        })

        return
    }

    // Get VC lines

    // Verify VCs

    // Send response
    res.json({
        'status': 'success',
        'message': 'Correct. On to the next lesson!',
        'problem': ''
    })
})

/*
    Checks for any trivial answers the student may provide, such as "Confirm
    true", "Confirm I = I", or "Confirm I /= I + 1". Returns a list of lines
    and an indicator of trivial or not for each line. Note: may not perfectly
    check for all possible trivials.
*/
function checkForTrivials(content) {
    var lines = content.split("\n")
    var confirms = []
    var allCorrect = true
    var regex
    var i

    // Find all the confirm or ensures statements, with their line numbers
    regex = new RegExp("Confirm [^;]*;|ensures [^;]*;", "mg")
    for (i = 0; i < lines.length; i++) {
        var confirm = lines[i].match(regex)
        if (confirm) {
            var obj = {
                line: i + 1,
                text: confirm[0],
                status: "success"
            }
            confirms.push(obj)
        }
    }

    if (confirms.length == 0) {
        return {confirms: [], allCorrect: false}
    }

    for (i = 0; i < confirms.length; i++) {
        // Remove the "Confirm " and "ensures " so that we can find the variable names
        var statement = confirms[i].text
        statement = statement.substr(8)

        // Search for an illegal "/="
        regex = new RegExp("/=")
        if (statement.search(regex) > -1) {
            allCorrect = false
            confirms[i].status = "failure"
            continue
        }

        // Split the string at the conditional, first looking for >= and <=
        regex = new RegExp(">=|<=")
        var parts = statement.split(regex)
        if (parts.length > 2) {
            allCorrect = false
            confirms[i].status = "failure"
            continue
        }
        if (parts.length == 1) { // If there is no >= or <=
            regex = new RegExp("=")
            parts = statement.split(regex)
            if (parts.length > 2) {
                allCorrect = false
                confirms[i].status = "failure"
                continue
            }
        }
        if (parts.length == 1) { // If there is no >=, <=, or =
            regex = new RegExp(">|<")
            parts = statement.split(regex)
            if (parts.length != 2) {
                allCorrect = false
                confirms[i].status = "failure"
                continue
            }
        }

        // Find the variables used on the left side. If there are none, mark it correct.
        var left = parts[0]
        var right = parts[1]
        regex = new RegExp("[a-zA-Z]", "g")
        var variables = left.match(regex)
        if (variables === null) {
            confirms[i].status = "failure"
            allCorrect = false
            continue
        }

        // Search for these variables on the right side
        var j
        for (j = 0; j < variables.length; j++) {
            var variable = variables[j]
            regex = new RegExp(" " + variable, "g")
            if (right.search(regex) > -1) {
                allCorrect = false
                confirms[i].status = "failure"
                continue
            }
        }
    }

    return {confirms: confirms, allCorrect: allCorrect}
}

module.exports = router

var express = require('express')
var router = express.Router()
var WebSocket = require('ws')

router.post('/verify', (req, res) => {
    // Check for all necessary fields
    if (!(
        'module' in req.body &&
        'name' in req.body &&
        'author' in req.body &&
        'milliseconds' in req.body &&
        'code' in req.body
    )) {
        console.log("Bad request. Request body:")
        console.log(req.body)
        res.status(400)
        res.send('Requires module, name, author, milliseconds, and code fields.')
        return
    }

    // Check for trivials
    var trivials = checkForTrivials(req.body.code)
    if (trivials.overall == 'failure') {
        res.json({
            'status': 'trivial',
            'lines': trivials.confirms,
        })
        log(req, 'trivial')

        return
    }

    // Verify VCs
    var vcs = {}
    var ws = new WebSocket('wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project')

    ws.on('open', () => {
        ws.send(encode(req.body.code))
    })

    ws.on('message', (message) => {
        message = JSON.parse(message)
        if (message.status == 'error' || message.status == '') {
            res.json({
                'status': 'unparsable',
            })
            log(req, 'unparsable')
            ws.close()
        }
        else if (message.status == 'processing') {
            var regex = new RegExp('^Proved')
            if (regex.test(message.result.result)) {
                vcs[message.result.id] = 'success'
            } else {
                vcs[message.result.id] = 'failure'
            }
        }
        else if (message.status == 'complete') {
            var lineNums = decode(message.result)
            var lines = mergeVCsAndLineNums(vcs, lineNums.vcs)

            log(req, lines.overall)
            ws.close()

            //Find the next lesson to send
            var problems = req.db.collection('problems')
            problems.find({
                'module': req.body.module,
                'name': req.body.name
            })
            .project({
                'module': 1,
                'success': 1,
                'failure': 1
            })
            .next((err, result) => {
                // Don't send a new problem if we want them to repeat it
                if (lines.overall == 'failure' && !('failure' in result)) {
                    res.json({
                        'status': 'failure',
                        'lines': lines.lines
                    })
                } else {
                    // Otherwise, find the new problem
                    problems.find({
                        'module' : result.module,
                        'name': result[lines.overall]
                    })
                    .project(problemProjection)
                    .next((err, result) => {
                        res.json({
                            'status': lines.overall,
                            'lines': lines.lines,
                            'problem': result
                        })
                    })
                }
            })
        }
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
    var overall = 'success'
    var regex
    var i

    // Find all the confirm or ensures statements, with their line numbers
    regex = new RegExp("Confirm [^;]*;|ensures [^;]*;", "mg")
    for (i = 0; i < lines.length; i++) {
        var confirm = lines[i].match(regex)
        if (confirm) {
            confirms.push({lineNum: i+1, text: confirm[0], status: 'success'})
        }
    }

    regex = new RegExp("requires [^;]*;" ,"g")
    if (confirms.length == 0 && !regex.test(content)) {
        return {confirms: [], overall: 'failure'}
    }

    for (i = 0; i < confirms.length; i++) {
        // Remove the "Confirm " and "ensures " so that we can find the variable names
        var statement = confirms[i].text
        statement = statement.substr(8)

        // Search for an illegal "/="
        regex = new RegExp("/=")
        if (statement.search(regex) > -1) {
            overall = 'failure'
            confirms[i].status = "failure"
            continue
        }

        // Split the string at the conditional, first looking for >= and <=
        regex = new RegExp(">=|<=")
        var parts = statement.split(regex)
        if (parts.length > 2) {
            overall = 'failure'
            confirms[i].status = "failure"
            continue
        }

        // If there is no >= or <=
        if (parts.length == 1) {
            regex = new RegExp("=")
            parts = statement.split(regex)
            if (parts.length > 2) {
                overall = 'failure'
                confirms[i].status = "failure"
                continue
            }
        }

        // If there is no >=, <=, or =
        if (parts.length == 1) {
            regex = new RegExp(">|<")
            parts = statement.split(regex)
            if (parts.length != 2) {
                overall = 'failure'
                confirms[i].status = "failure"
                continue
            }
        }

        // Find the variables used on the left side. If there are none, mark it correct.
        var left = parts[0]
        var right = parts[1]
        regex = new RegExp("[a-np-zA-QS-Z]", "g") // Temporary fix to allow Reverse(#S) o #T on section2, lesson6
        var variables = left.match(regex)
        if (variables === null) {
            overall = 'failure'
            confirms[i].status = "failure"
            continue
        }

        // Search for these variables on the right side
        var j
        for (j = 0; j < variables.length; j++) {
            var variable = variables[j]
            regex = new RegExp(" " + variable, "g")
            if (right.search(regex) > -1) {
                overall = 'failure'
                confirms[i].status = "failure"
                continue
            }
        }
    }

    // Get rid of the text field
    for (var confirm of confirms) {
        delete confirm.text
    }

    return {confirms: confirms, overall: overall}
}

/*
    Log the result.
*/
function log(req, status) {
    var time = new Date()
    req.body.timestamp = time.toISOString() // Note that this is an ISO 8601 timestamp, which does not account for time zone
    req.body.status = status
    var data = req.db.collection('data')
    data.insertOne(req.body)
}

/*
    Take the output of all the "processing" steps of the verifier, and combine
    it with the output of the "complete" step. The result is an object with two
    fields: overall and lines. overall tells you if all the VCs proved. lines is
    an array of objects with two fields each, lineNum and status. If there are
    multiple VCs on one line, then it only says the line is proven if all of
    the VCs on that line are proven.
*/
function mergeVCsAndLineNums(provedList, lineNums) {
    var overall = 'success'
    var lines = {}

    for (var vc of lineNums) {
        if (provedList[vc.vc] != 'success') {
            overall = 'failure'
        }

        if (lines[vc.lineNum] != 'failure') {
            lines[vc.lineNum] = provedList[vc.vc]
        }
    }

    // Convert from hashtable to array
    var lineArray = []
    for (var entry of Object.entries(lines)) {
        lineArray.push({'lineNum': entry[0], 'status': entry[1]})
    }

    return {'overall': overall, 'lines': lineArray}
}

/*
    Don't ask, just accept. This is how the Resolve Web API works at the
    moment. If you want to fix this, PLEASE DO.
*/
function encode(data) {
    var regex1 = new RegExp(" ", "g")
    var regex2 = new RegExp("/+", "g")

    var content = encodeURIComponent(data)
    content = content.replace(regex1, "%20")
    content = content.replace(regex2, "%2B")

    var json = {}

    json.name = "BeginToReason"
    json.pkg = "User"
    json.project = "Teaching_Project"
    json.content = content
    json.parent = "undefined"
    json.type = "f"

    return JSON.stringify(json)
}

function decode(data) {
    var regex1 = new RegExp("%20", "g")
    var regex2 = new RegExp("%2B", "g")
    var regex3 = new RegExp("<vcFile>(.*)</vcFile>", "g")
    var regex4 = new RegExp("\n", "g")

    var content = decodeURIComponent(data)
    content = content.replace(regex1, " ")
    content = content.replace(regex2, "+")
    content = content.replace(regex3, "$1")
    content = decodeURIComponent(content)
    content = decodeURIComponent(content)
    content = content.replace(regex4, "")

    var obj = JSON.parse(content)

    return obj;
}

const problemProjection = {
    _id: 0,
    type: 1,
    module: 1,
    name: 1,
    title: 1,
    activity: 1,
    referenceMaterial: 1,
    screenCapture: 1,
    solution: 1,
    code: 1
}

module.exports = router

var express = require('express')
var router = express.Router()

router.post('/log', (req, res) => {
	if (!(
		'type' in req.body &&
		'module' in req.body &&
		'name' in req.body &&
		'author' in req.body &&
		'code' in req.body &&
		'time' in req.body &&
		'correct' in req.body
	)) {
		res.status(400)
		res.send('Requires type, module, name, author, code, time, and correct fields.')
	} else {
		var time = new Date()
		req.body.timestamp = time.toISOString() // Note that this is an ISO 8601 timestamp, which does not account for time zone
		var data = req.db.collection('data')
		data.insertOne(req.body)
		res.json(req.body)
	}
})

module.exports = router

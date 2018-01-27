var express = require('express')
var router = express.Router()

router.post('/log', (req, res) => {
	res.send('Mmkay.')
})

module.exports = router

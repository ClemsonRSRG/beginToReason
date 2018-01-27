var express = require('express')
var router = express.Router()

router.post('/verify', (req, res) => {
	res.send('Mmkay')
})

module.exports = router

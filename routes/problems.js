var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
	res.send('Problems home page')
})

module.exports = router

var express = require('express')
var router = express.Router()

router.get('/1dry', (req, res) => {
	context = {
		section: 1,
		initialProblem: 'tutorial0'
	}
	res.render('index.ejs', context)
})

router.get('/2bat', (req, res) => {
	context = {
		section: 2,
		initialProblem: 'lesson1'
	}
	res.render('index.ejs', context)
})

router.get('/3pop', (req, res) => {
	res.send('Section 3')
})

router.get('/4red', (req, res) => {
	res.send('Section 4')
})

module.exports = router

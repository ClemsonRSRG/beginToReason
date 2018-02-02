var express = require('express')
var router = express.Router()

router.get('/:module/:problem', (req, res) => {
	var problems = req.db.collection('problems')
	problems.find({module: req.params.module, name: req.params.problem}).project(problemProj).next((err, result) => {
		res.json(result)
	})
})

router.get('/:module/:problem/code', (req, res) => {
	var problems = req.db.collection('problems')
	problems.find({module: req.params.module, name: req.params.problem}).project(codeProj).next((err, result) => {
		res.json(result)
	})
})

router.get('/:module/:problem/previous', (req, res) => {
	var problems = req.db.collection('problems')
	problems.find({module: req.params.module, name: req.params.problem}).project(previousProj).next((err, result) => {
		problems.find({module: req.params.module, name: result.previous}).project(problemProj).next((err, previous) => {
			res.json(previous)
		})
	})
})

router.get('/:module/:problem/success', (req, res) => {
	var problems = req.db.collection('problems')
	problems.find({module: req.params.module, name: req.params.problem}).project(successProj).next((err, result) => {
		problems.find({module: req.params.module, name: result.success}).project(problemProj).next((err, success) => {
			res.json(success)
		})
	})
})

router.get('/:module/:problem/failure', (req, res) => {
	var problems = req.db.collection('problems')
	problems.find({module: req.params.module, name: req.params.problem}).project(failureProj).next((err, result) => {
		problems.find({module: req.params.module, name: result.failure}).project(problemProj).next((err, failure) => {
			res.json(failure)
		})
	})
})

const problemProj = {
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

const codeProj = {
	_id: 0,
	code: 1
}

const previousProj = {
	_id: 0,
	previous: 1
}

const failureProj = {
	_id: 0,
	failure: 1
}

const successProj = {
	_id: 0,
	success: 1
}

module.exports = router

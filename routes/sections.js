var express = require('express')
var router = express.Router()

router.get('/1dry', (req, res) => {
    var context = {module: '1dry'}
    res.render('index.ejs', context)
})

router.get('/1dry/initial', (req, res) => {
    initial(req, res, 'section1', 'tutorial0')
})

router.get('/2bat', (req, res) => {
    var context = {module: '2bat'}
    res.render('index.ejs', context)
})

router.get('/2bat/initial', (req, res) => {
    initial(req, res, 'section2', 'lesson1')
})

router.get('/3pop', (req, res) => {
    var context = {module: '3pop'}
    res.render('index.ejs', context)
})

router.get('/3pop/initial', (req, res) => {
    initial(req, res, 'section2', 'lesson1')
})

// Unused sections
router.get('/4red', (req, res) => {
    res.send('Section 4')
})


/*
    One day, the initial problem should be hosted on the database.
*/
function initial(req, res, module, problem) {
    var problems = req.db.collection('problems')
    problems.find({
        module: module,
        name: problem
    })
    .project(problemProjection)
    .next((err, result) => {
        res.json(result)
    })
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

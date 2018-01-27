var express = require('express')
var app = express()

app.get('/', (req, res) => {
	res.send('Hello world!')
})

var port = 3000
app.listen(port, () => {
	console.log('Listening on port ' + port + '...')
})

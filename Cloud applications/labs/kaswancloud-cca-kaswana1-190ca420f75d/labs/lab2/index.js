const express = require('express')
const app = express()
var port = process.env.PORT || 8000;
app.use(express.static('static'))
app.use (express.urlencoded({extended: false}))
app.listen(port, () =>
    console.log(`HTTP Server with Express.js is listening on port:${port}`)
)
app.get('/', (require, res) => {
    res.sendFile(__dirname + '/static/cca-form.html');
})
app.get('/echo.php', function (req, res) {
    var data = req.query.data
    res.send(data)
})
app.post('/echo.php', function (req, res) {
    var data = req.body['data']
    res.send(data)
})

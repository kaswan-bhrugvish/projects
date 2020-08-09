const express = require('express')
const app = express()
const cors = require('cors')//New for microservice
var port = process.env.PORT || 8080;

app.use(express.static('static'))
app.use (express.urlencoded({extended: false}))
app.use(cors())//New for microservice
app.listen(port, () =>
    console.log(`HTTP Server with Express.js is listening on port:${port}`)
)

app.get('/', (require, res) => {
    res.sendFile(__dirname + '/static/cca-form.html');
})
app.get('/Age_ChineseZodiac', function (req, res) {
    var d = new Date();
    var n = d.getFullYear();
    var data = req.query.year
    var age = n - data 
    zodiac = ["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat"]
    var cal = age % 12

    zodiacsign = zodiac[cal]
    res.send(`your sign is  ${zodiacsign} & Age ${age}`)
    res.end(data)
})




/*
app.get('/echo.php', function (req, res) {
    var data = req.query.data
    res.send(data)
})
app.post('/echo.php', function (req, res) {
    var data = req.body['data']
    res.send(data)
})
*/

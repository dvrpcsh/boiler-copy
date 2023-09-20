const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
const { User } = require("./models/User");
const bodyParser = require('body-parser');
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());


mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req,res) => {
    //회원가입 할 때 필요한 정보를 client에서 가져와 db insert
    const user = new User(req.body)

    user.save().then(() => {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        res.json({ success: false,err})
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
const { User } = require("./models/User");
const bodyParser = require('body-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const cookieParser = require('cookie-parser');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req,res) => {
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

app.post('/api/users/login', (req,res) => {
    User.findOne({ email: req.body.email }).then(user=> {
        if(!user) {
            return res.json({
                        loginSuccess: false,
                        message: "제공된 이메일에 해당하는 유저가 없습니다."
                    })
        }
        //db에서 검색이 되면 비밀번호 비교
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."})
            }
        
            //비밀번호가 맞다면 토큰 생성
            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 로컬이나 쿠키
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess:true, userId: user._id})
            })
        })
     }).catch((err) => {
        return res.json({
            loginSuccess: false,
            message: "서버에 연결할 수 없습니다."
        })
    })
    
})

app.get('/api/users/auth', auth , (req,res) => {

    // Authentication 통과
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.role === 0? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })

})

app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({_id: req.user._id}, 
    { token: ""},
    (err,user) => {
        if(err) return res.json({success: false,err});
        return res.status(200).send({
            success:true
        })
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
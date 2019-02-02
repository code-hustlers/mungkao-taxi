module.exports = (app, jwt, User) => {
    
    // API LIST

    // User check
    app.post('/apis/v1/auth/check', (req, res) => {
        console.log(`API: /apis/v1/auth/check =============== ${req} :::::`);
    });

    // Sign up
    app.post('/apis/v1/signup', (req, res) => {
        console.log(`API: /apis/v1/signup =============== ${req.body} :::::`);

        const user = new User({
            id: req.body.id,
            pw: req.body.pw,
            name: req.body.name,
            position: req.body.position,
            status: req.body.status,
            create_date: new Date()
        });

        console.log(`=====================================`);
        console.log(user)
        console.log(`=====================================`);

        if(user.id) {

            user.save(err => {
                console.log('error: ', err);
                if(err) {
                    res.status(401).json({ result: 0, msg: err.code === 11000 ? '존재하는 아이디 입니다.' : '나도몰랑' });
                    return;
                }
                res.status(200).json({ result: 1, msg: '회원가입 성공!' });
            })
        }
        
        return;
    });

    // Login
    app.post('/apis/v1/login', (req, res) => {
        const secret = req.app.get('jwt-secret');
        console.log('REQ : ', req.body);

        User.find({ id: req.body.id }, (err, user) => {
            
            if(err) throw err;
            console.log('user: ', user);

            if(user.length == 0) {
                console.log('401=======USER NOT FOUND');
                return res.status(401).json({ msg: 'user not found' });
            }

            if(user[0].pw != req.body.pw) {
                console.log('401=======PW IS DEFERENT');
                return res.status(401).json({ msg: 'pw is deferent' });
            }

            const isAuth = user[0].id ? true : false;

            const t = new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        _id: user[0]._id,
                        id: user[0].id,
                        name: user[0].name,
                        gender: user[0].gender
                    },
                    secret,
                    {
                        expiresIn: '1d',
                        issuer: 'mungkao.com',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if(err) reject(err)
                        console.log('TOKEN : ', token);
                        res.json({
                            success: true,
                            token
                        });
                        resolve(token);
                    }
                )
            });
            
            return t;
        });
    });
}
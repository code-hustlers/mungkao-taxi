const DEFAULT_API = "/apis/v1";
module.exports = (app, jwt, User) => {
  // API LIST

  // User check
  app.post(`${DEFAULT_API}/auth/check`, (req, res) => {
    console.log(`API: ${DEFAULT_API}/auth/check =============== ${req} :::::`);
  });

  // Sign up
  app.post(`${DEFAULT_API}/signup`, (req, res) => {
    console.log(`API: ${DEFAULT_API}/signup =============== ${req.body} :::::`);

    const user = new User({
      id: req.body.id,
      pw: req.body.pw,
      name: req.body.name,
      position: req.body.position,
      status: req.body.status,
      create_date: new Date()
    });

    console.log(`=====================================`);
    console.log(user);
    console.log(`=====================================`);

    if (user.id) {
      user.save(err => {
        console.log("error: ", err);
        if (err) {
          res.status(401).json({
            result: 0,
            msg: err.code === 11000 ? "존재하는 아이디 입니다." : "나도몰랑"
          });
          return;
        }
        res.status(200).json({ result: 1, msg: "회원가입 성공!" });
      });
    }

    return;
  });

  // Login
  app.post(`${DEFAULT_API}/login`, (req, res) => {
    const secret = req.app.get("jwt-secret");
    console.log("REQ : ", req.body);

    User.find({ id: req.body.id }, (err, user) => {
      if (err) throw err;
      console.log("user: ", user);

      if (user.length == 0) {
        console.log("401=======USER NOT FOUND");
        return res.status(401).json({ msg: "user not found" });
      }

      if (user[0].pw != req.body.pw) {
        console.log("401=======PW IS DEFERENT");
        return res.status(401).json({ msg: "pw is deferent" });
      }

      const isAuth = user[0].id ? true : false;

      const t = new Promise((resolve, reject) => {
        jwt.sign(
          {
            _id: user[0]._id,
            id: user[0].id,
            name: user[0].name,
            position: user[0].position,
            status: user[0].status
          },
          secret,
          {
            expiresIn: "1d",
            issuer: "mungkao.com",
            subject: "userInfo"
          },
          (err, token) => {
            if (err) reject(err);
            console.log("TOKEN : ", token);
            res.json({
              success: true,
              token
            });
            resolve(token);
          }
        );
      });

      return t;
    });
  });
  app.get(`${DEFAULT_API}/verify`, async (req, res) => {
    // read the token from header or url
    const token = req.headers["x-access-token"] || req.query.token;

    // token does not exist
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "not logged in"
      });
    }

    try {
      await jwt.verify(token, req.app.get("jwt-secret"), (err, decoded, other) => {
        console.log("TCL: decoded", decoded, other);
        res.json(decoded);
      });
    } catch (error) {
      console.error(error);
    }
  });

  // Log out
};

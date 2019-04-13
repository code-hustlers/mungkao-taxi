const DEFAULT_API = "/apis/v1";
const moment = require("moment");
const {
  USER_STATUS_READY,
  USER_STATUS_WORK,
  USER_POSITION_DRIVER,
  CALL_STATUS_APPROVE,
  CALL_STATUS_REJECT,
  SERVER_RESULT_SUCCESS,
  SERVER_RESULT_FAILURE
} = require("../constants");
console.log("TCL: USER_STATUS_READY", USER_STATUS_READY);

const Now = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = (app, jwt, User, Call) => {
  // API LIST

  // PUT call approval
  app.put(`${DEFAULT_API}/call/approval`, async (req, res) => {
    // driver user status : 0 => 1
    // passenger user status : 0 => 1
    // call schema status : 0 => 1
    try {
      await User.update(
        { id: req.body.driverId },
        { status: USER_STATUS_WORK }
      );
      await User.update({ id: req.body.userId }, { status: USER_STATUS_WORK });
      await Call.update(
        { driverId: req.body.driverId, userId: req.body.userId },
        { status: CALL_STATUS_APPROVE }
      );
      await res
        .status(200)
        .json({ result: SERVER_RESULT_SUCCESS, msg: "매칭 완료 HooHoo ~" });
    } catch (error) {
      console.log("call/approval : ", error);
      await res
        .status(401)
        .json({ result: SERVER_RESULT_FAILURE, msg: "매칭 실패 FUCK..." });
    }
  });

  // PUT call reject
  app.put(`${DEFAULT_API}/call/reject`, async (req, res) => {
    // driver user status : 0 => 0
    // passenger user status : 0 => 0
    // call schema status : 0 => 2
    try {
      await Call.update(
        { driverId: req.body.driverId, userId: req.body.userId },
        { status: CALL_STATUS_REJECT }
      );
      await res
        .status(200)
        .json({ result: SERVER_RESULT_SUCCESS, msg: "거절 완료 HooHoo" });
    } catch (error) {
      console.log("call/reject : ", error);
      await res
        .status(401)
        .json({ result: SERVER_RESULT_FAILURE, msg: "거절 실패 FUCK..." });
    }
  });

  // GET call list
  app.post(`${DEFAULT_API}/call/list`, (req, res) => {
    console.log("calllist req.body.id ===============", req.body.id);
    Call.find(
      { driverId: req.body.id, status: CALL_STATUS_READY },
      (err, calls) => {
        if (err) throw err;
        let customCalls = calls.map(call => {
          return Object.assign({
            userId: call.userId,
            sPoint: call.sPoint,
            destination: call.destination,
            price: call.price,
            date: call.call_date
          });
        });
        console.log("call List : ", customCalls);

        try {
          res.status(200).json(customCalls);
        } catch (error) {
          console.log(error);
          res
            .status(401)
            .json({ result: SERVER_RESULT_FAILURE, msg: "다시시도해주세용" });
        }
      }
    );
  });

  // POST Insert call info
  app.post(`${DEFAULT_API}/call/request`, (req, res) => {
    console.log(
      `API: ${DEFAULT_API}/call/request =============== ${req.body} :::::`
    );

    User.find(
      { id: req.body.driverId, status: USER_STATUS_READY },
      (err, data) => {
        if (err) throw err;
        // console.log('data =============', data, 'err ======================', err);
        if (data.length === 1) {
          Call.find(
            { driverId: req.body.driverId, userId: req.body.userId },
            async (err, data) => {
              if (err) throw err;
              console.log(
                "data =============",
                data,
                "err ======================",
                err
              );
              const call = new Call({
                driverId: req.body.driverId,
                userId: req.body.userId,
                sPoint: req.body.sPoint,
                destination: req.body.destination,
                price: req.body.price,
                call_date: Now,
                status: CALL_STATUS_READY // 0 대기, 1 승인, 2 거절
              });
              if (data.length === 1) {
                console.log("call List update");
                await Call.updateOne(
                  { driverId: req.body.driverId, userId: req.body.userId },
                  {
                    sPoint: req.body.sPoint,
                    destination: req.body.destination,
                    price: req.body.price,
                    call_date: Now,
                    status: CALL_STATUS_READY
                  }
                );
              } else {
                //save
                console.log("call list insert");
                call.save(err => {
                  console.log(err);
                  if (err) {
                    res.status(401).json({
                      result: SERVER_RESULT_FAILURE,
                      msg: "에러낫오용"
                    });
                  }
                  res
                    .status(200)
                    .json({ result: SERVER_RESULT_SUCCESS, msg: "요청갓오용" });
                });
              }
            }
          );
        } else {
          res
            .status(401)
            .json({ result: SERVER_RESULT_FAILURE, msg: "운전중이에용" });
        }
      }
    );
  });

  // GET driver info
  app.get(`${DEFAULT_API}/driver/list`, (req, res) => {
    User.find(
      { position: USER_POSITION_DRIVER, status: USER_STATUS_READY },
      (err, dirvers) => {
        if (err) throw err;
        console.log("dirver: ", dirvers);
        let customDrivers = dirvers.map(driver => {
          return Object.assign(
            {},
            {
              id: driver.id,
              name: driver.name,
              status: driver.status,
              date: driver.create_date
            }
          );
        });
        console.log("driver1: ", customDrivers);
        try {
          res.status(200).json(customDrivers);
        } catch (error) {
          console.log(error);
        }
      }
    );
  });

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
      create_date: Now
    });

    console.log(`=====================================`);
    console.log(user);
    console.log(`=====================================`);

    if (user.id) {
      user.save(err => {
        console.log("error: ", err);
        if (err) {
          res.status(401).json({
            result: SERVER_RESULT_FAILURE,
            msg: err.code === 11000 ? "존재하는 아이디 입니다." : "나도몰랑"
          });
          return;
        }
        res
          .status(200)
          .json({ result: SERVER_RESULT_SUCCESS, msg: "회원가입 성공!" });
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
      await jwt.verify(
        token,
        req.app.get("jwt-secret"),
        (err, decoded, other) => {
          console.log("TCL: decoded", decoded, other);
          res.json(decoded);
        }
      );
    } catch (error) {
      console.error(error);
    }
  });

  // Log out
};

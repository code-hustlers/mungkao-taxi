import moment from "moment";
import {
  DEFAULT_API,
  USER_STATUS_READY,
  USER_STATUS_WORK,
  USER_POSITION_DRIVER,
  CALL_STATUS_READY,
  CALL_STATUS_APPROVE,
  CALL_STATUS_REJECT,
  SERVER_RESULT_SUCCESS,
  SERVER_RESULT_FAILURE,
  CALL_STATUS_ARRIVE
} from "../constants";

const NOW = moment().format("YYYY-MM-DD HH:mm:ss");

const callRoutes = (app, User, Call) => {
  // PUT call status
  app.post(`${DEFAULT_API}/call/arrive`, async (req, res) => {
    try {
      await Call.update(
        { driverId: req.body.driverId, userId: req.body.userId },
        { status: CALL_STATUS_ARRIVE }
      );
      await User.update(
        { id: req.body.driverId },
        { status: USER_STATUS_READY }
      );
      await User.update({ id: req.body.userId }, { status: USER_STATUS_READY });
      await res
        .status(200)
        .json({ result: SERVER_RESULT_SUCCESS, msg: "도착!" });
    } catch (error) {
      await res
        .status(401)
        .json({ result: SERVER_RESULT_FAILURE, msg: "failure arrive" });
    }
  });

  // GET call status
  app.post(`${DEFAULT_API}/call/info`, (req, res) => {
    if (req.body.type === "driver") {
      Call.find(
        { driverId: req.body.driverId, status: CALL_STATUS_APPROVE },
        (err, data) => {
          if (err) throw err;
          try {
            res.status(200).json({
              result: SERVER_RESULT_SUCCESS,
              msg: "Get status success!",
              status: data[0].status,
              userId: data[0].userId
            });
          } catch (error) {
            res.status(401).json({ result: SERVER_RESULT_FAILURE, msg: error });
          }
        }
      );
    } else if (req.body.type === "passenger") {
      Call.find()
        .where("userId")
        .equals(req.body.userId)
        .in("status", [CALL_STATUS_READY, CALL_STATUS_APPROVE])
        .then(data => {
          console.log(
            "++++++++++++++++++++++++++++++++++++++++++++++++++++++123",
            data
          );
          try {
            res.status(200).json({
              result: SERVER_RESULT_SUCCESS,
              msg: "Get status success!",
              status: data[0].status,
              userId: data[0].userId
            });
          } catch (error) {
            res.status(401).json({ result: SERVER_RESULT_FAILURE, msg: error });
          }
        });
    } else {
      res
        .status(401)
        .json({ result: SERVER_RESULT_FAILURE, msg: "parameter type error!" });
    }
  });

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
                call_date: NOW,
                status: CALL_STATUS_READY // 0 대기, 1 승인, 2 거절
              });
              if (data.length === 1) {
                console.log("call List update");
                await Call.update(
                  { driverId: req.body.driverId, userId: req.body.userId },
                  {
                    sPoint: req.body.sPoint,
                    destination: req.body.destination,
                    price: req.body.price,
                    call_date: NOW,
                    status: CALL_STATUS_READY
                  }
                );
                res
                  .status(200)
                  .json({ result: SERVER_RESULT_SUCCESS, msg: "요청갓오용" });
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
              token: driver.token,
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
};

export default callRoutes;

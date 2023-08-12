const express = require("express");
const router = express.Router();
const db = require("../services/db.service");

router.get("/query1", (req, res) => {
  db.query(
    `SELECT firstName,lastName,username, userType, phone ,education,proffesionalExperience FROM user WHERE userType!=? AND userCode!=? ORDER BY 4,2`,
    ["manager", 100],
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

router.get("/query2", (req, res) => {
  db.query(
    `SELECT  userCode ,firstName , lastName , userType , COUNT(*) AS Num
           FROM user, negotiation
           WHERE user.userCode = negotiation.userCode1 
           OR user.userCode = negotiation.userCode2
           OR user.userCode = negotiation.mediatorCode 
           AND userType!=? AND userCode!=?
           GROUP BY  user.userCode
           `,
    ["manager", 100],
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

router.get("/query3", (req, res) => {
  db.query(
    `SELECT  negotiation.negoid,title, COUNT(*) AS Num
           FROM message, negotiation
           WHERE message.negoid = negotiation.negoid 
           GROUP BY  negotiation.negoid
           `,
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

router.get("/query4", (req, res) => {
  db.query(
    `SELECT  negoid, title, description, startTime, userCode1, userCode2, mediatorCode
           FROM negotiation
           WHERE endTime IS NULL
           ORDER BY startTime`,
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

router.get("/query5", (req, res) => {
  db.query(
    `SELECT  negoid, title, description, startTime, endTime
           FROM negotiation
           WHERE endTime IS NOT NULL
           ORDER BY startTime`,
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

router.get("/query6", (req, res) => {
  db.query(
    `SELECT userType, COUNT(*) AS num
          FROM user
          WHERE userCode != ? AND userType!=?
          GROUP BY  userType;
          `,
    [100, "manager"],
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

module.exports = router;

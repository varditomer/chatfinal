const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");



router.get("/approvedMed", (req, res) => {
  const isApproved = 1;
  const type = "mediator";
  db.query(
    `SELECT username FROM user WHERE approved=? AND userType=?`,
    [isApproved, type],
    function (error, result) {
      res.send(result);
    }
  );
});

router.get("/getUnapprovedMediators", (req, res) => {
  const isApproved = 0;
  const type = "mediator";

  db.query(
    `SELECT firstName,lastName,username,education,professionalExperience FROM user WHERE approved=? AND userType=?`,
    [isApproved, type],
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});


router.post("/approveMediator", (req, res) => {
  const { username } = req.body
  console.log(`username:`, username)
  db.query(
    `UPDATE user SET approved='1' WHERE username=?`,
    [username],
    function (error, result) {
      if (error) {
        console.log(`error while approving mediator:`, error.message);
        return res.status(500)
          .json({ error: "Approving Mediator Failed!" });
      } else {
        // If approving mediator is successful, return mediator username
        console.log(`Mediator: '${username}' approved`);
        return res.json({ username });
      }
    }
  );
});

router.post("/assignmedi", (req, res) => {
  db.query(
    `SELECT userCode, email,phone FROM user WHERE username=?`,
    [req.body.username],
    function (error, result0) {
      db.query(
        `UPDATE negotiation SET mediatorCode=('${result0[0].userCode}') WHERE negoid=?`,
        [req.body.negoid],

        function (error, result) {
          db.query(
            `SELECT userCode1,userCode2,description FROM negotiation WHERE negoid=?`,
            [req.body.negoid],

            function (error, res2) {
              db.query(
                `SELECT username, email, phone FROM user WHERE userCode=? OR userCode=?`,
                [res2[0].userCode1, res2[0].userCode2],

                function (error, res3) {
                  console.log(res3);

                  var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "negoflict2555@gmail.com",
                      pass: "nidhbqdpouvypnhn",
                    },
                  });

                  var mailOptions = {
                    from: "negoflict2555@gmail.com",
                    to: `${res3[0].email}, ${res3[1].email}`,
                    form: "NegoFlict Support",
                    subject: "New negotiation",
                    text: `Hello friend! You have new negotiate with the mediator ${req.body.username}. You should make an appointment as soon as possible with the mediator on the phone ${result0[0].phone}.
                             `,
                  };

                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });

                  var transporter1 = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "negoflict2555@gmail.com",
                      pass: "nidhbqdpouvypnhn",
                    },
                  });

                  var mailOptions1 = {
                    from: "negoflict2555@gmail.com",
                    to: `${result0[0].email}`,
                    form: "NegoFlict Support",
                    subject: "New negotiation",
                    text: `Hello friend! You have new negotiate with the negotiators ${res3[0].username} and ${res3[1].username}. You should make an appointment as soon as possible with the negotiators on the phone${res3[0].phone} and ${res3[1].phone} . The description of the negotiation is ${res2[0].description}. 
                             `,
                  };

                  transporter1.sendMail(mailOptions1, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

router.post("/checkinsti", (req, res) => {
  db.query(
    `SELECT userType
        FROM user
        WHERE username=?`,
    [req.body.name],
    function (error, result0) {
      if ((result0[0].userType = "mediator")) {
        res.send("b");
      } else {
        res.send("no");
      }
    }
  );
});


router.get("/query8/:username", (req, res) => {
  const { username } = req.params;
  db.query(
    `SELECT userCode FROM user WHERE username=?`,
    [username],
    function (error, result) {
      db.query(
        `SELECT  mediatorCode, title, description, endTime, summary
           FROM negotiation
           WHERE summary IS NOT NULL AND mediatorCode=?
           ORDER BY endTime`,
        [result[0].userCode],
        function (error, res1) {
          res.send(res1);
        }
      );
    }
  );
});

module.exports = router;
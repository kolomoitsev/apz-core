const express = require("express");
const router = express.Router();
const fs = require("fs");

const jwt = require("jsonwebtoken");
const bCrypt = require("bcrypt");

const { authenticateToken, updateTokens } = require("./../helpers/index");
const { secret } = require("./../config").jwt;

const tokenModel = require("./../models/token.model");
const userModel = require("./../models/user.model");
const exec = require("child_process").exec;

router
  .get("/backup", async (req, res) => {
    // directory path
    try {
      const dir = "./cron-tasks/backups/";

      fs.readdir(dir, (err, files) => {
        return res.json({ files });
      });
    } catch (e) {
      return res.sendStatus(400);
    }
  })
  .post("/backup/apply", async (req, res) =>{

    const { backup } = req.body;


    exec("mongorestore --uri " +
        "mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/sigma " +
        `--archive=./cron-tasks/backups/${backup} --gzip`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      return res.sendStatus(200);

    });

  })
    .post('/backup/create', async (req, res) => {

      exec("mongodump --uri " +
          "mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/sigma " +
          `--archive=./cron-tasks/backups/customdump-` + new Date().toJSON() + `.gz --gzip`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        return res.sendStatus(200);

      });
    })

    //user auth
  .post("/login", async (req, res) => {
    const { userEmail, userPassword } = req.body;

    const user = await userModel.findOne({
      userEmail,
    });

    if (!user) {
      return res.sendStatus(404);
    }

    if ((await bCrypt.compare(userPassword, user.userPassword)) === false) {
      return res.sendStatus(401);
    } else {
      const { userEmail, _id, reservationId } = user;
      //console.log(user);

      updateTokens(_id).then((tokens) =>
        res.json({ tokens, userEmail, _id, reservationId })
      );
    }
  })
  //refresh tokens
  .post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    let payload;

    try {
      payload = jwt.verify(refreshToken, secret);
      if (payload.type !== "refresh") {
        return res.status(400).json({ message: "Invalid token" });
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: "Token expired" });
      } else if (e instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: "Invalid token" });
      }
    }

    tokenModel
      .findOne({ tokenId: payload.id })
      .exec()
      .then((token) => {
        if (token === null) {
          throw new Error("Invalid token");
        }
        return updateTokens(token.userId);
      })
      .then((tokens) => res.json(tokens))
      .catch((err) => res.status(400).json({ message: err.message }));
  })
  //register user
  .post("/", async (req, res) => {
    const {
      reservationId,
      userName,
      userMiddleName,
      userLastName,
      userEmail,
      userPhone,
      userRole,
      userStatus,
      userPassword,
    } = req.body;

    const user = new userModel({
      reservationId,
      userName,
      userMiddleName,
      userLastName,
      userEmail,
      userPhone,
      userRole,
      userStatus,
      userPassword: await bCrypt.hash(userPassword, 10),
    });

    await user
      .save()
      .then(() => res.status(200).json(user))
      .catch((err) =>
        res.status(500).json({
          error: "Error with creating new user",
          err,
        })
      );
  })
  //get all users
  .get("/", authenticateToken, async (req, res) => {
    return res.status(422).json({ message: "Wrong scooter's type" });

    try {
      const users = await userModel.find({});

      if (users.length) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          error: "Not found",
        });
      }
    } catch (e) {
      return res.status(500).json({
        error: "Error with finding users",
        e,
      });
    }
  })
  //get user by id
  .get("/reservation/:reservation_id", authenticateToken, async (req, res) => {
    const { reservation_id } = req.params;
    try {
      const users = await userModel.find({
        reservationId: reservation_id,
      });
      return res.json(users);
    } catch (e) {
      return res.json(e);
    }
  })

  .get("/:user_id", authenticateToken, async (req, res) => {
    const { user_id } = req.params;
    try {
      const user = await userModel.findById(user_id);
      if (user) {
        return res.status(200).json(user);
      } else
        return res.status(404).json({
          error: "Not found",
        });
    } catch (e) {
      return res.status(500).json({
        error: "Error with finding exact user",
      });
    }
  })
  //edit user
  .patch("/:user_id", authenticateToken, async (req, res) => {
    const { user_id } = req.params;
    const {
      userName,
      userMiddleName,
      userLastName,
      userEmail,
      userPhone,
      userRole,
      userStatus,
      userPassword,
    } = req.body;
    try {
      const user = await userModel.findByIdAndUpdate(user_id, {
        userName,
        userMiddleName,
        userLastName,
        userEmail,
        userPhone,
        userRole,
        userStatus,
        userPassword,
      });
      if (user) {
        return res.status(200).json(user);
      } else
        return res.status(404).json({
          error: "Not found",
        });
    } catch (e) {
      return res.status(500).json({
        error: "Error with updating exact user",
      });
    }
  })
  //delete user
  .delete("/:user_id", authenticateToken, async (req, res) => {
    const { user_id } = req.params;
    try {
      const remove = await userModel.findByIdAndDelete(user_id);
      if (remove) {
        return res.status(200).json({
          message: "Successfully deleted",
        });
      } else {
        return res.status(404).json({
          error: "Not found",
        });
      }
    } catch (e) {
      return res.status(500).json({
        error: "Error with deleting exact user",
      });
    }
  });

module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const connection = require("../../config/database");

// Secret key untuk token JWT
const secretKey = "kunciRahasiaYangSama";

router.post("/register",[
    body("nama_user").notEmpty().withMessage("Isi semua bidang"),
    body("no_hp").notEmpty().withMessage("Isi semua bidang"),
    body("email_user").notEmpty().withMessage("Isi semua bidang"),
    body("gender").notEmpty().withMessage("Isi semua bidang"),
    body("ttl").notEmpty().withMessage("Isi semua bidang"),
    body("pw_user").notEmpty().withMessage("Isi semua bidang")
  ],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { nama_user, no_hp, email_user, gender, ttl, pw_user } = req.body;
    const checkUserQuery = "SELECT * FROM user WHERE email_user = ?";
    connection.query(checkUserQuery, [email_user], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server Error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "Pengguna sudah terdaftar" });
      }
      const insertUserQuery = "INSERT INTO user (nama_user, no_hp, email_user, gender, ttl, pw_user) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(insertUserQuery, [ nama_user, no_hp, email_user, gender, ttl, pw_user], (err, results) => {
          if (err) {
            return res.status(500).json({ 
              error: "Server Error", 
              message: err
            });
          }
          const payload = { userid_user: results.id_user, email_user };
          const token = jwt.sign(payload, secretKey);
          const updateTokenQuery = "UPDATE user SET token = ? WHERE id_user = ?";
          connection.query(updateTokenQuery,[token, results.insertId], (err, results) => {
              if (err) {
                return res.status(500).json({ error: "Server Error" });
              }
              res.json({ token });
            });
        });
    });
});

router.post("/login", (req, res) => {
  const { email_user, pw_user } = req.body;

  connection.query("SELECT * FROM user WHERE email_user = ?",[email_user],(error, results) => {
      if (error) {
        return res.status(500).json({ error: "Server Error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Gagal masuk" });
      }
      const user = results[0];
      if (user.password !== pw_user) {
        return res.status(401).json({ error: "Kata sandi salah" });
      }
      if (user.token) {
        const token = user.token;
        res.json({ token });
      } else {
        const payload = { userId: user.id_user, email_user };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = "UPDATE user SET token = ? WHERE id_user = ? ";
        connection.query(updateTokenQuery,[token, user.id],(err, updateResult) => {
            if (err) {
              return res.status(500).json({ error: "Server Error" });
            }
            res.json({ token });
        });
      }
    });
});

module.exports = router;


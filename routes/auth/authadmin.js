const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const connection = require("../../config/database");

// Secret key untuk token JWT
const secretKey = "kunciRahasiaYangTidakSama";

router.get('/', function (req, res){
    connection.query('select * from admin order by id_admin desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data admin',
                data: rows
            })
        }
    })
});

router.post("/register",[
    body("nama_admin").notEmpty().withMessage("Isi semua bidang"),
    body("no_hp").notEmpty().withMessage("Isi semua bidang"),
    body("email_admin").notEmpty().withMessage("Isi semua bidang"),
    body("gender").notEmpty().withMessage("Isi semua bidang"),
    body("ttl").notEmpty().withMessage("Isi semua bidang"),
    body("pw_admin").notEmpty().withMessage("Isi semua bidang")
  ],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { nama_admin, no_hp, email_admin, gender, ttl, pw_admin } = req.body;
    const checkadminQuery = "SELECT * FROM admin WHERE email_admin = ?";
    connection.query(checkadminQuery, [email_admin], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server Error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "Pengguna sudah terdaftar" });
      }
      const insertadminQuery = "INSERT INTO admin (nama_admin, no_hp, email_admin, gender, ttl, pw_admin) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(insertadminQuery, [ nama_admin, no_hp, email_admin, gender, ttl, pw_admin], (err, results) => {
          if (err) {
            return res.status(500).json({ 
              error: "Server Error", 
              message: err
            });
          }
          const payload = { adminid_admin: results.id_admin, email_admin };
          const token = jwt.sign(payload, secretKey);
          const updateTokenQuery = "UPDATE admin SET token = ? WHERE id_admin = ?";
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
  const { email_admin, pw_admin } = req.body;

  connection.query("SELECT * FROM admin WHERE email_admin = ?",[email_admin],(error, results) => {
      if (error) {
        return res.status(500).json({ error: "Server Error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Gagal masuk" });
      }
      const admin = results[0];
      if (admin.pw_admin !== pw_admin) {
        return res.status(401).json({ error: "Kata sandi salah" });
      }
      if (admin.token) {
        const token = admin.token;
        res.json({ token });
      } else {
        const payload = { adminId: admin.id_admin, email_admin };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = "UPDATE admin SET token = ? WHERE id_admin = ? ";
        connection.query(updateTokenQuery,[token, admin.id],(err, updateResult) => {
            if (err) {
              return res.status(500).json({ error: "Server Error" });
            }
            res.json({ token });
        });
      }
    });
});

module.exports = router;


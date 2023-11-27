// const express = require('express');
// const router = express.Router();
// const {body, validationResult} = require('express-validator');
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
// const connection = require('../config/database');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/image')
//     },
//     filename: (req, file, cb) => {
//         console.log(file)
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Jenis File Tidak Diizinkan'), false)
//     }
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter })

// const authenticateToken = require('../routes/auth/midleware/authenticateToken')

// router.get('/', authenticateToken, function (req, res){
//     connection.query('select * from admin order by id_admin desc', function(err, rows){
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Failed',
//             })
//         }else{
//             return res.status(200).json({
//                 status:true,
//                 message: 'Data Admin',
//                 data: rows
//             })
//         }
//     })
// });

// router.post('/store', authenticateToken, upload.single("file_admin"), [
//     body('nama_admin').notEmpty(),
//     body('no_hp').notEmpty(),
//     body('email_admin').notEmpty(),
//     body('gender').notEmpty(),
//     body('ttl').notEmpty(),
//     body('pw_admin').notEmpty()
// ],(req, res) => {
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(422).json({
//             error: error.array()
//         });
//     }
//     let Data = {
//         nama_admin: req.body.nama_admin,
//         no_hp: req.body.no_hp,
//         email_admin: req.body.email_admin,
//         gender: req.body.gender,
//         ttl: req.body.ttl,
//         pw_admin: req.body.pw_admin,
//         file_admin: req.file.filename
//     }
//     connection.query('insert into admin set ?', Data, function(err, rows){
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Error'
//             })
//         }else{
//             return res.status(201).json({
//                 status: true,
//                 message: 'Success..!',
//                 data: rows[0]
//             })
//         }
//     })
// });

// router.get('/(:id)', authenticateToken, function (req, res) {
//     let id = req.params.id;
//     connection.query(`select * from admin where id_admin = ${id}`, function (err, rows) {
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Error'
//             })
//         }
//         if(rows.length <=0){
//             return res.status(404).json({
//                 status: false,
//                 message: 'Not Found'
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status: true,
//                 message: 'Data Admin',
//                 data: rows[0]
//             })
//         }
//     })
// });

// router.patch('/update/:id', authenticateToken, upload.single("file_admin"), [
//     body('nama_admin').notEmpty(),
//     body('no_hp').notEmpty(),
//     body('email_admin').notEmpty(),
//     body('gender').notEmpty(),
//     body('ttl').notEmpty(),
//     body('pw_admin').notEmpty()
// ], (req, res) => {
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(422).json({
//             error: error.array()
//         })
//     }
//     let id = req.params.id;
//     let file_admin = req.file ? req.file.filename : null;
//     connection.query(`select * from admin where id_admin = ${id}`, function(err, rows) {
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Error'
//             })
//         }
//         if(rows.length ===0){
//             return res.status(404).json({
//                 status: false,
//                 message: 'Not Found'
//             })
//         }
//         const namaFileLama = rows[0].file_admin;

//         //Hapus File Lama Jika ada
//         if(namaFileLama && file_admin){
//             const pathFileLama = path.join(__dirname, '../public/image', namaFileLama);
//             fs.unlinkSync(pathFileLama);
//         }
//     let Data = {
//         nama_admin: req.body.nama_admin,
//         no_hp: req.body.no_hp,
//         email_admin: req.body.email_admin,
//         gender: req.body.gender,
//         ttl: req.body.ttl,
//         pw_admin: req.body.pw_admin,
//         file_admin: req.file.filename
//     }
//     connection.query(`update admin set ? where id_admin = ${id}`, Data, function (err, rows) {
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Error'
//             })
//         }else{
//             return res.status(200).json({
//                 status: true,
//                 message: 'Update Success..!'
//             })
//         }
//     })
// })

// });

// router.delete('/delete/(:id)', authenticateToken, function(req, res) {
//     let id = req.params.id;
//     connection.query(`delete from admin where id_admin = ${id}`, function(err, rows) {
//         if(err){
//             return res.status(500).json({
//                 status: false,
//                 message: 'Server Error'
//             })
//         }else{
//             return res.status(200).json({
//                 status: true,
//                 message: 'Data has been Delete!'
//             })
//         }
//     })
// });
// module.exports = router;
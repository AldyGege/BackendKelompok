const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const connection = require('../config/database');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Jenis File Tidak Diizinkan'), false)
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter })

router.get('/', function (req, res){
    connection.query('select * from user order by id_user desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data user',
                data: rows
            })
        }
    })
});

router.post('/store', upload.single("file_user"), [
    body('nama_user').notEmpty(),
    body('no_hp').notEmpty(),
    body('email_user').notEmpty(),
    body('gender').notEmpty(),
    body('ttl').notEmpty(),
    body('pw_user').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama_user: req.body.nama_user,
        no_hp: req.body.no_hp,
        email_user: req.body.email_user,
        gender: req.body.gender,
        ttl: req.body.ttl,
        pw_user: req.body.pw_user,
        file_user: req.file.filename
    }
    connection.query('insert into user set ?', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
});

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from user where id_user = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data user',
                data: rows[0]
            })
        }
    })
});

router.patch('/update/:id', upload.single("file_user"), [
    body('nama_user').notEmpty(),
    body('no_hp').notEmpty(),
    body('email_user').notEmpty(),
    body('gender').notEmpty(),
    body('ttl').notEmpty(),
    body('pw_user').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id;
    let file_user = req.file ? req.file.filename : null;
    connection.query(`select * from user where id_user = ${id}`, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        const namaFileLama = rows[0].file_user;

        //Hapus File Lama Jika ada
        if(namaFileLama && file_user){
            const pathFileLama = path.join(__dirname, '../public/image', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
    let Data = {
        nama_user: req.body.nama_user,
        no_hp: req.body.no_hp,
        email_user: req.body.email_user,
        gender: req.body.gender,
        ttl: req.body.ttl,
        pw_user: req.body.pw_user,
        file_user: req.file.filename
    }
    connection.query(`update user set ? where id_user = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})

});

router.delete('/delete/(:id)', function(req, res) {
    let id = req.params.id;
    connection.query(`delete from user where id_user = ${id}`, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data has been Delete!'
            })
        }
    })
});
module.exports = router;
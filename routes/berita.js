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
    connection.query('SELECT b.judul_berita, b.jenis_berita, b.tgl_berita, b.file_berita, p.nama_presenter, a.nama_admin FROM berita b JOIN presenter p ON b.id_presenter = p.id_presenter JOIN admin a ON b.id_admin = a.id_admin', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Berita',
                data: rows
            })
        }
    })
});

router.post('/store', upload.single("file_berita"), [
    body('id_presenter').notEmpty(),
    body('id_admin').notEmpty(),
    body('judul_berita').notEmpty(),
    body('jenis_berita').notEmpty(),
    body('tgl_berita').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_presenter: req.body.id_presenter,
        id_admin: req.body.id_admin,
        judul_berita: req.body.judul_berita,
        jenis_berita: req.body.jenis_berita,
        tgl_berita: req.body.tgl_berita,
        file_berita: req.file.filename
    }
    connection.query('insert into berita set ?', Data, function(err, rows){
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
    connection.query(`SELECT b.judul_berita, b.jenis_berita, b.tgl_berita, b.file_berita, p.nama_presenter, a.nama_admin FROM berita b JOIN presenter p ON b.id_presenter = p.id_presenter JOIN admin a ON b.id_admin = a.id_admin where id_berita = ${id}`, function (err, rows) {
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
                message: 'Data berita',
                data: rows[0]
            })
        }
    })
});

router.patch('/update/:id', upload.single("file_berita"), [
    body('id_presenter').notEmpty(),
    body('id_admin').notEmpty(),
    body('judul_berita').notEmpty(),
    body('jenis_berita').notEmpty(),
    body('tgl_berita').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id;
    let file_berita = req.file ? req.file.filename : null;
    connection.query(`select * from berita where id_berita = ${id}`, function(err, rows) {
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
        const namaFileLama = rows[0].file_berita;

        //Hapus File Lama Jika ada
        if(namaFileLama && file_berita){
            const pathFileLama = path.join(__dirname, '../public/image', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
    let Data = {
        id_presenter: req.body.id_presenter,
        id_admin: req.body.id_admin,
        judul_berita: req.body.judul_berita,
        jenis_berita: req.body.jenis_berita,
        tgl_berita: req.body.tgl_berita,
        file_berita: file_berita
    }
    connection.query(`update berita set ? where id_berita = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(500).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})

});

router.delete('/delete/(:id)', function(req, res) {
    let id = req.params.id;
    connection.query(`delete from berita where id_berita = ${id}`, function(err, rows) {
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

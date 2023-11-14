const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const cors = require('cors')
const connection = require('../config/database');
const app = express();
app.use(cors())

router.get('/', function (req, res){
    connection.query('SELECT s.id_saran, s.isi_saran, s.id_user, u.nama_user FROM saran s JOIN user u ON s.id_user = u.id_user', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Saran',
                data: rows
            })
        }
    })
});

router.post('/store', [
    body('id_user').notEmpty(),
    body('isi_saran').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_user: req.body.id_user,
        isi_saran: req.body.isi_saran
    }
    connection.query('insert into saran set ?', Data, function(err, rows){
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
    connection.query(`SELECT s.id_saran, s.isi_saran, s.id_user, u.nama_user FROM saran s JOIN user u ON s.id_user = u.id_user
    where id_saran = ${id}`, function (err, rows) {
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
                message: 'Data Saran',
                data: rows[0]
            })
        }
    })
});

router.patch('/update/:id', [
    body('id_user').notEmpty(),
    body('isi_saran').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id;
    let Data = {
        id_user: req.body.id_user,
        isi_saran: req.body.isi_saran
    }
    connection.query(`update saran set ? where id_saran = ${id}`, Data, function (err, rows) {
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
});

router.delete('/delete/(:id)', function(req, res) {
    let id = req.params.id;
    connection.query(`delete from saran where id_saran = ${id}`, function(err, rows) {
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

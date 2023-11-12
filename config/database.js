let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'berita'
})

connection.connect(function(error) {
    if (!!error) {
        console.log(error)
    } else {
        console.log('Koneksi berhasil')
    }
})

module.exports = connection;
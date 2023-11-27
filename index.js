const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public/image')))



const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({extended: false}));
app.use(bodyPs.json());

// const AdminRouter = require('./routes/admin.js');
// app.use('/api/admin', AdminRouter);

// const UserRouter = require('./routes/user.js');
// app.use('/api/user', UserRouter);

const BeritaRouter = require('./routes/berita.js');
app.use('/api/berita', BeritaRouter);

const PresenterRouter = require('./routes/presenter.js');
app.use('/api/presenter', PresenterRouter);

const SaranRouter = require('./routes/saran.js');
app.use('/api/saran', SaranRouter);

const auth = require('./routes/auth/auth')
app.use('/api/auth', auth);

app.listen(port, () => {
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})
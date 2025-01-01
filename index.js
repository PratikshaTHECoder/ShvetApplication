const express = require('express');
const bodyParser = require('body-parser');
require('./models/index');
const userCtrl = require('./controllers/userController');
const DashboardCtrl = require('./controllers/dashboardController');

const { verifyToken } = require('./middlewares/verifyToken');

const upload = require('./middlewares/ImageUpload')

const app = express();
app.use(bodyParser.json());

// //============AUTH====================
app.post('/register', upload.single('profileImage'), userCtrl.register);
app.post('/verifyOtp', upload.single('profileImage'), userCtrl.verifyOtp);
app.post('/login', userCtrl.Login);
app.get('/getProfile', verifyToken, userCtrl.getProfile);
app.post('/logout', verifyToken, userCtrl.logout);
app.put('/editProfile', verifyToken, userCtrl.editProfile);


//=============DASHBOARD=================

app.post('/addCategory', upload.single('categoryImage'), verifyToken, DashboardCtrl.addCategory)
app.post('/addSubCategory', verifyToken, DashboardCtrl.addSubCategory)
app.post('/addCourse', verifyToken, DashboardCtrl.addCourse)



app.listen(8000, () => {
    console.log("app is running on http://localhost:8000");
});



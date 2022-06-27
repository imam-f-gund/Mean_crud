var http = require('http');
var express =require('express');
var port = process.env.PORT || 2020;
var app = express();
var appRoutes = require('./routes/appRoutes');
var mongoose =require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
//conect mongodb
mongoose.connect('mongodb://localhost/meanDb',{useMongoClient:true});

app.use(fileUpload({
    createParentPath: true
}));


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',appRoutes);
http.createServer(app).listen(port);

console.log("backend running",port);

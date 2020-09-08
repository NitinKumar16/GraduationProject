const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars")
const cookieParser = require("cookie-parser")
const app = express();
const loginRoutes = require("./routes/login");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes= require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const categoriesRoutes = require("./routes/category");
const manufactureRoutes = require("./routes/manufacturers");
const nonAdminRoute = require("./routes/nonadmin")
const enquiryRoutes = require("./routes/customerEnquiry")
//const {createAdmin} = require("./helper/adminroot")


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser());


//Static files
app.use(express.static(__dirname + "/public"));


//mongo Db connection 
mongoose.connect("mongodb+srv://admin_nitin97:Showdbs_97@graduationproj.pwuvx.mongodb.net/GraduationProject",{
//mongoose.connect("mongodb://localhost:27017/GraduationProj",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("DB connected");
}).catch(()=>{
    console.log("Oops couldnt connect to Database");
})

//Headers 

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT");
    
    next();
});

//Handlebars 

app.set('view engine' , 'hbs');

app.engine('hbs' , hbs({
    extname: '.hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname + '/views/layout/'),
    helpers: require('./helper/handlebar_helpers')
}));

//createAdmin();

//Router
app.use('/' , nonAdminRoute)
app.use('/login' , loginRoutes)
app.use('/dashboard' , dashboardRoutes)
app.use('/users', userRoutes)
app.use('/products' , productRoutes)
app.use('/manufacturers' , manufactureRoutes)
app.use('/category' , categoriesRoutes)
app.use('/enquiry' , enquiryRoutes)


module.exports = app;
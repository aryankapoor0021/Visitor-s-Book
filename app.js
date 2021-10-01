const mongoose=require('mongoose');
const express=require('express');
const ejs=require('ejs');
const path=require('path');
const User=require('./routes/visitor.js')
const showTime=require("./public/js/time");
const methodOverride=require('method-override');
const app=express();
const session = require('express-session');
const flash = require('connect-flash');
const port=process.env.PORT || 2323;


require('dotenv').config();

const url=process.env.URL;
mongoose.connect(url,{useNewUrlParser: true})
    .then(() => console.log('Database  Connected'))
    .catch((err) => console.log(err));

const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true,
}


app.use(session(sessionConfig));
app.use(flash());

app.use(express.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('method'));

const UserRoute = require('./routes/visitor.js');


app.get('/',(req,res)=>{
	const obj=showTime();
	const time=obj.time;
	const date=obj.day;  
	console.log(date+" "+time);
	res.render('index',{time,date});
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.get('/error', (req, res) => {
    
    res.render('error');
})


app.use(UserRoute);



app.listen(port,(req,res)=>{
	console.log(`server running at ${port}`);
})
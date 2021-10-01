const express = require('express');
const router = express.Router();
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const showTime=require("C:/Users/HP world/Desktop/fed/Assignment-9/public/js/time");
require('dotenv').config();
const flash = require('connect-flash');
let isPresent=false;

router.post('/entry',async (req,respo)=>{
	const {name,emailid,phoneno,address}=req.body;
	console.log(req.body);
	
	User.findOne({name:name},(err,res)=>{
		if(err)
			console.log(err);
		else{
			if(res===null){
				const obj=showTime();
				const time=obj.time;
				const date=obj.day; 
				isPresent=false;
				const newUser=new User({
					name:name,
					email:emailid,
					mobileNo:phoneno,
					address:address,
					time:time,
					date:date,
				})
				newUser.save((err)=>{
					if (err) 
						return console.log(err);
					else
						return console.log('Suucessfully Added To Database')
				});
				sgMail.setApiKey(process.env.SENDGRID_API_KEY)
				const msg = {
                    to:`${emailid}`,
                    from:`${process.env.EMAIL}`,
                    subject:`Check in Confiramtion for ${name}`,
                    text: 'Checked In',
                    html: `<h2>Dear ${name} you successfully checked in at ${time} on ${date}</h2>`,
                }
                sgMail
                .send(msg)
                .then(() => {
	                console.log(`Email sent to ${emailid}`)
                })
                .catch((error) => {
	                console.error(error);
                })
			}
			else{
				isPresent=true;
				return console.log("User already Present");
				
			}
		}
	  })

	setTimeout(function(){ 
    console.log(isPresent);
    if(isPresent){
    	req.flash('error', 'User already Present');
        respo.redirect('/error');
    }else{
    	req.flash('success', 'Checked In Successfully');
        respo.redirect('/error');
    }
	}, 500);
	
})

router.post('/exit',(req,res)=>{
	const name=req.body.name;
	const emailid=req.body.emailid;
	console.log(name);
	let isTheir=true;

	console.log('Patch request');
	User.findOneAndDelete({name:name},(err,res)=>{
		if(err)
			console.log(err);
		else{
			if(res===null){
				console.log("User Not Checked in");
				isTheir=false;
			}
			else{
				const obj=showTime();
				const time=obj.time;
				const date=obj.day;
				sgMail.setApiKey(process.env.SENDGRID_API_KEY)
				const msg = {
                    to:`${emailid}`,
                    from:`${process.env.EMAIL}`,
                    subject:`Check Out Confiramtion for ${name}`,
                    text: 'Checked Out',
                    html: `<h2>Dear ${name} you successfully checked out at ${time} on ${date}</h2>`,
                }
                sgMail
                .send(msg)
                .then(() => {
	                console.log(`Email sent to ${emailid}`)
                })
                .catch((error) => {
	                console.error(error);
                })
				console.log('User Checked Out')

			}
		}
	})
	setTimeout(function(){ 
    console.log(isTheir);
    if(!isTheir){
    	req.flash('error', 'User Not checked In');
        res.redirect('/error');
    }else{
    	req.flash('success', 'Checked out Succcessfully');
        res.redirect('/error');
    }
	}, 500);
})
module.exports=router;


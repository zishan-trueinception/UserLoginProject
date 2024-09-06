const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('./config');
const collection = require('./userSchema');
const { render } = require('ejs');

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

// convert data into json formate 
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.post('/signup',async(req,res)=>{
    const data = {
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
    }
    const salt = await bcrypt.genSalt(10); // number of rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password,salt);
    data.password = hashedPassword;

    const existingUser = await collection.findOne(
        {username:data.username,email:data.email}
    );
    if(existingUser){
        res.send("User already exists");
    }else{
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send("User created successfully");
    }
})


// login route
app.post('/login',async(req,res)=>{
    try{
        const check = await collection.findOne({username:req.body.username});
        if(!check){
            res.send("Invalid Credinals");
        }
        // comparing the password 
        const match = await bcrypt.compare(req.body.password,check.password);
        if(match){
            res.render("home");
        }else{
            res.send("Invalid Password");
        }
    }catch{
        res.send("Invalid Credinals");
    }
})


app.listen(5000,()=>{
    console.log('start port on 5000');
})
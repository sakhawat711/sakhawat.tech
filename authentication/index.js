const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator")


const app = express()
app.use(express.urlencoded({extended: true}));

//mongodb connection
const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("DB is connected");
    } catch (error) {
        console.log(error);
        Process.exit(1);
    }
}
//create schema
const newSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: [true, "First name is required"],
        trim: true  
    },
    lname: {
        type: String,
        require: [true, "Last name is required"],
        trim: true  
    },
    email: {
        type: String,
        require: [true, "Email is required"],
        trim: true 
    },
    password: {
        type: String,
        require: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 character"]
    },
    dob: {
        type: Date,
        require: [true, "Date is required"],
    }
})
//create schema model
const model = mongoose.model("users", newSchema);



app.get("/register", (req, res) => {
    res.sendFile(__dirname+"/index.html");
})
app.post("/register",
body("email").isEmail().withMessage("Invalid email"),
body("password").notEmpty().withMessage("Possword is required").isLength({min: 6}).withMessage("Possword must be at least 6 character"),
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next()
},
async (req, res) => {
    try {
        const info = new model({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            dob: req.body.dob
        })
        const userInfo = await info.save();
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
})

app.listen(3001, async () => {
    console.log("Listening");
    await dbConnection();
})
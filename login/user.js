const express = require("express")
const { body, validationResult } = require("express-validator")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(3000, () => {
    console.log("Listening");
});


app.get('/register', (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.post('/register',
body("name").trim().notEmpty().withMessage("Name is required"), 
body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"), 
body("password").notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("At least 6 characters"), 
body("dob").notEmpty().withMessage("Password is required").isISO8601().toDate().withMessage("Invalid date formate"), 
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next()
},
(req, res) => {
    try {
        const {name, email, password, dob} = req.body;
        const newUser = {
            name, email, password, dob
        }
        return res.status(200).json({
            message: "user is registered",
            newUser
        });
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
});
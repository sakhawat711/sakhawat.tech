const express = require("express");
const { url } = require("inspector");
const mongoose = require('mongoose');
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))


const DBconnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected");
        console.log(error);
        process.exit(1);
    }  
};

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    createAt: {
        type: Date,
        default: Date.now
    }
})
const product = mongoose.model("Products", productSchema);



app.get("/register", (req, res) => {
    res.sendFile(__dirname+"/index.html")
});

app.post("/register", async (req, res) => {
    try {
        const newProduct = new product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description
        })
        const productData = await newProduct.save();
        res.status(201).send(productData);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
})

app.listen(3000, async ()=> {
    console.log("Listening");
    await DBconnection()
})
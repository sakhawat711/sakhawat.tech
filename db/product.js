const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Database connection
const connection = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected");
        console.log(error);
        process.exit(1);
    }
};

//schema
const newProduct = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});
//model
const addProduct = mongoose.model("Phone", newProduct)

app.get("/register", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});
app.get("/products", async (req, res) => {
    try {
        const data = await addProduct.find();
        if (data)
            res.status(200).send(data);
        else
            res.status(401).send({message: "products not found"})
    } catch (error) {
        res.status(401).send({message: error.message});
    }
});
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const info = await addProduct.findOne({_id: id});
        if (info)
            res.status(200).send({
                success: true, 
                message: "product is found",
                data: info
            });
        else
            res.status(401).send({message: "products not found"})
    } catch (error) {
        res.status(401).send({message: error.message});
    }
});
app.post("/register", async (req, res) => {
    try {
        const showProduct = new addProduct({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description
        });
        const productData = await showProduct.save();
        res.status(201).send(productData);
    } catch (error) {
        res.status(401).send({message: error.message})
    }
})

app.listen(3001, async () => {
    console.log("Listening");
    await connection();
})
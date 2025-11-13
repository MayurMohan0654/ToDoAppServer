const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

const authRouter = require("./routes/authRoute");
const itemRoute = require("./routes/itemRoute");
const app = express();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected successfully to database");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/item", itemRoute);

app.use("/", (res, req) => {
    res.send("this is server");
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log("server started on, " + port);
});

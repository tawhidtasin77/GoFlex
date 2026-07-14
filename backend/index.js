import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/db/index.js"

dotenv.config({
        path: "./.env"
    })

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello world")
})

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Database unable to connect :: ", error);
    })
    app.listen(PORT, () => {
        console.log(`Server is running at: ${PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed: ", error);
    
})

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})
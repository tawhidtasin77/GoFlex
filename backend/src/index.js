import "./env.js"
import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("error: ", error);
    })

    app.listen(process.env.PORT || 4000, () => {
        console.log(`server is running on port: ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log(`mongoDB connection failed! error: ${error}`)
})
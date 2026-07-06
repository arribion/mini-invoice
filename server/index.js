import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import "dotenv/config";
import path from "path";

const app = express();

const fileName = path.resolve() + "/views";
const __dirname = path.resolve(fileName);

const PORT = process.env.PORT;
if (!PORT) {
    console.log("error accessing connection port..");
    process.exit(1);
}
 
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true                // Required to allow the browser to accept backend cookies
}));

// routes
import project_router from "./routes/project.route.js";
import member_router from "./routes/members.route.js";
import auth_router from "./routes/auth.route.js";

app.get("/", (req, res) => {
    res.send("app running");
});

app.use("/api/auth", auth_router);
app.use("/api/projects", project_router);
app.use("/api/members", member_router);

app.listen(PORT, () => {
    connectDB()
    console.log(`http://localhost:${PORT}`);
});
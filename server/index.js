import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import "dotenv/config";
const app = express();

app.use(bodyParser.json());
app.use(cors());

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

app.listen(3001, () => {
    connectDB()
    console.log("http://localhost:3001");
});
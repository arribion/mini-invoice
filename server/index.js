import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./config/db.js";
import "dotenv/config";
import path from "path";

const app = express();

const API_URL = process.env.API_URL;
if (!API_URL) {
  console.log("error accessing url");
}

const fileName = path.resolve() + "/views";
const __dirname = path.resolve(fileName);

const PORT = process.env.PORT || 3001;
if (!process.env.PORT) {
  console.log("error accessing connection port..");
}

// Middlewares
app.use(express.json()); 
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mini-invoice-mrlc-alpha.vercel.app",
    ],
    credentials: true,
  }),
);

// Routes Imports
import project_router from "./routes/project.route.js";
import member_router from "./routes/members.route.js";
import auth_router from "./routes/auth.route.js";

app.get("/", (req, res) => {
  res.send("app running");
});

// Route Mounts
app.use("/api/v1", auth_router);
app.use("/api/projects", project_router);
app.use("/api/members", member_router);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

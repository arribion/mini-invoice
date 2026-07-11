import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
// import { check_uploaded_files } from "./middleware/Upload.check.file.js";
import "dotenv/config";
import path from "path";

const app = express();

const fileName = path.resolve() + "/views";
const __dirname = path.resolve(fileName);

const PORT = process.env.PORT || 3001;
if (!process.env.PORT) {
  console.log("error accessing connection port..");
}

// Middlewares
app.use(express.json()); 
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
// app.use(check_uploaded_files());
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://mini-invoice-mrlc-alpha.vercel.app/",
    ],
    credentials: true,
  }),
);

// Routes Imports
import auth_router from "./routes/auth.route.js";
import project_router from "./routes/project.route.js";
import member_router from "./routes/members.route.js";
import resource_router from "./routes/resources.route.js";


app.get("/", (req, res) => {
  res.send("app running");
});

// Route Mounts
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/projects", project_router);
app.use("/api/v1/members", member_router);
app.use("/api/v1/resources", resource_router);


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
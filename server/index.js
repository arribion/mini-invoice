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

// Middlewares
const allowedOrigins = [
  "http://localhost:5172",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://vercel.app",
  "https://vercel.app",
];

// CRITICAL FIX: Put your CORS configuration options above ALL body parsers
app.use(
  cors({
    origin: function (origin, callback) {
      // If there's no origin (like server-to-server or curl tools), allow it
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Policy Blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200, // Fixes Render/legacy browser edge cases
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
// app.use(check_uploaded_files());

// Routes Imports
import auth_router from "./routes/auth.route.js";
import project_router from "./routes/project.route.js";
import member_router from "./routes/members.route.js";
import resource_router from "./routes/resources.route.js";

// Route Mounts
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/projects", project_router);
app.use("/api/v1/members", member_router);
app.use("/api/v1/resources", resource_router);

const PORT = process.env.PORT || 3001;
if (!process.env.PORT) {
  console.log("error accessing connection port..");
}
app.listen(PORT, "0.0.0.0", () => {
  connectDB()
  console.log(`Server executing successfully on port ${PORT}`);
});
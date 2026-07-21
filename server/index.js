import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import "dotenv/config";
import path from "path";
import connectDB from "./config/db.js";

// Route imports
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import memberRouter from "./routes/members.route.js";
import resourceRouter from "./routes/resources.route.js";
import projectAssignmentRoutes from "./routes/project.assignment.route.js";
import { protect } from "./middleware/auth.middleware.js";

const app = express();

// Static path helper (if you serve views/static files)
const fileName = path.resolve() + "/views";
const __dirname = path.resolve(fileName);

// ---------- Configuration ----------
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Comma-separated allowed origins in env (e.g., "https://app.example.com,https://mini-invoice-two.vercel.app")
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ---------- Security middleware ----------
app.use(helmet()); // sets common security headers

// ---------- CORS ----------
// Build a flexible origin checker that allows:
// - explicit origins from ALLOWED_ORIGINS env var
// - any vercel.app subdomain (useful for preview deployments)
// - localhost dev ports
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true);

    try {
      const url = new URL(origin);
      const hostname = url.hostname;

      // allow explicit origins from env
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        ALLOWED_ORIGINS.includes(hostname)
      ) {
        return callback(null, true);
      }

      // allow vercel preview/prod subdomains
      if (hostname.endsWith(".vercel.app") || hostname === "vercel.app") {
        return callback(null, true);
      }

      // allow localhost dev ports commonly used by Vite
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0"
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: origin ${origin} not allowed`),
        false,
      );
    } catch (err) {
      return callback(new Error("CORS policy: invalid origin"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


//  Parsers 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//  Routes 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/members", memberRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/project-assignments", projectAssignmentRoutes);

//  Health check 
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", env: NODE_ENV });
});

// Error handling 
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);
  // If CORS origin rejected, send a clear response for debugging
  if (err && err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }
  res
    .status(err?.status || 500)
    .json({ error: err?.message || "Internal Server Error" });
});

// ---------- Start server ----------
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT} (env: ${NODE_ENV})`);
    console.log(
      `Allowed origins: ${ALLOWED_ORIGINS.join(", ") || "vercel.app and localhost allowed"}`,
    );
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
});
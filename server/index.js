import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./config/db.js";
import ping_onrender from "./utils/ping.js";

// routes
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import memberRouter from "./routes/members.route.js";
import resourceRouter from "./routes/resources.route.js";
import projectAssignmentRoutes from "./routes/projectAssignment.route.js";

const app = express();
ping_onrender(); // Start the ping cron job to keep the server alive on Render
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy when running behind a load balancer (Render, Heroku, etc.)
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Build allowed origins list (env or defaults)
const allowedFromEnv = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const DEFAULT_DEV_ORIGINS = ["http://localhost:5173"];
const DEFAULT_PROD_ORIGINS = [
  "https://mini-invoice-mrlc-alpha.vercel.app",
  "https://mini-invoice.onrender.com",
];

const ALLOWED_ORIGINS = allowedFromEnv.length
  ? allowedFromEnv
  : NODE_ENV === "production"
    ? DEFAULT_PROD_ORIGINS
    : [...DEFAULT_DEV_ORIGINS, ...DEFAULT_PROD_ORIGINS];

// Logging
console.log(`NODE_ENV=${NODE_ENV}`);
console.log(`ALLOWED_ORIGINS=${ALLOWED_ORIGINS.join(", ")}`);

// Security headers
app.use(helmet());

// CORS: allow exact origins and credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (curl/postman)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(
        new Error(`CORS policy: origin ${origin} not allowed`),
        false,
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  }),
);

// Parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/members", memberRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/project-assignments", projectAssignmentRoutes);

// Health
app.get("/api/v1/health", (req, res) =>
  res.json({ status: "ok", env: NODE_ENV }),
);

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }
  res
    .status(err?.status || 500)
    .json({ error: err?.message || "Internal Server Error" });
});

// Start
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT} (${NODE_ENV})`);
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./config/db.js";

// Route imports
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import memberRouter from "./routes/members.route.js";
import resourceRouter from "./routes/resources.route.js";
import projectAssignmentRoutes from "./routes/project.assignment.route.js";


const app = express();

app.set("trust proxy", 1);

//  Configuration 
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Comma-separated allowed origins from env
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

//  Security headers
app.use(helmet());

// ---------- CORS ----------
// Allows: explicit origins from env, *.vercel.app, localhost dev ports
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);

    try {
      const { hostname } = new URL(origin);

      // 1. Explicitly allowed origins (full URL)
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // 2. Vercel preview/production deployments
      if (hostname.endsWith(".vercel.app") || hostname === "vercel.app") {
        return callback(null, true);
      }

      // allow render.com subdomains
      if (hostname.endsWith(".onrender.com") || hostname === "onrender.com") {
        return callback(null, true);
      }

      // 3. Local development
      if (["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname)) {
        return callback(null, true);
      }

      // 4. (Optional) allow any origin in development – but we keep it strict
      // if (NODE_ENV === "development") return callback(null, true);

      return callback(
        new Error(`CORS policy: origin "${origin}" not allowed`),
        false,
      );
    } catch {
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

// ---------- Parsers ----------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ---------- Routes ----------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/members", memberRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/project-assignments", projectAssignmentRoutes);

// ---------- Health check ----------
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", env: NODE_ENV });
});

// ---------- 404 handler ----------
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);

  // CORS errors
  if (err.message?.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }

  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// ---------- Start server ----------
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT} (${NODE_ENV})`);
    console.log(
      `Allowed origins: ${ALLOWED_ORIGINS.join(", ") || "vercel.app, localhost"}`,
    );
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
});

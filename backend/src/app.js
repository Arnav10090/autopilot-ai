import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import projectRoutes from "./routes/project.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/projects", projectRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

export default app;
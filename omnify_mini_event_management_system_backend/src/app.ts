// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupSwagger } from "./core/config/swagger.js";
import eventsRoutes from "./features/events/events.routes.js";

const app = express();

app.use(express.json());

// Allow requests from your frontend origin
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you need cookies/auth
  })
);

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use("/api/events", eventsRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    code: err.code || "INTERNAL_ERROR",
    message,
  });
});

// Welcome endpoint with API info
app.get("/api", (req, res) => {
  res.json({
    message: "Event Management API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      events: "/api/events",
      docs: "/api/docs",
      spec: "/api/docs.json",
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} ✅`);
});

export default app;

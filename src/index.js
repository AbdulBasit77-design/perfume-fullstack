import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "Minimal API working!",
        timestamp: new Date().toISOString()
    });
});

app.get("/test", (_req, res) => {
    res.json({
        message: "Test endpoint working!",
        env: process.env.NODE_ENV || 'development'
    });
});

export default app;

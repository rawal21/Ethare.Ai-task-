import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import routes from "./app/routes";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import type { createUserDto } from "./app/user/user.dto";
import { loadingConfig } from "./app/common/helper/config.helper";
loadingConfig();
import { initPassport } from "./app/common/service/passport-jwt.service";
import { initDB } from "./app/common/service/database.service";
import { logger } from "./app/common/helper/logger.helper";
import { apiRateLimiter } from "./app/common/middleware/rate-limmter.middleware";



declare global {
  namespace Express {
    interface User extends Omit<createUserDto, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "local";

app.set("trust proxy", 1);


app.use(
  helmet({
    contentSecurityPolicy: false, // API-only backend
  })
);


const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.CORS_ORIGIN?.split(",") || []),
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);



app.use(express.json({ limit: "10kb" }));


if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}

initPassport();
app.use(passport.initialize());


app.use(apiRateLimiter)
app.use("/api", routes);
app.get("/" , (req , res)=>{
  res.send("server is ready")
})
app.use(errorHandler);


const startServer = async () => {
  try {
    await initDB();
    logger.info("Database connected");

    

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });


    const shutdown = async () => {
      logger.info("Shutting down server...");
      server.close(async () => {
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
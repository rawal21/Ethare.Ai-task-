"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./app/routes"));
const error_handler_middleware_1 = __importDefault(require("./app/common/middleware/error-handler.middleware"));
const config_helper_1 = require("./app/common/helper/config.helper");
(0, config_helper_1.loadingConfig)();
const passport_jwt_service_1 = require("./app/common/service/passport-jwt.service");
const database_service_1 = require("./app/common/service/database.service");
const logger_helper_1 = require("./app/common/helper/logger.helper");
const rate_limmter_middleware_1 = require("./app/common/middleware/rate-limmter.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "local";
app.set("trust proxy", 1);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // API-only backend
}));
const allowedOrigins = [
    "http://localhost:3000",
    ...(((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || []),
];
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        }
        else {
            cb(new Error("CORS not allowed"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10kb" }));
if (NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => logger_helper_1.logger.http(message.trim()),
        },
    }));
}
(0, passport_jwt_service_1.initPassport)();
app.use(passport_1.default.initialize());
app.use(rate_limmter_middleware_1.apiRateLimiter);
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("server is ready");
});
app.use(error_handler_middleware_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_service_1.initDB)();
        logger_helper_1.logger.info("Database connected");
        const server = app.listen(PORT, () => {
            logger_helper_1.logger.info(`Server running on port ${PORT}`);
        });
        const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
            logger_helper_1.logger.info("Shutting down server...");
            server.close(() => __awaiter(void 0, void 0, void 0, function* () {
                process.exit(0);
            }));
        });
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    }
    catch (err) {
        logger_helper_1.logger.error("Failed to start server", err);
        process.exit(1);
    }
});
startServer();

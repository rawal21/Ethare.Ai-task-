"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiter for general API routes
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs` (15 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes",
    headers: true, // Send rate limit info in the response headers
});
// Rate limiter specifically for login routes
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 20 * 60 * 1000, // 5 minutes
    max: 20, // Limit to 5 requests per 5 minutes (to prevent brute force attacks)
    message: "Too many login attempts from this IP, please try again after 5 minutes",
    headers: true,
});

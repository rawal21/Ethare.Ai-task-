"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_error_middleware_1 = require("../common/middleware/catch-error.middleware");
const AuthController = __importStar(require("./auth.controller"));
const passport_1 = __importDefault(require("passport"));
// import { loginRateLimiter, apiRateLimiter } from "../config/rateLimiter";
const rate_limmter_middleware_1 = require("../common/middleware/rate-limmter.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post("/register", auth_validation_1.registerValidation, catch_error_middleware_1.catchError, AuthController.register);
router.post("/login", auth_validation_1.loginValidation, (req, res, next) => {
    console.log("Login route hit", req.body);
    next();
}, rate_limmter_middleware_1.loginRateLimiter, catch_error_middleware_1.catchError, passport_1.default.authenticate("login", { session: false }), AuthController.login);
router.post("/refresh", AuthController.refreshToken);
exports.default = router;

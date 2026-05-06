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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwtService = __importStar(require("../common/service/passport-jwt.service"));
const response_helper_1 = require("../common/helper/response.helper");
const http_errors_1 = __importDefault(require("http-errors"));
const userService = __importStar(require("../user/user.service"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield authService.register(req.body);
    const safeUser = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
    };
    const tokens = jwtService.createUserTokens(safeUser);
    // Store refreshToken in DB
    yield userService.updateUserById(safeUser._id, { refreshToken: tokens.refreshToken });
    res.status(201).json((0, response_helper_1.createResponse)({
        user: Object.assign(Object.assign({}, safeUser), { refreshToken: tokens.refreshToken }),
        tokens,
    }, "User registered successfully"));
});
exports.register = register;
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    const tokens = jwtService.createUserTokens(safeUser);
    // Store refreshToken in DB
    yield userService.updateUserById(user._id, { refreshToken: tokens.refreshToken });
    res.send((0, response_helper_1.createResponse)({
        user: Object.assign(Object.assign({}, safeUser), { refreshToken: tokens.refreshToken }),
        tokens,
    }, "Login successful"));
}));
exports.refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw (0, http_errors_1.default)(400, "Refresh token is required");
    }
    try {
        const payload = jwtService.verifyToken(refreshToken);
        const currentUser = yield userService.getById(payload._id);
        if (!currentUser || currentUser.refreshToken !== refreshToken) {
            throw (0, http_errors_1.default)(401, "Invalid refresh token");
        }
        const userObj = currentUser.toObject();
        const safeUser = {
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            role: userObj.role,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt
        };
        const tokens = jwtService.createUserTokens(safeUser);
        // Update refresh token in DB
        yield userService.updateUserById(userObj._id, { refreshToken: tokens.refreshToken });
        res.send((0, response_helper_1.createResponse)({
            tokens,
        }, "Token refreshed successfully"));
    }
    catch (error) {
        throw (0, http_errors_1.default)(401, "Invalid or expired refresh token");
    }
}));

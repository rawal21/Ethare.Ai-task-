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
exports.getAll = exports.updateById = exports.getByEmail = exports.getById = void 0;
const userService = __importStar(require("./user.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_helper_1 = require("../common/helper/response.helper");
const http_errors_1 = __importDefault(require("http-errors"));
exports.getById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getById(req.params.id);
    if (!user)
        throw (0, http_errors_1.default)(404, "User not found");
    res.send((0, response_helper_1.createResponse)(user.toObject(), "User fetched successfully"));
}));
exports.getByEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getByEmail(req.params.email);
    if (!user)
        throw (0, http_errors_1.default)(404, "User not found");
    res.send((0, response_helper_1.createResponse)(user.toObject(), "User fetched successfully"));
}));
exports.updateById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.updateUserById(req.params.id, req.body);
    if (!user)
        throw (0, http_errors_1.default)(404, "User not found");
    res.send((0, response_helper_1.createResponse)(user.toObject(), "User updated successfully"));
}));
exports.getAll = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const allUsers = yield userService.getAll();
    const sanitizedUsers = allUsers
        .map(u => u.toObject())
        .filter(u => u._id.toString() !== (currentUserId === null || currentUserId === void 0 ? void 0 : currentUserId.toString()));
    res.send((0, response_helper_1.createResponse)(sanitizedUsers, "Users fetched successfully"));
}));

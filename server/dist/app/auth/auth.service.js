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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_schema_1 = require("../user/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUser = yield user_schema_1.user.findOne({ email: payload.email });
    if (checkUser) {
        throw new Error("User already exists");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const newUser = yield user_schema_1.user.create(Object.assign(Object.assign({}, payload), { password: hashPassword }));
    return newUser.toObject();
});
exports.register = register;

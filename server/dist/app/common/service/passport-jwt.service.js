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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.decodeToken = exports.createUserTokens = exports.initPassport = exports.isValidPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dayjs_1 = __importDefault(require("dayjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const userService = __importStar(require("../../user/user.service"));
// ------------------------------------
// 🔐 Password Compare
// ------------------------------------
const isValidPassword = (input, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(input, hashed);
});
exports.isValidPassword = isValidPassword;
// ------------------------------------
// 🔐 Initialize Passport Strategies
// ------------------------------------
const initPassport = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET is missing");
    // --------------------------------
    // 🔐 JWT Strategy
    // --------------------------------
    passport_1.default.use(new passport_jwt_1.Strategy({
        secretOrKey: secret,
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userService.getById(payload._id);
            if (!user) {
                return done((0, http_errors_1.default)(401, "Invalid token user"), false);
            }
            return done(null, user.toObject());
        }
        catch (err) {
            return done(err, false);
        }
    })));
    // --------------------------------
    // 🔑 LocalStrategy for Login
    // --------------------------------
    passport_1.default.use("login", new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userService.getByEmail(email, {
                password: true,
                name: true,
                email: true,
                role: true,
                isBlocked: true,
            });
            if (!user) {
                return done((0, http_errors_1.default)(401, "User not found"), false);
            }
            //   if (user.isBlocked) {
            //     return done(createError(403, "User is blocked"), false);
            //   }
            const validPass = yield (0, exports.isValidPassword)(password, user.password);
            if (!validPass) {
                return done((0, http_errors_1.default)(401, "Invalid email or password"), false);
            }
            const userObj = user.toObject();
            const { password: _p } = userObj, safeUser = __rest(userObj, ["password"]);
            return done(null, safeUser);
        }
        catch (err) {
            return done((0, http_errors_1.default)(500, err.message), false);
        }
    })));
};
exports.initPassport = initPassport;
// ------------------------------------
// 🔐 Create Access + Refresh Tokens
// ------------------------------------
const createUserTokens = (user) => {
    var _a, _b;
    const secret = process.env.JWT_SECRET;
    const payload = {
        _id: user._id,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: (_a = process.env.ACCESS_TOKEN_EXPIRY) !== null && _a !== void 0 ? _a : "1d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: (_b = process.env.REFRESH_TOKEN_EXPIRY) !== null && _b !== void 0 ? _b : "2d",
    });
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
// ------------------------------------
// 🔎 Decode Token (no verify)
// ------------------------------------
const decodeToken = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded)
        throw (0, http_errors_1.default)(400, "Invalid token");
    const expired = dayjs_1.default.unix(decoded.exp).isBefore((0, dayjs_1.default)());
    return Object.assign(Object.assign({}, decoded), { expired });
};
exports.decodeToken = decodeToken;
// ------------------------------------
// 🔐 Verify Token (throws if invalid)
// ------------------------------------
const verifyToken = (token) => {
    var _a;
    const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;

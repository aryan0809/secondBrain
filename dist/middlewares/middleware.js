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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require(".."); // Make sure the secret is being imported correctly
const db_1 = require("../db");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json({
            message: "Token not provided"
        });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, __1.secret);
        console.log(decoded);
        const decodedUser = yield db_1.UserModel.findOne({ _id: decoded.userId });
        if (!decodedUser)
            return res.status(404).json({
                message: "token invalid ",
            });
        req.user = decodedUser;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "internval server error",
            error
        });
    }
});
exports.authMiddleware = authMiddleware;

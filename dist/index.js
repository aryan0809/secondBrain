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
exports.secret = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middlewares/middleware");
const db_1 = require("./db");
exports.secret = "your-secret-key";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // console.log("control reached here "+ username + password );
        if (!username || !password)
            res.status(411).json({
                message: "username or password not provided"
            });
        const newUser = new db_1.UserModel({
            username,
            password
        });
        yield newUser.save();
        res.status(200).json({
            message: "new user created",
            newUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(411).json({
                message: "Username or password not provided",
            });
        // Use findOne instead of find
        const user = yield db_1.UserModel.findOne({ username, password });
        if (!user)
            return res.status(404).json({
                message: "Username or password incorrect"
            });
        // Define a secret or retrieve from env
        // Correct access to properties of user
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, exports.secret);
        res.status(200).json({
            token,
            message: "User signed in",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}));
app.post('/api/v1/content', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { contentType, contentLink, title, tags } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const newContent = new db_1.ContentModel({
            userId,
            contentType,
            contentLink,
            title,
            tags
        });
        yield newContent.save();
        res.status(200).json({
            message: "content saved successfully",
            newContent
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}));
app.get('/api/v1/content', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    try {
        const userContent = yield db_1.ContentModel.find({
            _id: userId
        });
        if (!userContent)
            return res.status(411).json({
                message: "user has no content "
            });
        res.status(201).json({
            userContent
        });
    }
    catch (error) {
        res.status(500).json({
            messsage: "Internal server error",
            error: error.message
        });
    }
}));
app.post('/api/v1/authCheck', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("User authenticated successfully");
}));
app.listen(3000);

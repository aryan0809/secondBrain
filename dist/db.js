"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb://localhost:27017/secondbrainDb");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        // minlength:3,
        // maxlength:12,
        trim: true
    },
    password: {
        type: String,
        required: true,
        // minlength:6,
        // maxlength:12
    }
});
const contentSchema = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    contentType: {
        type: String,
        enum: ["tweet", "youtube", "document", "link"],
        required: true
    },
    contentLink: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: []
    }
});
const ContentModel = mongoose_1.default.model("Content", contentSchema);
exports.ContentModel = ContentModel;
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;

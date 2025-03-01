"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, authorization denied',
            });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // Add user from payload
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid',
        });
    }
};
exports.auth = auth;
// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    (0, exports.auth)(req, res, () => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin') {
            next();
        }
        else {
            res.status(403).json({
                success: false,
                message: 'Access denied, admin privileges required',
            });
        }
    });
};
exports.adminAuth = adminAuth;

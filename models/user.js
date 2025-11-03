import mongoose, { Schema, model, models } from "mongoose";

const userschema = new Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            select: false
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true
        },

        githubId: {
            type: String,
            sparse: true,
            unique: true
        },

        discordId: {
            type: String,
            sparse: true,
            unique: true
        },
        authMethods: {
            type: [String],
            enum: ['credentials', 'google', 'github', 'discord'],
            default: []
        },

        // ✅ NEW: Profile image
        profileImage: {
            type: String,
            default: null
        },

        // ✅ NEW: Account status
        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        // ✅ NEW: Track last login
        lastLogin: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

// Use the exact model name key when checking `models` cache (case-sensitive)
const User = models?.User || model("User", userschema);
export default User; 
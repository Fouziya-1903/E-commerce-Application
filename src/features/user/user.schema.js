import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Production-grade RegEx compiled in global module scope
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Enforces: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [emailRegex, "Please provide a valid email format structure"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        match: [
            strongPasswordRegex,
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ]
    },
    type: {
        type: String,
        required: [true, "User type is required"],
        enum: {
            values: ['customer', 'seller'],
            message: "{VALUE} is not a valid account type. Must be either 'customer' or 'seller'"
        },
        lowercase: true,
        trim: true
    }
}, { timestamps: true });

// Pre-Save Lifecycle Hook: Automatically hashes raw password string right after validation passes
// FIX: Removed 'next' parameter from the async signature completely so it resolves naturally
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        // No next() invocation needed here; completing the function resolves the middleware hook automatically
    } catch (err) {
        throw err; // Rethrowing the error lets Mongoose forward it straight down to your repository's catch block
    }
});

// Document Instance Method: Safely decodes and validates bcrypt matrix hashes on login
// FIX: Cleaned up the unused 'hashedUserPassword' parameter from the method signature
userSchema.methods.comparePassword = async function (candidatePassword, hashedUserPassword) {
    try {
        return await bcrypt.compare(candidatePassword, hashedUserPassword);
    } catch (err) {
        throw err;
    }
};
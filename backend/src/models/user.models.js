import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            toLowerCase: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        refreshToken: {
            type: String
        },
        otp: {
            type: String
        },

        otpExpires: {
            type: Date
        },

        isVerified: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.pre("save", async function(){
    if(!this.isModified("otp") || !this.otp) return;
    this.otp = await bcrypt.hash(this.otp, 10);
})

userSchema.methods.isOtpCorrect = async function(otp){
    return await bcrypt.compare(otp, this.otp);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//MongoDB TTL index
userSchema.index(
    { createdAt: 1 },
    {   
        expireAfterSeconds: 86400,
        partialFilterExpression: {
            isVerified: false
        }
    }
);

export const User = mongoose.model("User", userSchema);
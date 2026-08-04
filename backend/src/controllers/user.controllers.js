import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { sendEmail } from "../utils/sendEmail.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "user not found")
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, error.message || "something went wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "email and name is required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "this user is already exist")
    }

    const user = await User.create(
        {
            name,
            email,
            password
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering a user")
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // const message = `Hello ${name}, welcome to GoFlex. Thank you for registering with us. We are excited to have you as a part of our community. To complete your registration, please use the following One-Time Password (OTP): ${otp}. This OTP is valid for a limited time, so please use it promptly. If you did not initiate this registration, please ignore this message.`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to GoFlex 🎉</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>Thank you for registering with GoFlex.</p>

        <p>Your verification code is:</p>

        <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            background: #f5f5f5;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
        ">
            ${otp}
        </div>

        <p>This code will expire in <strong>10 minutes</strong>.</p>

        <p>If you didn't register, simply ignore this email.</p>

        <br>

        <p>Regards,<br><strong>GoFlex Team</strong></p>
    </div>
    `;

    // await sendEmail(email, "GoFlex Registration OTP", message);

    try {
        await sendEmail(email, "GoFlex Registration OTP", html);
        console.log("OTP send successfully")
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdUser,
                "user registered successfully"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        throw new ApiError(400, "all fields are required");
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "user logged out successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "current user fetched successfully"
            )
        )

})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");

    if (!users) {
        throw new ApiError(500, "something went wrong while getting users.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "users fetched successfully")
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUsers
}
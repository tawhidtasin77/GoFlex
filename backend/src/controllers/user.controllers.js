import jwt from "jsonwebtoken";

import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

const isProduction =
    process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
        ? "none"
        : "lax",
};

const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

const sendOTP = async (user) => {
    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires =
        new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f4f4;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
                <h1 style="color: #f97316; text-align: center;">
                    GoFlex
                </h1>

                <h2 style="color: #222;">
                    Verify Your Email
                </h2>

                <p style="color: #555;">
                    Hello ${user.name},
                </p>

                <p style="color: #555;">
                    Thank you for creating your GoFlex account.
                    Use the OTP below to verify your email address.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; padding: 15px 25px; background-color: #f97316; color: white; font-size: 30px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
                        ${otp}
                    </span>
                </div>

                <p style="color: #777;">
                    This OTP will expire in 10 minutes.
                </p>

                <p style="color: #777;">
                    If you did not create this account, you can safely ignore this email.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="text-align: center; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} GoFlex. All rights reserved.
                </p>
            </div>
        </div>
    `;

    await sendEmail(
        user.email,
        "GoFlex Email Verification OTP",
        html
    );
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const existedUser = await User.findOne({
        email,
    });

    if (existedUser) {
        if (existedUser.isVerified) {
            throw new ApiError(
                409,
                "User already exists. Please login."
            );
        }

        existedUser.name = name;
        existedUser.password = password;

        await sendOTP(existedUser);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "OTP sent successfully. Please verify your email."
                )
            );
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    await sendOTP(user);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {},
                "Account created successfully. Please verify your email."
            )
        );
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User does not exist"
        );
    }

    if (user.isVerified) {
        throw new ApiError(
            400,
            "User is already verified"
        );
    }

    if (!user.otp) {
        throw new ApiError(
            400,
            "No OTP found. Please request a new OTP."
        );
    }

    if (
        !user.otpExpires ||
        user.otpExpires < Date.now()
    ) {
        throw new ApiError(
            400,
            "OTP expired"
        );
    }

    const isOtpValid =
        await user.isOtpCorrect(otp);

    if (!isOtpValid) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const accessToken =
        user.generateAccessToken();

    const refreshToken =
        user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    const loggedInUser =
        await User.findById(
            user._id
        ).select(
            "-password -refreshToken -otp -otpExpires"
        );

    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )
        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Email verified and user logged in successfully"
            )
        );
});

const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.isVerified) {
        throw new ApiError(
            400,
            "User is already verified"
        );
    }

    await sendOTP(user);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "OTP resend successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User does not exist"
        );
    }

    if (!user.isVerified) {
        throw new ApiError(
            403,
            "Please verify your email before logging in."
        );
    }

    const isPasswordCorrect =
        await user.isPasswordCorrect(
            password
        );

    if (!isPasswordCorrect) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const accessToken =
        user.generateAccessToken();

    const refreshToken =
        user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    const loggedInUser =
        await User.findById(
            user._id
        ).select(
            "-password -refreshToken -otp -otpExpires"
        );

    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )
        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(
    async (req, res) => {

        console.log("REFRESH TOKEN REQUEST:", {
            hasCookie: !!req.cookies?.refreshToken,
            hasBodyToken: !!req.body?.refreshToken,
            origin: req.headers.origin,
            userAgent: req.headers["user-agent"],
        });

        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        try {
            const decodedToken =
                jwt.verify(
                    incomingRefreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

            const user =
                await User.findById(
                    decodedToken?._id
                );

            if (!user) {
                throw new ApiError(
                    401,
                    "Invalid refresh token"
                );
            }

            if (
                incomingRefreshToken !==
                user.refreshToken
            ) {
                throw new ApiError(
                    401,
                    "Refresh token is expired or used"
                );
            }

            const accessToken =
                user.generateAccessToken();

            return res
                .status(200)
                .cookie(
                    "accessToken",
                    accessToken,
                    cookieOptions
                )
                .json(
                    new ApiResponse(
                        200,
                        {
                            accessToken,
                        },
                        "Access token refreshed successfully"
                    )
                );
        } catch (error) {
            throw new ApiError(
                401,
                error?.message ||
                    "Invalid refresh token"
            );
        }
    }
);

const logoutUser = asyncHandler(
    async (req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );

        return res
            .status(200)
            .clearCookie(
                "accessToken",
                cookieOptions
            )
            .clearCookie(
                "refreshToken",
                cookieOptions
            )
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User logged out successfully"
                )
            );
    }
);

const getCurrentUser = asyncHandler(
    async (req, res) => {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    req.user,
                    "Current user fetched successfully"
                )
            );
    }
);

const getUsers = asyncHandler(
    async (req, res) => {
        const users = await User.find()
            .select(
                "-password -refreshToken -otp -otpExpires"
            )
            .sort({
                createdAt: -1,
            });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    users,
                    "Users fetched successfully"
                )
            );
    }
);

export {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
    getUsers,
};
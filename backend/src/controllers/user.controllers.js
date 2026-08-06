import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
// import { sendEmail } from "../utils/sendEmail.js"
import { otpEmail } from "../templates/otpEmail.templates.js"


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

    const existedUser = await User.findOne({email}).select("-password -otp");

    if (existedUser) {
        if(existedUser.isVerified){
            throw new ApiError(409, "this user is already exist");
        }

        existedUser.name = name;
        existedUser.password = password;

        otpEmail(existedUser);

        return res
        .status(200)
        .json(
            new ApiResponse(200, returnedExistedUser, "Account already exists but isn't verified. A new OTP has been sent.")
        )
    }

    const user = await User.create(
        {
            name,
            email,
            password
        }
    )

    const createdUser = await User.findById(user._id).select("-password -otp")

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering a user")
    }

    otpEmail(user);

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

const verifyOTP = asyncHandler(async(req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "NOT FOUND! user does not exist")
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    if (!user.otp) {
        throw new ApiError(400, "No OTP found. Please request a new OTP.");
    }

    if(user.otpExpires < Date.now()){
        throw new ApiError(400, "OTP expired");
    }

    const isOtpValid = await user.isOtpCorrect(otp);

    if(!isOtpValid){
        throw new ApiError(400, "invalid OTP");
    }
    
    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                isVerified: true,
                otp: undefined,
                otpExpires: undefined
            }
        },
        {
            new: true
        }
    )

    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;
    // await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Email verified successfully")
    )
    
})

const resendOTP = asyncHandler(async(req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "user not found")
    }

    if(user.isVerified){
        throw new ApiError(400, "user is already verified");
    }

    otpEmail(user);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "OTP resend successfully")
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

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in.");
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
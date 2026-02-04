import { ansyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.moodel.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/apiResponce.js";

const registerUser = ansyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty 
    // check if user already exits: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with or email or username already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        const avatarLocalPath = req.files.avatar[0].path
    }
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        const coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    if (!avatar?.url) {
        throw new ApiError(400, "Avatar upload failed")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while refistering the user")
    }

    return res.status(201).json(
        new ApiResponce(200, createdUser, "User registred Successfully")
    )


})

export { registerUser }
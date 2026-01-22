import { ansyncHandler } from "../utils/asyncHandler.js";

const registerUser = ansyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export { registerUser }
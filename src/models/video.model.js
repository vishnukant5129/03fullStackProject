import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary url
        required: true
    },
    thumbanil: { //cloudinary url
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, //cloudinary url
        required: true
    },
    view: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", ṇ
    }

}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const video = mongoose.model("video", videoSchema) 
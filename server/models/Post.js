const  mongoose  = require("mongoose");
 
const postSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
        },
        content:{
            type: String,
            max: 150,
            default: "Share my post"
        },
        photo:{
            type: String,
            max: 255,
        },
        like:{
            type: Array,
            default: [],
        },
        comment:{
            type: Array,
            default: [],
        },
    }, 
    {timestamps: true},
);

module.exports = mongoose.model("Post", postSchema);
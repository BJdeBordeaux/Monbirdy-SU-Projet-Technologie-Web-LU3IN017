const  mongoose  = require("mongoose");
 
const commentSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
        },
        postId:{
            type: String,
            required: true,
        },
        content:{
            type: String,
            max: 150,
            required: true,
        },
    }, 
    {timestamps: true},
);

module.exports = mongoose.model("Comment", commentSchema);
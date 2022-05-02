const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email:{
            type: String,
            require: true,
            min: 3,
            unique: true,
        },
        password:{
            type: String,
            require: true,
            min: 4,
        },
        alias:{
            type: String,
        },
        profilePhoto:{
            type: String,
            default:"",
        },
        coverPhoto:{
            type: String,
            default:"",
        },
        followers:{
            type: Array,
            default:[],
        },
        followings:{
            type: Array,
            default:[],
        },
        isAdmin:{
            type: Boolean,
            default: false,
        },
        description:{
            type: String,
            max: 50,
        },
        city:{
            type: String,
            max: 50,
        },
        field:{
            type: String,
            max: 50,
        },
        relationship:{
            type: Number,
            enum: [0,1,2],
        },
    }, 
    {timestamps: true},
);

module.exports = mongoose.model("User", userSchema);
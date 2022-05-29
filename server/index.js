const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet"); // for security
const dotenv = require("dotenv"); // for security
const morgan = require("morgan"); // logger
const multer = require("multer"); // upload file
const path = require("path"); // path handler
const fs = require("fs"); // file system
const cors = require("cors"); // Cross Origin Resource Sharing
const expressSession = require('express-session');
const mongoStore = require("connect-mongo"); // session store
const usersRouter = require("./routers/users");
const postsRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const authRouter = require("./routers/auth");


dotenv.config();

// Header pour toutes les réponses
app.use( (req, res, next ) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next()
})


// const dbAdress = process.env.MONGO_URL; 
const dbAdress = process.env.LOCAL_DB;
const connection = mongoose.connect(
    dbAdress, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) {
            console.log("failed", err);
        } else {
            console.log("connected to " + dbAdress);
        }

    }
);

// // use express-session
const secret = "monbirdy secret";
const cookieName = "monbidy session";
const cookieValue = "monbidy value";
app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: dbAdress,
        collection: "sessions",
    }),
    rolling: true,
    cookie: {
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
}));


app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));
app.use(morgan("common"))


app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);




app.use("/images", express.static(path.join(__dirname + "/public/images")));
// upload photo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        const fn = parseInt(Date.now() / 10000000) + "-" + file.originalname;
        cb(null, fn)
    }
});
const upload = multer({
    storage: storage
});
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("uploaded");
    } catch (error) {
        console.log(error);
    }
});

exports.default = app;

app.listen(8800, () => {
    console.log("Backend ready");
});
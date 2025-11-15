const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const alumniRouter=require("./routes/alumni.js");
const studentRouter=require("./routes/student.js");
const jobRouter=require("./routes/job.js");
const userRouter=require("./routes/user.js");
const eventRouter=require("./routes/event.js");
const profileRouter=require("./routes/profile.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const session=require("express-session");
const flash=require("connect-flash");
const User = require("./models/user");
const ExpressError=require("./utils/ExpressError.js");

const Message = require("./models/message");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);

const MONGO_URL="mongodb://127.0.0.1:27017/alumni_connect";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


const sessionOptions={
    secret:"my secretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); 
    res.locals.error=req.flash("error"); 
    res.locals.currUser=req.user;
    next();
});

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

// Middleware for EJS user
// app.use((req, res, next) => {
//   res.locals.currUser = req.user;
//   next();
// });

// Chat route
app.get("/chat", async (req, res) => {
// const msg=await Message.find();
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.render("chat.ejs", { user: req.user, users });
});

// Chat route
app.get("/privateChat", async (req, res) => {
// const msg=await Message.find();
  let {id}=req.params;
  const receiver = await User.findById(id);
  res.render("chat2.ejs", { user: req.user, receiver });
});

// SOCKET.IO SECTION
io.on("connection", (socket) => {
  console.log("User connected");

  // Join public room by default
  socket.join("common-room");

  // Public chat
  socket.on("publicMessage", async ({ userId, message }) => {
    const msg = await Message.create({
      sender: userId,
      content: message,
      room: "common-room",
    });


    const populatedMsg = await msg.populate("sender", "name profilePic.url");
    io.to("common-room").emit("publicMessage", populatedMsg);
  });

  // Private chat join
  socket.on("joinPrivateRoom", async ({ senderId, receiverId }) => {
    const room = getPrivateRoom(senderId, receiverId);
    socket.join(room);

    // load chat history
    const history = await Message.find({ room }).populate("sender", "name profilePic.url");
    socket.emit("chatHistory", history);
  });

  // Private message
  socket.on("privateMessage", async ({ senderId, receiverId, message }) => {
    const room = getPrivateRoom(senderId, receiverId);
    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: message,
      room,
    });
    const populatedMsg = await msg.populate("sender", "name profilePic.url");
    io.to(room).emit("privateMessage", populatedMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Helper to get consistent private room name
function getPrivateRoom(id1, id2) {
  return [id1, id2].sort().join("-");
}

const PORT = 8080;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

//routes
app.use("/alumni",alumniRouter);
app.use("/student",studentRouter);
app.use("/job",jobRouter);
app.use("/",userRouter);
app.use("/event",eventRouter);
app.use("/profile",profileRouter);



app.use((req,res,next)=>{
     next(new ExpressError(404,"Page not found!!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});
// app.listen(8080,()=>{
//     console.log("listening to port 8080");  
// });


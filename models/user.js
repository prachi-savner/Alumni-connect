const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema = new Schema({
  name: 
  { 
    type: String,
    required: true, 
  },
  email: {
     type: String,
     required: true,
     unique: true 
    },
  password: { 
    type: String, 
     },
  role: { 
    type: String, 
    enum: ["student", "alumni", "admin"], 
    default: "student" 
  },
  profilePic: {
    filename: {
      type: String,
      default: "profileImage"
    },
    url: {
      type: String,
      default:
        "/profile-image-icon.jpg",
      set: (v) =>
        v === ""
          ? "/profile-image-icon.jpg"
          : v,
    },
  },

  batch: {
     type: String 
    },
  bio: {
     type: String,
    },
  company: {
     type: String
    },
  position: {
     type: String
     },
  experience: {
     type: String
     },
  skills: [String],
  linkedin: {
     type: String,
     },
  github: {
     type: String,
     },
  verified: {
     type: Boolean,
      default: false
     }, 
     
    
  course: { 
    type: String },
    
  year: { 
    type: String
   },

  createdAt: {
     type: Date,
      default: Date.now()
     }
     
});

userSchema.plugin(passportLocalMongoose,{ usernameField: "email" });

module.exports=mongoose.model("User", userSchema);
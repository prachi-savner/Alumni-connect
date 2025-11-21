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
      default: "listingimage"
    },
    url: {
      type: String,
      default:
        "https://www.motivait.net/wp-content/uploads/2021/12/tri-vo-9r7vebvsZo8-unsplash.jpg",
      set: (v) =>
        v === ""
          ? "https://www.motivait.net/wp-content/uploads/2021/12/tri-vo-9r7vebvsZo8-unsplash.jpg"
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

userSchema.plugin(passportLocalMongoose,{ usernameField: "name" });

module.exports=mongoose.model("User", userSchema);
const { number } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const jobSchema = new Schema({
title: {
type: String,
required: true,
trim: true,
},
company: {
type: String,
required: true,
trim: true,
},
location: {
type: String,
default: '',
},
type: {
type: String,
enum: ['Internship', 'Full-Time', 'Part-Time', 'Contract'],
default: 'Full-Time',
},
description: {
type: String,
required: true,
},
position: {
type: String,
},
skills: {
type: [String],
default: [],
},
// applyLink: {
// type: String,
// default: '',
// },
postedBy: {
type: Schema.Types.ObjectId,
ref: 'User', 
// required: true,
},
postedAt: {
type: Date,
default: Date.now,
},
deadline: {
type: Date,
},
});

module.exports= mongoose.model('Job', jobSchema);
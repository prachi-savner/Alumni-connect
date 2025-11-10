const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const eventSchema = new Schema({
title: {
type: String,
required: true,
trim: true,
},
place: {
type: String,
default: '',
},
description: {
type: String,
required: true,
},

// applyLink: {
// type: String,
// default: '',
// },
host: {
type: Schema.Types.ObjectId,
ref: 'User', 
required: true,
},
date: {
type: Date,
default: Date.now,
},
});

module.exports= mongoose.model('Event', eventSchema);
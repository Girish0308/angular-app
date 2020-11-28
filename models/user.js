const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  // posts: [
  //   {
  //     type: ObjectId,
  //     required: true,
  //     ref: 'Post'
  //   }
  // ]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

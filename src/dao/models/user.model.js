import mongoose from 'mongoose';
const userCollection = " user";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true,
    },
    age: Number,
    password: String,
});


export const userModel = mongoose.model(userCollection, userSchema);


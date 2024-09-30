import mongoose from "mongoose";
import LogSchema from './LogSchema.js';

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: false
    },
    itemList:{
        type:[{
            barcode:String,
            name:String,
            expDate:Date
        }],
        default:[]
    },
    expD:{
        type:String,
        required:true,
        default:0
    },
    exercisesCount: {
        type: Number,
        default: 0
    },
    log: [LogSchema]
})

const User = mongoose.model('User',UserSchema);
export default User;
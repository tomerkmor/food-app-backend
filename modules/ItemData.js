import mongoose from "mongoose";

const ItemDataSchema = new mongoose.Schema({
    barcode:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

const ItemData = mongoose.model('ItemData',ItemDataSchema);
export default ItemData;
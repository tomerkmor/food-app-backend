import mongoose from "mongoose";

const UrlShortSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number
})

const ShortUrl = mongoose.model('ShortUrl',UrlShortSchema);
export default ShortUrl;
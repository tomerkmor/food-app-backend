import dns from 'dns'
import urlParser from 'url'
import ShortUrl from "../modules/UrlShortSchema.js";

export const createUrl = async (req,res) => {
    console.log(req.body)
    try {
        console.log("POSTING...")
        const originalUrl = req.body.url;
        console.log(originalUrl)
        const dnsloopup = dns.lookup(urlParser.parse(originalUrl).hostname, async (err, address) => {

        if(err || !address || originalUrl == ''){
            console.log("failed to post... from the try")
            res.json({error: 'invalid url'})
            return;
        }
        // Generate a short URL
        const urlCount = await ShortUrl.countDocuments(); // Use the model here
        const shortUrl = urlCount + 1; // Incremental short URL

        // Save to database
        const newUrl = new ShortUrl({
            original_url: originalUrl,
            short_url: shortUrl
        });

        await newUrl.save();
        
        res.json({
            original_url: originalUrl,
            short_url: shortUrl
        });
    });
    } catch (error) {
        console.error(error);
        console.log("failed to post")
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getUrl = async (req,res) => {
    const enteredQuery = req.params.short_url
    const page = await ShortUrl.findOne({short_url: + enteredQuery})
    res.redirect(page.original_url)
}
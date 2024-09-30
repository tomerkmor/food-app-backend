
const isInvalidDate = (date) => isNaN(date.getTime());

export const getDate = async (req,res) => {
    let dateParam = req.params.timestamp;
    let date;
    console.log("about to try to get date")

    try{
        ("about to try to get date")
        // Try parsing directly
        if (!isNaN(dateParam)) {
            let timestamp = parseInt(dateParam, 10);
            date = new Date(timestamp);
        } else {
            date = new Date(dateParam);
        }

        // If date is invalid, attempt second parsing
        if (isInvalidDate(date)) { 
        // Try converting assuming timestamp is in seconds( the input maybe a number)
            date = new Date(parseInt(dateParam, 10) * 1000);
        }

        // Check again if date is invalid
        if (isInvalidDate(date)) {
            res.json({ error: "Invalid Date" });
            return;
        }

        res.json({
            unix: date.getTime(),
            utc: date.toUTCString()
        });

    }catch(err){
        console.log("Error occurred while trying to get date");
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}

export const defaultDate = async (req,res) => {
    let now = new Date();
    res.json({
        unix: now.getTime(),
        utc: now.toUTCString()
  });
}
export const uploadFile = async (req,res) => {
    console.log(req.file)
    const enteredFile = await req.file
    res.json({
            name: enteredFile.originalname,
            type: enteredFile.mimetype,
            size: enteredFile.size
  })
}
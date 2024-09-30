export const getUserInfo = async (req,res) => {
    res.json({ 
        ipaddress: req.headers['x-forwarded-for'],
        language: req.headers['accept-language'],
        software: req.headers['user-agent']
      });
}
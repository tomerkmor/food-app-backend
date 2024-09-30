import User from "../modules/UserSchema.js"

export const addActivity = async (req,res) => {
    console.log("for real.. creating new exercise:")
    console.log(req.body)
    try {
        const { description, duration, date} = await req.body

        const id = await req.body.userId
        const user = await User.findById(id)
        
        // UPDATE THE USER
        const newLog = {
          description: description, 
          duration: parseInt(duration), 
          date: date ? new Date(date) : new Date()
        }
    
        user.log.push(newLog)
        user.count += 1
        await user.save()


        res.status(200).json({
          _id: user._id,
          username: user.username,
          date: new Date(date).toDateString(),
          duration: newLog.duration,
          description: newLog.description
        })

    } catch (error) {
        console.log(req.body)
        res.status(500).json({msg:error})
    }
}

export const getLogs = async (req,res) => {
    const username = req.params.username
    const { from, to, limit} = req.query
   
    // Convert 'from' and 'to' query parameters to Date objects
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    console.log("Tryting to get logs for " + username)
    try{
      const user = await User.findOne({username: username})
      if(!user){
        return res.status(404).json({msg: `No User with id of: ${id} was found`})
      }
  
      let filteredLogs = user.log
  
      if(fromDate){
        filteredLogs = filteredLogs.filter(log => log.date >= fromDate)
      }
  
      if(toDate){
        filteredLogs = filteredLogs.filter(log => log.date <= toDate)
      }
  
      if(limitNumber){
        filteredLogs = filteredLogs.slice(0,limitNumber)
      }
  
      const modifiedLogs = filteredLogs.map((log) => ({
        description: log.description,
        duration: log.duration,
        date: log.date.toDateString()
      }))
       
      res.json({
        _id: user._id,
        username: user.username,
        count: user.count,
        log: modifiedLogs
      })
      
    }catch(error){
      res.send(error)
    }
  }
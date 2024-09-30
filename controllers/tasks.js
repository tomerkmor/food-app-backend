//const Task = require('../models/Task')
import Task from "../modules/TaskSchema.js";

const getAllTasks = async (req,res) => {
    try {
        console.log("trying to get data from the server..." + req.params.id)
        const tasks = await Task.find({id: req.params.id})
        
        res.status(201).send({tasks})
    } catch (error) {
        console.log("Could not find any user")
        res.status(500).json({msg:error})
    }
}

// async because we will use it on a task that uses 'await'
const createTask = async (req,res) => {
    console.log("for real.. creating task:")
    //console.log(req.body)
    try {
        const newTask = new Task({
            id: req.body.id,
            name: req.body.name
        })
        newTask.save();
        //const task = await Task.create(req.body)
        res.status(200).send({newTask})
    } catch (error) {
        console.log(req.body)
        res.status(500).json({msg:error})
    }
}

const getSingleTask = async (req,res) => {
    console.log("trying to get info")
    try {
        const {id: taskID} = req.params

        const task = await Task.findOne({_id: taskID})
        if (!task) {
            //return next(createCustomError(`No task with id : ${taskID}`, 404))
            return res.status(404).json({msg: `No task with id of: ${taskID} was found`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


const updateSingleTask = async (req,res) => {
    console.log("the body is: " + req.body)
    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.taskId}, 
            req.body,
            {
            new: true,
            runValidators: true,
            }
        )

        if (!task) {
            return next(createCustomError(`No task with id : ${taskID}`, 404))
            return res.status(404).json({msg: `No task with id of: ${taskID} was found`})
        }
        res.status(200).json({task})
    } catch (error) {
        console.log("failed to patch")
        res.status(500).json({msg:error})
    }
}


const deleteSingleTask = async (req,res) => {
    console.log("trying to delete")
    try {

        console.log("?? - " + req.params.taskId)
        const task = await Task.findOneAndDelete({_id: req.params.taskId});
        if (!task) {
            //return next(createCustomError(`No task with id : ${taskID}`, 404))
            return res.status(404).json({msg: `No task with id of: ${taskID} was found`})
        }
        res.status(200).json({status: 'successful delete', task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}

export {
    getAllTasks,
    createTask,
    getSingleTask,
    updateSingleTask,
    deleteSingleTask
}

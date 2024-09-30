import User from "../modules/UserSchema.js";
import axios from "axios";
import ItemData from "../modules/ItemData.js";
///const express = require('express')

//app.use(express.json());


export const getUser = async(req,res)=>{
    try{
        console.log("user found!")
        console.log(req)
        const users = await User.find({})
        res.status(201).json({users})
    }
    catch{
        res.status(401).send({error:"Have not logged yet."})
    }
}

export const createUser = async(req,res)=>{
    // requirements: usernane + password + email + phone
    try{
        const data = req.body;
        console.log("the data is:")
        console.log(data)
        let users = await User.find({});
        users = users.filter(item => item.username === data.username || item.email === data.email);
        console.log(users);

        // user does not exists - create new one
        if(users.length == 0){
            const newUser = new User(data);
            newUser.save();
            res.status(200).send({data:newUser.id});
            return;
        }

        if(users[0].username === data.username){
            res.status(400).send({error:"username is taken"});
            return;
        }
        res.status(400).send({error:"email is taken"});
    }catch{
        res.status(400).send({error:"email or username is taken"})
    }
}


export const addItem = async(req,res)=>{

    const addToData = (list,item,quantity)=>{
        let i = 0;
        let length = list.length;
        let d1;
        let items = [];
        for(let j = 0 ; j < quantity ; j++){
            items.push(item);
        }

        if(length == 0){
            return items;
        }
        for(;i<length;i++){
            d1 = new Date(item.expDate);

            if(parseInt(item.barcode) < parseInt(list[i].barcode)){
                console.log(   list.slice(0,i).concat(...items).concat(...list.slice(i,length))  );
                return list.slice(0,i).concat(...items).concat(...list.slice(i,length));
            }
            if(parseInt(item.barcode) == parseInt(list[i].barcode) && d1 < list[i].expDate){
                console.log(  list.slice(0,i).concat(...items).concat(...list.slice(i,length))  );
                return list.slice(0,i).concat(...items).concat(...list.slice(i,length));
            }
        }
        console.log(list.concat(...items));
        return list.concat(...items);
    }

    console.log("ADD ITEM");
    try{
        const data = req.body;
        //console.log("add item's data: " , data);
        const user = await User.findById(data.id);
        //console.log("data.id:", data.id)
        //console.log("list is:",user.itemList);
        user.itemList = addToData(user.itemList,data.item,data.quantity);
        user.save();
        res.status(200).send(user.itemList);
    }
    catch{
        res.status(404).send({error:"user dont found"})
    }
}


export const deleteItem = async(req,res)=>{
    try{
        const data = req.body;
        const user = await User.findById(data.id);
        user.itemList = user.itemList.filter(item=> data.itemId !== item.id)
        user.save();
        res.status(200).send({data:user.itemList});
    }
    catch{
        res.status(400).send({error:"Error in Delete"});
    }
}


export const getUser2 = async(req,res)=>{
    try{
        const user = await User.find({_id: req.query.id})
        res.status(201).json({user})
    }
    catch{
        res.status(401).send({error:"Have not logged yet."})
    }
}

export const login = async(req,res)=>{
    try{
       const data = req.body;
       const users = await User.find();
        console.log("getting a user")
       const user = users.filter(item => {
           return (item.username === data.username && item.password === data.password)
        })
       res.status(200).send({data:user[0].id});
    }
    catch{
        res.status(400).send({error:"user doesn't exist"});
    }
}

export const getList2 = async(req,res)=>{
    try{
       const data = req.body;
       const users = await User.find();
        console.log("getting a user in 'getList2'...")
       const user = users.filter(item => {
           return (item.id === data.userId)
        })
       res.status(200).send({data:user[0].id});
    }
    catch{
        res.status(400).send({error:"user doesn't exist"});
    }
}

export const getList = async (req,res) => {
    try{
        const data = req.query;
        console.log(data);
        console.log("trying to get the list")
        const users = await User.find();
        
        const user = users.filter(item=> item.id === data.id);
        res.status(200).send({data: user[0].itemList, status: "success"});
    }
    catch{
        res.status(400).send({error:"Error in List"});
    }
}


export const getItemData = async(req,res)=>{
    console.log("getting barcode = " , req.query.id)

    //search for current items ?
    let itemList = await ItemData.find().catch(error=>{res.status(400).send({error:'error with itemData'})});
    const barcode = req.query.id;

    itemList = itemList.filter(item=> {
        console.log("item barcode = " + item.barcode)
        console.log("barcode = " + barcode)
        return item.barcode === barcode;
    });

    console.log("itemList = " + itemList);
    if(itemList.length != 0){
        console.log(3);
        res.status(200).send(itemList[0].name);
        return;
    }

    const targetURL = `https://chp.co.il/autocompletion/product_extended?term=${barcode}&from=0&u=0.22891359532097144&shopping_address=&shopping_address_city_id=0&shopping_address_street_id=0`;
    console.log("trying to access CHP_URL \n" + targetURL)
    try{
        const response = await axios.get(targetURL, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json'
            }
        });
        console.log("have we got the data?" + response.data);
        const jsonFile = response.data;
        console.log("we got - JSONFILE:", jsonFile);
        console.log("JSONFILE: " + jsonFile)
        const length = jsonFile.length
        if(length === 0){res.status(400).send({error:"Error in Data fetch"}); return;};

        //add the item to table
        const newItem = new ItemData({barcode:barcode, name:jsonFile[0].label});
        console.log(newItem);
        await newItem.save();
        console.log('2');
        res.status(200).send(jsonFile.data[0].label);//[0].value);
        console.log("end of CHP_URL")
    }
    catch(error){
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
          } else {
            console.error('Error making the request:', error.message);
        }
        console.log(error.message)
        res.status(400).send({error:"Error in Data fetch"})
    }

}


export const changeEmail = async(req,res) => {
    try{
        const data = req.body;
        let user = await User.findById(data.id);
        user.email = data.newEmail;
        user.save();
        res.status(200).send({data:"succeed!"})
    }
    catch{
        res.status(400).send({error:"error with change email"});
    }
} 


export const changePassword = async(req,res) => {
    
    try{
        const data = req.body;
        console.log("hfdsaljkfadsljkhdfsaljkhfdsalhjkfadslhjkafsd:" , data)
        let user = await User.findById(data.id);
        user.password = data.newPassword;
        console.log("fsdafs : " , user)
        await user.save();
        console.log("console.log succed")
        res.status(200).send({data : "Succeed!"})
    }

    catch{
        res.status(400).send({error:"error with change password"});
    }
}


export const changeExpD = async(req,res) => {
    try{
        const data = req.body;
        console.log("asdjksjkd:"  , data)
        let user = await User.findById(data.id);
        user.expD = data.expD;
        console.log("fsdafs : " , user)
        await user.save();
        console.log("console.log succed")
        res.status(200).send({data : "Succeed!"})
    }
    catch{
        res.status(400).send({error:"error with change password"});
    }
}
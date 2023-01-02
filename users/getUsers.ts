

import fs from 'fs'
import express from 'express'
const getUsers = (req:express.Request,res:express.Response) => {
    fs.readFile('users.json',{},(err,dataRes) => {
        if(err) return res.send(400).json({success: false,message: "failed to get users"})
        var temp = dataRes.toString('utf8')
        var parsedTemp = JSON.parse(temp) || []
        return res.status(200).json({success: true,message: "Successfully read the users", data: parsedTemp})
    })
}

export default getUsers
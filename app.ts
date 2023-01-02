import express from 'express';
import cors from 'cors'
//tokens
import issueAccessToken from './tokens/issue-access-token'
import getUserToken from './tokens/getToken';
//users
import createUser from './users/createUsers';
import getUsers from './users/getUsers';
import deleteUsers from './users/deleteUsers'
//threads
import createThread from './chatThreads/threads/createChatThread';
import getChatThreads from './chatThreads/threads/getChatThreads';
//message
import sendMessage from './messages/sendMessage';
import receiveMessage from './messages/receiveMessage';
import addParticipantToThread from './chatThreads/participants/addParticipantToThread';
import getParticipantsFromThread from './chatThreads/participants/getParticipantsFromThread';


require('dotenv').config()

const app = express()
const port = 3002

app.use(cors())

app.use(express.json());
// app.use(express.json());

app.listen(port ,() => console.log(`app started at port ${port}`))

app.get('/',(req,res) => {
    res.send("Hello")
})

//create new identity and access token
app.get('/issueAccessToken',issueAccessToken) //new user creation 1440hrs
app.post("/getToken", getUserToken) // existing user or refresh tokens

//users
app.get('/users',getUsers )
app.post("/users", createUser)
app.delete("/users", deleteUsers)

//chatThreads 
app.post("/createThread", createThread)
app.get("/getThreads", getChatThreads)
app.post("/addParticipantToThread", addParticipantToThread)
app.get("/getParticipantFromThread", getParticipantsFromThread)

//messages
app.post("/sendMessage", sendMessage) 
app.get("/readMessages", receiveMessage) 

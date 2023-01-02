import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { CommunicationIdentityClient } from "@azure/communication-identity";

import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let temp: any = [];
const getChatThreads = async (req: express.Request, res: express.Response) => {
    try{    
        let chatClient = new ChatClient(
          process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
          new AzureCommunicationTokenCredential(req.headers.authorization || "")
        );
      
        const threads = chatClient.listChatThreads();
      
        for await (const thread of threads) {
          temp.push(thread);
          // your code here
        }
        return res.status(200).json({ success: true, message: "ok", data: temp });
    }catch(err:any){
      if(err.statusCode === 401){
        return res.status(401).json({success: false, message: "UnAuthorize Access"})
      }
        return res.status(400).json({success: false, message: "unable to get chat threads"})
    }
};

export default getChatThreads;

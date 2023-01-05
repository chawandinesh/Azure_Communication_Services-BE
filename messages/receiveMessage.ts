import { ChatClient } from "@azure/communication-chat";
import express from "express";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let temp: any = [];
const receiveMessage = async (req: express.Request, res: express.Response) => {
  //sender Name, content
  try {
    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );
    const thread = req.query.thread as string;

    let chatThreadClient = chatClient.getChatThreadClient(thread);

    const messages = chatThreadClient.listMessages();
    temp = []
    for await (const message of messages) {
      temp.push(message);
      // your code here
    }

    return res.status(200).json({
      success: true,
      messages: temp,
      message: "successfully received",
    });
  } catch (err:any) {
    if(err.statusCode === 401){
      return res.status(401).json({success: false, message: "UnAuthorize Access"})
    }
    return res
      .status(400)
      .json({ success: false, message: "Unable to send message" });
  }
};

export default receiveMessage;

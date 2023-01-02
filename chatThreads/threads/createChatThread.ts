import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";


const createThread = async (req: express.Request, res: express.Response) => {
  try {
    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );


    const createChatThreadRequest = {
      topic: req.body?.topic,
    };

    const createChatThreadOptions = {
      participants: req.body.participants
    };

    const createChatThreadResult = await chatClient.createChatThread(
      createChatThreadRequest,
      createChatThreadOptions
    );
    const threadId = createChatThreadResult.chatThread?.id;
    return res.status(200).json({ success: true, data: threadId });
  } catch (err:any) {
    if(err.statusCode === 401){
      return res.status(401).json({success: false, message: "UnAuthorize Access"})
    }
    return res
      .status(400)
      .json({ success: false, message: "Failed to create a chat thread" });
  }
};

export default createThread;

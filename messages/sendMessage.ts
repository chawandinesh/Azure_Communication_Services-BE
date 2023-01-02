import { ChatClient } from "@azure/communication-chat";
import express from "express";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const sendMessage = async (req: express.Request, res: express.Response) => {
  //sender Name, content
  try {
    const sendMessageRequest = {
      content: req.body.message,
    };

    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );
    const thread = req.query.thread as string;
    let chatThreadClient = chatClient.getChatThreadClient(thread);
    const sendChatMessageResult = await chatThreadClient.sendMessage(
      sendMessageRequest
    );
    const messageId = sendChatMessageResult.id;
    return res
      .status(200)
      .json({
        success: true,
        messageId: messageId,
        message: "successfully sent",
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

export default sendMessage;

import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const addParticipantToThread = (req: express.Request, res: express.Response) => {
  try {
    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );

    const threadId = req.query?.threadId as string;

    const createChatThreadOptions = {
      participants: req.body.participants,
    };

    let chatThreadClient = chatClient.getChatThreadClient(threadId);
    chatThreadClient
      .addParticipants(createChatThreadOptions)
      .then((onSuccess) => {
       return res.status(200).json({
          success: true,
          message: "Successfully added the participants",
        });
      })
      .catch((reason) => {
       return res.status(400).json({
          success: false,
          message: "Failed to add participant",
        });
      });
  } catch (err) {
   return res.status(400).json({
      success: false,
      message: "Unable to add participant",
    });
  }
};

export default addParticipantToThread

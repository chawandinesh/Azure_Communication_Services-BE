import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let tempParticipants: any = [];
const getParticipantsFromThread = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );
    tempParticipants = []

    const threadId = req.query?.threadId as string;

    let chatThreadClient = chatClient.getChatThreadClient(threadId);
    const participants = chatThreadClient.listParticipants();

    for await (const participant of participants) {
      tempParticipants.push(participant);
    }

    return res.status(200).json({
      success: true,
      data: tempParticipants,
      message: "Successfully read the participants",
    });
  } catch (err:any) {
    if(err.statusCode === 401){
      return res.status(401).json({success: false, message: "UnAuthorize Access"})
    }
    return res.status(400).json({
      success: false,
      message: "Unable to add participant",
    });
  }
};

export default getParticipantsFromThread;

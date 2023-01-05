import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import _ from "lodash";

const removeParticipantFromThread = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userCommunicationId = _.get(req.body, "userCommunicationId", "");
    const threadId: any  = _.get(req.query, "threadId", "");

    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );

    let chatThreadClient = chatClient.getChatThreadClient(threadId);
    chatThreadClient
      .removeParticipant(userCommunicationId)
      .then((onSuccess) => {
        console.log(onSuccess,'success')
        return res.status(200).json({
          success: true,
          data: [],
          message: "Successfully removed the participant",
        });
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          return res
            .status(401)
            .json({ success: false, message: "UnAuthorize Access" });
        }
        return res.status(400).json({
          success: false,
          message: "Failed to remove participant",
        });
      });
  } catch (err: any) {
    console.log(err);
    if (err.statusCode === 401) {
      return res
        .status(401)
        .json({ success: false, message: "UnAuthorize Access" });
    }
    return res.status(400).json({
      success: false,
      message: "Unable to remove participant",
    });
  }
};

export default removeParticipantFromThread;

import express from "express";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const deleteChatThread = (req: express.Request, res: express.Response) => {
  try {
    let chatClient = new ChatClient(
      process.env["COMMUNICATION_SERVICES_ENDPOINT"] || "",
      new AzureCommunicationTokenCredential(req.headers.authorization || "")
    );

    chatClient
      .deleteChatThread(req.params.id)
      .then((onSuccess) => {
        return res
          .status(200)
          .json({ success: true, message: "Successfully deleted" });
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          return res
            .status(401)
            .json({ success: false, message: "UnAuthorize Access" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Failed to delete chat thread" });
        }
      });
  } catch (err: any) {
    if (err.statusCode === 401) {
      return res
        .status(401)
        .json({ success: false, message: "UnAuthorize Access" });
    }
    return res
      .status(400)
      .json({ success: false, message: "unable to delete chat threads" });
  }
};

export default deleteChatThread;

import { CommunicationIdentityClient } from "@azure/communication-identity";
import express from "express";

const getUserToken = (req: express.Request, res: express.Response) => {
  /**
   * main starts
   * @returns promise
   */
  const main = async () => {

    // connection string
    const connectionString =
      process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"] || "";

    //identity client
    const identityClient = new CommunicationIdentityClient(connectionString);

    //take communication id from req
    const communicationUserId = req.body.communicationId;

    //create token for available user
    const userAccessToken = await identityClient.getToken(
      { communicationUserId: communicationUserId },
      ["chat","voip"]
    );

    return res.status(200).json(userAccessToken);
  };

  main().catch((error) => {
    return res
      .status(400)
      .json({ success: false, message: "Unable to issue a token" });
  });
};

export default getUserToken;

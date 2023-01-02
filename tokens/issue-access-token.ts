//Not using this file
import { CommunicationIdentityClient } from "@azure/communication-identity";
import express from "express";
const issueAccessToken = (req: express.Request, res: express.Response) => {
  
  /**
   * main starts
   * @returns promise
   */
  const main = async () => {
    //get connection string
    const connectionString =
      process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"] || "";
    
    //create identity
    const identityClient = new CommunicationIdentityClient(connectionString);

    //user identity (new user)
    let identityResponse = await identityClient.createUser(); //communicationId

    //issue accessToken for new user
    let tokenResponse = await identityClient.getToken(identityResponse, [
      "chat",
      "voip",
    ]);

    return res.status(200).json(tokenResponse);
  };

  main().catch((error) => {
    return res
      .status(400)
      .json({ success: false, message: "Unable to issue a token" });
  });
};

export default issueAccessToken;

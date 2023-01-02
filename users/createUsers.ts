import fs from "fs";
import express from "express";
import { CommunicationIdentityClient } from "@azure/communication-identity";

const createUser = (req: express.Request, res: express.Response) => {
  /**
   * main starts
   */
  const main = async () => {
    // Connection string
    const connectionString =
      process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"] || "";

    // Instantiate the identity client
    const identityClient = new CommunicationIdentityClient(connectionString);

    //user identity
    let identityResponse = await identityClient.createUser();

    //read users from db
    fs.readFile("users.json", {}, (err, dataRes) => {
      var availableUsers = dataRes.toString("utf8"); //get available users from db (in stringify format)
      var parsedAvailableUsers = JSON.parse(availableUsers) || []; //convert to parsed
      //append new user
      var availableUsersWithNewUsers = [
        ...parsedAvailableUsers,
        {
          id: { communicationUserId: identityResponse.communicationUserId },
          displayName: req.body.displayName,
        },
      ];

      //write data in db
      fs.writeFile(
        "users.json",
        JSON.stringify(availableUsersWithNewUsers),
        (err) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: "Failed to save user" });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Successfully saved" });
          }
        }
      );
    });
  };

  main().catch((err) => {
    if(err.statusCode === 401){
      return res.status(401).json({success: false, message: "UnAuthorize Access"})
    }
    res.status(400).json({ success: false, message: "Failed to save user" });
  });
};

export default createUser;

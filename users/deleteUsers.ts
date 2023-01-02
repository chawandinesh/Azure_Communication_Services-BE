import fs from "fs";
import express from "express";
const deleteUsers = (req: express.Request, res: express.Response) => {
  fs.readFile("users.json", {}, (err, dataRes) => {
    if(err) return res.status(400).json({success: false, message: "Unable to delete"})
    var temp = dataRes.toString("utf8");
    var parsedTemp = Array.isArray(JSON.parse(temp)) ? JSON.parse(temp) : [];
    var changedData = parsedTemp.filter(
      (each: any) => each.id.communicationUserId !== req.body.id
    );
    fs.writeFile("users.json", JSON.stringify(changedData), (err) => {
      if (err) {
       return res
          .status(403)
          .json({ success: false, message: "Failed to save user" });
      }
      return res.status(200).json({ success: true, message: "Successfully deleted" });
    });
  });
};

export default deleteUsers;

const express = require("express");
const requestrouter = express.Router();
const authmiddleware = require("../middleware/middleware");
const User = require("../models/user");
const ConnectionRequestModal = require("../models/connectionrequest");
const { ExplainVerbosity } = require("mongodb");
requestrouter.post(
  "/sent/:status/:toUserId",
  authmiddleware,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const Status = req.params.status;
      const fromUserId = req.user._id;
      let available_status = ["intrested", "ignored"];
      if (!available_status.includes(Status)) {
        throw new Error("INvalid status type");
      }
      const toUserProfile = await User.findById(toUserId);
      // const Is_email_correct = await  ConnectionRequestModal.findById({touserId:toUserId,fromuserId:fromUserId})
      if (!toUserProfile) {
        console.log("incorect email");
        return res.status(200).json("Incorrect Email");
      }
      const existenceofId = await ConnectionRequestModal.find({
        $or: [
          {
            touserId: toUserId,
            fromuserId: fromUserId,
            $and: [{ Status: Status }],
          },
          {
            touserId: fromUserId,
            fromuserId: toUserId,
            $and: [{ Status: Status }],
          },
        ],
      });
      if (existenceofId.length > 0) {
        throw new Error(existenceofId + "Request Already established");
      }
      const instance = await new ConnectionRequestModal({
        touserId: toUserId,
        Status: Status,
        fromuserId: fromUserId,
      });
      await instance.save();
      res.send({
        msg: `${req.user.firstName} is ${Status} ${toUserProfile.firstName}`,
        instance,
      });
    } catch (err) {
      res.status(400).send("ERROR" + err);
    }
  }
);
requestrouter.post(
  "/received/:status/:fromUserId",
  authmiddleware,
  async (req, res) => {
    try {
      const validStatus = ["accepted", "rejected"];
      const FromUserId = req.params.fromUserId;
      const User = req.user;
      const Status = req.params.status;
      if (!validStatus.includes(Status)) {
        throw new Error("Invalid Status");
      }
      const Requestvalidator = await ConnectionRequestModal.findById(
        FromUserId
      );
      if (!Requestvalidator || Requestvalidator.Status !== "intrested") {
        // throw new Error('Foul Request' , Requestvalidator)
      }
      // else{
      const instance = await ConnectionRequestModal.findByIdAndUpdate(
        Requestvalidator._id,
        { Status: Status },
        { new: true }
      ).populate("fromuserId", "firstName");

      res.json({
        msg: `${User.firstName} ${Status} ${instance.fromuserId.firstName}`,
        res: instance,
      });
      // }
    } catch (err) {
      res.status(400).send(err + "Error");
    }
  }
);
requestrouter.get("/feed", authmiddleware, async (req, res) => {
  //console.log('indied feed')
  const uniquefind = req.body.firstName;
  try {
    const instance = await User.find();
    res.send(instance);
  } catch (err) {
    res.send(err);
  }
});
requestrouter.delete("/user", authmiddleware, async (req, res) => {
  const uniquefind = req.body.id;
  try {
    const instance = await User.findByIdAndDelete(uniquefind);

    res.send("user delted sucessfully");
  } catch (err) {
    res.send(err);
  }
});
requestrouter.patch("/user", authmiddleware, async (req, res) => {
  const id = req.params?.userId;
  const uniquefind = req.body;
  try {
    const ParamArray = ["gender", "password", "about", "skills", "id"];
    const UpdateParamAllow = (value) => {
      return ParamArray.includes(value);
    };
    const isavailableparam = Object.keys(uniquefind).every((key) =>
      UpdateParamAllow(key)
    );
    if (!isavailableparam) {
      res.status(404).send("update not allowed");
      throw new Error("You cannot change");
    }
    const instance = await User.findByIdAndUpdate(uniquefind?.id, uniquefind, {
      runValidators: true,
    });

    res.send("user update sucessfully");
  } catch (err) {
    res.send(err);
  }
});

module.exports = requestrouter;

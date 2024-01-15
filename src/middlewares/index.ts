import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["USER_SESSION"];

    if (!sessionToken) {
      return res
        .sendStatus(400)
        .json({ message: "No session token found" })
        .end();
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403).json({ message: "Invalid session token" });
    }

    merge(req, { identity: existingUser });

    next();
  } catch (error) {
    console.log("error in isAuthenticated:", error);
    return res.sendStatus(401);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId = get(req, "identity._id") as unknown as string;

    if (!currentUserId) {
      return res.sendStatus(400).json({ message: "No user found" });
    }

    if (currentUserId !== id) {
      return res.sendStatus(403).json({ message: "forbidden" });
    }

    next();
  } catch (error) {
    console.log("error in isOwner:", error);
    return res.sendStatus(401);
  }
};

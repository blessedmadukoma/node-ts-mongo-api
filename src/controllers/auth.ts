import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { hash, random } from "../helpers";

export const Register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(409);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt: salt,
        password: hash(salt, password),
      },
    });

    return res.status(201).json(user).end();
  } catch (error) {
    console.log("Error in regstration:", error);
    return res.sendStatus(400);
  }
};

export const Login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(404);
    }

    const expectedHash = hash(user!.authentication!.salt!, password);

    if (user.authentication!.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.authentication!.sessionToken = hash(salt, user._id.toString());

    await user.save();

    // res.cookie("USER_SESSION", user.authentication!.sessionToken, { domain: "localhost", path: '/', httpOnly: true, secure: false, maxAge: 3600000 });
    res.cookie("USER_SESSION", user.authentication!.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log("Error in login:", error);
    return res.sendStatus(400);
  }
};

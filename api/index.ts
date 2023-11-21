import express, { Request, Response } from "express";

const bootstrap = async () => {
  const app = express();
  app.get("/", (_req: Request, res: Response) => {
    return res.send("Express Typescript on Vercel" + process.env.NODE_ENV);
  });

  app.get("/ping", (_req: Request, res: Response) => {
    return res.send("pong 🏓");
  });

  return app;
};

export default bootstrap();

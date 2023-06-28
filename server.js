import nodemon from "nodemon";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.port || 8000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(201).json({
    status: "sucess",
    mesage: "Server is up and running",
  });
});

app.post("/", async (req, res) => {
  try {
    const { prompt, number, size } = req.body;
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
      prompt: prompt,
      n: number,
      size: size,
    });
    const image_url = response.data.data;

    response
      ? res.json({
          status: "success",
          message: "Image Sucessufullycreated",
          url: image_url,
        })
      : res.json({
          status: "error",
          message: "Unable to Create Image",
        });
  } catch (error) {
    const { message } = error;
    res.json({
      status: message,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});

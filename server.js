const express = require("express");
const cron = require("node-cron");
const crypto = require("crypto");

const app = express();

const server = app.listen(3000);

const temp = {};

app.get("/health", (req, res) => {
  return res.status(200).send({ message: "health is fine" });
});

app.post("/add-job", async (req, res) => {
  try {
    const publicId = crypto.randomUUID();

    const job = cron.schedule("5 *  * * * *", () => {
      console.log(`Running cron job ${publicId}...`);
      // Perform your task here
    });

    console.log("job", job);

    console.log("temp", temp);

    job.start();

    temp[publicId] = { ...job, status: "active" };

    return res.status(200).send({ message: "health is fine" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete-job", async (req, res) => {
  const {
    query: { publicId },
  } = req;

  const job = temp[publicId];

  if (job) {
    job.stop();
    job.destroy();

    temp[publicId] = { ...job, status: "deleted" };

    console.log("job", job);

    console.log("temp", temp);

    return res.status(200);
  }

  console.log("job", job);

  console.log("temp", temp);

  console.log("no job");

  return res.status(200);
});

const express = require("express");
const cron = require("node-cron");
const crypto = require("crypto");
const database = require("./database");
const { QueryTypes } = require("sequelize");

const app = express();

app.listen(process.env.PORT);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).send({ message: "health is fine" });
});

app.post("/add-job", async (req, res) => {
  try {
    const {
      body: { scheduledTime },
    } = req;

    const publicId = crypto.randomUUID();

    const job = cron.schedule(
      scheduledTime,
      () => {
        console.log(`Running cron job ${publicId}...`);
      },
      { name: publicId }
    );

    console.log("job", job);

    job.start();

    await database.query(
      `INSERT INTO cron_scheduled (public_id, scheduled_time)
      VALUES(:publicId, :scheduledTime);
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          scheduledTime,
          publicId,
        },
      }
    );

    return res.status(200).send({ message: "health is fine" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete-job", async (req, res) => {
  const {
    query: { publicId },
  } = req;

  const cronJob = cron.getTasks().get(publicId);

  if (cronJob) {
    cronJob.stop();

    await database.query(
      `UPDATE public.cron_scheduled
      SET status='inactive'
      WHERE public_id=:publicId
          `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          publicId,
        },
      }
    );

    return res.status(200).send({});
  }

  return res.status(204).send({});
});

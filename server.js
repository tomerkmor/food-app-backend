import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodeSchedule from "node-schedule";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import storeRouter from "./routes/store.js"; // Updated route import
import User from "./modules/UserSchema.js"; // Ensure to import your User model

const app = express();
const upload = multer({ dest: "uploads/" });

// Database connection
const CONNECTION_URL =
  "mongodb+srv://tomermor:Te709709@nodeexpressprojects.wxq8pye.mongodb.net/PLANO?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

console.log("process.env.port =", process.env.PORT);
console.log(
  "Meals file path:",
  path.join(process.cwd(), "data", "available-meals.json")
);

mongoose
  .connect(CONNECTION_URL)
  .then(async () => {
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("./public"));

            // Dynamically import routes
            const posts = (await import('./routes/posts.js')).default;
            const tasks = (await import('./routes/tasks.js')).default;
            const dates = (await import('./routes/dates.js')).default;
            const whoami = (await import('./routes/whoami.js')).default;
            const shorturls = (await import('./routes/shorturls.js')).default;
            const exercises = (await import('./routes/exercises.js')).default;
            
    // Use store router for meals and orders
    app.use("/api/store", storeRouter);

    // Other routes
    // Uncomment if you have additional routes to handle
    app.use("/api/exercises", exercises);
    app.use("/api/shorturl", shorturls);
    app.use("/api/date", dates);
    app.use("/api/whoami", whoami);
    app.use("/", posts);
    app.use("/api/tasks", tasks);

    console.log("Routes set up. Listening on port:", PORT);

    // File upload route
    app.post("/api/file", upload.single("upfile"), async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { originalname, filename, mimetype, size } = req.file;
      res.json({ name: originalname, filename, type: mimetype, size });
    });

    // Ensure __dirname is correctly resolved
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    // Download file from /uploads folder
    app.get("/api/file/:filename", (req, res) => {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), "uploads", filename);
      console.log("Requesting file:", filename);
      console.log("File path:", filePath);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error("File not found:", err);
          return res.status(404).json({ error: "File not found" });
        }

        res.download(filePath, (err) => {
          if (err) {
            console.error("Download error:", err);
            res.status(500).json({ error: "Failed to download file" });
          }
        });
      });
    });

    // Scheduler to send expiration emails
    nodeSchedule.scheduleJob("0 0 * * *", async () => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        port: 25,
        auth: {
          user: "sexylooter@gmail.com",
          pass: "iafwewpjwdbiyzll", // Consider using environment variables for sensitive data
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOption = {
        from: "planocooperation@gmail.com",
        to: "",
        subject: "Expired List",
        text: "",
      };

      try {
        let sendMail = false;
        const users = await User.find(); // Ensure User model is defined and imported
        for (const user of users) {
          sendMail = false;
          let message = `${user.username}\n`;
          const expire = user.expD;

          for (const item1 of user.itemList) {
            const daysUntilExpiry = Math.floor(
              (item1.expDate - new Date()) / (1000 * 3600 * 24)
            );
            if (daysUntilExpiry < expire) {
              message += `${item1.name}\n${item1.expDate}\n\n`;
              sendMail = true;
            }
          }

          if (sendMail) {
            mailOption.to = user.email;
            mailOption.text = message;
            console.log(message);
            transporter.sendMail(mailOption, (error, info) => {
              if (error) {
                console.log("Error sending email:", error.message);
              } else {
                console.log("Email sent:", info.response);
              }
            });
          }
        }
      } catch (error) {
        console.log("Error in sending expiration emails:", error);
      }
    });

    // Handle 404 for unknown routes
    app.use((req, res) => {
      res.status(404).json({ message: "Not found" });
    });

    // Start the server after successful DB connection
    app.listen(PORT, () =>
      console.log(`Connected to DATABASE on port: ${PORT}`)
    );
  })
  .catch((e) => {
    console.log("Database connection error:", e.message);
  });

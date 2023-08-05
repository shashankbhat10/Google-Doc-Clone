const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const { auth, firestore } = require("../firebase_server/firebase_server.js");

const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

/**
 * Create express App
 */

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

/**
 * Create socket instance
 */
// const io = require("socket.io")(process.env.SOCKET_PORT, {
//   cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
// });

/**
 * Handle socket messages
 */
io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("get-document", (documentId) => {
    socket.join(documentId);
    socket.emit("load-document");

    socket.on("send-changes", (delta) => {
      // console.log(delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("change-document-lock-status", (documentLockStatus) => {
      socket.broadcast.to(documentId).emit("change-document-lock-status", documentLockStatus);
    });
  });
});

/**
 * Create transporter instance for sending mail
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  auth: {
    user: "s.2205.b@gmail.com",
    pass: process.env.APP_PASS,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Test route
 */
app.get("/api/", (req, res) => {
  console.log("Hello World!");
});

/**
 * Route to handle sending emails
 */
app.post("/api/sendmail", async (req, res) => {
  const { token, emailTo, documentName, documentId } = req.body;
  console.log(emailTo);

  try {
    const tokenVerifyRes = await auth.verifyIdToken(token);
    const user_email = tokenVerifyRes.email;

    const query = firestore.collection("document").doc(documentId);

    const documentSnapshot = await query.get();

    const data = documentSnapshot.data();
    if (data.owner !== user_email) {
      return res.status(400).send({ message: "User is not allowed to add/remove users" });
    }

    console.log(data.allowed);
    if (data.allowed.includes(emailTo)) {
      return res.status(400).send({ message: "Target user already has access to the document" });
    }

    const mailData = {
      from: "Doc Clone Admin <admin@googledocclone.com>",
      to: emailTo,
      subject: `Invitation to view/edit document: ${documentName}`,
      text: "Invitation to view/edit document",
      html: `Hello,<br>
             <span> You have been invited to collaborate on the following document: <i>${documentName}</i> by ${tokenVerifyRes.name}
             <br> <br>
             You can access the document at this <a href='${APP_URL}/document/${documentId}'>link</a>
             `,
    };

    transporter.sendMail(mailData).then((info, err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Error while sending email to user" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error in validating token", stack_err: error });
  }

  res.status(200).json({ message: "Email sent!" });
});

const PORT = process.env.SERVER_PORT || 8002;

if (process.env.NODE_ENV === "production") {
  const root = path.join(__dirname, "..", "client", "build");
  // console.log(__dirname);
  // const rootClient = path.resolve(__dirname, "..", "client", "build");
  // app.use(express.static(path.join(__dirname, "/client/build")));
  app.use(express.static(root));

  app.get("*", (req, res) => {
    // console.log(path.resolve(__dirname, "..", "client", "build", "index.html"));
    // res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
    res.sendFile("index.html", { root });
  });
} else {
  app.get("/api/", (req, res) => {
    res.send("API is running...");
  });
}

server.listen(PORT, console.log(`API server started. Listening on port: ${PORT}`));

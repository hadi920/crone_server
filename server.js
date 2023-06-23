const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

function sendEmail(propertyData) {
  const mailOptions = {
    from: "syedhadialvi18@gmail.com",
    to: "syedhadifreelancer@gmal.com",
    subject: "Rent Payment Reminder",
    text: `Collection From ${propertyData.name},\nCollection Price : ${propertyData.price}\nProperty Address : ${propertyData.address}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function scheduleEmail(propertyData) {
  const { date } = propertyData;
  const cronExpression = `0 0 ${rentDate} * *`;

  cron.schedule(cronExpression, () => {
    sendEmail(propertyData);
  });
}

app.get("/", async (req, res) => {
  res.send("working");
});

app.post("/schedule-email", async (req, res) => {
  const { renterName, rentDate, rentAddress, rentPrice } = req.body;
  const emailData = {
    name: renterName,
    date: rentDate,
    address: rentAddress,
    price: rentPrice,
  };

  try {
    scheduleEmail(emailData);
    res.send("Email scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).send("An error occurred while scheduling the email.");
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

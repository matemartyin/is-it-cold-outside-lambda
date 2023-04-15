const express = require('express')
const nodemailer = require("nodemailer");
const axios = require("axios");
const sls = require('serverless-http')
const app = express()

const tresshold = process.env.TRESSHOLD;
const password = process.env.MAIL_PASS;
const mail = process.env.MAIL;
const weatherApiKey = process.env.WEATHER_API_KEY;
const lat = process.env.LAT;
const lon = process.env.LON;
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {user: mail, pass: password}
});

app.get('/', async function(req, res) {
  const response = await axios.get(apiUrl)
  var data = response.data.list[8];
  var temp = data.main.temp

  if (temp < tresshold) {
      await sendMail({
          from: mail,
          sender: mail,
          to: mail,
          subject: "FŰTÉS EMLÉKEZTETŐ",
          text: `A következő éjszakán várható hőmérséklet: ${temp} C`
      });
  }
  res.send("Done.");
});

async function sendMail(mailDetails) {
  let info = await mailTransporter.sendMail(mailDetails);
  console.log(`Message sent to ${mailDetails.to} with subject: ${mailDetails.subject}; message id: ${info.messageId}`);
}

module.exports.server = sls(app)

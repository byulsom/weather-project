require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const userRouter = require('./routes/user');
const Company = require('./models/company');
const companyRouter = require('./routes/company');
const Unlimit = require('./models/unlimit');
const unlimitRouter = require('./routes/unlimit');
const cookieParser = require('cookie-parser');
const config = require("./config/key");
const request = require("request");
const path = require("path");
const productRouter = require('./routes/product');
const projectRouter = require('./routes/project');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;
const pvWattsRateRouter = require('./routes/calculate');
const cronjobRouter = require('./routes/cronjob');
const weatherRouter= require('./routes/weather');
const calculateRouter= require('./routes/calculate');


///// DB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///// route
app.use('/weather/user', userRouter);
app.use('/weather/company', companyRouter);
app.use('/weather/unlimit', unlimitRouter);
app.use('/weather/project', projectRouter);
app.use('/weather/product', productRouter);
app.use('/weather/pvwatt', pvWattsRateRouter);
app.use('/weather/weather', weatherRouter);
app.use('/weather/cronjob', cronjobRouter);
app.use('/weather/calculate', calculateRouter);


// Login user
app.post('/weather/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Check username.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: 'Wrong Password',
      });
    }

    const token = user.generateAuthToken();

    res
      .cookie('hasVisited', token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, token });

  } catch (err) {
    res.status(500).send(err.message);
  }
});




// Login company
app.post('/weather/company/login', async (req, res) => {
  try {
    const { companyname, password } = req.body;

    const company = await Company.findOne({ companyname });
    if (!company) {
      return res.json({
        loginSuccess: false,
        message: 'Check companyname.',
      });
    }

    const isMatch = await company.comparePassword(password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: 'Wrong Password',
      });
    }

    const token = company.generateAuthToken();

    res
      .cookie('hasVisited', token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, companyid: company._id.toString() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login unlimit
app.post('/weather/unlimit/login', async (req, res) => {
  try {
    const { unlimitname, password } = req.body;

    const unlimit = await Unlimit.findOne({ unlimitname });
    if (!unlimit) {
      return res.json({
        loginSuccess: false,
        message: 'Check unlimitname.',
      });
    }

    const isMatch = await unlimit.comparePassword(password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: 'Wrong Password',
      });
    }

    const token = unlimit.generateAuthToken();

    res
      .cookie('hasVisited', token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, unlimitid: unlimit._id.toString() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// authorizeuser access company product
const authorizeUser = (req, res, next) => {
  const { companyId } = req.params; // Assuming you pass the company ID as a parameter

  // Check if the user is associated with the requested company
  if (req.user.companyId !== companyId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  next(); // User is authorized, proceed to the next middleware or route handler
};



//email
const mailSender = require('./email/mailsender');

app.post('/weather/email', (req, res) => {
  const emailParams = req.body;

  mailSender.sendOutlookMail(emailParams)
    .then(() => {
      res.json({ success: true, message: 'Email sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
    });
});



////page not found
app.get("*", (req, res) => {

    res.send("Page not found.")
})




///start server
app.listen(3000, () => console.log('Server Started'));





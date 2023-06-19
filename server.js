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



///// DB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///// use route
app.use('/weather/user', userRouter);
app.use('/weather/company', companyRouter);
app.use('/weather/unlimit', unlimitRouter);
app.use('/weather/project', projectRouter);
app.use('/weather/product', productRouter);



// Login user
app.post("/weather/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Check username.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    
    res
      .cookie("hasVisited", token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Login company
app.post("/weather/company/login", async (req, res) => {
  try {
    const company = await Company.findOne({ companyname: req.body.companyname });
    if (!company) {
      return res.json({
        loginSuccess: false,
        message: "Check username.",
      });
    }

    const isMatch = await company.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ companyId: company._id }, secretKey);

    res
      .cookie("hasVisited", token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, companyId: company._id.toString() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login unlimit
app.post("/weather/unlimit/login", async (req, res) => {
  try {
    const unlimit = await Unlimit.findOne({ unlimitname: req.body.unlimitname });

    if (!unlimit) {
      return res.json({
        loginSuccess: false,
        message: "Check username.",
      });
    }

    const isMatch = await unlimit.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ unlimitId: unlimit._id }, secretKey);

    res
      .cookie("hasVisited", token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, unlimitId: unlimit._id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});







// open api
const weatherModule = require('./weather/fetchweather');


app.get('/weather/fetchweather', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // Check if latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Fetch weather data using fetchWeatherData function from weather module
    const weather = await weatherModule.fetchWeatherData(latitude, longitude); 

    // Return the weather data in the response
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


app.get('/weather/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // Check if latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Fetch location data using fetchLocation function from weather module
    const location = await weatherModule.fetchLocation(latitude, longitude); 

    // Return the location data in the response
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});


app.get('/weather/geo', async (req, res) => {
  try {
    const { input } = req.query;
    
    // Check if input is provided
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    
    // Fetch geo data using fetchGeo function from weather module
    const geo = await weatherModule.fetchGeo(input); 

    // Return the geo data in the response
    res.json(geo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch geo data' });
  }
});



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





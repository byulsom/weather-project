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

///// route
app.use('/weather/user', userRouter);
app.use('/weather/company', companyRouter);
app.use('/weather/unlimit', unlimitRouter);
app.use('/weather/project', projectRouter);
app.use('/weather/product', productRouter);



const authenticateToken = require('./jwt');
// Login user
app.get('/weather/profile', authenticateToken, async (req, res) => {
  // Access the user information from req.decoded
  const userId = req.decoded.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Construct the response data based on the user's profile
    const userProfile = {
      username: user.username,
      email: user.email,
      // Add more fields as needed
    };

    // Send the response with the user's profile
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving user profile',
    });
  }
});

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
      .json({ loginSuccess: true, userid: user._id.toString() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// Login company
app.get('/weather/profile', authenticateToken, async (req, res) => {
  // Access the company information from req.decoded
  const companyId = req.decoded.companyId;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
      });
    }

    // Construct the response data based on the company's profile
    const companyProfile = {
      companyname: company.companyname,
      email: company.email,
      // Add more fields as needed
    };

    // Send the response with the company's profile
    res.status(200).json(companyProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving company profile',
    });
  }
});

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
app.get('/weather/profile', authenticateToken, async (req, res) => {
  // Access the unlimit information from req.decoded
  const unlimitId = req.decoded.unlimitId;

  try {
    const unlimit = await Unlimit.findById(unlimitId);

    if (!unlimit) {
      return res.status(404).json({
        message: 'Unlimit not found',
      });
    }

    // Construct the response data based on the unlimit's profile
    const unlimitProfile = {
      unlimitname: unlimit.unlimitname,
      email: unlimit.email,
      // Add more fields as needed
    };

    // Send the response with the unlimit's profile
    res.status(200).json(unlimitProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving unlimit profile',
    });
  }
});

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





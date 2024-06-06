# Project Setup Guide

This document provides instructions for setting up and running the project cloned from GitHub. Follow the steps below to get started:

## Prerequisites

Ensure you have Node.js and npm installed on your system. You can download and install them from [Node.js official website](https://nodejs.org/).

## Cloning the Repository

To clone the project from GitHub, use the following command in your terminal:

```
git clone <repository-url>
```


## Installing Dependencies

After cloning the repository, you need to install the necessary npm packages. Navigate to the project directory and run:

```
cd path/to/project
npm install
```

## Starting the Development Server

To start the development server, run:
```
npm run dev
```

## Managing OTP Timer

The OTP (One-Time Password) timer is set for 300 seconds. The relevant configuration can be found in the following file:

```
path\to\project\Backend_Login\models\otp
```

## Managing Static JSON Data

To serve static JSON data, you need to create new JSON files in the following directory:

```
path\to\project\Backend_Login\data
```

## Managing Static JSON Data

To serve static JSON data, you need to create new JSON files in the following directory:

```
path\to\project\Backend_Login\routes\dataRoute.js
```
## Javascript code
```
const express = require('express');
const router = express.Router();
const sampleData = require('../data/sampleData.json');  // existing data
const yourData = require('../data/yourData.json');  // your new data file

// GET endpoint to retrieve existing data
router.get('/static', (req, res) => {
    res.json(sampleData);
});

// GET endpoint to retrieve your new data
router.get('/your-data', (req, res) => {
    res.json(yourData);
});

module.exports = router;
```
## API ENDPOINT
```
http://localhost:PORT/api/data/yourData
```
## Environment Configuration

For the proper operation of the project, certain environmental variables need to be set in the `.env` file. Below is the required configuration:
```
PORT=ENTER PORT HERE
MONGODB_URI=ENTER CONNECTION URL HERE
TOKEN_SECRET=719f9cb6b1b8279e24d25e02f9ee29d296417f90b99c9e9eaf9e88a3dc1e931c
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=innovatelabs.dev@gmail.com
EMAIL_PASS=hvzi uuxy mtzk rjab
```


Please replace `ENTER PORT HERE` and `ENTER CONNECTION URL HERE` with your actual port number and MongoDB connection URL respectively. This configuration ensures the application connects correctly to your database and email server for authentication and other functionalities.

For assistance in setting up your MongoDB connection, you may refer to this instructional video: [MongoDB Connection Setup Tutorial](https://www.youtube.com/watch?v=oVHQXwkdS6w).



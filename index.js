const express = require('express');
const formData = require('express-form-data')
const bodyParser = require("body-parser");
const path = require('path');
require('dotenv').config();
const cors = require("cors");
const { CLIENT_ORIGIN } = require('./config')

const db = require("./app/models");
// const Role = db.role;

db.sequelize.sync().then(() => {
  console.log('Sync Db');
  // initial();
});

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });
//
//   Role.create({
//     id: 2,
//     name: "moderator"
//   });
//
//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }

const app = express();
app.use(cors({
  origin: CLIENT_ORIGIN
}));


app.use(formData.parse())

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// routes

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/food.diary.routes')(app);
require('./app/routes/recipe.routes')(app);
require('./app/routes/image.routes')(app);
require('./app/routes/wakeup.routes')(app);
require('./app/routes/measurement.routes')(app);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to rms-tracker service." });
});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

const db = require("../models");
const Measurement = db.measurement;
const { QueryTypes } = require('sequelize');

const Op = db.Sequelize.Op;

exports.addMeasurement = (req, res) => {
  console.log("measurement.controller");
  console.log(JSON.stringify(req.body));
 
  Measurement.create({
    name: req.body.name,
    servingSize: req.body
  }). then(measurement => {
    res.status(200).send(measurement);
  }).catch( err => {
    res.status(500).send({ message: err.message });
  })

};

exports.getAllMeasurements = (req, res) => {
  Measurement.findAll({
    order: [['id', 'ASC']]
  }).then(m => {
    res.status(200).send(m);
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });
};

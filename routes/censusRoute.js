const express = require('express');
const router = express.Router();

const censusAPI = require('../client/censusApi');

router.get('/data/getData', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let variableString = req.body;
  let stateId = req.query.stateId;
  let promise = censusAPI.getData(year, dataSet, variableString, stateId);

  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/data/getDataWithLabels', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let variableString = req.body;
  let stateId = req.query.stateId;
  let promise = censusAPI.getDataWithLabels(year, dataSet, variableString, stateId);

  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getVariables', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getVariables(year, dataSet);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

module.exports = router;

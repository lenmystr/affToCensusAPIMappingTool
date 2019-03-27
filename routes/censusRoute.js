const express = require('express');
const router = express.Router();

const censusAPI = require('../client/censusApi');

router.get('/getTableData', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getTableData(year, dataSet, variableString, stateId);

  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getProfileData', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getProfileData(year, dataSet, variableString, stateId);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getSubjectData', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getSubjectData(year, dataSet, variableString, stateId);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getSubjectVariables', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getSubjectVariables(year, dataSet);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getProfileVariables', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getProfileVariables(year, dataSet);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getTableVariables', function(req, res) {
  let year = req.query.year;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getTableVariables(year, dataSet);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

module.exports = router;

const express = require('express');
const router = express.Router();

const censusAPI = require('../client/censusApi');
const affApi = require('../client/affApi');
const mappingService = require('../service/mappingService');

router.get('/getMappings', function (req, res) {
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let tableId = req.query.tableId;
  let geoId = req.query.geoId;

  let promise = mappingService.buildmappingtable(tableId, program, dataSet, geoId);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getAFFColumns', function(req, res) {
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let tableId = req.query.tableId;
  let geoId = req.query.geoId;
  let promise = affApi.getHeadersInTable(program, dataSet, tableId, geoId);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

router.get('/getTableData', function(req, res) {
  let year = req.query.year;
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getTableData(year, program, dataSet, variableString, stateId);

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
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getProfileData(year, program, dataSet, variableString, stateId);
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
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let variableString = req.query.variableString;
  let stateId = req.query.stateId;
  let promise = censusAPI.getSubjectData(year, program, dataSet, variableString, stateId);
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
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getSubjectVariables(year, program, dataSet);
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
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getProfileVariables(year, program, dataSet);
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
  let program = req.query.program;
  let dataSet = req.query.dataSet;
  let promise = censusAPI.getTableVariables(year, program, dataSet);
  promise.then(function (successResponse) {
    res.status(successResponse.status);
    res.json(successResponse.data)

  }).catch(function (failResponse) {
    res.status(500);
    res.json({ message: failResponse.message });

  })
});

module.exports = router;

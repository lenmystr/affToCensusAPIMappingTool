const express = require('express');
const router = express.Router();

const affApi = require('../client/affApi');

router.get('/getColumns', function(req, res) {
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

module.exports = router;

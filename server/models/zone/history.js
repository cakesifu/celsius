var Datastore = require("../../services/datastore"),
    moment = require("moment"),
    datastore = Datastore({model: "zone-history-0"}),

    UNIT_SENSOR = "s",
    UNIT_HEATER = "h";

// TODO add indexes if worried at all about performance
// TODO bypass the generic datastore since this is going to be using it's own specialized storage
function ZoneHistory(zone) {
  var instance = {};

  function addSensorRecord(value) {
     datastore.insert({
       zoneId: zone._id,
       unit: UNIT_SENSOR,
       value: value,
       time: moment().unix()
     });
  }

  function getSensorRecords(options, callback) {
    var filters = {
          unit: UNIT_SENSOR,
          zoneId: zone._id,
        };

    datastore.filter(filters, function(err, records) {
      if (err) {
        return callback(err);
      }

      callback(undefined, parseRecords(records));
    });
  }

  function parseRecords(records) {
    var dates = [],
        values = [];
    records.forEach(function(r) {
      dates.push(r.time);
      values.push(r.value);
    });

    return {
      dates: dates,
      values: values
    };
  }

  instance.addSensorRecord = addSensorRecord;
  instance.getSensorRecords = getSensorRecords;

  return Object.freeze(instance);
}

module.exports = ZoneHistory;

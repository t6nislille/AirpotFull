const airportsController = require("../controllers/AirportsController.js")
const flightsController = require("../controllers/FlightsController.js")
const airportFlightController = require("../controllers/airportFlightController.js")
const airportFuelController = require("../controllers/airportFuelController.js")

module.exports = (app) => {
    app.route("/airports")
         .get(airportsController.getAll)
         .post(airportsController.createNew)
    app.route("/airports/id/:id")
         .get(airportsController.getById)
         .put(airportsController.updateById)
         .delete(airportsController.deleteById)
    app.route("/airports/iata/:IATA_code")
         .get(airportsController.getByIATA_code)
    app.route("/airports/icao/:ICAO_code")
         .get(airportsController.getByICAO_code)
    app.route("/flights")
        .get(flightsController.getAll)
        .post(flightsController.createNew)
    app.route("/flights/:id")
        .get(flightsController.getById)
        .put(flightsController.updateById)
        .delete(flightsController.deleteById)
    app.route("/airportflight")
        .get(airportFlightController.getAll)
    app.route("/airportflight/:name")
        .get(airportFlightController.getByName)
    app.route("/fuelings")
        .get(airportFuelController.getAll)
        .post(airportFuelController.createNew)
    app.route("/fuelings/id/:id")
        .get(airportFuelController.getById)
        .put(airportFuelController.updateById)
        .delete(airportFuelController.deleteById)
}
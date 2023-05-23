const {db} = require("../db")
const { updateAirportFlight } = require('../controllers/airportFlightController');
const AirportFlight = db.airportflights
const Flight = db.flights

exports.getAll = async(req, res)=>{
    const flights = await Flight.findAll({attributes:["id","flight_nr", "departure_airport", "arrival_airport", "info"]})
    res.send(flights)
}

exports.getById = async (req, res) => {
    const flight = await Flight.findByPk(req.params.id)
    if (flight === null) {
      res.status(404).send({ error: "Flight not found" })
      return
    }
    res.send(flight)
  }
  
  exports.createNew = async (req, res) => {
    let flight
    try {
        flight = await Flight.create(req.body)
        await updateAirportFlight(flight)
    } catch (error) {
      if (error instanceof db.Sequelize.ValidationError) {
        res.status(400).send({ error: error.errors.map((item) => item.message) })
      } else {
        console.log("FlightsCreate: ", error)
        res
          .status(500)
          .send({ error: "Something went wrong on our side. Sorry" })
      }
      return
    }
    res
      .status(201)
      .location(`${getBaseUrl(req)}/flights/${flight.id}`)
      .json(flight)
  }
  
  exports.deleteById = async (req, res) => {
    let result
    try {
      const flight = await Flight.findByPk(req.params.id)
      if (!flight) {
        res.status(404).send({ error: "Flight not found" })
        return
      }
      await AirportFlight.destroy({ where: { flightId: req.params.id } })

      result = await Flight.destroy({ where: { id: req.params.id } })
    } catch (error) {
      console.log("FlightsDelete: ",error)
      res.status(500).send({ error: "Something went wrong on our side. Sorry" })
      return
    }
    
    res.status(204).send()
  }
  
  exports.updateById = async (req,res) => {
    let result
    delete req.body.id
    try {
      result = await Flight.update(req.body,{ where: { id: req.params.id } })
      if (result[0] === 0) {
          res.status(404).send({ error: "Flight not found" })
          return
      }
      await AirportFlight.destroy({ where: { flightId: req.params.id } })
      const flight = await Flight.findByPk(req.params.id)
      await updateAirportFlight(flight)
      res.status(200)
          .location(`${getBaseUrl(req)}/flights/${flight.id}`)
          .json(flight)
    } catch (error) {
      console.log("FlightsUpdate: ",error)
      if (error instanceof db.Sequelize.ValidationError) {
          res.status(400).send({ error: error.errors.map((item) => item.message) })
          return
      }
      res.status(500).send({ error: "Something went wrong on our side. Sorry" })
    }  
  }
  
  getBaseUrl = (request) => {
    return (
      (request.connection && request.connection.encrypted ? "https" : "http") +
      `://${request.headers.host}`
    )
  }
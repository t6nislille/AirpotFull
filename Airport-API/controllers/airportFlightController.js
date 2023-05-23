const { db } = require("../db")
const Flight = db.flights
const Airport = db.airports
const AirportFlight = db.airportflights
const Sequelize = require("sequelize")

AirportFlight.belongsTo(Airport, { foreignKey: 'airportId' })
AirportFlight.belongsTo(Flight, { foreignKey: 'flightId' })

exports.getAll = async (req, res) => {
    try {
        const airports = await Airport.findAll()
        const flights = await Flight.findAll()
        const airportFlightPromises = []

        for (const airport of airports) {
            for (const flight of flights) {
                if (airport.IATA_code === flight.departure_airport) {
                    airportFlightPromises.push(AirportFlight.findOrCreate({
                        where: {
                            airportId: airport.id,
                            flightId: flight.id
                        },
                        defaults: {
                            airportId: airport.id,
                            flightId: flight.id
                        }
                    }))
                }
            }
        }

        await Promise.all(airportFlightPromises)

        const airportFlights = await AirportFlight.findAll({
            include: { all: true },
            logging: console.log
        })

        const result = airportFlights.map((af) => {
            return {
                "name": af.airport.name,
                "flight_nr": af.flight.flight_nr
            }
        })

        res.send(result)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Something went wrong on our side. Sorry" })
    }
}

exports.getByName = async (req, res) => {
    try {
      const airportName = req.params.name
      const airport = await Airport.findOne({ where: { name: airportName } })
      
      if (!airport) {
        res.status(404).send({ message: "Airport not found" })
        return
      }
  
      const airportFlights = await AirportFlight.findAll({
        include: { model: Flight },
        where: { airportId: airport.id },
      })
  
      const result = airportFlights.map((af) => ({
        "name": airportName,
        "flight_nr": af.flight.flight_nr
      }))
  
      res.send(result)
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: "Something went wrong on our side. Sorry" })
    }
  }

  exports.updateAirportFlight = async function(newEntry) {
    const airports = await Airport.findAll()
    const flights = await Flight.findAll()
    const airportFlightPromises = []

    if (newEntry instanceof Airport) {
        for (const flight of flights) {
            if (newEntry.IATA_code === flight.departure_airport) {
                airportFlightPromises.push(AirportFlight.findOrCreate({
                    where: {
                        airportId: newEntry.id,
                        flightId: flight.id
                    },
                    defaults: {
                        airportId: newEntry.id,
                        flightId: flight.id
                    }
                }))
            }
        }
    } else if (newEntry instanceof Flight) {
        for (const airport of airports) {
            if (airport.IATA_code === newEntry.departure_airport) {
                airportFlightPromises.push(AirportFlight.findOrCreate({
                    where: {
                        airportId: airport.id,
                        flightId: newEntry.id
                    },
                    defaults: {
                        airportId: airport.id,
                        flightId: newEntry.id
                    }
                }))
            }
        }
    }

    await Promise.all(airportFlightPromises)
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
      console.error("FlightsCreate: ", error)
      res.status(500).send({ error: "Something went wrong on our side. Sorry" })
    }
  }
}

getBaseUrl = (request) => {
    return (
      (request.connection && request.connection.encrypted ? "https" : "http") +
      `://${request.headers.host}`
    )
}



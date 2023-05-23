const {db} = require("../db")
const FlightModel = require("../models/Fuel.model")
const Fueling = db.fuelings


exports.getAll = async(req, res)=>{
    const fuelings = await Fueling.findAll({attributes:["id","name", "location","fueltype", "IATA_code", "ICAO_code", "Info"]})
    res.send(fuelings)
}

exports.getById = async (req, res) => {
    const fueling = await Fueling.findByPk(req.params.id)
    if (fueling === null) {
      res.status(404).send({ error: "Fueling not found" })
      return
    }
    res.send(fueling)
  }

  exports.getByIATA_code = async (req, res) => {
    const fueling = await Fueling.findOne({
      where: {
        IATA_code: req.params.IATA_code
      },
      attributes: ["id","name","fueltype" ,"IATA_code", "ICAO_code"]
    })
    if (fueling === null) {
      res.status(404).send({ error: "Airport code not found" })
      return
    }
    res.send(fueling)
  }

  exports.getByICAO_code = async (req, res) => {
    const fueling = await Fueling.findOne({
    where: {
      ICAO_code: req.params.ICAO_code
    },
    attributes: ["id","name","fueltype", "ICAO_code", "IATA_code"]
  })
  if (fueling === null) {
    res.status(404).send({ error: "Airport code not found" })
    return
  }
  res.send(fueling)
  }
  
  exports.createNew = async (req, res) => {
    let fueling
    try {
        fueling = await Fueling.create(req.body)
    } catch (error) {
      if (error instanceof db.Sequelize.ValidationError) {
        res.status(400).send({ error: error.errors.map((item) => item.message) })
      } else {
        console.log("FuelingsCreate: ", error)
        res
          .status(500)
          .send({ error: "Something went wrong on our side. Sorry" })
      }
      return
    }
    res
      .status(201)
      .location(`${getBaseUrl(req)}/fuelings/${fueling.id}`)
      .json(fueling)
  }
  
  exports.deleteById = async (req, res) => {
    let result
    try {
      const fueling = await Fueling.findByPk(req.params.id)
      if (!fueling) {
        res.status(404).send({ error: "Fueling not found" })
        return
      }
      
      result = await Fueling.destroy({ where: { id: req.params.id } })
    } catch (error) {
      console.log("AFuelingsDelete: ",error)
      res.status(500).send({ error: "Something went wrong on our side. Sorry" })
      return
    }
    
    res.status(204).send()
  }
  
  exports.updateById = async (req,res) => {
    let result
    delete req.body.id
    try {
      result = await Fueling.update(req.body,{ where: { id: req.params.id } })
      if (result[0] === 0) {
          res.status(404).send({ error: "Fueling not found" })
          return
      }
      
      
      const fueling = await Fueling.findByPk(req.params.id)


      res.status(200)
          .location(`${getBaseUrl(req)}/fuelings/${fueling.id}`)
          .json(fueling)
  } catch (error) {
      console.log("FuelingsUpdate: ",error)
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
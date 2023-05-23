<template>
  <div>
    <form @submit.prevent="submitForm">
      <h3 class="codetext" for="code">Enter IATA or ICAO code:</h3>
      <input type="text2" id="code" v-model="code">
      <button class="search-button" type="submit">Search</button>
    </form>
    <div v-if="result.IATA_code || result.ICAO_code">
      <h3 v-if="result.IATA_code">IATA code: {{ result.IATA_code }}</h3>
      <h3 v-if="result.ICAO_code">ICAO code: {{ result.ICAO_code }}</h3>
      <button class="show-button" v-if="result.id != 0" @click="showDetails">Show Details</button>
      <button class="show-button" v-if="result.id != 0" @click="showFlights()">Show Flights</button>
    </div>
    <airport-details :airportDetailId="airportDetailId" @close="closeDetails"></airport-details>
    <modal :show="showFlightsModal" @close="showFlightsModal = false">
      <template #header>
        <h3>Flights from this Airport</h3>
      </template>
      <template #body>
        <ul>
          <li v-for="flight in flights" :key="flight">{{ flight }}</li>
        </ul>
      </template>
    </modal>
  </div>
</template>

<script>
import axios from 'axios';
import AirportDetails from '../../components/AirportDetails.vue';
import Modal from '../../components/Modal.vue';

export default {
components: {
  AirportDetails,
  Modal
},
data() {
  return {
    code: '',
    airportDetailId: 0,
    flights: [],
    showFlightsModal: false,
    result: {
      id: 0,
      IATA_code: '',
      ICAO_code: '',
      name: '',
    },
  };
},
methods: {
  async submitForm() {
    try {
      let response;
      if (this.code.length === 3) {
        response = await axios.get(`http://localhost:8090/airports/iata/${this.code}`);
        this.result.ICAO_code = response.data.ICAO_code;
        this.result.IATA_code = '';
        this.result.name = response.data.name;
      } else if (this.code.length === 4) {
        response = await axios.get(`http://localhost:8090/airports/icao/${this.code}`);
        this.result.IATA_code = response.data.IATA_code;
        this.result.ICAO_code = '';
        this.result.name = response.data.name;
      } else {
        alert("Please enter a valid IATA or ICAO code.");
      }
      this.result.id = response.data.id;
    } catch (error) {
      console.error(error);
    }
  },
  showDetails() {
    this.airportDetailId = this.result.id;
  },
  closeDetails() {
    this.airportDetailId = 0;
  },
  async showFlights() {
    console.log('showFlights function called');
    try {
      this.showFlightsModal = true;
      const response = await axios.get(`http://localhost:8090/airportflight/${encodeURIComponent(this.result.name)}`);
      this.flights = response.data.map(airportFlight => airportFlight.flight_nr);
      if (this.flights.length > 0) {
        this.showFlightsModal = true;
      } else {
        alert("No flights found for this airport.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the flights.");
    }
  },
},
};
</script>


<style>

* {
    box-sizing: border-box;
    }
    
  .search-button {
    background-color: #24bb63;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 12px;
    margin-top: 5px;
  }

  .search-button:hover {
    background-color: #49be4e;
  }

  .show-button {
    background-color: #24bb63;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 5px;
  }

  .show-button:hover {
    background-color: #49be4e;
  }

  .codetext{
    margin-top: 120px;
  }

  input[type="text2"],
  select,
  textarea {
        width: 130px;
        padding: 9px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
        margin-bottom: 5px;
        margin-top: 5px;
    }
    
  label {
        padding: 12px 12px 12px 0;
        display: inline-block;
    }
    
  input[type="button"],
  input[type="submit"] {
        background-color: #24bb63;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        float: right;
    }
    
  input[type="button"]:hover,
  input[type="submit"]:hover {
        background-color: #45a049;
    }
    
  input[type="button"] {
        margin-right: 5px;
    }
    
  .container {
        border-radius: 5px;
        background-color: #f2f2f2;
        padding: 20px;
    }
    
  .col-25 {
        float: left;
        width: 25%;
        margin-top: 6px;
        color: black;
    }
    
  .col-75 {
        float: left;
        width: 75%;
        margin-top: 6px;
    }
    
  .row::after {
        content: "";
        display: table;
        clear: both;
    }
    
  @media screen and (max-width: 600px) {
        .col-25,
        .col-75,
        input[type="submit"] {
        width: 100%;
        margin-top: 0;
        }
    }
</style>

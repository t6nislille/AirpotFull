<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal :show="airportDetailId !== 0" @close="$emit('close')">
      <template #header>
        <h3>Airport Details</h3>
      </template>
      <template #body>
        <b>Name: </b>{{ currentAirport.name }}<br />
        <b>Location: </b>{{ currentAirport.location }}<br />
        <b>IATA code: </b>{{ currentAirport.IATA_code }}<br />
        <b>ICAO code: </b>{{ currentAirport.ICAO_code }}<br />
        <b>Departing flights:</b>
        <ul>
          <li v-for="flight in flights" :key="flight">{{ flight }}</li>
        </ul>
        <b>Info: </b>{{ currentAirport.info }}<br />
      </template>
    </modal>
  </Teleport>
</template>

<script>
import Modal from "./Modal.vue";
import axios from "axios";

export default {
  components: {
    Modal,
  },
  props: {
    airportDetailId: {
      type: Number,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      currentAirport: {
        id: 0,
        name: "",
        location: "",
        IATA_code: "",
        ICAO_code: "",
        info: "",
      },
      flights: [],
    };
  },
  watch: {
    airportDetailId(newId) {
      if (newId !== 0) {
        this.getDetails();
      }
    },
  },
  methods: {
    async getDetails() {
      try {
        const response = await axios.get(
          `http://localhost:8090/airports/id/${this.airportDetailId}`
        );
        this.currentAirport = response.data;
        await this.showFlights();
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching the airport details.");
      }
    },
    async showFlights() {
      console.log("showFlights function called");
      try {
        const response = await axios.get(
          `http://localhost:8090/airportflight/${encodeURIComponent(
            this.currentAirport.name
          )}`
        );
        this.flights = response.data.map(
          (airportFlight) => airportFlight.flight_nr
        );

      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching the flights.");
      }
    },
  },
};
</script>
  <style>
  .modal-container {
    width: 700px;
  }
  </style>
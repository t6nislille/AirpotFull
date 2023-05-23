<template>
    <div class="container">
      <div v-if="error">
        <span v-for="(message, index) in error" :key="index">
          {{ message }} <br />
        </span>
      </div>
      <form @submit.prevent="formSubmitHandler">
        <div class="row">
          <div class="col-25">
            <label for="airport">Airport</label>
          </div>
          <div class="col-75">
            <select id="airport" v-model="airportId" required>
              <option v-for="item in airports" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-25">
            <label for="flight">Flight</label>
          </div>
          <div class="col-75">
            <select id="flight" v-model="flightId" required>
              <option v-for="item in flights" :key="item.id" :value="item.id">
                {{ item.flight_nr }}
              </option>
            </select>
          </div>
        </div>
        <br />
        <div class="row">
          <input type="submit" value="Add Flight" />
        </div>
      </form>
    </div>
  </template>
  <script>
  const API_URL = "http://localhost:8090/airportflight";
  export default {
    data() {
      return {
        error: "",
        airports: [],
        airportId: 0,
        flights: [],
        flightId: 0,
      };
    },
    async created() {
      this.airports = await (await fetch("http://localhost:8090/airports")).json();
      this.flights = await (await fetch("http://localhost:8090/flights")).json();
    },
    methods: {
      formSubmitHandler() {
        const newFlight = {
            airportId: this.airportId,
            flightId: this.flightId,
        };
        fetch(API_URL, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFlight),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.error) {
              this.$router.push("/flights");
              return;
            }
            this.error = data.error;
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  };
  </script>
  
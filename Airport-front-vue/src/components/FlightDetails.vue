<template>
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <modal :show="flightDetailId != 0" @close="$emit('close')">
        <template #header>
          <h3>Flight Details</h3>
        </template>
        <template #body>
            <b>Flight number: </b>{{ currentFlight.flight_nr }}<br />
            <b>Departure airport: </b>{{ currentFlight.departure_airport }}<br />
            <b>Arrival airport: </b>{{ currentFlight.arrival_airport }}<br />
            <b>Info: </b>{{ currentFlight.info }}<br />
        </template>
      </modal>
    </Teleport>
  </template>
  
  <script>
  import Modal from "./Modal.vue";
  export default {
    components: {
      Modal,
    },
    props: {
        flightDetailId: {
        type: Number,
        required: true,
      },
    },
    emits: ["close"],
    data() {
      return {
        currentFlight: {
            id: 0,
            flight_nr: "",
            departure_airport: "",
            arrival_airport: "",
            info: "",
        },
      };
    },
    beforeUpdate() {
      if (this.flightDetailId == 0) return;
      this.getDetails();
    },
    methods: {
      async getDetails() {
        this.currentFlight = await (
          await fetch(`http://localhost:8090/flights/${this.flightDetailId}`)
        ).json();
      },
    },
  };
  </script>
  <style>
  .modal-container {
    width: 700px;
  }
  </style>
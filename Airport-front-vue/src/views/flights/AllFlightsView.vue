<template>
  <div>
    <table-template
      caption="All Flights"
      :items="flights"
      :showControls="true"
      @show="flightDetailId = $event.id"
      @delete="flightToDelete = $event"
      @update="flightToUpdate = { ...$event }"
    >
    </table-template>
    <router-link class="addflighttext" to="/createflight">Add new flight</router-link>
  </div>
  <flight-details
    :flightDetailId="flightDetailId"
    @close="flightDetailId = 0"
  ></flight-details>
  <modal :show="JSON.stringify(flightToDelete) !== '{}'">
    <template #header>
      <h3>Delete Flights</h3>
    </template>
    <template #body>
      <p>Are you sure about deleting the flight?</p>
    </template>
    <template #footer>
      <button class="button button-update" @click="deleteFlight()">Yes</button>
      <button class="button button-cancel" @click="flightToDelete = {}">
        No
      </button>
    </template>
  </modal>
  <modal :show="flightToUpdate !== null">
    <template #header>
      <h3>Update Flight</h3>
    </template>
    <template #body>
      <form @submit.prevent="updateFlight">
        <div>
          <label>
            Flight number:
            <input type="text" v-model="flightToUpdate.flight_nr" required>
          </label>
        </div>
        <div>
          <label>
            Departure airport:
            <input type="text" v-model="flightToUpdate.departure_airport" required>
          </label>
        </div>
        <div>
          <label>
            Arrival airport:
            <input type="text" v-model="flightToUpdate.arrival_airport" required>
          </label>
        </div>
        <div>
          <label>
            Info:
            <input type="text" v-model="flightToUpdate.info">
          </label>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="button-container">
        <button class="button button-update" @click="updateFlight">Update</button>
        <button class="button button-cancel" @click="flightToUpdate = null">Cancel</button>
      </div>
    </template>
  </modal>
</template>
  
<script>
  import TableTemplate from "../../components/Table.vue";
  import FlightDetails from "../../components/FlightDetails.vue";
  import Modal from "../../components/Modal.vue";
  import { RouterLink } from "vue-router";
  export default {
    components: {
      TableTemplate,
      FlightDetails,
      RouterLink,
      Modal,
    },
    data() {
      return {
        flights: [],
        flightDetailId: 0,
        flightToDelete: {},
        flightToUpdate: null,
      };
    },
    async created() {
      this.flights = await (await fetch("http://localhost:8090/flights")).json();
    },
    methods: {
      async deleteFlight() {
        fetch("http://localhost:8090/flights/" + this.flightToDelete.id, {
          method: "delete",
        }).then(async (response) => {
          if (response.status == 204) {
            this.flights.splice(this.flights.indexOf(this.flightToDelete), 1);
            this.flightToDelete = {};
          } else {
            const data = await response.json();
            console.log("DELETE: ", data);
          }
        });
      },
      updateFlight() {
      fetch(`http://localhost:8090/flights/${this.flightToUpdate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'},
          body: JSON.stringify(this.flightToUpdate)
          }).then(async (response) => {
        if (response.ok) {
          const index = this.flights.findIndex(flight => flight.id === this.flightToUpdate.id);
          this.flights.splice(index, 1, this.flightToUpdate);
          this.flightToUpdate = null;
        } else {
          const data = await response.json();
          console.log('UPDATE: ', data);
        }
     });
   },
},
};
</script>
  
<style>
* {
  box-sizing: border-box;
}

.addflighttext{
    margin-left: 89px;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
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

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.button {
  background-color: #24bb63;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
  flex-shrink: 0;
}

.button-update {
  background-color: #24bb63;
}

.button-cancel {
  background-color: #ff6666;
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

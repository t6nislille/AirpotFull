<template>
  <div>
    <table-template
      caption="All Airports"
      :items="airports"
      :showControls="true"
      @show="airportDetailId = $event.id"
      @delete="airportToDelete = $event"
      @update="airportToUpdate = { ...$event }">
    </table-template>
    <router-link class="addairporttext" to="/createAirport">Add new Airport</router-link>
  </div>
  <airport-details
    :airportDetailId="airportDetailId"
    @close="airportDetailId = 0"
  ></airport-details>
  <modal :show="JSON.stringify(airportToDelete) !== '{}'">
    <template #header>
      <h3>Delete Airport</h3>
    </template>
    <template #body>
      <p>Are you sure about deleting the airport?</p>
    </template>
    <template #footer>
      <button class="button button-update" @click="deleteAirport()">Yes</button>
      <button class="button button-cancel" @click="airportToDelete = {}">
        No
      </button>
    </template>
  </modal>
  <modal :show="airportToUpdate !== null">
    <template #header>
      <h3>Update Airport</h3>
    </template>
    <template #body>
      <form @submit.prevent="updateAirport">
  <div>
    <label>
      Name:
      <input type="text" v-model="airportToUpdate.name" required>
    </label>
  </div>
  <div>
    <label>
      Location:
      <input type="text" v-model="airportToUpdate.location" required>
    </label>
  </div>
  <div>
    <label>
      IATA Code:
      <input type="text" v-model="airportToUpdate.IATA_code" required>
    </label>
  </div>
  <div>
    <label>
      ICAO Code:
      <input type="text" v-model="airportToUpdate.ICAO_code" required>
    </label>
  </div>
  <div>
    <label>
      Info:
      <input type="text" v-model="airportToUpdate.info">
    </label>
  </div>
</form>
    </template>
    <template #footer>
      <div class="button-container">
        <button class="button button-update" @click="updateAirport">Update</button>
        <button class="button button-cancel" @click="airportToUpdate = null">Cancel</button>
    </div>
    </template>
  </modal>
</template>

<script>
import TableTemplate from "../../components/Table.vue";
import AirportDetails from "../../components/AirportDetails.vue";
import Modal from "../../components/Modal.vue";
import { RouterLink } from "vue-router";
export default {
  components: {
    TableTemplate,
    AirportDetails,
    RouterLink,
    Modal,
  },
  data() {
    return {
      airports: [],
      airportDetailId: 0,
      airportToDelete: {},
      airportToUpdate: null,
    };
  },
  async created() {
    this.airports = await (await fetch("http://localhost:8090/airports/")).json();
  },
  methods: {
    async deleteAirport() {
      fetch("http://localhost:8090/airports/id/" + this.airportToDelete.id, {
        method: "delete",
      }).then(async (response) => {
        if (response.status == 204) {
          this.airports.splice(this.airports.indexOf(this.airportToDelete), 1);
          this.airportToDelete = {};
        } else {
          const data = await response.json();
          console.log("DELETE: ", data);
        }
      });
    },
    updateAirport() {
      fetch(`http://localhost:8090/airports/id/${this.airportToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.airportToUpdate)
      }).then(async (response) => {
        if (response.ok) {
            const index = this.airports.findIndex(airport => airport.id === this.airportToUpdate.id);
            this.airports[index].id = this.airportToUpdate.id;
            this.airports[index].name = this.airportToUpdate.name;
            this.airportToUpdate = null;
          } else {
          const data = await response.json();
          console.log('UPDATE: ', data);
        }
      });
    }
  },
};
</script>


<style>
* {
  box-sizing: border-box;
}

.addairporttext{
    margin-left: 115px;
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

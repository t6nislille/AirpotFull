<template>
    <div>
      <table-template
        caption="All Fuelings"
        :items="fuelings"
        :showControls="true"
        @show="fuelingDetailId = $event.id"
        @delete="fuelingToDelete = $event"
        @update="fuelingToUpdate = { ...$event }">
      </table-template>
      <router-link class="addfuelingttext" to="/createFueling">Add new Fueling</router-link>
    </div>
    <fueling-details
      :fuelingDetailId="fuelingDetailId"
      @close="fuelingtDetailId = 0"
    ></fueling-details>
    <modal :show="JSON.stringify(fuelingToDelete) !== '{}'">
      <template #header>
        <h3>Delete Fueling</h3>
      </template>
      <template #body>
        <p>Are you sure about deleting the fueling?</p>
      </template>
      <template #footer>
        <button class="button button-update" @click="deleteFueling()">Yes</button>
        <button class="button button-cancel" @click="fuelingToDelete = {}">
          No
        </button>
      </template>
    </modal>
    <modal :show="fuelingToUpdate !== null">
      <template #header>
        <h3>Update Fueling</h3>
      </template>
      <template #body>
        <form @submit.prevent="updateFueling">
    <div>
      <label>
        Name:
        <input type="text" v-model="fuelingToUpdate.name" required>
      </label>
    </div>
    <div>
      <label>
        Location:
        <input type="text" v-model="fuelingToUpdate.location" required>
      </label>
    </div>
    <div>
      <label>
        Fuel Type:
        <input type="text" v-model="fuelingToUpdate.fuelType" required>
      </label>
    </div>
    <div>
      <label>
        IATA Code:
        <input type="text" v-model="fuelingToUpdate.IATA_code" required>
      </label>
    </div>
    <div>
      <label>
        ICAO Code:
        <input type="text" v-model="fuelingToUpdate.ICAO_code" required>
      </label>
    </div>
    <div>
      <label>
        Info:
        <input type="text" v-model="fuelingToUpdate.info">
      </label>
    </div>
  </form>
      </template>
      <template #footer>
        <div class="button-container">
          <button class="button button-update" @click="updateFueling">Update</button>
          <button class="button button-cancel" @click="fuelingToUpdate = null">Cancel</button>
      </div>
      </template>
    </modal>
  </template>
  
  <script>
  import TableTemplate from "../../components/Table.vue";
  import FuelingDetails from "../../components/FuelingDetails.vue";
  import Modal from "../../components/Modal.vue";
  import { RouterLink } from "vue-router";
  export default {
    components: {
      TableTemplate,
      FuelingDetails,
      RouterLink,
      Modal,
    },
    data() {
      return {
        fuelings: [],
        fuelingDetailId: 0,
        fuelingToDelete: {},
        fuelingToUpdate: null,
      };
    },
    async created() {
      this.fuelings = await (await fetch("http://localhost:8090/fuelings/")).json();
    },
    methods: {
      async deleteFueling() {
        fetch("http://localhost:8090/fuelings/id/" + this.fuelingToDelete.id, {
          method: "delete",
        }).then(async (response) => {
          if (response.status == 204) {
            this.fuelings.splice(this.fuelings.indexOf(this.fuelingToDelete), 1);
            this.fuelingsToDelete = {};
          } else {
            const data = await response.json();
            console.log("DELETE: ", data);
          }
        });
      },
      updateFueling() {
        fetch(`http://localhost:8090/fuelings/id/${this.fuelingToUpdate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.fuelingToUpdate)
        }).then(async (response) => {
          if (response.ok) {
              const index = this.fuelings.findIndex(fueling => fueling.id === this.fuelingToUpdate.id);
              this.fuelings[index].id = this.fuelingToUpdate.id;
              this.fuelings[index].name = this.fuelingToUpdate.name;
              this.fuelingToUpdate = null;
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
  
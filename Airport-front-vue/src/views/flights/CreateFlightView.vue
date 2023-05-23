<template>
    <div class="container">
        <div v-if="error">{{ error }}</div>
        <form @submit.prevent="formSubmitHandler">
            <div class="row">
                <div class="col-25">
                    <label for="flight_nr">Flight Nr.</label>
                </div>
                <div class="col-75">
                    <input id="flight_nr" type="text" placeholder="Ex. SK999" v-model="flight_nr" required />
                </div>
            </div>
    
            <div class="row">
                <div class="col-25">
                    <label for="departure_airport">Departure Airport</label>
                </div>
                <div class="col-75">
                    <input id="departure_airport" type="text" placeholder="Ex. Copenhagen Kastrup" v-model="departure_airport" required />
                </div>
            </div>
            
            <div class="row">
                <div class="col-25">
                    <label for="arrival_airport">Arrival Airport</label>
                </div>
                <div class="col-75">
                    <input id="arrival_airport" type="text" placeholder="Ex. Stockholm Arlanda" v-model="arrival_airport" required />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label for="info">Info</label>
                </div>
                <div class="col-75">
                    <input id="info" type="text" placeholder="Flight info" v-model="info" required />
                </div>
            </div>

            <br>
            <div class="row">
                <input type="submit" value="Create" />
                <input type="button" value="Back" class="back" @click="goBack">
            </div>
        </form>
    </div>
</template>
  
<script>
  const API_URL = "http://localhost:8090/flights"
  
  export default {
    data() {
      return {
        error: "",
        flight_nr: "",
        departure_airport: "",
        arrival_airport: "",
        info: "",
      };
    },
    methods: {
      formSubmitHandler() {
          this.error = null
          const newFlight = {
              flight_nr: this.flight_nr,
              departure_airport: this.departure_airport,
              arrival_airport: this.arrival_airport,
              info: this.info
          }
          fetch(API_URL, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newFlight)
          })
          .then(response => response.json())
          .then(data => {
              if (!data.error) {
                  this.$router.push("/flights")
                  return
              }
              this.error = data.error
          })
          .catch(error => {
              console.log(error)
          })
        },
        goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style>
    * {
        box-sizing: border-box;
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
    
    @media screen and (max-width: 600px) {
        .col-25,
        .col-75,
        input[type="submit"] {
        width: 100%;
        margin-top: 0;
        }
    }
</style>

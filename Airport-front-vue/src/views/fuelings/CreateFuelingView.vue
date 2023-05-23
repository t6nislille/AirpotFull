<template>
    <div class="container">
        <div v-if="error">{{ error }}</div>
        <form @submit.prevent="formSubmitHandler">
            <div class="row">
                <div class="col-25">
                    <label for="name">Name</label>
                </div>
                <div class="col-75">
                    <input id="name" type="text" placeholder="ex. TotalEnergies" v-model="name" required />
                </div>
            </div>
    
            <div class="row">
                <div class="col-25">
                    <label for="location">Location</label>
                </div>
                <div class="col-75">
                    <input id="location" type="text" placeholder="ex. Tallinn Airport" v-model="location" required />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label for="location">Fuel type</label>
                </div>
                <div class="col-75">
                    <input id="fuelType" type="text" placeholder="ex. JET A-1" v-model="fuelType" required />
                </div>
            </div>
            
            <div class="row">
                <div class="col-25">
                    <label for="IATA_code">IATA code</label>
                </div>
                <div class="col-75">
                    <input id="IATA_code" type="text" placeholder="3 letter code ex. TLL" v-model="IATA_code" required />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label for="ICAO_code">ICAO code</label>
                </div>
                <div class="col-75">
                    <input id="ICAO_code" type="text" placeholder="4 letter code ex. EETN" v-model="ICAO_code" required />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label for="info">Info</label>
                </div>
                <div class="col-75">
                    <input id="info" type="text" placeholder="Info about the refueler" v-model="info" />
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
  const API_URL = "http://localhost:8090/fuelings"
  
  export default {
    data() {
      return {
        error: "",
        name: "",
        location: "",
        fuelType: "",
        IATA_code: "",
        ICAO_code: "",
        info: "",
      };
    },
    methods: {
        
      formSubmitHandler() {
          this.error = null
          const newFueling = {
              name: this.name,
              location: this.location,
              fuelType: this.fuelType,
              IATA_code: this.IATA_code,
              ICAO_code: this.ICAO_code,
              info: this.info
          }
          fetch(API_URL, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newFueling)
          })
          .then(response => response.json())
          .then(data => {
              if (!data.error) {
                  this.$router.push("/fuelings")
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
    
    input[type="text"],
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
    
    @media screen and (max-width: 600px) {
        .col-25,
        .col-75,
        input[type="submit"] {
        width: 100%;
        margin-top: 0;
        }
    }
</style>

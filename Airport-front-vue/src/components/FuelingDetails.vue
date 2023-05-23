<template>
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <modal :show="fuelingDetailId != 0" @close="$emit('close')">
        <template #header>
          <h3>Fueling Details</h3>
        </template>
        <template #body>
            <b>Name: </b>{{ currentFueling.name }}<br />
        <b>Location: </b>{{ currentFueling.location }}<br />
        <b>Fuel type: </b>{{ currentFueling.fuelType }}<br />
        <b>Info: </b>{{ currentFueling.info }}<br />
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
        fuelingDetailId: {
        type: Number,
        required: true,
      },
    },
    emits: ["close"],
    data() {
      return {
        currentFueling: {
        id: 0,
        name: "",
        location: "",
        fuelType: "",
        indo: "",
        },
      };
    },
    beforeUpdate() {
      if (this.fuelingDetailId == 0) return;
      this.getDetails();
    },
    methods: {
      async getDetails() {
        this.currentFueling = await (
          await fetch(`http://localhost:8090/fuelings/id/${this.fuelingDetailId}`)
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
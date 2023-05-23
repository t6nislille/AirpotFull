<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header >
    <img
      alt="AIrport logo"
      class="logo"
      src="@/assets/Airport-PNG.png"
      width="300"
      height="300"
    />

    <div class="wrapper">
      <nav>
        <RouterLink to="/airportCodeConversion">Airport Code Conversion</RouterLink>
        <RouterLink to="/airports">All Airports</RouterLink>
        <RouterLink to="/flights">All Flights</RouterLink>
        <RouterLink to="/fuelings">All Fuel Providers</RouterLink>
      </nav>
    </div>
  </header>
  
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}


nav {
  width: 120%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
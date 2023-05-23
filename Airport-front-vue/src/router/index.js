import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/airports",
      name: "Airports",
      component: () => import("../views/airports/AllAirportsView.vue"),
    },
    {
      path: '/createAirport',
      name: 'createAirport',
      component: () => import("../views/airports/CreateAirportView.vue")
    },
    {
      path: "/flights",
      name: "Flights",
      component: () => import("../views/flights/AllFlightsView.vue"),
    },
    {
      path: '/createFlight',
      name: 'createFlight',
      component: () => import("../views/flights/CreateFlightView.vue")
    },
    {
      path: "/fuelings",
      name: "Fuelings",
      component: () => import("../views/fuelings/AllFuelingsView.vue"),
    },
    {
      path: '/createFueling',
      name: 'createFueling',
      component: () => import("../views/fuelings/CreateFuelingView.vue")
    },
    {
      path: '/airportCodeConversion',
      name: 'IATA',
      component: () => import('../views/airportCodeConversion/codeConversion.vue')
    },,
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    }
  ],
});

export default router;

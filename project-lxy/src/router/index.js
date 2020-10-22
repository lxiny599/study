import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Count from "../views/Count.vue";
import Parent from "../views/Parent.vue";
import EventBus from "../views/eventBus.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/count",
    name: "Count",
    component: Count,
  },
  {
    path: "/parent",
    name: "Parent",
    component: Parent,
  },
  {
    path: "/eventBus",
    name: "EventBus",
    component: EventBus,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/A",
    name: "A",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/A.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

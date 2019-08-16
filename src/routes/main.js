export default [
  {
    path: "/",
    exact: true,
    component: import("../app/components/home/home")
  },
  {
    path: "/page1",
    exact: true,
    component: import("../app/components/page1/page1")
  },
  {
    path: "/page2",
    exact: true,
    component: import("../app/components/page2/page2")
  },
  {
    path: "/visitor",
    exact: true,
    component: import("../app/components/visitor/Visitor")
  },
  {
    path: "/visitor/abhyasi",
    exact: true,
    component: import("../app/components/visitor/abhyasi/Abhyasi")
  },
  {
    path: "/visitor/non-abhyasi",
    exact: true,
    component: import("../app/components/visitor/non-abhyasi/NonAbhyasi")
  }
];

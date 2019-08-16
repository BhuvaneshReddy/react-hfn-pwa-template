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
    path: "/visitor/entry",
    exact: true,
    component: import("../app/components/visitor/entry/Entry")
  },
  {
    path: "/visitor/entry/abhyasi",
    exact: true,
    component: import("../app/components/visitor/entry/abhyasi/Abhyasi")
  },
  {
    path: "/visitor/entry/non-abhyasi",
    exact: true,
    component: import("../app/components/visitor/entry/non-abhyasi/NonAbhyasi")
  }
  // {
  //   path: "/visitor/exit",
  //   exact: true,
  //   component: import("../app/components/visitor/exit")
  // }
];

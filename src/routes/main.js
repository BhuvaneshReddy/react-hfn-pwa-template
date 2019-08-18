

export default [
  {
    path: '/',
    exact: true,
    component: import('../app/components/home/home'),
  },
  {
    path: '/page1',
    exact: true,
    component: import('../app/components/page1-regserver/page1'),
  },
  {
    path: '/page2',
    exact: true,
    component: import('../app/components/page2-profileserver/page2'),
  },
  {
    path: '/firestore-users',
    exact: true,
    component: import('../app/components/firestore/users'),
  },
  {
    path: '/dorms-booking',
    exact: true,
    component: import('../app/components/dorms-booking/fetchDorms'),
  },
];

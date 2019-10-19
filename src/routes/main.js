

const prodPages = [

];

const home = {
  path: '/',
  exact: true,
  component: import('../workspace/firestore/'),  
}

const workSpace = [
  {
    path: '/firestore',
    exact: true,
    component: import('../workspace/firestore/'),
  },
];


const devRing = [

  // {
  //   path: '/page1',
  //   exact: true,
  //   component: import('../devring/page1-regserver/page1'),
  // },
//   {
//     path: '/favorites',
//     exact: true,
//     component: import('../devring/firestore/users'),
//   },
//   {
//     path: '/agg',
//     exact: true,
//     component: import('../devring/boilerplates/page1_agg_query'),
//   },
//   {
//     path: '/event',
//     abstract: true,
//     component: import('../devring/event-registration'),
//   },
//   {
//     path: '/pnr',
//     abstract: true,
//     component: import('../devring/pnr'),
//   },

];


export default [
  home,
  ...prodPages,
  ...(devRing.map(rec => { let r = { ...rec }; r.path = "/devring" + r.path; return r })),
  ...(workSpace.map(rec => { let r = { ...rec }; r.path = "/workspace" + r.path; return r })),
];

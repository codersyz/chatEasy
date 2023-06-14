import React from 'react';

const routes = [
  {
    path: '/',
    component: React.lazy(() => import('./component/home/index.js')),
  },
  {
    path: '/lucky-grid',
    component: React.lazy(() => import('./component/lucky-grid/index.js')),
  },
  {
    path: '/slot-machine',
    component: React.lazy(() => import('./component/slot-machine/index.js')),
  },
  {
    path: '/gpt',
    component: React.lazy(() => import('./component/gpt/index.js')),
  },
];

export default routes;

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'input', component: () => import('pages/InputPage.vue') },
      { path: 'output', component: () => import('pages/OutputPage.vue') },
      { path: 'remoteSupport', component: () => import('pages/RemoteSupportPage.vue') },
      { path: 'tests', component: () => import('pages/TestsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

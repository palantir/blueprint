import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docsV2/__docusaurus/debug',
    component: ComponentCreator('/docsV2/__docusaurus/debug', '7fe'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/config',
    component: ComponentCreator('/docsV2/__docusaurus/debug/config', '3fc'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/content',
    component: ComponentCreator('/docsV2/__docusaurus/debug/content', '811'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/globalData',
    component: ComponentCreator('/docsV2/__docusaurus/debug/globalData', 'eb4'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/metadata',
    component: ComponentCreator('/docsV2/__docusaurus/debug/metadata', 'bc6'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/registry',
    component: ComponentCreator('/docsV2/__docusaurus/debug/registry', '394'),
    exact: true
  },
  {
    path: '/docsV2/__docusaurus/debug/routes',
    component: ComponentCreator('/docsV2/__docusaurus/debug/routes', '946'),
    exact: true
  },
  {
    path: '/docsV2/docs',
    component: ComponentCreator('/docsV2/docs', 'db7'),
    routes: [
      {
        path: '/docsV2/docs',
        component: ComponentCreator('/docsV2/docs', '9e3'),
        routes: [
          {
            path: '/docsV2/docs',
            component: ComponentCreator('/docsV2/docs', 'b3f'),
            routes: [
              {
                path: '/docsV2/docs/callout',
                component: ComponentCreator('/docsV2/docs/callout', '155'),
                exact: true,
                sidebar: "componentsSidebar"
              },
              {
                path: '/docsV2/docs/card',
                component: ComponentCreator('/docsV2/docs/card', '28b'),
                exact: true,
                sidebar: "componentsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/docsV2/',
    component: ComponentCreator('/docsV2/', '71e'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

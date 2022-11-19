export const getMenuData: any[] = [
  {
    category: true,
    title: 'BizDom',
  },

  {
    title: 'Dashboard',
    key: 'dashboard',
    icon: 'fa fa-area-chart',
    url: '/apps/dashboard',
  },
  // {
  //   title: 'Sale',
  //   key: 'appsProfile',
  //   icon: 'fe fe-shopping-cart',
  //   url: '/apps/sale',
  // },
  {
    title: 'FB',
    key: 'apps',
    icon: 'fa fa-server',
    children: [

      {
        title: 'Sell',
        key: 'appsProfile',
        icon: 'fe fe-shopping-cart',
        url: '/apps/sell',
      },

      {
        title: 'Productfb',
        key: 'appsProfile',
        icon: 'fa fa-cart-arrow-down',
        url: '/apps/productfb',

      },
      {
        title: 'Category',
        key: 'appsProfile',
        icon: 'fa fa-sitemap',
        url: '/apps/category',
      },
      {
        title: 'TaxGroup',
        key: 'appsSetting',
        icon: 'fa fa-list-alt',
        url: '/apps/taxgroup',
      },
      {
        title: 'Additional-Charge',
        key: 'appsSetting',
        icon: 'fa fa-money',
        url: '/apps/Additional-Charge',
      },
      {
        title: 'Option-Group',
        key: 'appsSetting',
        icon: 'fa fa-calculator',
        url: '/apps/Option-Group',
      },
      {
        title: 'Variant',
        key: 'appsProductOptions',
        icon: 'fe fe-copy',
        url: '/apps/productoptions',
      },
      {
        title: 'Dine In',
        key: 'appsProductOptions',
        icon: 'fe fe-copy',
        url: '/apps/dinein',
      },
      {
        title: 'Price Book',
        key: 'appsProductOptions',
        icon: 'fe fe-copy',
        url: '/apps/Pricebook',
      },


    ]
  },

  {
    title: 'Receipts',
    icon: 'fa fa-pencil-square-o',
    key: 'appsSetting',
    url: '/apps/receipt',
  },


  {
    title: 'Company Management',
    key: 'apps',
    icon: 'fa fa-building',
    children: [
      {
        title: 'Company',
        key: 'appsSetting',
        icon: 'fa fa-building',
        url: '/apps/Company',
      },
      {
        title: 'Outlet',
        key: 'appsSetting',
        icon: 'fa fa-map-marker',
        url: '/apps/Outlet',
      },
      {
        title: 'User',
        key: 'appsSetting',
        icon: 'fe fe-users',
        url: '/apps/user',
      },
    ]
  },

  // {
  //   title: 'Menu Management',
  //   key: 'apps',
  //   icon: 'fa fa-server',
  //   children: [
  //     {
  //       title: 'Product',
  //       key: 'appsProfile',
  //       icon: 'fe fe-grid',
  //       url: '/apps/products',
  //     },
  //     {
  //       title: 'Category',
  //       key: 'appsProfile',
  //       icon: 'fa fa-sitemap',
  //       url: '/apps/category',
  //     },
  //     {
  //       title: 'TaxGroup',
  //       key: 'appsSetting',
  //       icon: 'fa fa-list-alt',
  //       url: '/apps/taxgroup',
  //     },
  //     {
  //       title: 'Additional-Charge',
  //       key: 'appsSetting',
  //       icon: 'fa fa-money',
  //       url: '/apps/Additional-Charge',
  //     },

  //     {
  //       title: 'Variant',
  //       key: 'appsProductOptions',
  //       icon: 'fe fe-copy',
  //       url: '/apps/productoptions',
  //     },


  //   ]
  // },

  {
    title: 'Stock Management',
    key: 'apps',
    icon: 'fa fa-balance-scale',
    children: [

      {
        title: 'Stock-Entry',
        key: 'appsBatchEntry',
        icon: 'fe fe-layers',
        url: '/apps/stockentry',
      },
      {
        title: 'Add Stock',
        key: 'appsBatchEntry',
        icon: 'fe fe-layers',
        url: '/apps/batchentry',
      },
      {
        title: 'Stock',
        key: 'appsSetting',
        icon: 'fe fe-shopping-bag',
        url: '/apps/Stock',
      },
      {
        title: 'Purchase Entry',
        key: 'appsSetting',
        icon: 'fa fa-truck',
        url: '/apps/purchaseentry',
      },
      {
        title: 'Vendors',
        key: 'appsSetting',
        icon: 'fe fe-user-check',
        url: '/apps/vendors',
      },
    ]
  },

  {
    title: 'Wastage Management',
    key: 'apps',
    icon: 'fa fa-trash',
    children: [
      {
        title: 'Add-Wastages',
        key: 'appsSetting',
        icon: 'fa fa-recycle',
        url: '/apps/AddWastages',
      },
      {
        title: 'Expiary Products',
        key: 'appsSetting',
        icon: 'fa fa-calendar-check-o',
        url: '/apps/WastageProduct',
      },
    ]
  },

  {
    title: 'Report Management',
    key: 'apps',
    icon: 'fa fa-sticky-note',
    children: [

      {
        title: 'Sales Report',
        key: 'appsSetting',
        icon: 'fa fa-calendar-check-o',
        url: '/apps/Daywisesale',
      },
      {
        title: 'OrderwiseSales',
        key: 'appsSetting',
        icon: 'fa fa-sort',
        url: '/apps/OrderwiseSales',
      },
      {
        title: 'ProductwiseSales',
        key: 'appsSetting',
        icon: 'fa fa-product-hunt',
        url: '/apps/ProductwiseSales',
      },

      {
        title: 'Paymenttypes',
        key: 'appsSetting',
        icon: 'fa fa-money',
        url: '/apps/Paymenttypes',
      },


    ]
  },
  {
    title: 'Internal Transfer',
    key: 'apps',
    icon: 'fe fe-truck',
    children: [
      {
        title: 'To Order',
        key: 'appsInternalTransfer',
        icon: 'fa fa-code-fork',
        url: '/apps/internaltransfer',
      },
      {
        title: 'To Dispatch',
        key: 'appsDispatch',
        url: '/apps/dispatch',
      },
  
      {
        title: 'Receive Orders',
        key: 'appsDispatchOrders',
        url: '/apps/DispatchOrders',
      },
      {
        title: 'Dispatched orders',
        key: 'appsDispatchItem',  
        url: '/apps/DispatchItem',
      },
    ],
  },

  {
      title: 'Maintenance',
      key: 'apps',
      icon: 'fa fa-server',
      children: [
        {
          title: 'Assets',
          key: 'appsAssets',
          url: '/apps/asset',
        },
        {
          title: 'Asset Types',
          key: 'appsAssettypes',
          url: '/apps/assettypes',
        },
        {
          title: 'Maintainence Bill Types',
          key: 'appsMaintbilltypes',
          url: '/apps/maintainencebilltypes',
        },
      ]
    },

  // {
  //   title: 'Setting',
  //   key: 'appsSetting',
  //   icon: 'fa fa-cogs',
  //   url: '/apps/setting',
  // },
  // {
  //   title: 'Pricing Tables',
  //   key: 'pricingTables',
  //   icon: 'fe fe-command',
  //   url: '/advanced/pricing-tables',
  // },





  // {
  //   title: 'Apps',
  //   key: 'apps',
  //   icon: 'fe fe-database',
  //   children: [

  //     {
  //       title: 'Profile',
  //       key: 'appsProfile',
  //       url: '/apps/profile',
  //     },
  //     {
  //       title: 'Calendar',
  //       key: 'appsCalendar',
  //       url: '/apps/calendar',
  //     },
  //     {
  //       title: 'Gallery',
  //       key: 'appsGallery',
  //       url: '/apps/gallery',
  //     },
  //     {
  //       title: 'Messaging',
  //       key: 'appsCart',
  //       url: '/apps/messaging',
  //     },
  //     {
  //       title: 'Mail',
  //       key: 'appsMail',
  //       url: '/apps/mail',
  //     },
  //   ],
  // },
  // {
  //   title: 'Extra Apps',
  //   key: 'extraApps',
  //   icon: 'fe fe-hard-drive',
  //   children: [
  //     {
  //       title: 'Github Explore',
  //       key: 'extraAppsGithubExplore',
  //       url: '/apps/github-explore',
  //     },
  //     {
  //       title: 'Github Discuss',
  //       key: 'extraAppsGithubDiscuss',
  //       url: '/apps/github-discuss',
  //     },
  //     {
  //       title: 'Digitalocean Droplets',
  //       key: 'extraAppsDigitaloceanDroplets',
  //       url: '/apps/digitalocean-droplets',
  //     },
  //     {
  //       title: 'Digitalocean Create',
  //       key: 'extraAppsDigitaloceanCreate',
  //       url: '/apps/digitalocean-create',
  //     },
  //     {
  //       title: 'Google Analytics',
  //       key: 'extraAppsGoogleAnalytis',
  //       url: '/apps/google-analytics',
  //     },
  //     {
  //       title: 'Wordpress Post',
  //       key: 'extraAppsWordpressPost',
  //       url: '/apps/wordpress-post',
  //     },
  //     {
  //       title: 'Wordpress Posts',
  //       key: 'extraAppsWordpressPosts',
  //       url: '/apps/wordpress-posts',
  //     },
  //     {
  //       title: 'Wordpress Add',
  //       key: 'extraAppsWordpressAdd',
  //       url: '/apps/wordpress-add',
  //     },
  //     {
  //       title: 'Todoist List',
  //       key: 'extraAppsTodoistList',
  //       url: '/apps/todoist-list',
  //     },
  //     {
  //       title: 'Jira Dashboard',
  //       key: 'extraAppsJiraDashboard',
  //       url: '/apps/jira-dashboard',
  //     },
  //     {
  //       title: 'Jira Agile Board',
  //       key: 'extraAppsJiraAgileBoard',
  //       url: '/apps/jira-agile-board',
  //     },
  //     {
  //       title: 'Helpdesk Dashboard',
  //       key: 'extraAppsHelpdeskDashboard',
  //       url: '/apps/helpdesk-dashboard',
  //     },
  //   ],
  // },



  // {
  //   title: 'Ant Design',
  //   key: 'antDesign',
  //   icon: 'fe fe-bookmark',
  //   url: '/ui-kits/antd',
  // },
  // {
  //   title: 'Bootstrap',
  //   key: 'bootstrap',
  //   icon: 'fe fe-bookmark',
  //   url: '/ui-kits/bootstrap',
  // },
  // {
  //   category: true,
  //   title: 'Components',
  // },
  // {
  //   title: 'Widgets',
  //   key: 'widgets',
  //   icon: 'fe fe-image',
  //   count: 47,
  //   children: [
  //     {
  //       title: 'General',
  //       key: 'widgetsGeneral',
  //       url: '/widgets/general',
  //     },
  //     {
  //       title: 'Lists',
  //       key: 'widgetsLists',
  //       url: '/widgets/lists',
  //     },
  //     {
  //       title: 'Tables',
  //       key: 'widgetsTables',
  //       url: '/widgets/tables',
  //     },
  //     {
  //       title: 'Charts',
  //       key: 'widgetsCharts',
  //       url: '/widgets/charts',
  //     },
  //   ],
  // },
  // {
  //   title: 'Cards',
  //   key: 'cards',
  //   icon: 'fe fe-credit-card',
  //   children: [
  //     {
  //       title: 'Basic Cards',
  //       key: 'cardsBasicCards',
  //       url: '/cards/basic-cards',
  //     },
  //     {
  //       title: 'Tabbed Cards',
  //       key: 'cardsTabbedCards',
  //       url: '/cards/tabbed-cards',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables',
  //   key: 'tables',
  //   icon: 'fe fe-grid',
  //   children: [
  //     {
  //       title: 'Ant Design',
  //       key: 'tablesAntd',
  //       url: '/tables/antd',
  //     },
  //     {
  //       title: 'Bootstrap',
  //       key: 'tablesBootstrap',
  //       url: '/tables/bootstrap',
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   key: 'charts',
  //   icon: 'fe fe-pie-chart',
  //   children: [
  //     {
  //       title: 'Chartist.js',
  //       key: 'chartsChartistjs',
  //       url: '/charts/chartistjs',
  //     },
  //     {
  //       title: 'Chart.js',
  //       key: 'chartsChartjs',
  //       url: '/charts/chartjs',
  //     },
  //     {
  //       title: 'C3',
  //       key: 'chartsC3',
  //       url: '/charts/c3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Icons',
  //   key: 'icons',
  //   icon: 'fe fe-star',
  //   children: [
  //     {
  //       title: 'Feather Icons',
  //       key: 'iconsFeatherIcons',
  //       url: '/icons/feather-icons',
  //     },
  //     {
  //       title: 'Fontawesome',
  //       key: 'iconsFontawesome',
  //       url: '/icons/fontawesome',
  //     },
  //     {
  //       title: 'Linearicons Free',
  //       key: 'iconsLineariconsFree',
  //       url: '/icons/linearicons-free',
  //     },
  //     {
  //       title: 'Icomoon Free',
  //       key: 'iconsIcomoonFree',
  //       url: '/icons/icomoon-free',
  //     },
  //   ],
  // },
  // {
  //   category: true,
  //   title: 'Advanced',
  // },
  // {
  //   title: 'Form Examples',
  //   key: 'formExamples',
  //   icon: 'fe fe-menu',
  //   url: '/advanced/form-examples',
  // },
  // {
  //   title: 'Email Templates',
  //   key: 'emailTemplates',
  //   icon: 'fe fe-mail',
  //   url: '/advanced/email-templates',
  // },
  // {
  //   title: 'Pricing Tables',
  //   key: 'pricingTables',
  //   icon: 'fe fe-command',
  //   url: '/advanced/pricing-tables',
  // },
  // {
  //   title: 'Invoice',
  //   key: 'invoice',
  //   icon: 'fe fe-file-text',
  //   url: '/advanced/invoice',
  // },
  // {
  //   title: 'Utilities',
  //   key: 'utilities',
  //   icon: 'fe fe-inbox',
  //   url: '/advanced/utilities',
  // },
  // {
  //   title: 'Grid',
  //   key: 'grid',
  //   icon: 'fe fe-grid',
  //   url: '/advanced/grid',
  // },
  // {
  //   title: 'Typography',
  //   key: 'typography',
  //   icon: 'fe fe-type',
  //   url: '/advanced/typography',
  // },
  // {
  //   title: 'Colors',
  //   key: 'colors',
  //   icon: 'fe fe-feather',
  //   url: '/advanced/colors',
  // },
  // {
  //   title: 'Nested Items',
  //   key: 'nestedItem1',
  //   icon: 'fe fe-layers',
  //   children: [
  //     {
  //       title: 'Nested Item 1-1',
  //       key: 'nestedItem1-1',
  //       children: [
  //         {
  //           title: 'Nested Item 1-1-1',
  //           key: 'nestedItem1-1-1',
  //         },
  //         {
  //           title: 'Nested Items 1-1-2',
  //           key: 'nestedItem1-1-2',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Nested Items 1-2',
  //       key: 'nestedItem1-2',
  //     },
  //   ],
  // },
  // {
  //   title: 'Disabled Item',
  //   key: 'disabledItem',
  //   icon: 'fe fe-slash',
  //   disabled: true,
  // },
]

# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.

```
RESTfulSapCdsNoSQL
├─ company.md
├─ eslint.config.mjs
├─ package-lock.json
├─ package.json
├─ README.md
├─ server.js
└─ src
   ├─ api
   │  ├─ controllers
   │  │  ├─ inv-inversions-controller.js
   │  │  └─ sec-security-controller.js
   │  ├─ models
   │  │  ├─ cedis.cds
   │  │  ├─ data
   │  │  │  ├─ inv-priceshistory.csv
   │  │  │  └─ inv-strategies.csv
   │  │  ├─ inv-inversions.cds
   │  │  ├─ mongoDB
   │  │  │  ├─ company.js
   │  │  │  ├─ fetchEmpresas.js
   │  │  │  ├─ Strategy.js
   │  │  │  └─ ztpricehistory.js
   │  │  ├─ sec-roles.cds
   │  │  ├─ sec-users.cds
   │  │  └─ sec-values.cds
   │  ├─ routes
   │  │  ├─ inv-inversions-router.cds
   │  │  └─ sec-security.cds
   │  └─ services
   │     ├─ inv-inversions-services.js
   │     └─ sec-security-service.js
   ├─ config
   │  ├─ connectToMongoDB.js
   │  └─ dotenvXconfig.js
   └─ lib
      └─ mongo.js

```
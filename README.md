# Analyses Catalog STRAPI application

## Requirements

- _Node 14.21.3_ (or NVM for Windows)

## Installation

> This installation refers to Windows 11 installation.

1. Clone this project to any directory

  - `git clone git@gitlab.bionext.lu:myrdv/web/backend.git`

2. Install NVM: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows

  - install Node 20.5.1: `nvm install 14.21.3`
  - use Node 20.5.1: `nvm use 14.21.3`
  - install Yarn globally: `npm install yarn -g`
  - install dependencies with Yarn: `yarn install --frozen-lockfile`
  - copy `.env.example` to `.env`
  - edit parameters to fit your installation
  - start Node via Yarn: `yarn develop --watch-admin`

## Parameters

- `NODE_ENV`: environment to run, default to _development_
- `HOST`: HTTP hostname, default to _0.0.0.0_
- `PORT`: HTTP port, default to _1337_
- `DATABASE_HOST`: database hostname, default to _localhost_
- `DATABASE_PORT`: database port, default to _3306_
- `DATABASE_NAME`: database name, default to _catalog_strapi_
- `DATABASE_USERNAME`: database username, default to _root_
- `DATABASE_PASSWORD`: database password, empty by default
- `DATABASE_SSL`: database hostname, default to _localhost_
- `CATALOG_API_URL`: base URI for STRAPI API, default to _http://localhost:1337_
- `ADMIN_JWT_SECRET`: random string to generate JWT for backoffice users
- `JWT_SECRET`: random string to generate JWT

> To generate a random 32-length string, use `openssl rand -base64 32`.

These parameters are only available for **development**.

- `ADMIN_USERNAME`: Username for the first super administrator, default to _admin_ 
- `ADMIN_PASSWORD`: Password for the first super administrator
- `ADMIN FIRSTNAME`: First name for the first super administrator
- `ADMIN_LASTNAME`: Last name for the first super administrator
- `ADMIN_EMAIL`: Email address for the first super administrator

## POI

### STRAPI

STRAPI comes with a CMS and an API.  
Current STRAPI version is fixed to **3.6.8**.  
For a full documentation, see https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html.

### Env. staging : switch to develop mode
Edit `ecosystem.staging.config.js` change  `args: 'start'`, by  `args: 'develop'`

### Creating new entity

1. Go to _Content Type Builder_: http://localhost:8000/admin/plugins/content-type-builder/content-types

2. Add a title and expected fields

3. Configure the view to fit your needs

4. Edit generated `api/<CONTENT-TYPE>/models/<CONTENT-TYPE>.settings.json` for fine-tuning

> Tips: Changing field order in `attributes` section changes fields order on listing.

### Adding a menu link to a CRUD panel

1. Assign permissions on this content type for expected roles

2. Modify `admin/src/containers/LeftMenu/index.js` to add a link to a menu section

> Inspired from https://github.com/strapi/strapi/issues/900#issuecomment-867056853

### Adding a homepage component

1. Modify `admin/src/containers/HomePage/index.js` to add a component

2. Modify `admin/src/translations/*.json` to add new translations for this component

3. Modify `admin/src/containers/HomePage/components.js` to change component's symbol

### Font Awesome

This project use Font Awesome icons: https://fontawesome.com/

## Contributors

- Loic Gasiorowski
- Sandrine Luconi
- Adrien Schmuck
- Anthony Perozzo
- Pierrot Evrard

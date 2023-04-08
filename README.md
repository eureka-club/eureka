# Eureka

Eureka webapp is build on top of Next.js-10.0 and react-bootstrap-1.5. It is hosted as so called app-service in the Azure cloud. It is using MSSQL server for the database and Prisma 2 for database driver. Almost all images are stored in Azure blob storage and hosted via Azure's Verizon CDN.

In this document we describe steps necessary for local development and deployment to the Azure cloud.

## Local development

### Requirements
- Docker
- Git
- Node.js 14+
- azure-cli v2
- bash v4+
- yarn v1


### Preparation
- clone repository into local project folder
- copy `.env.local [example]` into `.env.local`, adjust values in a new file, make decision about URL for local development (will you use **localhost:3000** as development URL? Maybe you should use something more sophisticated like `eureka-dev.local:3000`, highly recommended), fill that URL into `NEXT_PUBLIC_WEBAPP_URL` & `NEXTAUTH_URL`
- copy `prisma/.env [example]` into `primsa/.env` and adjust values

*Remember, values in `.env [examples]` are not real (production ready) values! They are good defaults for local development only.*

- install all libraries with `yarn install` command
- create local MSSQL database for local development via Docker:

  ```
  docker run \
      -e ACCEPT_EULA=Y \
      -e SA_PASSWORD='$3cret123' \
      -e MSSQL_PID=Express \
      -p 1433:1433 \
      -v $HOME/.docker/my_volumes/mssql-eureka:/var/opt/mssql \
      --name mssql-eureka \
      --restart on-failure \
      -d mcr.microsoft.com/mssql/server:2019-latest
  ```

MSSQL database server is now available at `localhost:1433`. Container will be started automatically with Docker.

You can connect to MSSQL database via [TablePlus](https://tableplus.com/download) or similar app.

- run database migrations with `yarn prisma-pf migrate deploy` to create DB tables

Dynamic images (uploads) in development are handled by Next.js's server and stored locally in `public-assets` folder.

For full funcionality (login, comments) it is needed to populate valid ENVs into `.env.local` for Google, Hyvor and SendGrid. Every developer need to use his/her own Google ID/KEY. Hyvor & SendGrid credentials can be shared.

#### Hyvor comments
Ask supervisor to add your development URL to [Hyvor console](https://talk.hyvor.com/console).

#### Google sign-in
To populate `GOOGLE_ID` and `GOOGLE_SECRET` you must navigate to (your own) [console.cloud.google.com](http://console.cloud.google.com/) and create a new project. Then in *APIs & Services* > *Credentials* create a new **OAUTH** credential for webapp. Do not setup project icon! When finished you will be provided with `GOOGLE_ID` and `GOOGLE_SECRET`.

You will need to fill *Authorized redirect URIs* with URL of running apps (development & production). Value(s) should look like:

```
http://eureka-dev.local:3000/api/auth/callback/google
```

### Development

- run `yarn dev`
- access website on URL configured in `NEXT_PUBLIC_WEBAPP_URL`
- make changes to the code
- **check the code before pushing to the repository: `yarn lt` !!!**
- if you change `prisma/schema.prisma` file, always follow this steps:
  - create a new migration: `yarn prisma-pf migrate dev --create-only`
  - inspect/tweak new migration at `prisma/migrations`
  - **fist deploy migration do your local DB** - !!!make sure that `prisma/.env` points to local database!!!
  `yarn prisma-pf migrate deploy`
  - document changes into database diagram at Google drive!
  - !!!make note that migration(s) is/are needed for production!!!
- if you changed `.env.local`, update also `.env.local [example]` and make sure that ENV values will be provisioned by `.azure/.env` and `.azure/99_deploy.sh`!


## Deployment to Azure cloud
Application is deployed in Azure as a so-called app-service. It is a Heroku-like service, where deployment is made with simple `git push azure master`. During this step sources are pushed into Azure GIT repository. Then deployment process will run `yarn build` within configured runtime (Node.js v14). After successful build a `yarn start` starts the web-application. All this is happening during that `git push` command and can take some serious time (10-30 mins) to finish.

This deployment process is ran on app-service-plan - HW resource for your app-service. App service plan together with app-service are way of abstracting HW (servers) out of sight of developer. All you care is app-service-plan tier (size of your abstracted server) and GIT repository to push to. You can run multiple app-services on top of app-service-plan (same way as single server can serve multiple web-applications in IaaS scenario).

Eureka is also utilizing app-service deployment slot(s). It is a nice way to group couple of app-services into single project. This allows independend deployment of production/staging targets.


### Preparation
- login via `azure-cli` - `az login`
- from the supervisor ask for secrets archive.zip and copy `.azure/.env` into your project
- create infrastructure in Azure by running `.azure/00_infrastrucure.sh` (command is idempotent, you can run it safely many times)
- add Git remotes to your environment
  - `git remote add azure https://EurekaClubDeployer@eurekaclubeureka.scm.azurewebsites.net/eurekaclubeureka.git`
  - `git remote add azure-staging https://EurekaClubDeployer@eurekaclubeureka-staging.scm.azurewebsites.net/eurekaclubeureka.git`
- initiate prompt for deployment credentials
  - `git fetch -v azure` *(provide deployment password - see `.azure/.env`)*
  - `git fetch -v azure-staging`

### Cloud deployment
- run `yarn lt`!!!
- commit all changes into git!
- if DB migrations are needed, run them before deployment
  - change to staging/production database in `prisma/.env`
  - apply pending migrations `yarn prisma-pf migrate deploy`
  - change back to development database in `prisma/.env`!
- run `.azure/99_deploy.sh`
- apply changes to ENV only if you changed your `.env.local` and prepared/reflected changes in `.azure/.env` & `.azure/99_deploy.sh`
- wait to finish, do not interrupt running command (take around 18 minutes to finish)
- it takes around another 3 minutes to deployment to become live at Azure. Click around production website to warm caches on the server.

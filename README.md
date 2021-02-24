# Eureka

Webapp is build on top of Next.js-10 and react-bootstrap-1.5. It is hosted as so called app-service (also called webapp) in Azure cloud. It is using Azure's SQL server for the database.

### Requirements for local development
- Docker
- Node.js 12+
- Git
- azure-cli
- yarn v1


### Preparation (local development)
- clone repository into local project folder
- copy `.env.local [example]` into `.env.local`, adjust values in a new file, make decision about URL for local development (will you use **localhost:3000** as development URL? Maybe you should use something more sophisticated ;), fill that URL into `NEXT_PUBLIC_WEBAPP_URL` & `NEXTAUTH_URL` or keep default values
- copy `.azure/.env [example]` into `.azure/.env`, fill `SUBSCRIPTION` and other missing values in **Provisioning** section, populate passwords with good random strings
- copy `prisma/.env [example]` into `primsa/.env` and adjust values

*Remember, values in `.env [examples]` are not real (production ready) values! They are good defaults for local development. Ask for eureka-secrets.zip archive for deployment from your local machine/laptop.*

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
*You can connect to MSSQL database via [TablePlus](https://tableplus.com/download) or similar app.*

- run database migrations with `yarn prisma-pf migrate deploy` to create DB tables

### Development
- run `yarn dev`
- access website on URL configured in `NEXT_PUBLIC_WEBAPP_URL`
- make changes to the code
- check the code before pushing to the repository: `yarn lt`
- if you change `prisma/schema.prisma` file, always follow this steps:
  - create a new migration: `yarn prisma-pf migrate dev --create-only`
  - inspect new migration at `prisma/migrations`
  - deploy migration do your local DB - !!!make sure that `prisma/.env` points to local database!!!
  `yarn prisma-pf migrate deploy`
  - document changes into database diagram ad GDrive!
  - !!!make note that migration(s) is/are needed for production!!!
- if you changed `.env.local`, make sure that ENV values will be provisioned by `.azure/.env` and `.azure/99_deploy.sh`!

### Preparation (cloud deployment)
- login via `azure-cli` - `az login`
- create infrastructure in Azure by running `.azure/00_infrastrucure.sh` (command is idempotent, you can run it safely)
- add Git remote to your environment
  ```
  git remote add azure https://EurekaClubDeployer@eurekaclubeureka.scm.azurewebsites.net/EurekaClubEureka.git
  ```

### Cloud deployment
- run `yarn lt`!!!
- commit all changes into git!
- if DB migrations are needed, run them before deployment
  - change to production database in `prisma/.env`
  - apply pending migrations `yarn prisma-pf migrate deploy`
  - change to development database in `prisma/.env`!!!
- run `.azure/99_deploy.sh`
- apply changes to ENV only if you changed your `.env.local` and prepared changes in `.azure/.env` & `.azure/99_deploy.sh`
- wait to finish, do not interrupt running command (take around 14 minutes to finish)
- it takes around another 3 minutes to deployment to become live at Azure. Click around production website to warm caches on the server.


#### Google sign-in
To populate `GOOGLE_ID` and `GOOGLE_SECRET` you must navigate to [console.cloud.google.com](http://console.cloud.google.com/) and create a new project. Then in *APIs & Services* > *Credentials* create a new **OAUTH** credential for webapp. When finished you will be provided with `GOOGLE_ID` and `GOOGLE_SECRET`.

You will need to fill *Authorized redirect URIs* with URL of running apps (development & production). Value(s) should look like:

```
https://your.application.url/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

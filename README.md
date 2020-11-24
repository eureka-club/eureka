# Eureka

Webapp is build on top of Next.js-10 and react-bootstrap-1.4. It is hosted as so called app-service (also called webapp) in Azure cloud. It is using Azure's SQL server for database.

### Requirements
- Node.js 12+
- Git
- azure-cli
- yarn 1


### Preparation
- clone repository into local project folder
- copy `.env.local [example]` into `.env.local`, adjust values in a new file, make decision about URL for local development, fill that URL into `NEXT_PUBLIC_WEBAPP_URL` & `NEXTAUTH_URL` or keep default values
- copy `.azure/.env [example]` into `.azure/.env`, fill `SUBSCRIPTION` and other missing values in **Provisioning** section, populate passwords with good random strings
- install all libraries with `yarn install` command
- create infrastructure in Azure by running `.azure/00_infrastrucure.sh`
- use MSSQL server DSN from above command to populate `DATABASE_URL` in env files
- run database migrations with `yarn knex migrate:latest`


### Development
- run `yarn dev`
- access website on URL configured in `NEXT_PUBLIC_WEBAPP_URL`
- make changes to the code
- check the code before pushing to the repository: `yarn lt`


### Deployment
- run `yarn lt`!!!
- run `.azure/99_deploy.sh`
- wait to finish, do not interrupt running command (take around 8 minutes to finish)
- it takes around another 3 minutes to deployment to become live at Azure. Click around production website to warm caches on the server.


#### Google sign-in
To populate `GOOGLE_ID` and `GOOGLE_SECRET` you must navigate to [console.cloud.google.com](http://console.cloud.google.com/) and create a new project. Then in *APIs & Services* > *Credentials* create a new **OAUTH** credential for webapp. When finished you will be provided with `GOOGLE_ID` and `GOOGLE_SECRET`.

You will need to fill *Authorized redirect URIs* with URL of running apps (development & production). Value(s) should look like:

```
https://your.application.url/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

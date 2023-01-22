<p align="center">
  <a href="https://codeclimate.com/github/Simba-City/nueno/maintainability"><img src="https://api.codeclimate.com/v1/badges/1e547d9b8a46c47be067/maintainability" /></a>
  <a href="https://codeclimate.com/github/Simba-City/nueno/test_coverage"><img src="https://api.codeclimate.com/v1/badges/1e547d9b8a46c47be067/test_coverage" /></a>
</p>

# Simba City

## Project setup

run `docker-compose up -d`

<details>
<summary>You haven't installed docker and docker-compose on your system?</summary>

  <a href="https://docs.docker.com/compose/install/">Here's an installation guide</a>
  
You'll only need these commands when using docker-compose:
```bash
# start running containers
docker-compose up -d

# shut-down running containers
docker-compose down

# list running containers
docker-compose ps
```

</details>

## Development workflow

Initial setup:
```
docker-compose up -d
npx prisma db push
npx prisma studio
```

Run:
```
npm run dev
```

Then visit `http://localhost:3000`.

## Run tests
```
npm run test
```

Optionally, you can add a name pattern of the file name:
```
npm run test User
```

**Check test coverage:**
1. `npm run test:coverage`
2. open file `./coverage/lcov-report/index.html`

## Database

We're using <a href="https://planetscale.com">PlanetScale</a> for our database. It uses a MySql database, however PlanetScale doesn't support foreign key constraints and we enabled this on the Prisma level instead of having it at the DB level.

**This means there's one thing we need to consider now:**
We now always need to add an `@@index([...])` if we add a foreign key (otherwise certain queries would run slower).
- find a detailed explaination in this video: https://youtu.be/iaHt5_hg44c?t=757
- <img width="649" alt="image" src="https://user-images.githubusercontent.com/98182227/174460965-250d111e-ae44-49e2-befd-30ba235114b9.png">

Here is a more detailed documentation on using Prisma with Planetscale: https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale

## Advanced (not required)

### Setup firebase Authentication

We are going to use firebase to create the credentials for us. We can use Google cloud console directly but we will need to configure extra stuff.

<details>
<summary>How to create credentials in firebase</summary>

**Part 1:**
1. Go to firebase. Create a new account then click on add project.
2. Give a name for your app then you can leave everything as default and click next.
3. Go to the authentication tab in the sidebar. Click get started. Click on Google sign in and enable it. Now simply click on save.
4. If you click on edit again and open the Web SDK configuration accordion. You can see the credentials we need. I am showing my credentials for the demo but you shouldn’t show your credentials.
5. Now add the credentials to your `.env` file.
- <img width="612" alt="image" src="https://user-images.githubusercontent.com/98182227/174501714-304e2add-b736-4074-b755-d66b22323e76.png">

**Part 2:**
1. Stop and start your dev server `npm run dev`
2. Click on "Sign in with Google" in the app
3. You'll get an error screen. Now copy the link at which is at the bottom of the error and paste the link into a new tab. Scroll down and you will be able to see redirect URI’s.
- <img width="942" alt="image" src="https://user-images.githubusercontent.com/98182227/174501964-c5e89e2b-dc35-4b50-b43f-4b3dee8ff647.png">
4. Now click on ADD URI and add this: `http://localhost:3000/api/auth/callback/google`
- <img width="645" alt="image" src="https://user-images.githubusercontent.com/98182227/174501991-10581759-3751-41c9-a527-4af74d24da65.png">
5. Then click on save. If you try logging in. You can now log in.

</details>


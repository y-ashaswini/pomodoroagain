This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Hosted Link

[Pomodoro Task App](https://pomodoroagain.vercel.app/)

## Getting Started

Clone the repository onto your local machine:

```bash
git clone https://github.com/y-ashaswini/pomodoroagain.git
```

Generate the Prisma Client, by navigating to the ./Server directory:

```bash
cd ./Server
```

You may encounter a few issues with the environment variables from the .env file, so in addition to the global .env.local file located in the root directory, please create another .env file located in the ./Server directory and store the DATABASE_URL there (since the server directory only needs access to DATABASE_URL).

Then, run the Prisma Generate and Prisma Migrate commands:

```bash
npx prisma generate --schema ./prisma/migrations/schema.prisma

npx prisma migrate dev --schema ./prisma/migrations/schema.prisma

```

Navigate back to the root of the directory:

```bash
cd ../
```

Spur up your local host:

```bash
npm install

npm run dev
```

Change the graphql uri to [http://localhost:3000](http://localhost:3000) at /lib/apollo.js

Open up [http://localhost:3000](http://localhost:3000) with your browser to see the web application!

## About The Website

This is a web application created for users to add, edit, update and delete timed Pomodoro-based tasks.

#### Features:

- Sign in through a verified Google Account.
- If your account doesn't exists in the database, a new and empty one is automatically created for you.
- Begin by adding tasks, setting the title, giving a short description, setting the due date and the required number of pomodoros you'd assign yourself for the task.
- Keep adding tasks, set the timer for the task you're sitting for, and let the timer guide you through till the end!
- Navigate to the profile page to look at your task data analysed and visualised.

#### Tech Stack:

- Next.js with React.js + TailwindCSS (UI Framework) + ChartJS (Data visualising) hosted through Vercel
- GraphQL + ApolloClient with Prisma ORM, data stored in a PostgreSQL database hosted through Render
- Google NextAuth for authorisation

#### Codebase Structure:
Earlier, I tried setting it app up using the NextJS app-directory-based file structure, but due to facing a ton of issues with authentication, I rebuilt the entire thing with the pages/ structure.
It also contains a built-in ./Server directory with the database Queries and GraphQL, Prisma initialisation files.

Hope you enjoy using the app!
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Setup

# BACKEND
First, go to omnify_mini_event_management_system_backend and set below mentioned keys in the .env to start node.js, express.js server.

.env Keys:
```bash
DATABASE_URL="YOUR_POSTGRES_DB_URL"
PORT=4000 # Set it as it is this is the port where your backend is running.
FRONTEND_URL="http://localhost:3000" # or the port where frontend is running to enable cors.
```

After this run below commands one by one to start the dev server:
```bash
npm install
npx prisma migrate dev --name setup #to setup prisma orm
npx prisma generate #to generate prisma client
npm run build && npm run start # to start backend api server
npm run docs #to setup and see the swagger api docs
npx prisma studio # to see the db content as a db studio in you browser on default port: http://localhost:5555
```

# FRONTEND

Now go to omnify_mini_event_management_system folder and set keys.

.env Keys: 
```bash
NEXT_API_BASE_URL: # in here put the main url such as http://localhost:4000/api
```

After this run below command to start the frontend:
```bash
npm install
npm run dev
```

Then you can access the frontend on: http://localhost:3000

## Tech stack
### Frontend: Next, Tailwind, Axios, Shadcn-ui, Zustand, React Query
### Backend: Node, Express, Typescript, Prisma ORM, Supabase (As PostgreSQL Provider)

## Video Link:

[Loom](https://www.loom.com/share/79651b886864416c8f4969f18b431a44?sid=a3b0c985-7618-4342-80f3-f810cfe1076f)
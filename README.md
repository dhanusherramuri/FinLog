# FinLog — Angular App with JSON Server

## Thought Process
When I started working on FinLog, I wanted to create a simple frontend project using Angular that could still interact with data like a real full-stack app. Instead of setting up a full backend or database, I decided to use **JSON Server**. It’s lightweight, easy to use, and perfect for simulating API calls.

The main idea was to manage a list of participants, each with details like their name, email, NDIS number, state, and status. JSON Server made it easy to create a fake REST API that the Angular app could call during development.

---

## Tech Stack
- **Frontend:** Angular (runs on port 4200)
- **Backend:** JSON Server (mock API, runs on port 3000)
- **Database:** `db.json`
- **Version Control:** GitHub repository — `dhanusherramuri/FinLog`

---

## Setup and Run Instructions

### Step 1: Clone the repository
```bash
git clone https://github.com/dhanusherramuri/FinLog.git
cd FinLog
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the JSON Server
Change the directory to where the db.json file is present :
``` cd src```

Run this command to start the mock API:
```bash
npx json-server --watch db.json --port 3000
```

Once it’s running, you can access the API here:
```
http://localhost:3000/participants
```

### Step 4: Start the Angular App
Open another terminal window and start the Angular development server:
```bash
ng serve
```

After it starts, open your browser and go to:
```
http://localhost:4200
```

---

## API Endpoints
Here are the available endpoints based on the `db.json` data:

| Method | Endpoint                             | Description            |
|--------|--------------------------------------|------------------------|
| GET    | `http://localhost:3000/participants` | Fetch all participants |
| POST   |`http://localhost:3000/participants`  | Add a new participant  |

---

## Database Structure
Here’s a sample of the data used in `db.json`:
```json
{
  "participants": [
    {
      "id": "42",
      "name": "Aria",
      "email": "aria42@untitledui.com",
      "ndis": "78838",
      "state": "Tasmania",
      "status": "Active"
    },
    {
      "id": "43",
      "name": "Nathan",
      "email": "nathan43@untitledui.com",
      "ndis": "78839",
      "state": "Western Australia",
      "status": "Inactive"
    }
  ]
}
```

---

## Deployment Notes
This project doesn’t use a backend server — it relies completely on JSON Server for mock data. For deployment, you’ll need to either host the Angular frontend separately or switch to a real backend (like Express or Firebase) if you want persistent data online.

Locally, this setup is perfect for testing, prototyping, and demonstrating API integration in Angular.

---

## Final Thoughts
FinLog was good to connect Angular with a simple API setup. JSON Server made it really easy to handle mock data, and it’s a great approach for learning how frontends interact with RESTful APIs.

---
**Author:** Dhanush Erramuri

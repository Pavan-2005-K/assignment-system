# Assignment Submission System

## Description
This project is a backend API built using Node.js, Express, and MongoDB.  
It allows teachers to create assignments and students to submit them before deadlines.  
It also ensures validation such as preventing late and duplicate submissions.

---

## Features
- Create, update, delete assignments
- View all assignments and individual assignment
- Submit assignments
- Deadline validation (no late submissions)
- Prevent duplicate submissions
- Filter assignments by subject/status
- Sort assignments by due date
- Middleware logging of all API requests

---

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## API Endpoints

### Assignment APIs
- POST /assignments
- GET /assignments
- GET /assignments/:id
- PUT /assignments/:id
- DELETE /assignments/:id

### Submission APIs
- POST /assignments/:id/submissions
- GET /assignments/:id/submissions
- GET /submissions

### Bonus APIs
- GET /assignments/filter?subject=DBMS
- GET /assignments/sorted

---

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start server:
   ```bash
   node server.js
   ```

3. Make sure MongoDB is running:
   ```
   mongodb://127.0.0.1:27017/assignmentDB
   ```

4. Open:
   ```
   http://localhost:5000
   ```

---

## Sample Request (Create Assignment)

**POST** `http://localhost:5000/assignments`

```json
{
  "title": "DBMS Assignment",
  "subject": "DBMS",
  "description": "SQL queries",
  "dueDate": "2026-12-31T23:59:59.000Z"
}
```
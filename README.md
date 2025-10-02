# MongoDB Fundamentals - Week 1 Assignment

## Overview

This assignment demonstrates MongoDB fundamentals including CRUD operations, advanced queries, aggregation pipelines, and indexing using a bookstore database.

## Files Included

- `insert_books.js`: Script to populate MongoDB with 12 sample books
- `queries.js`: Complete MongoDB queries for all assignment tasks
- `Week1-Assignment.md`: Detailed assignment instructions

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- MongoDB Shell (mongosh) or MongoDB Compass

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mongodb
```

### 2. Start MongoDB

**Local MongoDB:**
```bash
# Linux/macOS
sudo systemctl start mongod

# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

**MongoDB Atlas:**
Update the `uri` variable in both scripts with your Atlas connection string.

## How to Run

### Step 1: Populate the Database

```bash
node insert_books.js
```

This creates the `plp_bookstore` database and inserts 12 books into the `books` collection.

### Step 2: Run All Queries

```bash
node queries.js
```

This executes all assignment tasks:
- **Task 2**: Basic CRUD operations
- **Task 3**: Advanced queries (filtering, projection, sorting, pagination)
- **Task 4**: Aggregation pipelines
- **Task 5**: Indexing and performance analysis

### Optional: Run Individual Tasks

Edit `queries.js` and uncomment specific task functions at the bottom:

```javascript
// task2_basicCRUD().catch(console.error);
// task3_advancedQueries().catch(console.error);
// task4_aggregation().catch(console.error);
// task5_indexing().catch(console.error);
```

## Verify in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `plp_bookstore` → `books` collection
4. View inserted documents and indexes

## Assignment Tasks Completed

✅ Task 1: MongoDB setup with `plp_bookstore` database
✅ Task 2: CRUD operations (find, update, delete)
✅ Task 3: Advanced queries with filtering, projection, sorting, and pagination
✅ Task 4: Aggregation pipelines for data analysis
✅ Task 5: Indexing with performance analysis using `explain()`

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)

// queries.js - MongoDB queries for Week 1 Assignment
// Database: plp_bookstore | Collection: books

const { MongoClient } = require('mongodb');

// Connection URI 
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// =============================================================================
// TASK 2: BASIC CRUD OPERATIONS
// =============================================================================

async function task2_basicCRUD() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find all books in a specific genre (Fiction)
    console.log('--- 1. Find all books in Fiction genre ---');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log(fictionBooks);
    console.log(`Found ${fictionBooks.length} fiction books\n`);

    // 2. Find books published after a certain year (after 1950)
    console.log('--- 2. Find books published after 1950 ---');
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log(recentBooks);
    console.log(`Found ${recentBooks.length} books published after 1950\n`);

    // 3. Find books by a specific author (George Orwell)
    console.log('--- 3. Find books by George Orwell ---');
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log(orwellBooks);
    console.log(`Found ${orwellBooks.length} books by George Orwell\n`);

    // 4. Update the price of a specific book (1984)
    console.log('--- 4. Update the price of "1984" ---');
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 15.99 } }
    );
    console.log(`Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);
    const updated1984 = await collection.findOne({ title: '1984' });
    console.log('Updated book:', updated1984, '\n');

    // 5. Delete a book by its title (Moby Dick)
    console.log('--- 5. Delete "Moby Dick" ---');
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`Deleted ${deleteResult.deletedCount} document(s)\n`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// =============================================================================
// TASK 3: ADVANCED QUERIES
// =============================================================================

async function task3_advancedQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find books that are both in stock and published after 2010
    console.log('--- 1. Books in stock AND published after 2010 ---');
    const inStockRecent = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log(inStockRecent);
    console.log(`Found ${inStockRecent.length} books\n`);

    // 2. Use projection to return only title, author, and price fields
    console.log('--- 2. Projection: title, author, price only ---');
    const projectedBooks = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log(projectedBooks, '\n');

    // 3. Sorting by price - Ascending
    console.log('--- 3a. Books sorted by price (Ascending) ---');
    const sortedAsc = await collection.find(
      {},
      { projection: { title: 1, price: 1, _id: 0 } }
    ).sort({ price: 1 }).toArray();
    console.log(sortedAsc, '\n');

    // 3b. Sorting by price - Descending
    console.log('--- 3b. Books sorted by price (Descending) ---');
    const sortedDesc = await collection.find(
      {},
      { projection: { title: 1, price: 1, _id: 0 } }
    ).sort({ price: -1 }).toArray();
    console.log(sortedDesc, '\n');

    // 4. Pagination using limit and skip (5 books per page)
    console.log('--- 4. Pagination: 5 books per page ---');

    // Page 1
    console.log('Page 1:');
    const page1 = await collection.find(
      {},
      { projection: { title: 1, author: 1, _id: 0 } }
    ).limit(5).skip(0).toArray();
    console.log(page1, '\n');

    // Page 2
    console.log('Page 2:');
    const page2 = await collection.find(
      {},
      { projection: { title: 1, author: 1, _id: 0 } }
    ).limit(5).skip(5).toArray();
    console.log(page2, '\n');

    // Page 3
    console.log('Page 3:');
    const page3 = await collection.find(
      {},
      { projection: { title: 1, author: 1, _id: 0 } }
    ).limit(5).skip(10).toArray();
    console.log(page3, '\n');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// =============================================================================
// TASK 4: AGGREGATION PIPELINE
// =============================================================================

async function task4_aggregation() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Calculate average price of books by genre
    console.log('--- 1. Average price by genre ---');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();
    console.log(avgPriceByGenre, '\n');

    // 2. Find the author with the most books in the collection
    console.log('--- 2. Author with most books ---');
    const authorWithMostBooks = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
          books: { $push: '$title' }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();
    console.log(authorWithMostBooks, '\n');

    // 3. Group books by publication decade and count them
    console.log('--- 3. Books grouped by decade ---');
    const booksByDecade = await collection.aggregate([
      {
        $project: {
          title: 1,
          author: 1,
          published_year: 1,
          decade: {
            $subtract: [
              '$published_year',
              { $mod: ['$published_year', 10] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          bookCount: { $sum: 1 },
          books: { $push: { title: '$title', year: '$published_year' } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    console.log(JSON.stringify(booksByDecade, null, 2), '\n');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// =============================================================================
// TASK 5: INDEXING
// =============================================================================

async function task5_indexing() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Create an index on the title field
    console.log('--- 1. Creating index on title ---');
    const titleIndex = await collection.createIndex({ title: 1 });
    console.log('Index created:', titleIndex, '\n');

    // 2. Create a compound index on author and published_year
    console.log('--- 2. Creating compound index on author and published_year ---');
    const compoundIndex = await collection.createIndex({
      author: 1,
      published_year: -1
    });
    console.log('Compound index created:', compoundIndex, '\n');

    // 3. List all indexes
    console.log('--- 3. All indexes on books collection ---');
    const indexes = await collection.indexes();
    console.log(indexes, '\n');

    // 4. Use explain() to demonstrate performance improvement
    console.log('--- 4. Query performance analysis ---');

    // Query without using index (collection scan)
    console.log('Performance without index (searching by genre):');
    const explainNoIndex = await collection.find({ genre: 'Fiction' }).explain('executionStats');
    console.log('Execution time:', explainNoIndex.executionStats.executionTimeMillis, 'ms');
    console.log('Documents examined:', explainNoIndex.executionStats.totalDocsExamined, '\n');

    // Query using title index
    console.log('Performance with index (searching by title):');
    const explainWithIndex = await collection.find({ title: '1984' }).explain('executionStats');
    console.log('Execution time:', explainWithIndex.executionStats.executionTimeMillis, 'ms');
    console.log('Documents examined:', explainWithIndex.executionStats.totalDocsExamined);
    console.log('Index used:', explainWithIndex.executionStats.executionStages.indexName, '\n');

    // Query using compound index
    console.log('Performance with compound index (author + year):');
    const explainCompound = await collection.find({
      author: 'George Orwell',
      published_year: { $gte: 1940 }
    }).explain('executionStats');
    console.log('Execution time:', explainCompound.executionStats.executionTimeMillis, 'ms');
    console.log('Documents examined:', explainCompound.executionStats.totalDocsExamined);
    console.log('Index used:', explainCompound.executionStats.executionStages.indexName, '\n');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// =============================================================================
// MAIN FUNCTION - Run all tasks
// =============================================================================

async function runAllTasks() {
  console.log('\n========================================');
  console.log('TASK 2: BASIC CRUD OPERATIONS');
  console.log('========================================\n');
  await task2_basicCRUD();

  console.log('\n========================================');
  console.log('TASK 3: ADVANCED QUERIES');
  console.log('========================================\n');
  await task3_advancedQueries();

  console.log('\n========================================');
  console.log('TASK 4: AGGREGATION PIPELINE');
  console.log('========================================\n');
  await task4_aggregation();

  console.log('\n========================================');
  console.log('TASK 5: INDEXING');
  console.log('========================================\n');
  await task5_indexing();
}

// Run all tasks
runAllTasks().catch(console.error);

// =============================================================================
// ALTERNATIVE: Run individual tasks
// =============================================================================
// Uncomment any of these lines to run tasks individually:

// task2_basicCRUD().catch(console.error);
// task3_advancedQueries().catch(console.error);
// task4_aggregation().catch(console.error);
// task5_indexing().catch(console.error);

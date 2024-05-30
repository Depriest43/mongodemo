const { MongoClient } = require("mongodb");
require("dotenv").config();
const CONNECTION_STRING = process.env.CONNECTION_STRING;
console.log(CONNECTION_STRING);
const client = new MongoClient(CONNECTION_STRING);
try {
  client.connect();
  console.log("Connected to the database");
} catch (e) {
  console.error(e);
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

listDatabases(client);
const db = client.db("sample_mflix");

async function listCollections(db) {
  collections = await db.listCollections().toArray();
  console.log("Collections:");
  collections.forEach((collection) => console.log(` - ${collection.name}`));
}

listCollections(db);

const movies = db.collection("movies");

async function findAllMovies() {
  const cursor = movies.find({});
  const moviesArray = await cursor.toArray();
  const filteredMovies = moviesArray.filter((movie) => movie.year === 1972);
  console.log(moviesArray);
}
//remove comment here to find all movies. output will be extremely long
//findAllMovies();

//It is possible to get all of the movies and then
//filter them in the application, but it is better to
//filter the movies in the database

//lets find a movie
async function findMovie(title) {
  const query = { title: title };
  //find one
  const movie = await movies.findOne(query);
  console.log(movie);
}

//findMovie("The Godfather");

//lets find movies by genre and year
async function findMoviesByGenreAndYear(genre, year) {
  const query = { genre: genre, year: year };
  const cursor = movies.find(query);
  const moviesArray = await cursor.toArray();
  console.log(moviesArray);
}
//remove comment here to find some of the movies.
//findMoviesByGenreAndYear("Drama", 1972);

//lets insert a movie
async function insertMovie(movie) {
  const result = await movies.insertOne(movie);
  console.log(`New movie created with the following id: ${result.insertedId}`);
}

const newMovie = {
  title: "Elden Ring",
  year: 2022,
  director: "Steven Spielberg",
};
//remove comment here to insert a movie
//insertMovie(newMovie);

//lets update a movie

async function updateMovie(title, year) {
  const query = { title: title };
  const update = { $set: { year: year } };
  const result = await movies.updateOne(query, update);
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//updateMovie("Elden Ring", 2020);

//lets delete a movie
async function deleteMovie(title) {
  const query = { title: title };
  const result = await movies.deleteOne(query);
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
//remove comment to delete a movie
//deleteMovie("Elden Ring");

// sudo service postgresql start

import express from 'express';
// import methodOverride from 'method-override';
// import { add, read, write } from './jsonFileStorage.js';
import pool from './initClient.js';

pool.connect();

const app = express();
app.set('view engine', 'ejs');

//
app.use(express.static('public'));

// Configure Express to parse requst body data into request.body
app.use(express.urlencoded({ extended: false }));

const tableName = 'birding';

// sqlHandlers
const handleQueryError = (queryError) => {
  console.error('You messed up: ', queryError);
};

const handleEmptyResult = () => {
  console.log('No viewings!');
};

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    handleQueryError(error);
    return;
  }

  // if (result.rows.length <= 0) {
  //   handleEmptyResult();
  //   return;
  // }
  console.log(result.rows);
};

const whenQueryInsert = (error, result) => {
  const checkQuery = `SELECT * from ${tableName}`;
  pool.query(checkQuery, (err, res) => {
    if (err) {
      console.error(err);
    }
    const allResult = res.rows;
    console.log(allResult);
  });
};

//
const dictEntry = { date: 'Date', behavior: 'Behavior', flock: 'Flock Size' };

const handleNoteRequest = (request, response) => {
  const listEntry = Object.values(dictEntry);
  console.log({ listEntry });
  response.render('noteEJS', { listEntry });
};

const handleNewNote = (request, response) => {
  // Results from the request. Put it in a list of objects
  const submission = Object.values(request.body);

  const keys = Object.keys(dictEntry);
  const listEntry = Object.values(dictEntry);

  const sqlDataInsert = `INSERT INTO ${tableName} (${keys[0]}, ${keys[1]}, ${keys[2]}) VALUES ($1,$2,$3)`;
  pool.query(sqlDataInsert, submission, whenQueryInsert);

  response.render('noteEJS', { listEntry });
};

const handleIndexQuery = (request, response) => {
  const { id } = request.params;

  const sqlQuery = `SELECT * FROM ${tableName} WHERE id=${id}`;
  pool.query(sqlQuery, (error, result) => {
    const indexResult = result.rows[0];
    console.log(indexResult);
    if (error) {
      handleQueryError();
    }
    if (result.rows.length <= 0) {
      handleEmptyResult();
    }

    response.render('displayIndex', { indexResult });
  });
};

const handleHomePage = (request, response) => {
  const sqlQuery = `SELECT * FROM ${tableName}`;
  pool.query(sqlQuery, (error, result) => {
    if (error) {
      handleQueryError(error);
    }

    const results = result.rows;
    console.log(results);
    response.render('homePage', { results });
  });
};

app.get('/note', handleNoteRequest);
app.post('/note', handleNewNote);
app.get('/note/:id', handleIndexQuery);
app.get('/', handleHomePage);

app.listen(3004);

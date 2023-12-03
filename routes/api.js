const express = require('express');
const { readFromFile, readAndAppend, readAndDelete } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

const api = express.Router();

api.get('/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })
    .catch((error) => {
      console.error('Error reading from file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

api.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json')
      .then(() => res.json({ body: newNote }))
      .catch((error) => {
        console.error('Error appending to file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } else {
    res.status(400).json({ error: 'Title and text are required' });
  }
});

api.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    readAndDelete(noteId, './db/db.json')
      .then(() => res.json({ success: true }))
      .catch((error) => {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  

module.exports = api;

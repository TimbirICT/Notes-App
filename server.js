const express = require('express');
const path = require('path');
const api = require('./routes/api.js');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Middleware for parsing JSON and urlencoded form data
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.post('/notes', (req, res) => {
  console.info('${req.method} request received to add a note');
  const { title, text } = req.body;
  if (title && text ) {
    const newNote = {
      title,
      text,
      
    };

    const response = {
      body: newNote,
    };

    res.status(201).json(response);
    fs.appendFile(__dirname + '/db/db.json', JSON.stringify(response, null, 2) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data has been written to the file');
      }
    });
  } else {
    res.status(500).json('Error in saving note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  // Read the existing notes from the file
  readFromFile(dbFilePath)
    .then((data) => {
      const notes = JSON.parse(data);

      // Find the index of the note with the specified ID
      const noteIndex = notes.findIndex((note) => note.id === noteId);

      if (noteIndex !== -1) {
        // Remove the note from the array
        notes.splice(noteIndex, 1);

        // Write the updated notes back to the file
        fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2))
          .then(() => {
            console.log(`Note with ID ${noteId} deleted successfully.`);
            res.status(204).end(); // 204 No Content indicates success with no response body
          })
          .catch((error) => {
            console.error('Error writing to file:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      } else {
        
        res.status(404).json({ error: 'Note not found' });
      }
    })
    .catch((error) => {
      console.error('Error reading from file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

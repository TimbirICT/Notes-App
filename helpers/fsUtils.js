const fs = require('fs').promises;

/
// Function to read from a file
const readFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data.trim() === '' ? '[]' : data;
  } catch (error) {
    console.error('Error reading from file:', error);
    throw error;
  }
};


// Function to read from a file, append data
const readAndAppend = async (content, file) => {
  try {
    // Read the file and parse its contents
    const data = await readFromFile(file);
    const parsedData = JSON.parse(data);

    parsedData.push(content);

    // Write the updated array back to the file
    await fs.writeFile(file, JSON.stringify(parsedData, null, 2));

    console.log('Content has been appended to the file');
  } catch (error) {
    console.error('Error appending to file:', error);
    throw error;
  }
};


// Function to delete data from a file
const readAndDelete = async (id, filePath) => {
  try {
    const data = await readFromFile(filePath);
    const parsedData = JSON.parse(data);
    const newData = parsedData.filter((item) => item.id !== id);
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
  } catch (error) {
    console.error('Error deleting from file:', error);
    throw error;
  }
};

module.exports = { readFromFile, readAndAppend, readAndDelete };

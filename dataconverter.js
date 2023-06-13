const csv = require('csv-parser');
const fs = require('fs');

// Define the file paths for the CSV files
const nodesFilePath = '/Users/mikio/Desktop/Nodes.csv';
const edgesFilePath = '/Users/mikio/Desktop/Edges.csv';

// Define the output file path for the data.js file
const outputFilePath = 'data.js';

// Initialize arrays to store the nodes and edges
const nodes = [];
const edges = [];

// Read and process the Nodes.csv file
fs.createReadStream(nodesFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const { id, name } = row;
    nodes.push({ id, name });
  })
  .on('end', () => {
    // Read and process the Edges.csv file
    fs.createReadStream(edgesFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const { source, target } = row;
        edges.push({ source, target });
      })
      .on('end', () => {
        // Create the data object
        const data = { nodes, edges };

        // Write the data object to the output file
        fs.writeFileSync(outputFilePath, `export const data = ${JSON.stringify(data, null, 2)};`);

        console.log(`Data conversion completed. Output file: ${outputFilePath}`);
      });
  });

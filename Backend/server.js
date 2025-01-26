const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

const CONFIG_FILE_PATH = path.join(__dirname, 'graphConfigurations.json');

app.use(cors());
app.use(express.json());

const initializeConfigFile = async () => {
  try {
    await fs.access(CONFIG_FILE_PATH);
  } catch {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify([]));
  }
};

const readConfigurations = async () => {
  try {
    const data = await fs.readFile(CONFIG_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading configurations:', error);
    return [];
  }
};

const saveConfigurations = async (configurations) => {
  try {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(configurations, null, 2));
  } catch (error) {
    console.error('Error saving configurations:', error);
  }
};

app.get('/api/graph/list', async (req, res) => {
  const configurations = await readConfigurations();
  res.json(configurations.map(config => config.name));
});

app.get('/api/graph/load/:name', async (req, res) => {
  const configurations = await readConfigurations();
  const configuration = configurations.find(config => config.name === req.params.name);
  
  if (configuration) {
    res.json(configuration);
  } else {
    res.status(404).json({ message: 'Configuration not found' });
  }
});

app.post('/api/graph/save', async (req, res) => {
  const { name, nodes, adjacencyMatrix } = req.body;
  
  if (!name || !nodes || !adjacencyMatrix) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const configurations = await readConfigurations();
  const existingIndex = configurations.findIndex(config => config.name === name);
  
  const configuration = { name, nodes, adjacencyMatrix };
  
  if (existingIndex !== -1) {
    configurations[existingIndex] = configuration;
  } else {
    configurations.push(configuration);
  }
  
  await saveConfigurations(configurations);
  res.status(200).json({ message: 'Configuration saved successfully' });
});

const startServer = async () => {
  await initializeConfigFile();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
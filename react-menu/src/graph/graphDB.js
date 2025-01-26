const fs = require('fs');
const path = require('path');

const CONFIG_FILE_PATH = path.join(__dirname, 'graphConfigurations.json');

const readConfigurations = () => {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading configurations:', error);
    return [];
  }
};

const saveConfigurations = (configurations) => {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configurations, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving configurations:', error);
    return false;
  }
};

const saveGraphConfiguration = (name, nodes, adjacencyMatrix) => {
  const configurations = readConfigurations();
  const existingIndex = configurations.findIndex(config => config.name === name);
  
  const configuration = { name, nodes, adjacencyMatrix };
  
  if (existingIndex !== -1) {
    configurations[existingIndex] = configuration;
  } else {
    configurations.push(configuration);
  }
  
  return saveConfigurations(configurations);
};

const listGraphConfigurations = () => {
  const configurations = readConfigurations();
  return configurations.map(config => config.name);
};

const loadGraphConfiguration = (name) => {
  const configurations = readConfigurations();
  return configurations.find(config => config.name === name) || null;
};

module.exports = {
  saveGraphConfiguration,
  listGraphConfigurations,
  loadGraphConfiguration
};
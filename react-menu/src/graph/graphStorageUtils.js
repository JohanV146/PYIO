export const saveGraphConfiguration = (name, nodes, adjacencyMatrix) => {
    try {
      const configuration = {
        name,
        nodes,
        adjacencyMatrix
      };
      
      const savedConfigurations = JSON.parse(localStorage.getItem('graphConfigurations') || '[]');
      
      const existingIndex = savedConfigurations.findIndex(config => config.name === name);
      
      if (existingIndex !== -1) {
        savedConfigurations[existingIndex] = configuration;
      } else {
        savedConfigurations.push(configuration);
      }
      
      localStorage.setItem('graphConfigurations', JSON.stringify(savedConfigurations));
      return true;
    } catch (error) {
      console.error('Error saving configuration:', error);
      return false;
    }
  };
  
  export const listGraphConfigurations = () => {
    try {
      const savedConfigurations = JSON.parse(localStorage.getItem('graphConfigurations') || '[]');
      return savedConfigurations.map(config => config.name);
    } catch (error) {
      console.error('Error listing configurations:', error);
      return [];
    }
  };
  
  export const loadGraphConfiguration = (name) => {
    try {
      const savedConfigurations = JSON.parse(localStorage.getItem('graphConfigurations') || '[]');
      const configuration = savedConfigurations.find(config => config.name === name);
      return configuration || null;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return null;
    }
  };
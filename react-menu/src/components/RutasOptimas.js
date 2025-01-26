import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import "./RutasOptimas.css";
import FloydWarshallVisualization from './Floyd';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/graph';

export const saveGraphConfiguration = async (name, nodes, adjacencyMatrix) => {
  try {
    const response = await axios.post(`${API_URL}/save`, {
      name, 
      nodes, 
      adjacencyMatrix
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error saving configuration:', error);
    return false;
  }
};

export const listGraphConfigurations = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    console.error('Error listing configurations:', error);
    return [];
  }
};

export const loadGraphConfiguration = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/load/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return null;
  }
};

const SaveConfigModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  nodes, 
  adjacencyMatrix 
}) => {
  const [configName, setConfigName] = useState('');

  const handleSave = () => {
    if (configName.trim()) {
      onSave(configName, nodes, adjacencyMatrix);
      onClose();
      setConfigName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2 className="modal-title">Save Configuration</h2>
        <input
          type="text"
          placeholder="Enter configuration name"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          className="input"
        />
        <div className="button-group">
          <button onClick={handleSave} className="button save-button">
            Save
          </button>
          <button onClick={onClose} className="button cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadConfigModal = ({ 
  isOpen, 
  onClose, 
  onLoad 
}) => {
  const [availableConfigs, setAvailableConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      if (isOpen) {
        try {
          const configs = await axios.get(`${API_URL}/list`);
          setAvailableConfigs(configs.data);
        } catch (error) {
          console.error('Error fetching configurations:', error);
        }
      }
    };
    fetchConfigs();
  }, [isOpen]);

  const handleLoad = async () => {  // Add 'async' keyword
    if (selectedConfig) {
      try {
        const response = await axios.get(`${API_URL}/load/${selectedConfig}`);
        const config = response.data;
        const processedConfig = {
          ...config,
          adjacencyMatrix: config.adjacencyMatrix.map(row => 
            row.map(val => val === null ? Infinity : val)
          )
        };
        onLoad(processedConfig);
        onClose();
        setSelectedConfig(null);
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2>Load Configuration</h2>
          <select 
            value={selectedConfig || ''}
            onChange={(e) => setSelectedConfig(e.target.value)}
            className="modal-select"
          >
            <option value="">Select a configuration</option>
            {availableConfigs.map(config => (
              <option key={config} value={config}>{config}</option>
            ))}
          </select>
          <div className="modal-actions">
            <button 
              onClick={handleLoad} 
              disabled={!selectedConfig}
              className="modal-btn save-btn"
            >
              Load
            </button>
            <button onClick={onClose} className="modal-btn cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptimalRoutesApp = () => {
  const [nodes, setNodes] = useState(
    Array.from({length: 10}, (_, i) => ({
      id: String.fromCharCode(65 + i),
      label: String.fromCharCode(65 + i)
    }))
  );

  const [nodePositions, setNodePositions] = useState(
    Array.from({length: 10}, () => ({ x: 0, y: 0 }))
  );

  const [adjacencyMatrix, setAdjacencyMatrix] = useState(() => 
    Array.from({length: 10}, (_, rowIndex) => 
      Array.from({length: 10}, (_, colIndex) => 
        rowIndex === colIndex ? 0 : Infinity
      )
    )
  );

  const [showVisualization, setShowVisualization] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const graphRef = useRef(null);
  const cyRef = useRef(null);

  const handleSaveConfiguration = async (name, nodes, matrix) => {
    try {
      await axios.post(`${API_URL}/save`, { name, nodes, adjacencyMatrix: matrix });
      // Optional: Add success notification
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Optional: Add error notification
    }
  };

  const handleLoadConfiguration = (config) => {
    if (config) {
      setNodes(config.nodes);
      setAdjacencyMatrix(config.adjacencyMatrix);
    }
  };

  
  const handleCreateRoute = () => {
    if (cyRef.current) {
      const positions = nodes.map(node => {
        const cyNode = cyRef.current.getElementById(node.id);
        return cyNode.position();
      });
      setNodePositions(positions);
    }
    setShowVisualization(true);
  };

  const handleBackToMatrix = () => {
    setShowVisualization(false);
  };

  // Update Cytoscape edge rendering
const createUniqueEdges = (nodes, adjacencyMatrix) => {
  const edges = [];
  nodes.forEach((fromNode, fromIndex) => {
    nodes.forEach((toNode, toIndex) => {
      if (fromIndex !== toIndex) {
        const forwardWeight = adjacencyMatrix[fromIndex][toIndex];
        const reverseWeight = adjacencyMatrix[toIndex][fromIndex];
        
        if (forwardWeight !== Infinity) {
          edges.push({
            data: {
              id: `edge-${fromNode.id}-${toNode.id}`,
              source: fromNode.id,
              target: toNode.id,
              label: forwardWeight.toString(),
              type: 'forward'
            }
          });
        }
        
        if (reverseWeight !== Infinity) {
          edges.push({
            data: {
              id: `edge-${toNode.id}-${fromNode.id}`,
              source: toNode.id,
              target: fromNode.id,
              label: reverseWeight.toString(),
              type: 'reverse'
            }
          });
        }
      }
    });
  });
  return edges;
};

  useEffect(() => {
    if (graphRef.current) {
      const cy = cytoscape({
        container: graphRef.current,
        elements: {
          nodes: nodes.map(node => ({
            data: { 
              id: node.id, 
              label: node.label 
            },
            position: nodePositions[nodes.indexOf(node)]
          })),
          edges: createUniqueEdges(nodes, adjacencyMatrix)
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'gray',
              'label': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': 'white'
            }
          },
          {
            selector: 'edge[type="forward"]',
            style: {
              'line-color': 'blue',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'label': 'data(label)',
              'color': 'white',
              'text-background-color': 'black',
              'text-rotation': 'autorotate'
            }
          },
          {
            selector: 'edge[type="reverse"]',
            style: {
              'line-color': 'green',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'label': 'data(label)',
              'text-rotation': 'autorotate',
              'color': 'white',
              'text-background-color': 'black'
            }
          }
        ],
        layout: {
          name: 'grid'
        },
        interactive: true,
        userZoomingEnabled: false,
        userPanningEnabled: false,
        boxSelectionEnabled: false,
        selectionType: 'single'
      });

      cy.on('drag', 'node', function(e) {
        const node = e.target;
        const pos = node.position();
        const containerBounds = graphRef.current.getBoundingClientRect();
        const nodeWidth = containerBounds.width / Math.ceil(Math.sqrt(nodes.length));
        const nodeHeight = containerBounds.height / Math.ceil(Math.sqrt(nodes.length));

        const minX = nodeWidth / 2;
        const maxX = containerBounds.width - nodeWidth / 2;
        node.position('x', Math.max(minX, Math.min(pos.x, maxX)));

        // Adjust y position
        const minY = nodeHeight / 2;
        const maxY = containerBounds.height - nodeHeight / 2;
        node.position('y', Math.max(minY, Math.min(pos.y, maxY)));
      });



      cyRef.current = cy;
    }
  }, [nodes, adjacencyMatrix]);

  const handleNodeCountChange = (count) => {

    const validCount = Math.max(1, Math.min(10, count));

    const newNodes = Array.from({length: count}, (_, i) => ({
      id: String.fromCharCode(65 + i),
      label: String.fromCharCode(65 + i)
    }));
    
    const newMatrix = Array.from({length: validCount}, (_, rowIndex) => 
      Array.from({length: validCount}, (_, colIndex) => 
        rowIndex === colIndex ? 0 : Infinity
      )
    );

    setNodes(newNodes);
    setAdjacencyMatrix(newMatrix);
  };

  const handleNodeLabelChange = (index, newLabel) => {
    const updatedNodes = [...nodes];
    updatedNodes[index].label = newLabel;
    setNodes(updatedNodes);

    if (cyRef.current) {
      const cyNode = cyRef.current.getElementById(nodes[index].id);
      cyNode.data('label', newLabel);
    }
  };

  const handleMatrixWeightChange = (row, col, weight) => {
    if (row !== col) {
      const cleanedWeight = weight.replace(/[^0-9]/g, '');
      const numericWeight = cleanedWeight === '' ? Infinity : Number(cleanedWeight);
      
      const updatedMatrix = adjacencyMatrix.map(row => [...row]);
      updatedMatrix[row][col] = numericWeight;
      setAdjacencyMatrix(updatedMatrix);
    }
  };

  const renderMatrixValue = (value) => {
    return value === Infinity ? '∞' : value;
  };

  if (showVisualization) {
    return (
      <FloydWarshallVisualization 
        initialMatrix={adjacencyMatrix} 
        nodes={nodes}
        nodePositions={nodePositions}
        onBack={handleBackToMatrix}
      />
    );
  }
  

  return (
    <div className="flexContainer">
      <div className="graphContainer">
        <div 
          ref={graphRef} 
          style={{width: '700px', height: '500px', border: '1px solid white'}} 
        />
      </div>
      <div className="cantNodesContainer">
        <div className="flex-container">
          <div className="cantNodesInput flex-grow">
            <div className="cantNodes">
              <label className="block-label"> Number of Nodes (1-10): </label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={nodes.length}
                onChange={(e) => handleNodeCountChange(Number(e.target.value))}
                className="inputE"
                onKeyDown={(e) => e.preventDefault()} 
              />
            </div>
          
            <div className="flex-container spaced-buttons">
              <button 
                className="btn blue-bg white-text"
                onClick={handleCreateRoute}
              >
                Create Route
              </button>
              <button 
                className="btn green-bg white-text"
                onClick={() => setShowLoadModal(true)}
              >
                Load
              </button>
              <button 
                className="btn gray-bg white-text"
                onClick={() => setShowSaveModal(true)}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="full-width border-collapse">
            <thead>
              <tr>
                <th className="table-header sticky-first-column"> </th>
                {nodes.map(node => (
                  <th key={node.id} className="table-header">
                  <input
                    type="text"
                    value={node.label}
                    onChange={(e) => handleNodeLabelChange(nodes.indexOf(node), e.target.value)}
                    className="full-width text-center"
                  />
                </th>
              ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((rowNode, rowIndex) => (
                <tr key={rowNode.id}>
                  <td className="table-cell sticky-first-column text-center">{rowNode.label}</td>
                  {nodes.map((colNode, colIndex) => (
                    <td key={colNode.id} className="table-cell">
                      <input
                        type="text"
                        value={rowIndex === colIndex ? '0' : renderMatrixValue(adjacencyMatrix[rowIndex][colIndex])}
                        onChange={(e) => {
                          const updatedMatrix = [...adjacencyMatrix];
                          const weight = e.target.value.replace(/[^0-9]/g, '');
                          updatedMatrix[rowIndex][colIndex] = weight === '' ? Infinity : Number(weight);
                          setAdjacencyMatrix(updatedMatrix);
                        }}
                        className={`full-width text-center 
                          ${rowIndex < colIndex ? 'bg-blue-100' : 'bg-green-100'}
                        `}
                        disabled={rowIndex === colIndex}
                      />
                      <input
                        type="text"
                        value={renderMatrixValue(adjacencyMatrix[colIndex][rowIndex])}
                        onChange={(e) => {
                          const updatedMatrix = [...adjacencyMatrix];
                          const weight = e.target.value.replace(/[^0-9]/g, '');
                          updatedMatrix[colIndex][rowIndex] = weight === '' ? Infinity : Number(weight);
                          setAdjacencyMatrix(updatedMatrix);
                        }}
                        className={`w-1/2 text-center ${rowIndex > colIndex ? 'bg-blue-100' : 'bg-green-100'}`}
                      />
                      {rowIndex === colIndex && (
                        <input
                          type="text"
                          value="0"
                          disabled
                          className="full-width text-center"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SaveConfigModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveConfiguration}
        nodes={nodes}
        adjacencyMatrix={adjacencyMatrix}
      />

      <LoadConfigModal 
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onLoad={handleLoadConfiguration}
      />
    </div>
  );
};

export default OptimalRoutesApp;
import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './Floyd.css';

const FloydWarshallVisualization = ({ initialMatrix, nodes, nodePositions, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [distanceMatrices, setDistanceMatrices] = useState([]);
    const [pathMatrices, setPathMatrices] = useState([]);
    const [changedCells, setChangedCells] = useState([]);
    const [showOptimalRouteDialog, setShowOptimalRouteDialog] = useState(false);
    const [selectedSourceNode, setSelectedSourceNode] = useState('');
    const [selectedTargetNode, setSelectedTargetNode] = useState('');
    const [optimalRoute, setOptimalRoute] = useState(null);

    const graphRef = useRef(null);
    const cyRef = useRef(null);
  
    useEffect(() => {
      if (!initialMatrix || !nodes || nodes.length === 0) {
        console.error('Invalid props passed to FloydWarshallVisualization');
        return;
      }
  
      const runFloydWarshallAlgorithm = () => {
        const n = nodes.length;
        
        const initialDistanceMatrix = initialMatrix.map(row => [...row]);
        const initialPathMatrix = Array.from({length: n}, () => 
          Array.from({length: n}, () => 0)
        );
  
        const newDistanceMatrices = [initialDistanceMatrix];
        const newPathMatrices = [initialPathMatrix];
        const newChangedCells = [[]];
  
        for (let k = 0; k < n; k++) {
          const currentDistanceMatrix = newDistanceMatrices[newDistanceMatrices.length - 1].map(row => [...row]);
          const currentPathMatrix = newPathMatrices[newPathMatrices.length - 1].map(row => [...row]);
          const currentChangedCells = [];
  
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              const directDistance = currentDistanceMatrix[i][j];
              const throughKDistance = 
                (currentDistanceMatrix[i][k] !== Infinity && 
                 currentDistanceMatrix[k][j] !== Infinity)
                  ? currentDistanceMatrix[i][k] + currentDistanceMatrix[k][j]
                  : Infinity;
              
              if (throughKDistance < directDistance) {
                currentDistanceMatrix[i][j] = throughKDistance;
                currentPathMatrix[i][j] = k+1;
                currentChangedCells.push({ row: i, col: j });
              }
            }
          }
  
          newDistanceMatrices.push(currentDistanceMatrix);
          newPathMatrices.push(currentPathMatrix);
          newChangedCells.push(currentChangedCells);
        }
  
        setDistanceMatrices(newDistanceMatrices);
        setPathMatrices(newPathMatrices);
        setChangedCells(newChangedCells);
      };
  
      runFloydWarshallAlgorithm();
    }, [initialMatrix, nodes]);

    const handleNextStep = () => {
        if (currentStep === distanceMatrices.length - 2) {
            // Special case for the very last matrix step
            setCurrentStep(currentStep + 1);
            setShowOptimalRouteDialog(true);
        } else if (currentStep < distanceMatrices.length - 2) {
            setCurrentStep(currentStep + 1);
        }
    };
    const findOptimalRoute = () => {
        const sourceIndex = nodes.findIndex(node => node.label === selectedSourceNode);
        const targetIndex = nodes.findIndex(node => node.label === selectedTargetNode);
      
        if (sourceIndex === -1 || targetIndex === -1) {
          setOptimalRoute(null);
          return;
        }
      
        const finalDistanceMatrix = distanceMatrices[distanceMatrices.length - 1];
        const finalPathMatrix = pathMatrices[pathMatrices.length - 1];
      
        const distance = finalDistanceMatrix[sourceIndex][targetIndex];
        
        if (distance === Infinity) {
          setOptimalRoute({ 
            exists: false, 
            message: 'No route exists between these nodes.' 
          });
          return;
        }
      
        const reconstructPath = (start, end, pathMatrix) => {
          if (start === end) return [nodes[start].label];
          const intermediate = pathMatrix[start][end] - 1;
          
          if (intermediate < 0) {
            return [nodes[start].label, nodes[end].label];
          }
          
          const leftPath = reconstructPath(start, intermediate, pathMatrix);
          const rightPath = reconstructPath(intermediate, end, pathMatrix);
          
          return [...leftPath, nodes[intermediate].label, ...rightPath.slice(1)];
        };
      
        const path = reconstructPath(sourceIndex, targetIndex, finalPathMatrix);
      
        setOptimalRoute({
          exists: true,
          distance: distance,
          path: path
        });
      };

    const closeOptimalRouteDialog = () => {
      setShowOptimalRouteDialog(false);
      setSelectedSourceNode('');
      setSelectedTargetNode('');
      setOptimalRoute(null);
    };

    const renderMatrixValue = (value) => {
      return value === Infinity ? '∞' : value;
    };
  
    const isChangedCell = (rowIndex, colIndex) => {
      return changedCells[currentStep].some(
        cell => cell.row === rowIndex && cell.col === colIndex
      );
    };
  
    const handlePreviousStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };
  
    if (distanceMatrices.length === 0 || pathMatrices.length === 0) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="flexContainer">
        <div className="cantNodesContainer">
          <div className="flex-container spaced-buttons">
            <button 
              className="btn blue-bg white-text"
              onClick={onBack}
            >
              Back to Matrix
            </button>
            <button 
              className="btn blue-bg white-text"
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button 
              className="btn green-bg white-text"
              onClick={handleNextStep}
              disabled={currentStep === distanceMatrices.length - 1}
            >
              Next
            </button>
          </div>

          <div className="floyd-matrix-container">
            <h3 className="floyd-matrix-title">Distance Matrix D{currentStep}</h3>
            <table className="full-width border-collapse floyd-matrix-table">
              <thead>
                <tr>
                  <th className="table-header sticky-first-column floyd-matrix-header"> </th>
                  {nodes.map(node => (
                    <th key={node.id} className="table-header floyd-matrix-header">
                      {node.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map((rowNode, rowIndex) => (
                  <tr key={rowNode.id}>
                    <td className="table-cell sticky-first-column text-center floyd-matrix-row-header">
                      {rowNode.label}
                    </td>
                    {nodes.map((colNode, colIndex) => (
                      <td 
                        key={colNode.id} 
                        className={`table-cell text-center floyd-matrix-cell ${
                          isChangedCell(rowIndex, colIndex) ? 'floyd-matrix-cell-changed' : ''
                        }`}
                      >
                        {renderMatrixValue(distanceMatrices[currentStep][rowIndex][colIndex])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="floyd-matrix-title">Path Matrix P{currentStep}</h3>
            <table className="full-width border-collapse floyd-matrix-table">
              <thead>
                <tr>
                  <th className="table-header sticky-first-column floyd-matrix-header"> </th>
                  {nodes.map(node => (
                    <th key={node.id} className="table-header floyd-matrix-header">
                      {node.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map((rowNode, rowIndex) => (
                  <tr key={rowNode.id}>
                    <td className="table-cell sticky-first-column text-center floyd-matrix-row-header">
                      {rowNode.label}
                    </td>
                    {nodes.map((colNode, colIndex) => (
                      <td 
                        key={colNode.id} 
                        className={`table-cell text-center floyd-matrix-cell ${
                          isChangedCell(rowIndex, colIndex) ? 'floyd-matrix-cell-changed' : ''
                        }`}
                      >
                        {pathMatrices[currentStep][rowIndex][colIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showOptimalRouteDialog && (
          <div className="optimal-route-dialog">
            <div className="dialog-content">
              <h2>Find Optimal Route</h2>
              <div className="node-selectors">
                <select 
                  value={selectedSourceNode}
                  onChange={(e) => setSelectedSourceNode(e.target.value)}
                >
                  <option value="">Select Source Node</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.label}>
                      {node.label}
                    </option>
                  ))}
                </select>
                <select 
                  value={selectedTargetNode}
                  onChange={(e) => setSelectedTargetNode(e.target.value)}
                >
                  <option value="">Select Target Node</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.label}>
                      {node.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dialog-actions">
                <button 
                  onClick={findOptimalRoute}
                  disabled={!selectedSourceNode || !selectedTargetNode}
                >
                  Find Route
                </button>
                <button onClick={closeOptimalRouteDialog}>
                  Close
                </button>
              </div>
              {optimalRoute && (
                <div className="route-result">
                  {optimalRoute.exists ? (
                    <>
                      <p>Distance: {optimalRoute.distance}</p>
                      <p>Path: {optimalRoute.path.join(' → ')}</p>
                    </>
                  ) : (
                    <p>{optimalRoute.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

export default FloydWarshallVisualization;
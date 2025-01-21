import React, { useState } from 'react';
import { generateBST } from './BSTAlgorithm'; 
import { useNavigate } from 'react-router-dom';
import styles from './BinarySearchTree.module.css'; 

const BinarySearchTree = () => {
    const [numKeys, setNumKeys] = useState('');
    const [keys, setKeys] = useState([]); 
    const [weights, setWeights] = useState([]); 
    const [result, setResult] = useState(null); 
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleNumKeysChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) { // para validar los numeros
            const num = parseInt(value, 10);
            setNumKeys(value);

            if (num >= 2 && num <= 10) {
                setKeys(Array(num).fill(''));
                setWeights(Array(num).fill(''));
                setError('');
            } else {
                setKeys([]);
                setWeights([]);
                if (value !== '') {
                    setError('El número de llaves debe ser entre 2 y 10.');
                }
            }
        } else {
            setError('Por favor, ingrese solo números.');
        }
    };

    // el creador del arbol binario
    const handleGenerateTree = () => {
        if (!keys.length || !weights.length) {
            setError('Por favor, ingrese la cantidad de llaves.');
            setMessage('');
            return;
        }
        if (keys.some((key) => key.trim() === '') || weights.some((weight) => weight.trim() === '')) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        const numericWeights = weights.map((w) => parseInt(w, 10));
        if (numericWeights.some((w) => isNaN(w))) {
            setError('Los pesos deben ser números válidos.');
            return;
        }
        const treeResult = generateBST(keys, numericWeights);
        setResult(treeResult);
        setError('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = JSON.parse(event.target.result); 
                const { numKeys, keys, weights } = content;

                if (
                    typeof numKeys !== 'number' ||
                    !Array.isArray(keys) ||
                    !Array.isArray(weights) ||
                    keys.length !== numKeys ||
                    weights.length !== numKeys
                ) {
                    setError('El archivo tiene un formato inválido.');
                    return;
                }

                setNumKeys(numKeys.toString());
                setKeys(keys);
                setWeights(weights);


                const numericWeights = weights.map((w) => parseInt(w, 10));
                const treeResult = generateBST(keys, numericWeights);
                setResult(treeResult);
                setMessage('Árbol generado con archivo.');
                setError('');
            } catch (err) {
                setError('No se pudo leer el archivo. Asegúrese de que sea un JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    const handleSaveToFile = () => {

        if (!keys.length || !weights.length) {
            setError('No hay datos disponibles para guardar. Por favor, configure las llaves y los pesos primero.');
            setMessage('');
            return;
        }

        if (keys.some((key) => key.trim() === '') || weights.some((weight) => weight.trim() === '')) {
            setError('Por favor, complete todos los campos antes de guardar.');
            setMessage('');
            return;
        }
        const numericWeights = weights.map((w) => parseInt(w, 10));
        if (numericWeights.some((w) => isNaN(w))) {
            setError('Los pesos deben ser números válidos.');
            setMessage('');
            return;
        }
    
        const data = {
            numKeys: keys.length,
            keys,
            weights: numericWeights,
        };

        const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.download = 'arbolBinarioData.json';
        link.click();

        setMessage('Datos guardados correctamente en archivo JSON.');
        setError('');
    };

    const renderMatrix = (matrix, title) => {
        //para agregar una fila vacia con ceros
        const extendedMatrix = [...matrix, new Array(matrix[0].length).fill(0)];
    
        return (
            <div className={styles.matrixContainer}>
                <h3>{title}</h3>
                <table className={styles.matrixTable}>
                    <thead>
                        <tr>
                            <th></th> 
                            {extendedMatrix[0].slice(1).map((_, index) => (
                                <th key={index}>{index}</th> 
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {extendedMatrix.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td> 
                                {row.slice(1).map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={handleGoBack}>
                ← Volver
            </button>
            <h1>Árbol Binario de Búsqueda Óptimo</h1>
            <form>
                <div>
                    <label>
                        Número de llaves (entre 2 y 10):
                        <input
                            type="text"
                            value={numKeys}
                            onChange={handleNumKeysChange}
                            className={styles.input}
                        />
                    </label>
                </div>
                {keys.length > 0 && (
                    <div>
                        <h3>Ingrese las llaves y sus pesos:</h3>
                        {keys.map((_, index) => (
                            <div key={index}>
                                <label>
                                    Llave {index + 1}:
                                    <input
                                        type="text"
                                        value={keys[index]}
                                        onChange={(e) => setKeys([...keys.slice(0, index), e.target.value, ...keys.slice(index + 1)])}
                                        className={styles.input}
                                    />
                                </label>
                                <label>
                                    Peso:
                                    <input
                                        type="text"
                                        value={weights[index]}
                                        onChange={(e) => setWeights([...weights.slice(0, index), e.target.value, ...weights.slice(index + 1)])}
                                        className={styles.input}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </form>

            {error && <p className={styles.error}>{error}</p>}

            <label 
                className={`${styles.button} ${styles.buttonSmall}`} 
                htmlFor="file-upload">
                Cargar archivo
            </label>
            <input 
                id="file-upload" 
                type="file" 
                onChange={handleFileUpload} 
                className={styles.hiddenInput} 
            />
            

            <button onClick={handleSaveToFile} className={`${styles.button} ${styles.buttonSmall}`}>
                Guardar Datos en Archivo
            </button>
            <button onClick={handleGenerateTree} className={`${styles.button} ${styles.buttonGenerate}`}>
                Generar Árbol
            </button>
            
            {result && (
            <div className={styles.results}>
                {renderMatrix(result.A, 'Tabla A (Costos)')}
                {renderMatrix(result.R, 'Tabla R (Raíces)')}
            </div>
        )}
        </div>
    );
};

export default BinarySearchTree;
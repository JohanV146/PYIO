import React, { useState } from 'react';
import { generateBST } from './BSTAlgorithm'; // Importar la lógica
import { useNavigate } from 'react-router-dom';
import styles from './BinarySearchTree.module.css'; 

const BinarySearchTree = () => {
    const [numKeys, setNumKeys] = useState(''); // Número de llaves
    const [keys, setKeys] = useState([]); // Nombres de las llaves
    const [weights, setWeights] = useState([]); // Pesos de las llaves
    const [result, setResult] = useState(null); // Resultado del algoritmo
    const [error, setError] = useState(''); // Mensajes de error
    const navigate = useNavigate(); // Hook de React Router

    const handleGoBack = () => {
        navigate(-1); // Volver a la página anterior
    };

    // Actualizar el número de llaves y generar inputs dinámicos
    const handleNumKeysChange = (e) => {
        const value = e.target.value;

        // Validar que el valor sea un número entre 2 y 10
        if (/^\d*$/.test(value)) { // Solo números
            const num = parseInt(value, 10);
            setNumKeys(value);

            if (num >= 2 && num <= 10) {
                setKeys(Array(num).fill(''));
                setWeights(Array(num).fill(''));
                setError(''); // Limpiar errores si el número es válido
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

    // Capturar "Enter" en el input del número de llaves
    const handleNumKeysKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const num = parseInt(numKeys, 10);
            if (isNaN(num) || num < 2 || num > 10) {
                setError('El número de llaves debe ser entre 2 y 10.');
            } else {
                setError('');
            }
        }
    };

    // Actualizar el valor de una llave
    const handleKeyChange = (index, value) => {
        const updatedKeys = [...keys];
        updatedKeys[index] = value;
        setKeys(updatedKeys);
    };

    // Actualizar el valor de un peso
    const handleWeightChange = (index, value) => {
        if (/^\d*$/.test(value)) { // Solo números
            const updatedWeights = [...weights];
            updatedWeights[index] = value;
            setWeights(updatedWeights);
            setError('');
        } else {
            setError('Los pesos deben ser números.');
        }
    };

    // Generar el árbol binario
    const handleGenerateTree = () => {
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
    const renderMatrix = (matrix, title) => (
        <div className={styles.matrixContainer}>
            <h3>{title}</h3>
            <table className={styles.matrixTable}>
                <thead>
                    <tr>
                        {matrix[0].map((_, index) => (
                            <th key={index}>{index === 0 ? '' : `Col ${index}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{`Row ${rowIndex + 1}`}</td>
                            {row.slice(1).map((value, colIndex) => (
                                <td key={colIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

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
            <button onClick={handleGenerateTree} className={styles.button}>
                Generar Árbol
            </button>
            {error && <p className={styles.error}>{error}</p>}
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
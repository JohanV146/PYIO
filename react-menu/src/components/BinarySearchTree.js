import React, { useState } from 'react';
import { generateBST } from './BSTAlgorithm'; // Importar la lógica

const BinarySearchTree = () => {
    const [numKeys, setNumKeys] = useState(''); // Número de llaves
    const [keys, setKeys] = useState([]); // Nombres de las llaves
    const [weights, setWeights] = useState([]); // Pesos de las llaves
    const [result, setResult] = useState(null); // Resultado del algoritmo
    const [error, setError] = useState(''); // Mensajes de error

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

    return (
        <div>
            <h1>Árbol Binario de Búsqueda Óptimo</h1>
            <form>
                {/* Número de llaves */}
                <div>
                    <label>
                        Número de llaves (entre 2 y 10):
                        <input
                            type="text"
                            value={numKeys}
                            onChange={handleNumKeysChange}
                            onKeyDown={handleNumKeysKeyDown}
                        />
                    </label>
                </div>

                {/* Inputs dinámicos para llaves y pesos */}
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
                                        onChange={(e) => handleKeyChange(index, e.target.value)}
                                    />
                                </label>
                                <label>
                                    Peso:
                                    <input
                                        type="text"
                                        value={weights[index]}
                                        onChange={(e) => handleWeightChange(index, e.target.value)}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </form>

            {/* Botón para generar el árbol */}
            <button onClick={handleGenerateTree}>Generar Árbol</button>

            {/* Mostrar error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Mostrar resultados */}
            {result && (
                <div>
                    <h2>Resultados</h2>
                    <h3>Tabla A (Costos):</h3>
                    <pre>{JSON.stringify(result.A.slice(1).map(row => row.slice(1)), null, 2)}</pre>
                    <h3>Tabla R (Raíces):</h3>
                    <pre>{JSON.stringify(result.R.slice(1).map(row => row.slice(1)), null, 2)}</pre>
                    <h3>Llaves Ordenadas:</h3>
                    <pre>{JSON.stringify(result.sortedKeys, null, 2)}</pre>
                    <h3>Probabilidades:</h3>
                    <pre>{JSON.stringify(result.probabilities, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default BinarySearchTree;

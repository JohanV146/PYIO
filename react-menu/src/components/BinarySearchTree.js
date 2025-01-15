import React, { useState } from 'react';
import { generateBST } from './BSTAlgorithm'; // importar la logica

const BinarySearchTree = () => {
    const [keys, setKeys] = useState([]);
    const [weights, setWeights] = useState([]);
    const [result, setResult] = useState(null);

    const handleGenerateTree = () => {
        const keys = ["Praga", "newyork", "San Jose", "Paris", "atenas"];
        const weights = [2023, 8504, 3100, 2125, 6617];
        const treeResult = generateBST(keys, weights);
        setResult(treeResult);
    };

    return (
        <div>
            <h1>Árbol Binario de Búsqueda Óptimo</h1>
            <form>
                {/* Inputs para llaves y pesos */}
                {/* Agregar inputs dinámicos para llaves y pesos */}
            </form>
            <button onClick={handleGenerateTree}>Generar Árbol</button>
            {result && (
                <div>
                    <h2>Resultados</h2>
                    {/* Renderizar tablas A y R */}
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default BinarySearchTree;

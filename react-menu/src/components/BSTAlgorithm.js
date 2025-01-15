export function generateBST(keys, weights) {
    // Ordenar las llaves y pesos en orden lexicográfico
    const combined = keys.map((key, index) => ({ key, weight: weights[index] }));
    combined.sort((a, b) => a.key.localeCompare(b.key));

    const sortedKeys = combined.map(item => item.key);
    const sortedWeights = combined.map(item => item.weight);

    // Calcular las probabilidades
    const totalWeight = sortedWeights.reduce((sum, w) => sum + w, 0);
    const probabilities = sortedWeights.map(w => w / totalWeight);

    const n = sortedKeys.length;
    const A = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    const R = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    
    // Precalcular las sumas acumulativas de probabilidades
    const cumulativeSum = [0];
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeSum.push(cumulativeSum[i] + probabilities[i]);
    }

    // Inicializar costos para subárboles de un solo nodo
    for (let i = 1; i <= n; i++) {
        A[i][i] = probabilities[i - 1];
        R[i][i] = i;
    }
    // Calcular costos mínimos para subárboles de longitud mayor
    for (let length = 2; length <= n; length++) {
        for (let i = 1; i <= n - length + 1; i++) {
            const j = i + length - 1;
            A[i][j] = Infinity;

            // Suma de probabilidades para el rango [i, j]
            const weightSum = cumulativeSum[j] - cumulativeSum[i - 1];

            for (let r = i; r <= j; r++) {
                const cost = (r > i ? A[i][r - 1] : 0) + (r < j ? A[r + 1][j] : 0) + weightSum;
                if (cost < A[i][j]) {
                    A[i][j] = cost;
                    R[i][j] = r;
                }
            }
        }
    }
    console.log("Tabla A (costos):", A);
    console.log("Tabla R (raíces):", R);
    console.log("Llaves ordenadas:", sortedKeys);
    console.log("Probabilidades:", probabilities);
    return { A, R, sortedKeys, probabilities };
}

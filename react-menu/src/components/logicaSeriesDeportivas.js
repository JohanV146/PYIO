let tabla = [];
let ordenPartidos = [1, 0, 1]; 
let probabilidadLocal = 0.6;
let probabilidadVisita = 0.5;
let partidas = null;

function crearMatriz(numeroPartidos) {
    partidas = Math.ceil(numeroPartidos / 2); 
    tabla = []; 

    for (let i = 0; i < partidas; i++) {
        let fila = [];
        for (let j = 0; j < partidas; j++) {
            fila.push(0); 
        }
        tabla.push(fila);
    }
}

function llenarTabla() {
    for (let i = 0; i < partidas; i++) {
        tabla[0][i] = 1; 
    }
    for (let j = 0; j < partidas; j++) {
        tabla[j][0] = 0; 
    }
}

function obtenerProbabilidadActual(contador, i) { 
    ganadosEquipoA = partidas - contador;
    ganadosEquipoB = partidas - i;
    partidosTotales = ganadosEquipoA-ganadosEquipoB + 1;

    if (ordenPartidos[partidosTotales+1] === 1) {
        probabilidadActual = probabilidadLocal;
    } else {
        probabilidadActual = probabilidadVisita;
    }
    return probabilidadActual;
}

function ejecutar() {
    let contador = 1;
    while (contador < partidas) {
        for (let i = 1; i < partidas; i++) {
            let probabilidadActual = obtenerProbabilidadActual(
                contador,
                i
            );

            tabla[contador][i] = probabilidadActual * tabla[contador - 1][i] + (1 - probabilidadActual) * tabla[contador][i - 1];
        }
        contador++;
    }
}


crearMatriz(3); 
llenarTabla();
ejecutar();
imprimirTabla();
imprimirTodosLosResultados();

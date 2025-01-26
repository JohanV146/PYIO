import React, { useState } from "react";
import "./seriesDeportivas.css";
 function SeriesProbabilidades(){ 
  const [probabilidadLocal, setProbabilidadLocal] = useState(0.6);
  const [probabilidadVisita, setProbabilidadVisita] = useState(0.5);
  const [numeroPartidos, setNumeroPartidos] = useState(3);
  const [ordenPartidos, setOrdenPartidos] = useState([]);
  const [tabla, setTabla] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const manejarCambioOrden = (index, esLocal) => {
    const nuevoOrden = [...ordenPartidos]; //Puntos para elegir varios
    nuevoOrden[index] = esLocal ? 1 : 0;
    setOrdenPartidos(nuevoOrden);
  };

  const crearMatriz = (numeroPartidos) => {
    const partidas = Math.ceil(numeroPartidos / 2);
    const size = partidas + 1; 
    const tabla = []; 

    for (let i = 0; i < size; i++) {
      let fila = [];
      for (let j = 0; j < size; j++) {
        fila.push(0); 
      }
      tabla.push(fila); 
    }

    return { tabla, partidas };
  };

  const llenarTabla = (tabla, partidas) => {
    for (let i = 0; i <= partidas; i++) {
      tabla[0][i] = 1;
    }
    for (let j = 0; j <= partidas; j++) {
      tabla[j][0] = 0;
    }
    return tabla;
  };


  const obtenerProbabilidadActual = (contador, i) => {
    let partidas = Math.ceil(numeroPartidos / 2);
    let ganadosEquipoA = partidas - contador; 
    let ganadosEquipoB = partidas - i; 
    let partidosTotales = ganadosEquipoA + ganadosEquipoB; 
  
    
    if (partidosTotales >= ordenPartidos.length) {
      setError("Error indices");
      return 0; 
    }
  
    return ordenPartidos[partidosTotales] === 1 
      ? probabilidadLocal 
      : probabilidadVisita;
  };


  const calcularTabla = () => {
    const { tabla, partidas } = crearMatriz(numeroPartidos);
    llenarTabla(tabla, partidas);

    for (let contador = 1; contador <= partidas; contador++) {
      for (let i = 1; i <= partidas; i++) {
        const probabilidadActual = obtenerProbabilidadActual(contador, i);
        tabla[contador][i] =
          (probabilidadActual * tabla[contador - 1][i] +
          (1 - probabilidadActual) * tabla[contador][i - 1]);
      }
    }
    setTabla(tabla);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        const { probabilidadLocal, probabilidadVisita, numeroPartidos, ordenPartidos } = content;

        if (
          typeof probabilidadLocal !== "number" ||
          typeof probabilidadVisita !== "number" ||
          typeof numeroPartidos !== "number" ||
          !Array.isArray(ordenPartidos) ||
          ordenPartidos.length !== numeroPartidos
        ) {
          setError("El archivo tiene un formato inválido.");
          return;
        }

        setProbabilidadLocal(probabilidadLocal);
        setProbabilidadVisita(probabilidadVisita);
        setNumeroPartidos(numeroPartidos);
        setOrdenPartidos(ordenPartidos);

        setMessage("Archivo cargado correctamente");
        setError("");
      } catch (err) {
        setError("No se pudo leer el archivo");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToFile = () => {
    if (!ordenPartidos.length) {
      setError(
        "No hay datos disponibles para guardar, configure las probabilidades primero."
      );
      setMessage("");
      return;
    }

    const data = {
      probabilidadLocal,
      probabilidadVisita,
      numeroPartidos,
      ordenPartidos,
    };

    const blob = new Blob([JSON.stringify(data, null, 4)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "seriesDeportivasData.json";
    link.click();
  };

  return (
    <div className={"SeriesProbabilidades"}>
      
        <button className="backButton" onClick={() => (window.location.href = "/")}>
          Volver
        </button>
        
        <h1 className="titulo">Series deportivas</h1>
     
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calcularTabla();
        }}
      >
        <label>
          Probabilidad local:
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={probabilidadLocal}
            onChange={(e) => setProbabilidadLocal(Number(e.target.value))}
          />
        </label>
        <label>
          Probabilidad visita:
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={probabilidadVisita}
            onChange={(e) => setProbabilidadVisita(Number(e.target.value))}
          />
        </label>
        <label>
          Número de partidos:
          <select
            value={numeroPartidos}
            onChange={(e) => {
              const nuevosPartidos = Number(e.target.value);
              setNumeroPartidos(nuevosPartidos);
              setOrdenPartidos(Array(nuevosPartidos).fill(1)); // Inicializa todos como local
            }}
          >
            {[3, 5, 7, 9, 11].map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <div>
          <h3>Seleccione el orden de los partidos:</h3>
          {[...Array(numeroPartidos)].map((_, index) => ( //Los puntos para la multiseleccion 
            <div key={index}>
              <label>
                Partido {index + 1}:
                <input
                  type="checkbox"
                  checked={ordenPartidos[index] === 1}
                  onChange={(e) => manejarCambioOrden(index, e.target.checked)}
                />
                {ordenPartidos[index] === 1 ? " Local" : " Visita"}
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Calcular</button>
        <br/>
        <button type="button" onClick={handleSaveToFile}>
          Guardar Configuración
        </button>
        <br/>
        <label>
          Cargar archivo
          <input type="file" accept="application/json" onChange={handleFileUpload} />
        </label>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      {tabla.length > 0 && (
        <div>
          <h2>Tabla de Resultados</h2>
          <table>
            <tbody>
              {tabla.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) => (
                    <td key={j}>{celda.toFixed(4)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SeriesProbabilidades;

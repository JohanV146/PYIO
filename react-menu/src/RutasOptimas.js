import React, { useEffect, useState } from "react";
import axios from "axios";

const RutasOptimas = () => {
  const [binaryTrees, setBinaryTrees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBinaryTrees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/binary-trees");
        setBinaryTrees(response.data.saved_trees || []);
      } catch (err) {
        setError("Error al cargar los datos");
      }
    };

    fetchBinaryTrees();
  }, []);

  return (
    <div>
      <h1>Árboles Binarios</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {binaryTrees.length > 0 ? (
            binaryTrees.map((tree) => (
              <li key={tree.id}>
                <strong>Nombre:</strong> {tree.name}
                <br />
                <strong>Llaves:</strong>
                <ul>
                  {tree.keys.map((key, index) => (
                    <li key={index}>
                      {key.text} - Peso: {key.weight}
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <p>No hay árboles binarios guardados.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default RutasOptimas;

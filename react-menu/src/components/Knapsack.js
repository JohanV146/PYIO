import React, { useState } from "react"
import "./Knapsack.css"

function Knapsack() {
  const [capacity, setCapacity] = useState("")
  const [numItems, setNumItems] = useState("")
  const [objects, setObjects] = useState([])
  const [dp, setDp] = useState([])
  const [choice, setChoice] = useState([])
  const [finalValue, setFinalValue] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [finalPicks, setFinalPicks] = useState([])
  const [fileCount, setFileCount] = useState(1)

  function handleCapacityChange(e) {
    setCapacity(e.target.value)
  }

  function handleNumItemsChange(e) {
    setNumItems(e.target.value)
    const arr = []
    for (let i = 0; i < e.target.value; i++) {
      arr.push({ name: "", value: "", cost: "", quantity: "" })
    }
    setObjects(arr)
  }

  function handleObjectChange(index, field, value) {
    const newObjects = [...objects]
    newObjects[index][field] = value
    setObjects(newObjects)
  }

  function handleFileLoad(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result)
      setCapacity(data.capacity)
      setNumItems(data.numItems)
      setObjects(data.objects)
    }
    reader.readAsText(file)
  }

  function handleSaveFile() {
    const newFileCount = fileCount + 1
    setFileCount(newFileCount)
    const data = {
      capacity: capacity,
      numItems: objects.length,
      objects: objects
    }
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "knapsack_" + fileCount + ".json"
    link.click()
    URL.revokeObjectURL(url)
  }

  function solveKnapsack() {
    setShowResults(false)
    setFinalPicks([])
    const n = objects.length
    const cap = parseInt(capacity)
    if (!n || !cap) return
    const items = objects.map((o, i) => {
      let q = o.quantity
      if (typeof q === "string") {
        if (q.toLowerCase() === "infinito") q = Infinity
        else q = parseInt(q)
      }
      if (!q || q < 1) q = 1
      return {
        index: i+1,
        name: o.name || "Obj"+(i+1),
        value: parseInt(o.value)||0,
        cost: parseInt(o.cost)||0,
        quantity: q
      }
    })
    const dpArray = Array.from({ length: cap+1 }, () => Array(n+1).fill(0))
    const choiceArray = Array.from({ length: cap+1 }, () => Array(n+1).fill(0))
    for (let i = 1; i <= n; i++) {
      const cost = items[i-1].cost
      const value = items[i-1].value
      const q = items[i-1].quantity
      for (let w = 0; w <= cap; w++) {
        dpArray[w][i] = dpArray[w][i-1]
        choiceArray[w][i] = 0
        if (cost>0 && value>0) {
          if (q === Infinity) {
            if (cost <= w) {
              const c = dpArray[w-cost][i] + value
              if (c > dpArray[w][i]) {
                dpArray[w][i] = c
                choiceArray[w][i] = -1
              }
            }
            if (dpArray[w][i-1] > dpArray[w][i]) {
              dpArray[w][i] = dpArray[w][i-1]
              choiceArray[w][i] = 0
            }
          } else {
            for (let k = 1; k <= q; k++) {
              const costTotal = cost*k
              const valTotal = value*k
              if (costTotal <= w) {
                const c = dpArray[w-costTotal][i-1] + valTotal
                if (c > dpArray[w][i]) {
                  dpArray[w][i] = c
                  choiceArray[w][i] = k
                }
              }
            }
            if (dpArray[w][i-1] > dpArray[w][i]) {
              dpArray[w][i] = dpArray[w][i-1]
              choiceArray[w][i] = 0
            }
          }
        }
      }
    }
    setDp(dpArray)
    setChoice(choiceArray)
    setFinalValue(dpArray[cap][n])
    setShowResults(true)
    let picksMap = {}
    let w = cap
    for (let i = n; i > 0; i--) {
      if (items[i-1].quantity === Infinity) {
        while (choiceArray[w][i] === -1) {
          if (!picksMap[items[i-1].name]) picksMap[items[i-1].name]=0
          picksMap[items[i-1].name]++
          w -= items[i-1].cost
        }
      } else {
        const used = choiceArray[w][i]
        if (used>0) {
          if (!picksMap[items[i-1].name]) picksMap[items[i-1].name]=0
          picksMap[items[i-1].name]+= used
          w -= items[i-1].cost*used
        }
      }
    }
    const resultArray = Object.keys(picksMap).map(k => picksMap[k]+" "+k)
    setFinalPicks(resultArray)
  }

  return (
    <div className="container">
      <h2>Problema de la Mochila</h2>
      <div className="input-file">
        <label className="input-file-label">
          Cargar JSON
          <input type="file" onChange={handleFileLoad}/>
        </label>
      </div>
      <button className="buttonSmall" onClick={handleSaveFile}>Guardar JSON</button>
      <label>Capacidad</label>
      <input type="text" value={capacity} onChange={handleCapacityChange}/>
      <label>Cantidad de Objetos</label>
      <input type="text" value={numItems} onChange={handleNumItemsChange}/>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Valor</th>
              <th>Costo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((obj, index) => (
              <tr key={index}>
                <td><input type="text" value={obj.name} onChange={(e) => handleObjectChange(index, "name", e.target.value)}/></td>
                <td><input type="text" value={obj.value} onChange={(e) => handleObjectChange(index, "value", e.target.value)}/></td>
                <td><input type="text" value={obj.cost} onChange={(e) => handleObjectChange(index, "cost", e.target.value)}/></td>
                <td><input type="text" value={obj.quantity} onChange={(e) => handleObjectChange(index, "quantity", e.target.value)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="buttonGenerate" onClick={solveKnapsack}>Generar Respuesta</button>
      {showResults && (
        <div className="results">
          <h3>Valor Máximo: {finalValue}</h3>
          {finalPicks.length>0 && (
            <p>Solución Óptima: {finalPicks.join(", ")}</p>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Capacidad</th>
                  {objects.map((obj,i) => (
                    <th key={i}>{obj.name || "Obj"+(i+1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row,w) => (
                  <tr key={w}>
                    <td>{w}</td>
                    {row.slice(1).map((val, iIndex) => {
                      const used = choice[w][iIndex+1]
                      const infiniteUsed = used === -1
                      const highlight = (used>0 || infiniteUsed)
                      return (
                        <td key={iIndex} className={highlight ? "greenCell" : "redCell"}>
                          {val}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Knapsack

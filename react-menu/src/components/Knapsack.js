import React, { useState } from "react"
import "./Knapsack.css"

function Knapsack() {
  const [capacity, setCapacity] = useState("")
  const [numItems, setNumItems] = useState("")
  const [objects, setObjects] = useState([])
  const [dpTable, setDpTable] = useState([])
  const [choiceTable, setChoiceTable] = useState([])
  const [finalValue, setFinalValue] = useState(0)
  const [showResults, setShowResults] = useState(false)

  function handleCapacityChange(e) {
    setCapacity(e.target.value)
  }

  function handleNumItemsChange(e) {
    setNumItems(e.target.value)
    const arr = []
    for (let i = 0; i < e.target.value; i++) {
      arr.push({ name: "", value: "", cost: "" })
    }
    setObjects(arr)
  }

  function handleObjectChange(index, field, value) {
    const newObjects = [...objects]
    newObjects[index][field] = value
    setObjects(newObjects)
  }

  function solveKnapsack() {
    setShowResults(false)
    const n = objects.length
    const cap = parseInt(capacity)
    if (!n || !cap) return
    const items = objects.map((o) => ({
      name: o.name,
      value: parseInt(o.value),
      cost: parseInt(o.cost)
    }))
    const dp = Array.from({ length: n }, () => Array(cap + 1).fill(0))
    const choice = Array.from({ length: n }, () => Array(cap + 1).fill(0))

    for (let j = 0; j < n; j++) {
      for (let w = 0; w <= cap; w++) {
        if (j === 0) {
          if (items[j].cost <= w) {
            dp[j][w] = items[j].value
            choice[j][w] = 1
          }
        } else {
          dp[j][w] = dp[j - 1][w]
          if (items[j].cost <= w) {
            const val = dp[j - 1][w - items[j].cost] + items[j].value
            if (val > dp[j][w]) {
              dp[j][w] = val
              choice[j][w] = 1
            }
          }
        }
      }
    }
    setDpTable(dp)
    setChoiceTable(choice)
    setFinalValue(dp[n - 1][cap])
    setShowResults(true)
  }

  return (
    <div className="container">
      <h2>Problema de la Mochila</h2>
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
            </tr>
          </thead>
          <tbody>
            {objects.map((obj, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={obj.name}
                    onChange={(e) => handleObjectChange(index, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={obj.value}
                    onChange={(e) => handleObjectChange(index, "value", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={obj.cost}
                    onChange={(e) => handleObjectChange(index, "cost", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="buttonGenerate" onClick={solveKnapsack}>Generar Respuesta</button>
      {showResults && (
        <div className="results">
          <h3>Valor Máximo: {finalValue}</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cap/Obj</th>
                  {objects.map((obj, index) => (
                    <th key={index}>{obj.name || `Obj${index+1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dpTable[0] && dpTable[0].map((_, capIndex) => {
                  return (
                    <tr key={capIndex}>
                      <td>{capIndex}</td>
                      {dpTable.map((col, itemIndex) => {
                        const val = dpTable[itemIndex][capIndex]
                        const used = choiceTable[itemIndex][capIndex]
                        return (
                          <td key={itemIndex} className={used ? "greenCell" : "redCell"}>
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Knapsack

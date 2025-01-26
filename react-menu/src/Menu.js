import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const menuItems = [
    { 
      label: "Rutas Óptimas", 
      color: "rgba(255, 126, 0, 0.2)",
      description: "Encuentra el camino más eficiente entre múltiples puntos",
      details: "Algoritmo para encontrar la ruta más corta o eficiente entre diferentes puntos. Útil para problemas de logística y optimización.",
      route: "/RutasOptimas"
    },
    { 
      label: "Problema de la Mochila", 
      color: "rgba(132, 139, 121, 0.2)",
      description: "Optimiza la selección de items con restricciones de peso",
      details: "Resuelve el problema clásico de optimización combinatoria para maximizar el valor de los elementos seleccionados.",
      route: "/knapsack"
    },
    { 
      label: "Arboles Binarios", 
      color: "rgba(187, 40, 8, 0.2)",
      description: "Estructura de datos jerárquica con operaciones básicas",
      details: "Implementación y operaciones fundamentales en árboles binarios: inserción, eliminación, búsqueda y recorridos.",
      route: "/BinarySearchTree"
    },
    { 
      label: "Series Deportivas", 
      color: "rgba(36, 195, 115, 0.2)",
      description: "Análisis estadístico de eventos deportivos",
      details: "Análisis y predicción de resultados en series deportivas usando modelos estadísticos y probabilísticos.",
      route: "/seriesDeportivas"
    }
  ];

  const getRotationForItem = (index) => {
    return -90 * index;
  };

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  const handleStart = () => {
    if (selectedItem !== null) {
      navigate(menuItems[selectedItem].route);
    }
  };

  const createTrapezoidPath = (startAngle, angle) => {
    const innerRadius = 155;
    const outerRadius = 260;
    const angleRad = (Math.PI / 180);
    const startRad = startAngle * angleRad;
    const endRad = (startAngle + angle) * angleRad;

    const gap = 5 * angleRad;
    const startRadWithGap = startRad + gap;
    const endRadWithGap = endRad - gap;
    
    const innerStart = {
        x: innerRadius * Math.cos(startRadWithGap),
        y: innerRadius * Math.sin(startRadWithGap)
      };
      const innerEnd = {
        x: innerRadius * Math.cos(endRadWithGap),
        y: innerRadius * Math.sin(endRadWithGap)
      };
      const outerStart = {
        x: outerRadius * Math.cos(startRadWithGap),
        y: outerRadius * Math.sin(startRadWithGap)
      };
      const outerEnd = {
        x: outerRadius * Math.cos(endRadWithGap),
        y: outerRadius * Math.sin(endRadWithGap)
      };
  
      return `
        M ${innerStart.x} ${innerStart.y}
        L ${outerStart.x} ${outerStart.y}
        A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}
        L ${innerEnd.x} ${innerEnd.y}
        A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}
      `;
    };
  
    const createCornerPath = (startAngle, angle) => {
      const innerRadius = 155;
      const outerRadius = 260;
      const angleRad = (Math.PI / 180);
      const startRad = startAngle * angleRad;
      const endRad = (startAngle + angle) * angleRad;
    
      const gap = 5 * angleRad;
      const startRadWithGap = startRad + gap;
      const endRadWithGap = endRad - gap;
      
      const innerStart = {
        x: innerRadius * Math.cos(startRadWithGap),
        y: innerRadius * Math.sin(startRadWithGap)
      };
      const outerStart = {
        x: outerRadius * Math.cos(startRadWithGap),
        y: outerRadius * Math.sin(startRadWithGap)
      };
      const outerEnd = {
        x: outerRadius * Math.cos(endRadWithGap),
        y: outerRadius * Math.sin(endRadWithGap)
      };
      const innerEnd = {
        x: innerRadius * Math.cos(endRadWithGap),
        y: innerRadius * Math.sin(endRadWithGap)
      };
    
      const cornerLength = 20; // Longitud de las líneas de las esquinas
      
      // Ajustamos el ángulo a un valor intermedio
      const cornerAngleOffset = Math.PI / 2.3; // Cambio de PI/3 a PI/2.2 para un ángulo menos horizontal
      
      // Esquina exterior inicio
      const cornerOuterStart = `M ${outerStart.x} ${outerStart.y}
        L ${outerStart.x + (cornerLength * Math.cos(startRadWithGap - cornerAngleOffset))} 
          ${outerStart.y + (cornerLength * Math.sin(startRadWithGap - cornerAngleOffset))}`;
      
      // Esquina exterior fin
      const cornerOuterEnd = `M ${outerEnd.x} ${outerEnd.y}
        L ${outerEnd.x + (cornerLength * Math.cos(endRadWithGap - cornerAngleOffset))} 
          ${outerEnd.y + (cornerLength * Math.sin(endRadWithGap - cornerAngleOffset))}`;
      
      // Esquina interior inicio
      const cornerInnerStart = `M ${innerStart.x} ${innerStart.y}
        L ${innerStart.x + (cornerLength * Math.cos(startRadWithGap + cornerAngleOffset))} 
          ${innerStart.y + (cornerLength * Math.sin(startRadWithGap + cornerAngleOffset))}`;
      
      // Esquina interior fin
      const cornerInnerEnd = `M ${innerEnd.x} ${innerEnd.y}
        L ${innerEnd.x + (cornerLength * Math.cos(endRadWithGap + cornerAngleOffset))} 
          ${innerEnd.y + (cornerLength * Math.sin(endRadWithGap + cornerAngleOffset))}`;
    
      return {
        corners: [cornerOuterStart, cornerOuterEnd, cornerInnerStart, cornerInnerEnd]
      };
    };
  

  const dots = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60) * (Math.PI / 180);
    const radius = 100;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  });

  const dots2 = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60) * (Math.PI / 180);
    const radius = 295;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  });

  const createTextArcPath = (index) => {
    const radius = 207;
    const startAngle = index * 90 + 20; // Ajustamos el ángulo inicial
    const arcLength = 40; // Longitud del arco en grados
    const startRad = startAngle * (Math.PI / 180);
    const endRad = (startAngle + arcLength) * (Math.PI / 180);
    
    const start = {
      x: radius * Math.cos(startRad),
      y: radius * Math.sin(startRad)
    };
    
    const end = {
      x: radius * Math.cos(endRad),
      y: radius * Math.sin(endRad)
    };
  
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
        setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center">
      <div className="menu-container">
        <svg 
            className="rueda" 
            width="600" 
            height="600" 
            viewBox="-300 -300 600 600"
        >
            <motion.g
                animate={{ 
                  rotate: 360 
                }}
                transition={{
                  duration: selectedItem !== null ? 0.5 : 8,
                  repeat: selectedItem !== null ? 0 : Infinity,
                  ease: selectedItem !== null ? "easeInOut" : "linear"
                }}
                >
                  
                <circle
                    r="75"
                    fill="none"
                    stroke="#4299e1"
                    strokeWidth="2"
                    strokeDasharray="3"
                    className="opacity-30"
                />
                
                <circle
                    r="50"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeDasharray="0"
                    className="opacity-30"
                />

                <circle
                    r="115"
                    fill="none"
                    stroke="#4299e1"
                    strokeWidth="4"
                    strokeDasharray="0"
                    className="opacity-30"
                />

                <circle
                    r="295"
                    fill="none"
                    stroke="#4299e1"
                    strokeWidth="4"
                    strokeDasharray="0"
                    className="opacity-30"
                />

                {dots.map((dot, i) => (
                    <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r="2"
                    fill="#4299e1"
                    className="opacity-50"
                    />
                ))}

                {dots2.map((dot, i) => (
                    <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r="5"
                    fill="#4299e1"
                    className="opacity-50"
                    />
                ))}
            </motion.g>
          
            <motion.g
              animate={{
                rotate: selectedItem !== null ? 280 - selectedItem * 90 : 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
            {menuItems.map((item, index) => {
            const startAngle = index * 90;
            const cornerPaths = createCornerPath(startAngle, 80);
            const isSelected = selectedItem === index;
            return (
                <g key={index}>
                  <motion.path
                    d={createTrapezoidPath(startAngle, 80)}
                    fill={item.color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isOpen ? 1 : 0, 
                      opacity: isOpen ? 0.8 : 0 
                    }}
                    transition={{
                      delay: isOpen ? index * 0.1 : 0,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="circuloInterno"
                    whileHover={{
                      scale: 1.05,
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                    }}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                  <defs>
                        <path
                        id={`textPath${index}`}
                        d={createTextArcPath(index)}
                        />
                  </defs>
                  {isSelected && cornerPaths.corners.map((cornerPath, cornerIndex) => (
                    <motion.path
                      key={`corner-${cornerIndex}`}
                      d={cornerPath}
                      stroke={item.color.replace('0.2', '1')} // Color más brillante
                      strokeWidth="3"
                      fill="none"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ 
                        opacity: 1, 
                        pathLength: 1,
                        filter: "drop-shadow(0 0 3px rgba(255,255,255,0.5))"
                      }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2
                      }}
                    />
                  ))}
                  <motion.text
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{
                      delay: isOpen ? index * 0.1 : 0,
                      duration: 0.3
                    }}
                    className="select-none pointer-events-none"
                  >
                  <textPath
                    href={`#textPath${index}`}
                    startOffset="50%"
                    textAnchor="middle"
                    
                  >
                  {item.label}
                  </textPath>
                </motion.text>
              </g>
            );
        })}
        </motion.g>
        </svg>

        <motion.button
            className="menu-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(!isOpen);
              setSelectedItem(null);
            }}
        >
            {isOpen ? '×' : '+'}
        </motion.button>
      </div>

      <AnimatePresence>
        {hoveredItem !== null && !selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="descripcion"
            style={{
              position: "absolute",
              left: mousePosition.x,
              top: mousePosition.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {menuItems[hoveredItem].description}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem !== null && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="Panel"
            style={{ maxWidth: '400px' }}
          >
            <h2 className="text-xl font-bold mb-4">{menuItems[selectedItem].label}</h2>
            <p className="mb-6">{menuItems[selectedItem].details}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={handleStart}
            >
              Iniciar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;

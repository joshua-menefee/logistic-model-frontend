// src/App.js
import React, { useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import SimulationChart from './SimulationChart'; // Import the new component

function App() {
  const [simulations, setSimulations] = useState([
    {
      id: Date.now(), // Unique ID for each simulation
      params: {
        M: 1000,
        k: 0.1,
        B: 10,
        duration: 52, // Duration set to 52 weeks (1 year)
        step: 1,
      },
      data: [], // Data specific to this simulation
    },
  ]);

  const handleParamsChange = useCallback((id, newParams) => {
    setSimulations((prevSimulations) =>
        prevSimulations.map((sim) =>
            sim.id === id ? { ...sim, params: newParams } : sim
        )
    );
  }, []); // useCallback helps prevent unnecessary re-renders of child components

  // Function to run simulation for a specific instance
  const runSimulation = useCallback(async (id) => {
    const simulationInstance = simulations.find(sim => sim.id === id);
    if (!simulationInstance) return;

    try {
      // Make API call with the specific instance's parameters
      const response = await axios.get('https://logistic-model-backend.onrender.com/simulate', {
        params: simulationInstance.params,
      });

      const formattedData = response.data.map((value, index) => ({
        // Calculate time based on step and index (0 to 51 for 52 weeks)
        time: index * simulationInstance.params.step,
        users: Math.round(value),
      }));

      // Update the data for the specific simulation instance
      setSimulations((prevSimulations) =>
          prevSimulations.map((sim) =>
              sim.id === id ? { ...sim, data: formattedData } : sim
          )
      );
    } catch (error) {
      console.error(`Error fetching simulation data for instance ${id}:`, error);
    }
  }, [simulations]); // Dependency array includes simulations

  // Function to add a new simulation instance (e.g., for the next year)
  const addSimulationYear = () => {
    const lastSimulation = simulations[simulations.length - 1];


    // Option 2: Start next year using the *end* value of the previous year's data
    const newB = lastSimulation?.data[lastSimulation.data.length - 1]?.users || 10; // Use last user count as new B

    setSimulations((prevSimulations) => [
      ...prevSimulations,
      {
        id: Date.now(), // New unique ID
        params: {
          ...(lastSimulation?.params || { // Copy last params or use defaults
            M: 1000, k: 0.1, B: 10, duration: 52, step: 1
          }),
          B: newB, // Set initial users for the new year (choose Option 1 or 2 above)
        },
        data: [],
      },
    ]);
  };

  // Function to remove a simulation instance
  const removeSimulation = useCallback((idToRemove) => {
    setSimulations((prevSimulations) => {
      // Optional: Prevent removing the last simulation instance
      if (prevSimulations.length <= 1) {
        alert("Cannot remove the last simulation instance."); // Or handle differently
        return prevSimulations;
      }
      return prevSimulations.filter((sim) => sim.id !== idToRemove);
    });
  }, []);
  return (
      <div className="container">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
          <h1>
            Software User Adoption
          </h1>

          {/* Render each SimulationChart */}
          {simulations.map((sim, index) => (
              <SimulationChart
                  key={sim.id}
                  instance={sim}
                  onParamsChange={handleParamsChange}
                  onRunSimulation={runSimulation}
                  // You could pass the index if you want to label charts "Year 1", "Year 2"
              />
          ))}

          {/* Button to add another year */}
          <div className="button-row">
            <button onClick={addSimulationYear}>Add Another Year</button>
            <button onClick={() => removeSimulation(simulations[simulations.length - 1]?.id)}>
              Remove Last Simulation
            </button>
          </div>

        </div>
      </div>
  );
}

export default App;
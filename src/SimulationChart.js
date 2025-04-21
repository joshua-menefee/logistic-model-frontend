import React from 'react';
import './App.css'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

function SimulationChart({ instance, onParamsChange, onRunSimulation }) {
    const { id, params, data } = instance;

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        // Ensure duration and step aren't changed by these inputs
        const { duration, step, ...editableParams } = params;
        const updatedParam = {
            ...editableParams,
            [name]: parseFloat(value) || 0, // Handle potential NaN if input is cleared
        };
        // Pass the full params object back up, including duration and step
        onParamsChange(id, { ...updatedParam, duration, step });
    };

    const handleRunClick = () => {
        onRunSimulation(id);
    };

    // Determine a title, e.g., "Year 1", "Year 2", etc. based on its index or ID if needed
    // For simplicity, we'll just use a generic title here. Add index prop if needed.
    const chartTitle = `Simulation Instance`;

    return (
        <div className="container">
            <h2>{chartTitle}</h2>

            <div className="simulation-controls">
                <div className="control-group">
                    <label htmlFor={`M-${id}`}>Market Saturation M</label>
                    <input
                        id={`M-${id}`}
                        name="M"
                        type="number"
                        value={params.M}
                        onChange={handleParamChange}
                    />
                </div>
                <div className="control-group">
                    <label htmlFor={`k-${id}`}>Growth Rate k</label>
                    <input
                        id={`k-${id}`}
                        name="k"
                        type="number"
                        step="0.01"
                        value={params.k}
                        onChange={handleParamChange}
                    />
                </div>
                <div className="control-group">
                    <label htmlFor={`B-${id}`}>Initial Users P(0)</label>
                    <input
                        id={`B-${id}`}
                        name="B"
                        type="number"
                        value={params.B}
                        onChange={handleParamChange}
                    />
                </div>
                <div className="control-group">
                    <label htmlFor={`duration-${id}`}>Duration (Weeks)</label>
                    <input
                        id={`duration-${id}`}
                        name="duration"
                        type="number"
                        value={params.duration}
                        onChange={handleParamChange}
                    />
                </div>
            </div>

            <div className="button-row">
                <button onClick={handleRunClick}>Run Simulation</button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: 'Time (Weeks)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                        label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#2563eb"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SimulationChart;
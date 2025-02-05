/* eslint-disable react/prop-types */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Rechart = ({ statusCounts }) => {
    // Prepare data for the bar chart
    const data = [
        { name: 'New', value: statusCounts.New },
        { name: 'In Progress', value: statusCounts['In Progress'] },
        { name: 'Completed', value: statusCounts.Completed },
        { name: 'Received', value: statusCounts.Received },
        { name: 'Total', value: statusCounts.Received + statusCounts.Completed + statusCounts['In Progress'] + statusCounts.New },
    ];

    // Define an array of colors (one for each bar)
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347']; // Example colors for the bars

    return (
        <ResponsiveContainer className={"mt-10"} width="80%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="value">
                    {/* Loop over data to assign a different color to each bar */}
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Rechart;

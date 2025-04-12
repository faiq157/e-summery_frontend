/* eslint-disable react/prop-types */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Rechart = ({ statusCounts }) => {
    // Prepare data for the line chart
    const data = [
        { name: 'New', value: statusCounts.New },
        { name: 'In Progress', value: statusCounts['In Progress'] },
        { name: 'Completed', value: statusCounts.Completed },
        { name: 'Received', value: statusCounts.Received },
        { name: 'Total', value: statusCounts.Received + statusCounts.Completed + statusCounts['In Progress'] + statusCounts.New },
    ];

    // Define a color for the line
    const LINE_COLOR = '#0088FE'; // Example color for the line

    return (
        <ResponsiveContainer className={"mt-10"} width="80%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* Define the line for the chart */}
                <Line type="monotone" dataKey="value" stroke={LINE_COLOR} strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Rechart;
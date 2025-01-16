import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function Trends({ auth, exercise, trendsData }) {
    // Formatear las fechas para mostrarlas en el eje X
    const formattedData = trendsData.map(day => ({
        ...day,
        formattedDate: new Date(day.date).toLocaleDateString()
    }));

    const series = [
        {
            type: 'bar',
            yAxisId: 'reps',
            label: 'Total Repeticiones',
            color: 'lightgray',
            data: formattedData.map((day) => day.total_reps),
        },
        {
            type: 'line',
            yAxisId: 'weight',
            color: 'blue',
            label: 'Peso Promedio',
            data: formattedData.map((day) => day.avg_weight),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                        <Typography variant="h5" className="mb-4">
                            Tendencias de Progreso - {exercise.name}
                        </Typography>
                        
                        <div style={{ width: '100%', height: 500 }}>
                            <ResponsiveChartContainer
                                series={series}
                                height={400}
                                xAxis={[{
                                    id: 'date',
                                    data: formattedData.map(day => day.formattedDate),
                                    scaleType: 'band',
                                    tickLabelStyle: { fontSize: 10, angle: 45 }
                                }]}
                                yAxis={[
                                    {
                                        id: 'weight',
                                        scaleType: 'linear',
                                        label: 'Peso (kg)',
                                    },
                                    {
                                        id: 'reps',
                                        scaleType: 'linear',
                                        label: 'Repeticiones',
                                    }
                                ]}
                            >
                                <BarPlot />
                                <LinePlot />
                                <ChartsXAxis 
                                    label="Fecha"
                                    position="bottom"
                                    tickLabelStyle={{ fontSize: 10 }}
                                />
                                <ChartsYAxis
                                    label="Peso (kg)"
                                    position="left"
                                    axisId="weight"
                                    tickLabelStyle={{ fontSize: 10 }}
                                />
                                <ChartsYAxis
                                    label="Repeticiones"
                                    position="right"
                                    axisId="reps"
                                    tickLabelStyle={{ fontSize: 10 }}
                                />
                                <ChartsTooltip />
                            </ResponsiveChartContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

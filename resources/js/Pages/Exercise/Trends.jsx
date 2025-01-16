import * as React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

export default function Trends({ auth, exercise, trendsData }) {
    const hasData = trendsData && trendsData.length > 0;

    const chartData = React.useMemo(() => {
        if (!hasData) return null;

        // Limitar a los últimos 50 registros y agrupar por fecha
        const limitedData = trendsData.slice(-50);
        const setsByDate = limitedData.reduce((acc, set) => {
            const date = new Date(set.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(set);
            return acc;
        }, {});

        const dates = Object.keys(setsByDate);
        const maxSetsInDay = Math.max(...Object.values(setsByDate).map(sets => sets.length));
        
        // Preparar series para el gráfico de líneas
        const series = [];
        for (let i = 0; i < maxSetsInDay; i++) {
            series.push(
                {
                    data: dates.map(date => {
                        const sets = setsByDate[date];
                        return sets[i]?.reps || null;
                    }),
                    label: `R${i + 1}`,
                    valueFormatter: (value) => value ? `${value} reps` : '-',
                    color: `hsl(120, 70%, ${65 + (i * 3)}%)`,
                },
                {
                    data: dates.map(date => {
                        const sets = setsByDate[date];
                        return sets[i]?.weight || null;
                    }),
                    label: `P${i + 1}`,
                    valueFormatter: (value) => value ? `${value} kg` : '-',
                    color: `hsl(200, 70%, ${65 + (i * 3)}%)`,
                }
            );
        }

        return { dates, series };
    }, [trendsData]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4 sm:p-6">
                        <Typography variant="h5" className="mb-4">
                            Progreso - {exercise.name}
                        </Typography>

                        {chartData && (
                            <>
                                <div className="w-full overflow-x-auto">
                                    <LineChart
                                        xAxis={[{
                                            data: chartData.dates,
                                            scaleType: 'point',
                                            tickLabelStyle: {
                                                angle: 45,
                                                textAnchor: 'start',
                                                fontSize: 11
                                            }
                                        }]}
                                        series={chartData.series}
                                        height={300}
                                        margin={{
                                            left: 50,
                                            right: 20,
                                            top: 20,
                                            bottom: 65
                                        }}
                                        sx={{
                                            '.MuiLineElement-root': {
                                                strokeWidth: 2,
                                            },
                                            '.MuiMarkElement-root': {
                                                strokeWidth: 2,
                                                fill: '#fff',
                                            }
                                        }}
                                        slotProps={{
                                            legend: { hidden: true }
                                        }}
                                    />
                                </div>
                                <Typography variant="caption" className="mt-2 block text-center text-gray-600">
                                    R = Repeticiones, P = Peso • Últimos {chartData.dates.length} entrenamientos
                                </Typography>
                            </>
                        )}

                        {!hasData && (
                            <Typography variant="body1" className="text-center py-4">
                                No hay datos disponibles
                            </Typography>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

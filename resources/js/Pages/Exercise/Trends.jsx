import * as React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function Trends({ auth, exercise, trendsData: initialTrendsData }) {
    const [trendsData, setTrendsData] = React.useState(initialTrendsData);
    const [showModal, setShowModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        weight: '',
        reps: '',
        date: dayjs()
    });
    const [selectedDate, setSelectedDate] = React.useState(dayjs());
    const [workoutSets, setWorkoutSets] = React.useState([{ weight: '', reps: '' }]);
    const [showWorkoutModal, setShowWorkoutModal] = React.useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const workoutResponse = await axios.post(route('workouts.getOrCreate'));
            const workoutId = workoutResponse.data.id;

            const response = await axios.post(route('exercise.finish', exercise.id), {
                weight: formData.weight,
                reps: formData.reps,
                workout_id: workoutId,
                date: formData.date.toISOString()
            });

            const newSet = {
                id: response.data.id,
                weight: parseFloat(formData.weight),
                reps: parseInt(formData.reps),
                date: formData.date.toISOString()
            };

            setTrendsData([...trendsData, newSet].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            ));
            setFormData({ weight: '', reps: '', date: dayjs() });
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar el set:', error);
            alert('Error al guardar el set');
        }
    };

    const addSet = () => {
        setWorkoutSets([...workoutSets, { weight: '', reps: '' }]);
    };

    const removeSet = (index) => {
        setWorkoutSets(workoutSets.filter((_, i) => i !== index));
    };

    const updateSet = (index, field, value) => {
        const newSets = [...workoutSets];
        newSets[index][field] = value;
        setWorkoutSets(newSets);
    };

    const handleWorkoutSubmit = async (e) => {
        e.preventDefault();
        try {
            const workoutResponse = await axios.post(route('workouts.getOrCreate'), {
                date: selectedDate.format('YYYY-MM-DD')
            });
            const workoutId = workoutResponse.data.id;

            const newSets = await Promise.all(
                workoutSets
                    .filter(set => set.weight && set.reps)
                    .map(async (set) => {
                        const response = await axios.post(route('exercise.finish', exercise.id), {
                            weight: parseFloat(set.weight),
                            reps: parseInt(set.reps),
                            workout_id: workoutId,
                            duration_seconds: 30 // Valor por defecto
                        });

                        return {
                            id: response.data.id,
                            weight: parseFloat(set.weight),
                            reps: parseInt(set.reps),
                            date: selectedDate.format('YYYY-MM-DD')
                        };
                    })
            );

            setTrendsData(prevData => {
                const updatedData = [...prevData, ...newSets];
                return updatedData.sort((a, b) => new Date(b.date) - new Date(a.date));
            });

            setWorkoutSets([{ weight: '', reps: '' }]);
            setShowWorkoutModal(false);

        } catch (error) {
            console.error('Error al guardar el workout:', error);
            alert('Error al guardar el entrenamiento: ' + (error.response?.data?.message || 'Error desconocido'));
        }
    };

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

                    {/* Nueva sección para la tabla */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mt-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Historial de Sets</h2>
                                <button
                                    onClick={() => setShowWorkoutModal(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Agregar Registro
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Peso (kg)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reps
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {trendsData && trendsData.map((set, index) => (
                                            <tr key={set.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(set.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {set.weight}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {set.reps}
                                                </td>
                                            </tr>
                                        ))}
                                        {!hasData && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No hay registros disponibles
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Modal de nuevo registro */}
                    {showWorkoutModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-xl w-full">
                                <h3 className="text-xl font-semibold mb-4">Registrar Entrenamiento - {exercise.name}</h3>
                                <form onSubmit={handleWorkoutSubmit}>
                                    <div className="mb-6">
                                        <label className="block text-gray-700 mb-2">Fecha del entrenamiento</label>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={selectedDate}
                                                onChange={(newValue) => setSelectedDate(newValue)}
                                                className="w-full"
                                                maxDate={dayjs()}
                                            />
                                        </LocalizationProvider>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-medium">Sets</h4>
                                            <button
                                                type="button"
                                                onClick={addSet}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                + Agregar Set
                                            </button>
                                        </div>

                                        {workoutSets.map((set, index) => (
                                            <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded">
                                                <div className="flex-1">
                                                    <label className="block text-sm text-gray-700 mb-1">
                                                        Peso (kg)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        className="w-full p-2 border rounded"
                                                        value={set.weight}
                                                        onChange={(e) => updateSet(index, 'weight', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm text-gray-700 mb-1">
                                                        Repeticiones
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 border rounded"
                                                        value={set.reps}
                                                        onChange={(e) => updateSet(index, 'reps', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {workoutSets.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSet(index)}
                                                        className="text-red-500 hover:text-red-700 px-2"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWorkoutModal(false);
                                                setWorkoutSets([{ weight: '', reps: '' }]);
                                            }}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Guardar Entrenamiento
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

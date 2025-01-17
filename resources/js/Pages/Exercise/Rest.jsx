import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function Rest({ auth, exercise, trendsData: initialTrendsData, routineId }) {
    const [selectedTime, setSelectedTime] = useState(dayjs().hour(0).minute(3).second(0));
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [showSelector, setShowSelector] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exerciseStartTime, setExerciseStartTime] = useState(null);
    const [formData, setFormData] = useState({
        weight: '',
        reps: '',
        duration_seconds: 0
    });
    const [audio] = useState(new Audio('/sounds/beep.mp3')); // Cambia a tu archivo local
    const [editingSet, setEditingSet] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Modificar el estado inicial para manejar los datos del último workout
    const [workoutData, setWorkoutData] = useState({
        date: initialTrendsData?.workout_date || null,
        sets: initialTrendsData?.sets || []
    });

    const hasWorkoutSets = workoutData.sets && workoutData.sets.length > 0;
    const workoutDate = workoutData.date ? new Date(workoutData.date).toLocaleDateString() : 'Hoy';

    useEffect(() => {
        // Precarga el audio
        audio.load();
        
        // Maneja errores de audio
        audio.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });

        return () => {
            audio.removeEventListener('error', () => {});
        };
    }, [audio]);

    useEffect(() => {
        let intervalId;

        if (isActive && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            try {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Audio started playing
                        })
                        .catch(error => {
                            console.error("Error playing audio:", error);
                        });
                }
            } catch (error) {
                console.error("Error playing audio:", error);
            }
            setIsActive(false);
        }

        return () => clearInterval(intervalId);
    }, [timeLeft, isActive, audio]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartExercise = () => {
        setExerciseStartTime(Date.now());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const duration = Math.floor((Date.now() - exerciseStartTime) / 1000);
        
        try {
            const workoutResponse = await axios.post(route('workouts.getOrCreate'));
            const workoutId = workoutResponse.data.id;

            const response = await axios.post(route('exercise.finish', exercise.id), {
                ...formData,
                duration_seconds: duration,
                workout_id: workoutId
            });

            const newSet = {
                id: response.data.id,
                weight: parseFloat(formData.weight),
                reps: parseInt(formData.reps),
                created_at: new Date().toISOString()
            };

            setWorkoutData(prev => ({
                ...prev,
                sets: [...prev.sets, newSet]
            }));

            setFormData({ weight: '', reps: '', duration_seconds: 0 });
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar el set:', error);
            alert('Error al guardar el set');
        }
    };

    const startTimer = () => {
        const minutes = selectedTime.minute();
        const seconds = selectedTime.second();
        setTimeLeft(minutes * 60 + seconds);
        setIsActive(true);
        setShowSelector(false);
    };

    const skipRest = () => {
        setTimeLeft(0);
        setIsActive(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const updatedSet = {
                ...editingSet,
                reps: parseInt(editingSet.reps),
                weight: parseFloat(editingSet.weight),
                duration_seconds: parseInt(editingSet.duration_seconds || 0)
            };

            const response = await axios.put(`/workout-sets/${editingSet.id}`, updatedSet);

            if (response.data) {
                setWorkoutData(prev => ({
                    ...prev,
                    sets: prev.sets.map(set => 
                        set.id === editingSet.id ? response.data : set
                    )
                }));
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error al actualizar el set:', error);
            alert('Error al actualizar el set: ' + (error.response?.data?.message || 'Error desconocido'));
        }
    };

    const handleDelete = async (setId) => {
        if (confirm('¿Estás seguro de que deseas eliminar este set?')) {
            try {
                await axios.delete(`/workout-sets/${setId}`);
                setWorkoutData(prev => ({
                    ...prev,
                    sets: prev.sets.filter(set => set.id !== setId)
                }));
            } catch (error) {
                console.error('Error al eliminar el set:', error);
                alert('Error al eliminar el set: ' + (error.response?.data?.message || 'Error desconocido'));
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center mb-4">
                        {routineId && (
                            <Link
                                href={route('routines.show', routineId)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Volver a la Rutina
                            </Link>
                        )}
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">{exercise.name}</h2>
                            <h3 className="text-xl font-medium mb-4">Tiempo de Descanso</h3>
                            <div className="text-center">
                                {showSelector ? (
                                    <>
                                        <div className="flex justify-center items-center gap-4 mb-8">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    value={selectedTime}
                                                    onChange={(newValue) => setSelectedTime(newValue)}
                                                    views={['minutes', 'seconds']}
                                                    format="mm:ss"
                                                    ampm={false}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <button
                                            onClick={startTimer}
                                            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                                        >
                                            Iniciar Descanso
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
                                        {timeLeft > 0 && (
                                            <button
                                                onClick={skipRest}
                                                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 mb-4"
                                            >
                                                Saltar Descanso
                                            </button>
                                        )}
                                        {timeLeft === 0 && (
                                            <div className="space-x-4">
                                                <button
                                                    onClick={() => {
                                                        handleStartExercise();
                                                        setShowModal(true);
                                                    }}
                                                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
                                                >
                                                    Registrar Set
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowSelector(true);
                                                        setIsActive(false);
                                                    }}
                                                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                                                >
                                                    Nuevo Descanso
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Modal para registrar el set */}
                            {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                        <h3 className="text-lg font-semibold mb-4">Registrar Set - {exercise.name}</h3>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 mb-2">Peso</label>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.weight}
                                                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 mb-2">Repeticiones</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.reps}
                                                    onChange={(e) => setFormData({...formData, reps: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                    className="px-4 py-2 bg-gray-300 rounded"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                                >
                                                    Guardar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nueva sección para la tabla */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mt-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">
                                    Sets del entrenamiento ({workoutDate})
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Set #
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Peso (kg)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reps
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {workoutData.sets.map((set, index) => (
                                            <tr key={set.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {set.weight}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {set.reps}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSet(set);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(set.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!hasWorkoutSets && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No hay sets registrados para este entrenamiento
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {showEditModal && editingSet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Editar Set</h3>
                        <form onSubmit={handleEdit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Peso</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="w-full p-2 border rounded"
                                    value={editingSet.weight}
                                    onChange={(e) => setEditingSet({
                                        ...editingSet,
                                        weight: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Repeticiones</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={editingSet.reps}
                                    onChange={(e) => setEditingSet({
                                        ...editingSet,
                                        reps: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function Rest({ auth, exercise }) {
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

    useEffect(() => {
        let intervalId;

        if (isActive && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => clearInterval(intervalId);
    }, [timeLeft, isActive]);

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
            // Primero obtenemos el workout del día actual o creamos uno nuevo
            const workoutResponse = await axios.post(route('workouts.getOrCreate'));
            const workoutId = workoutResponse.data.id;

            // Ahora registramos el set usando el workout_id obtenido
            await axios.post(route('exercise.finish', exercise.id), {
                ...formData,
                duration_seconds: duration,
                workout_id: workoutId
            });
            
            setShowModal(false);
            // Opcional: redirigir o mostrar mensaje de éxito
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Tiempo de Descanso</h2>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

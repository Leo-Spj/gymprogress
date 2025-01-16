import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Rest({ auth, exercise }) {
    const [selectedMinutes, setSelectedMinutes] = useState(3);
    const [selectedSeconds, setSelectedSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [showSelector, setShowSelector] = useState(true);
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
            await axios.post(route('exercise.finish', exercise.id), {
                ...formData,
                duration_seconds: duration
            });
            
            setShowModal(false);
            // Opcional: redirigir al usuario o mostrar mensaje de éxito
        } catch (error) {
            console.error('Error al guardar el set:', error);
            alert('Error al guardar el set');
        }
    };

    const startTimer = () => {
        setTimeLeft(selectedMinutes * 60 + selectedSeconds);
        setIsActive(true);
        setShowSelector(false);
    };

    const skipRest = () => {
        setTimeLeft(0);
        setIsActive(false);
    };

    const NumberWheel = ({ value, onChange, max }) => {
        const numbers = Array.from({ length: max + 1 }, (_, i) => i);
        const itemHeight = 40; // Aumentado de 32 a 40
        const containerRef = React.useRef(null);

        const adjustValue = (increment) => {
            const newValue = increment ? 
                Math.min(value + 1, max) : 
                Math.max(value - 1, 0);
            onChange(newValue);
            containerRef.current?.scrollTo({
                top: newValue * itemHeight,
                behavior: 'smooth'
            });
        };

        useEffect(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = value * itemHeight;
            }
        }, []);

        const handleScroll = (e) => {
            clearTimeout(e.target.scrollTimeout);
            e.target.scrollTimeout = setTimeout(() => {
                const scrollTop = e.target.scrollTop;
                const selectedIndex = Math.round(scrollTop / itemHeight);
                if (selectedIndex !== value && selectedIndex >= 0 && selectedIndex <= max) {
                    onChange(selectedIndex);
                    e.target.scrollTo({
                        top: selectedIndex * itemHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        };

        return (
            <div className="relative h-40 border rounded-lg select-none"> {/* Aumentado de h-32 a h-40 */}
                {/* Botones de ajuste */}
                <button 
                    onClick={() => adjustValue(true)}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-blue-500 hover:text-blue-600 z-10"
                >
                    ▲
                </button>
                <button 
                    onClick={() => adjustValue(false)}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-blue-500 hover:text-blue-600 z-10"
                >
                    ▼
                </button>

                {/* Indicador del centro */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="h-10 border-t-2 border-b-2 border-blue-300 bg-blue-50/30"/>
                </div>
                
                <div 
                    ref={containerRef}
                    className="h-full overflow-y-scroll scrollbar-hidden touch-pan-y"
                    onScroll={handleScroll}
                >
                    <div className="h-[80px]"/> {/* Aumentado el padding */}
                    {numbers.map(num => (
                        <div
                            key={num}
                            className={`h-10 flex items-center justify-center transition-all duration-150 text-lg
                                ${value === num ? 'font-bold text-blue-600 scale-110' : 'text-gray-400'}`}
                        >
                            {num.toString().padStart(2, '0')}
                        </div>
                    ))}
                    <div className="h-[80px]"/> {/* Aumentado el padding */}
                </div>
            </div>
        );
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
                                            <div className="w-20">
                                                <NumberWheel
                                                    value={selectedMinutes}
                                                    onChange={setSelectedMinutes}
                                                    max={10}
                                                />
                                                <div className="text-sm text-gray-500">minutos</div>
                                            </div>
                                            <div className="text-2xl font-bold">:</div>
                                            <div className="w-20">
                                                <NumberWheel
                                                    value={selectedSeconds}
                                                    onChange={setSelectedSeconds}
                                                    max={59}
                                                />
                                                <div className="text-sm text-gray-500">segundos</div>
                                            </div>
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
                                                <label className="block text-gray-700 mb-2">Peso (kg)</label>
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

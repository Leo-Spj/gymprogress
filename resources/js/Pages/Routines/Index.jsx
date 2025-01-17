import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaPlus, FaEdit, FaPlay } from 'react-icons/fa';

export default function Index({ auth, routines }) {
    const { delete: destroy, post } = useForm();

    const getCurrentDay = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = new Date().getDay();
        return days[currentDay];
    };

    const translateDay = (day) => {
        const translations = {
            'monday': 'Lunes',
            'tuesday': 'Martes',
            'wednesday': 'Miércoles',
            'thursday': 'Jueves',
            'friday': 'Viernes',
            'saturday': 'Sábado',
            'sunday': 'Domingo'
        };
        return translations[day.toLowerCase()] || day;
    };

    const currentDay = getCurrentDay();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
            destroy(route('routines.destroy', id));
        }
    };

    const handleTrain = (routineId) => {
        post(route('workouts.store', { routine_id: routineId }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Mis Rutinas</h2>
                                <div className="space-x-4">
                                    <Link
                                        href={route('routines.create')}
                                        className="bg-blue-500 text-white w-10 h-10 rounded-md hover:bg-blue-600 flex items-center justify-center" // Ajustado
                                        title="Nueva Rutina"
                                    >
                                        <FaPlus className="text-xl" /> {/* Ajustado tamaño del ícono */}
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {routines.map((routine) => (
                                    <div key={routine.id} className="bg-white p-3 rounded-lg shadow-sm relative">
                                        <Link
                                            href={route('routines.edit', routine.id)}
                                            className="absolute top-3 right-3 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <div className="mb-3">
                                            <h3 className="text-lg font-medium mb-2">{routine.name}</h3>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {routine.days.map(day => (
                                                    <span 
                                                        key={day} 
                                                        className={`
                                                            text-xs px-2 py-1 rounded-full
                                                            ${day.toLowerCase() === currentDay 
                                                                ? 'bg-green-500 text-white font-bold' 
                                                                : 'bg-gray-100'
                                                            }
                                                        `}
                                                    >
                                                        {translateDay(day)}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                {routine.exercises.length} ejercicios
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleTrain(routine.id)}
                                            className="bg-green-500 text-white py-2 px-3 rounded-md w-full hover:bg-green-600 flex items-center justify-center"
                                            title="Entrenar"
                                        >
                                            <FaPlay />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

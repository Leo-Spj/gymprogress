import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, routines }) {
    const { delete: destroy, post } = useForm();

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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Mis Rutinas</h2>
                        <Link
                            href={route('routines.create')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Nueva Rutina
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {routines.map((routine) => (
                            <div key={routine.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium">{routine.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {routine.days.map(day => (
                                            <span key={day} className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        {routine.exercises.length} ejercicios
                                    </p>
                                    <div className="mt-4 flex space-x-4">
                                        <Link
                                            href={route('routines.edit', routine.id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleTrain(routine.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Entrenar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

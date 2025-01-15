import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RemoveExercise({ auth, routine }) {
    const { delete: destroy } = useForm();

    const handleRemove = (exerciseId) => {
        if (confirm('¿Estás seguro de que quieres eliminar este ejercicio de la rutina?')) {
            destroy(route('routines.removeExercise', { routine: routine.id, exercise: exerciseId }));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Eliminar Ejercicio de {routine.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {routine.exercises.map(exercise => (
                                    <div key={exercise.id} className="flex justify-between items-center">
                                        <p className="text-gray-600">{exercise.name}</p>
                                        <button
                                            onClick={() => handleRemove(exercise.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Eliminar
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

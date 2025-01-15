import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, routine }) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
            destroy(route('routines.destroy', routine.id));
        }
    };

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
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{routine.name}</h2>
                                <div className="space-x-4">
                                    <Link
                                        href={route('routines.edit', routine.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        href={route('routines.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Volver
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Ejercicios</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {routine.exercises.map(exercise => (
                                        <div key={exercise.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-600"><span className="font-medium">Nombre:</span> {exercise.name}</p>
                                                <p className="text-gray-600"><span className="font-medium">Tipo:</span> {exercise.type}</p>
                                                {exercise.image_url && (
                                                    <img 
                                                        src={exercise.image_url} 
                                                        alt={exercise.name}
                                                        className="w-full max-w-lg h-auto object-cover rounded-lg mt-2"
                                                    />
                                                )}
                                            </div>
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

                            <div className="flex justify-end">
                                <Link
                                    href={route('routines.showAddExerciseForm', routine.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Añadir Ejercicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, exercises }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            destroy(route('exercises.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Mis Ejercicios</h2>
                        <Link
                            href={route('exercises.create')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Nuevo Ejercicio
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((exercise) => (
                            <div key={exercise.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium">{exercise.name}</h3>
                                    <p className="text-gray-600 mt-2">Tipo: {exercise.type}</p>
                                    {exercise.image_url && (
                                        <img 
                                            src={exercise.image_url} 
                                            alt={exercise.name}
                                            className="w-full h-48 object-cover mt-4"
                                        />
                                    )}
                                    <div className="mt-4 flex space-x-4">
                                        <Link
                                            href={route('exercises.show', exercise.id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            href={route('exercises.edit', exercise.id)}
                                            className="text-green-500 hover:underline"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(exercise.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
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

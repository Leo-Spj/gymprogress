import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, exercise }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{exercise.name}</h2>
                                <div className="space-x-4">
                                    <Link
                                        href={route('exercises.edit', exercise.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        href={route('exercises.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Volver
                                    </Link>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Detalles del Ejercicio</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600"><span className="font-medium">Tipo:</span> {exercise.type}</p>
                                    </div>
                                    {exercise.image_url && (
                                        <div className="md:col-span-2">
                                            <img 
                                                src={exercise.image_url} 
                                                alt={exercise.name}
                                                className="w-full max-w-lg h-auto object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

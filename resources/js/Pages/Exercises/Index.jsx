import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, exercises }) {
    const [searchQuery, setSearchQuery] = useState('');

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const filteredAndGroupedExercises = useMemo(() => {
        const searchNormalized = normalizeText(searchQuery);
        
        const filtered = exercises.filter(exercise =>
            normalizeText(exercise.name).includes(searchNormalized) ||
            normalizeText(exercise.type).includes(searchNormalized)
        );

        return filtered.reduce((groups, exercise) => {
            if (!groups[exercise.type]) {
                groups[exercise.type] = [];
            }
            groups[exercise.type].push(exercise);
            return groups;
        }, {});
    }, [exercises, searchQuery]);

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

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar ejercicios..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {Object.entries(filteredAndGroupedExercises).map(([type, groupExercises]) => (
                        <div key={type} className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 bg-gray-100 p-2 rounded">{type}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupExercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-white overflow-hidden shadow-sm rounded-lg relative p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            {exercise.image_url ? (
                                                <img 
                                                    src={exercise.image_url} 
                                                    alt={exercise.name}
                                                    className="w-16 h-16 object-cover rounded-lg mr-4"
                                                />
                                            ) : (
                                                exercise.image_path && (
                                                    <img 
                                                        src={`/storage/${exercise.image_path}`} 
                                                        alt={exercise.name}
                                                        className="w-16 h-16 object-cover rounded-lg mr-4"
                                                    />
                                                )
                                            )}
                                            <div>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Nombre:</span> {exercise.name}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Tipo:</span> {exercise.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href={route('exercises.edit', exercise.id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-center"
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                href={route('trends.show', exercise.id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-center"
                                            >
                                                Tendencias
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

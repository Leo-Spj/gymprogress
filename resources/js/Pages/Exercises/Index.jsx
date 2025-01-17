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

    const filteredExercises = useMemo(() => {
        const searchNormalized = normalizeText(searchQuery);
        
        return exercises
            .filter(exercise => {
                const nameMatch = normalizeText(exercise.name).includes(searchNormalized);
                const typeMatch = Array.isArray(exercise.type) 
                    ? exercise.type.some(type => normalizeText(type).includes(searchNormalized))
                    : normalizeText(exercise.type?.join(', ') || '').includes(searchNormalized);
                
                return nameMatch || typeMatch;
            })
            .sort((a, b) => {
                const typeA = Array.isArray(a.type) && a.type.length > 0 ? a.type[0] : 'Sin categoría';
                const typeB = Array.isArray(b.type) && b.type.length > 0 ? b.type[0] : 'Sin categoría';
                return typeA.localeCompare(typeB);
            });
    }, [exercises, searchQuery]);

    const getTypeLabel = (type) => {
        const types = {
            'strength': 'Fuerza',
            'cardio': 'Cardio',
            'flexibility': 'Flexibilidad',
            'balance': 'Equilibrio',
            'general': 'General',
            'pectorals': 'Pectorales',
            'biceps': 'Bíceps',
            'triceps': 'Tríceps',
            'back': 'Espalda',
            'legs': 'Piernas',
            'shoulders': 'Hombros',
            'abs': 'Abdominales'
        };
        return types[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            'strength': 'bg-red-100 text-red-800',
            'cardio': 'bg-blue-100 text-blue-800',
            'flexibility': 'bg-green-100 text-green-800',
            'balance': 'bg-purple-100 text-purple-800',
            'general': 'bg-gray-100 text-gray-800',
            'pectorals': 'bg-pink-100 text-pink-800',
            'biceps': 'bg-yellow-100 text-yellow-800',
            'triceps': 'bg-orange-100 text-orange-800',
            'back': 'bg-teal-100 text-teal-800',
            'legs': 'bg-indigo-100 text-indigo-800',
            'shoulders': 'bg-lime-100 text-lime-800',
            'abs': 'bg-cyan-100 text-cyan-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Mis Ejercicios</h2>
                                <div className="space-x-4">
                                    <Link
                                        href={route('exercises.create')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Nuevo Ejercicio
                                    </Link>
                                </div>
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

                            <div className="grid grid-cols-1 gap-3">
                                {filteredExercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                                        <div className="flex items-center mb-3">
                                            {exercise.image_url ? (
                                                <img 
                                                    src={exercise.image_url} 
                                                    alt={exercise.name}
                                                    className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                                                />
                                            ) : (
                                                exercise.image_path && (
                                                    <img 
                                                        src={`/storage/${exercise.image_path}`} 
                                                        alt={exercise.name}
                                                        className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                                                    />
                                                )
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-gray-900 text-sm font-medium truncate">
                                                    {exercise.name}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(exercise.type) 
                                                        ? exercise.type.map((type, index) => (
                                                            <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                                                                {getTypeLabel(type)}
                                                            </span>
                                                        ))
                                                        : (
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}>
                                                                {getTypeLabel(exercise.type)}
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href={route('exercises.edit', exercise.id)}
                                                className="bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-600 text-center text-sm"
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                href={route('trends.show', exercise.id)}
                                                className="bg-green-500 text-white py-1.5 px-3 rounded-md hover:bg-green-600 text-center text-sm"
                                            >
                                                Tendencias
                                            </Link>
                                        </div>
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

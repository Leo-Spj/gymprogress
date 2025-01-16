import React, { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

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

const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = new Date().getDay();
    return days[currentDay];
};

export default function Show({ auth, routine }) {
    const [exercises, setExercises] = useState(routine.exercises);
    const currentDay = getCurrentDay();

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(exercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Actualizar el estado optimistamente
        setExercises(items);

        const updatedExercises = items.map((exercise, index) => ({
            id: exercise.id,
            order_index: index + 1
        }));

        axios.put(route('routines.updateExercisesOrder', routine.id), {
            exercises: updatedExercises
        })
        .then(response => {
            // Actualizar el estado con los datos del servidor
            if (response.data.exercises) {
                setExercises(response.data.exercises);
            }
        })
        .catch(error => {
            // Revertir al estado anterior en caso de error
            setExercises(routine.exercises);
            console.error('Error al actualizar el orden:', error);
            // Opcional: Mostrar un mensaje de error más amigable
            alert('Ha ocurrido un error al actualizar el orden. Por favor, inténtalo de nuevo.');
        });
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
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Días de entrenamiento</h3>
                                <div className="flex flex-wrap gap-2">
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
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Ejercicios</h3>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="exercises">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="grid grid-cols-1 gap-3"
                                            >
                                            
                                                {exercises.map((exercise, index) => (
                                                    <Draggable
                                                        key={exercise.id}
                                                        draggableId={exercise.id.toString()}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="bg-white p-3 rounded-lg shadow-sm flex flex-col"
                                                            >
                                                                <div className="flex items-center mb-3">
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="mr-3 cursor-move text-gray-400"
                                                                    >
                                                                        ⋮⋮
                                                                    </div>
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
                                                                        href={route('trends.show', exercise.id)}
                                                                        className="bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-600 text-center text-sm"
                                                                    >
                                                                        Tendencias
                                                                    </Link>
                                                                    <Link
                                                                        href={route('exercise.rest', { 
                                                                            exercise: exercise.id,
                                                                            routine_id: routine.id 
                                                                        })}
                                                                        className="bg-green-500 text-white py-1.5 px-3 rounded-md hover:bg-green-600 text-center text-sm"
                                                                    >
                                                                        Entrenar
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

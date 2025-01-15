import React, { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

export default function Show({ auth, routine }) {
    const { delete: destroy } = useForm();
    const [exercises, setExercises] = useState(routine.exercises);

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

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(exercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setExercises(items);

        const updatedExercises = items.map((exercise, index) => ({
            id: exercise.id,
            order_index: index + 1
        }));

        axios.put(route('routines.updateExercisesOrder', routine.id), {
            exercises: updatedExercises
        }).catch(() => {
            setExercises(routine.exercises);
            alert('Error al actualizar el orden');
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
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Días de entrenamiento</h3>
                                <div className="flex flex-wrap gap-2">
                                    {routine.days.map(day => (
                                        <span key={day} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                            {day}
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
                                                className="grid grid-cols-1 gap-4"
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
                                                                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="mr-4 cursor-move text-gray-400"
                                                                    >
                                                                        ⋮⋮
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-600">
                                                                            <span className="font-medium">Nombre:</span> {exercise.name}
                                                                        </p>
                                                                        <p className="text-gray-600">
                                                                            <span className="font-medium">Tipo:</span> {exercise.type}
                                                                        </p>
                                                                        {exercise.image_url && (
                                                                            <img 
                                                                                src={exercise.image_url} 
                                                                                alt={exercise.name}
                                                                                className="w-full max-w-lg h-auto object-cover rounded-lg mt-2"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRemove(exercise.id)}
                                                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                                                >
                                                                    Eliminar
                                                                </button>
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

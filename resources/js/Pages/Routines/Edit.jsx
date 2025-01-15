import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, routine, exercises }) {
    const { data, setData, put, errors } = useForm({
        name: routine.name || '',
        days: routine.days || [],
        exercises: (routine.exercises || []).map(e => e.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('routines.update', routine.id));
    };

    const handleDayChange = (day) => {
        setData('days', data.days.includes(day)
            ? data.days.filter(d => d !== day)
            : [...data.days, day]);
    };

    const handleExerciseChange = (exerciseId) => {
        setData('exercises', data.exercises.includes(exerciseId)
            ? data.exercises.filter(id => id !== exerciseId)
            : [...data.exercises, exerciseId]);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Editar Rutina</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.name && <div className="text-red-500 mt-2">{errors.name}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Días</label>
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                        <div key={day} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.days.includes(day)}
                                                onChange={() => handleDayChange(day)}
                                                className="mr-2"
                                            />
                                            <label className="text-gray-700 capitalize">{day}</label>
                                        </div>
                                    ))}
                                    {errors.days && <div className="text-red-500 mt-2">{errors.days}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Ejercicios</label>
                                    {(exercises || []).map(exercise => (
                                        <div key={exercise.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.exercises.includes(exercise.id)}
                                                onChange={() => handleExerciseChange(exercise.id)}
                                                className="mr-2"
                                            />
                                            <label className="text-gray-700">{exercise.name}</label>
                                        </div>
                                    ))}
                                    {errors.exercises && <div className="text-red-500 mt-2">{errors.exercises}</div>}
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

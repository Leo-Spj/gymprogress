import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AddExercise({ auth, routine, exercises }) {
    const { data, setData, post, errors } = useForm({
        exercise_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('routines.addExercise', routine.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Añadir Ejercicio a {routine.name}</h2>
                            <form onSubmit={handleSubmit} method="POST">
                                <div className="mb-4">
                                    <label className="block text-gray-700">Ejercicio</label>
                                    <select
                                        value={data.exercise_id}
                                        onChange={e => setData('exercise_id', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="">Seleccione un ejercicio</option>
                                        {exercises.map(exercise => (
                                            <option key={exercise.id} value={exercise.id}>
                                                {exercise.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.exercise_id && <div className="text-red-500 mt-2">{errors.exercise_id}</div>}
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                        Añadir
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

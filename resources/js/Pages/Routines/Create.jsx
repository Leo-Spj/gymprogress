import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function Create({ auth, exercises }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);

    const { data, setData, post, errors } = useForm({
        name: '',
        days: [],
        exercises: [],
    });

    const diasSemana = [
        { value: 'monday', label: 'Lunes' },
        { value: 'tuesday', label: 'Martes' },
        { value: 'wednesday', label: 'Miércoles' },
        { value: 'thursday', label: 'Jueves' },
        { value: 'friday', label: 'Viernes' },
        { value: 'saturday', label: 'Sábado' },
        { value: 'sunday', label: 'Domingo' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('routines.store'));
    };

    const handleDayChange = (day) => {
        setData('days', data.days.includes(day)
            ? data.days.filter(d => d !== day)
            : [...data.days, day]);
    };

    const handleExerciseSelect = (event, newValue) => {
        setSelectedExercises(newValue);
        setData('exercises', newValue.map(exercise => exercise.id));
    };

    const filteredExercises = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Nueva Rutina</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la rutina
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Nombre de la rutina"
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Días de entrenamiento
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {diasSemana.map(({ value, label }) => (
                                            <div key={value} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                                 onClick={() => handleDayChange(value)}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.days.includes(value)}
                                                    onChange={() => {}}
                                                    className="h-4 w-4 text-blue-600"
                                                />
                                                <span className="text-sm">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.days && <div className="text-red-500 text-sm mt-1">{errors.days}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ejercicios
                                    </label>
                                    <Autocomplete
                                        multiple
                                        options={exercises}
                                        getOptionLabel={(option) => option.name}
                                        value={selectedExercises}
                                        onChange={handleExerciseSelect}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Buscar ejercicios"
                                                className="mb-4"
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option.name}
                                                    {...getTagProps({ index })}
                                                    className="m-1"
                                                />
                                            ))
                                        }
                                    />
                                    {errors.exercises && <div className="text-red-500 text-sm mt-1">{errors.exercises}</div>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm text-sm font-medium transition-colors"
                                    >
                                        Guardar Rutina
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

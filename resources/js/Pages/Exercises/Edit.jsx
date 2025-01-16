import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, exercise }) {
    const { data, setData, put, delete: destroy, errors } = useForm({
        name: exercise.name,
        type: exercise.type,
        image_url: exercise.image_url,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('exercises.update', exercise.id));
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            destroy(route('exercises.destroy', exercise.id), {
                onSuccess: () => router.visit(route('exercises.index'))
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Editar Ejercicio</h2>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    type="button"
                                >
                                    Eliminar Ejercicio
                                </button>
                            </div>
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
                                    <label className="block text-gray-700">Tipo</label>
                                    <input
                                        type="text"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.type && <div className="text-red-500 mt-2">{errors.type}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">URL de Imagen</label>
                                    <input
                                        type="text"
                                        value={data.image_url}
                                        onChange={e => setData('image_url', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.image_url && <div className="text-red-500 mt-2">{errors.image_url}</div>}
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

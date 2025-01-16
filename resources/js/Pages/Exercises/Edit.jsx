import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, exercise }) {
    const imageInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(exercise.image_path ? `/storage/${exercise.image_path}` : null);
    
    const { data, setData, put, delete: destroy, errors } = useForm({
        name: exercise.name,
        type: exercise.type,
        image_url: exercise.image_url,
        image: null
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Crear preview
        setPreviewUrl(URL.createObjectURL(file));

        // Optimizar imagen
        const optimizedImage = await optimizeImage(file);
        setData('image', optimizedImage);
    };

    const optimizeImage = async (file) => {
        // ... mismo código de optimización que en Create.jsx ...
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('type', data.type);
        
        // Solo agregar image_url si tiene un valor
        if (data.image_url) {
            formData.append('image_url', data.image_url);
        }
        
        // Verificar si hay una nueva imagen seleccionada
        const fileInput = imageInputRef.current;
        if (fileInput && fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }

        router.post(route('exercises.update', exercise.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Ejercicio actualizado con éxito');
            },
            onError: (errors) => {
                console.error('Error al actualizar:', errors);
            }
        });
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
                                <div className="mb-4">
                                    <label className="block text-gray-700">Imagen</label>
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                    />
                                    {previewUrl && (
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="mt-2 h-48 object-cover rounded-md"
                                        />
                                    )}
                                    {errors.image && (
                                        <div className="text-red-500 mt-2">{errors.image}</div>
                                    )}
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

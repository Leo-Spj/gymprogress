import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, exercise, existingTypes }) {
    const imageInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(exercise.image_path ? `/storage/${exercise.image_path}` : null);
    const [newType, setNewType] = useState('');
    const [showNewTypeInput, setShowNewTypeInput] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState(exercise.type || []);
    const [typeInput, setTypeInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    const { data, setData, put, delete: destroy, errors } = useForm({
        name: exercise.name,
        type: exercise.type,
        image_url: exercise.image_url,
        image: null
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Crear preview
            setPreviewUrl(URL.createObjectURL(file));

            // Optimizar imagen
            const optimizedImage = await optimizeImage(file);
            console.log('Tamaño original:', file.size, 'bytes');
            console.log('Tamaño optimizado:', optimizedImage.size, 'bytes');
            
            setData('image', optimizedImage);
        } catch (error) {
            console.error('Error al optimizar la imagen:', error);
        }
    };

    const optimizeImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Crear un canvas para redimensionar
                    const canvas = document.createElement('canvas');
                    // Establecer dimensiones máximas
                    const MAX_WIDTH = 400*0.55;
                    const MAX_HEIGHT = 300*0.55;
                    
                    let width = img.width;
                    let height = img.height;
                    
                    // Calcular nuevas dimensiones manteniendo proporción
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convertir a WebP con baja calidad
                    canvas.toBlob((blob) => {
                        // Crear nuevo archivo con el blob optimizado
                        const optimizedFile = new File([blob], file.name, {
                            type: 'image/webp',
                            lastModified: Date.now()
                        });
                        resolve(optimizedFile);
                    }, 'image/webp', 0.1); // 0.1 = 10% de calidad
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewTypeInput(true);
            setData('type', '');
        } else {
            setShowNewTypeInput(false);
            setData('type', value);
        }
    };

    const handleNewTypeChange = (e) => {
        const value = e.target.value;
        setNewType(value);
        setData('type', value);
    };

    const handleTypeInput = (e) => {
        const value = e.target.value;
        setTypeInput(value);
        
        if (value.length > 0) {
            const matches = existingTypes.filter(type => 
                type.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const addType = (type) => {
        if (!selectedTypes.includes(type) && type.trim()) {
            const newTypes = [...selectedTypes, type.trim()];
            setSelectedTypes(newTypes);
            setData('type', newTypes);
            setTypeInput('');
            setSuggestions([]);
        }
    };

    const removeType = (typeToRemove) => {
        const newTypes = selectedTypes.filter(type => type !== typeToRemove);
        setSelectedTypes(newTypes);
        setData('type', newTypes);
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
                                    <label className="block text-gray-700">Tipos</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedTypes.map((type) => (
                                            <div key={type} className="bg-blue-100 px-2 py-1 rounded-md flex items-center">
                                                <span>{type}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeType(type)}
                                                    className="ml-2 text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={typeInput}
                                            onChange={handleTypeInput}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addType(typeInput);
                                                }
                                            }}
                                            className="mt-1 block w-full rounded-md"
                                            placeholder="Escribe y presiona Enter para agregar"
                                        />
                                        {suggestions.length > 0 && (
                                            <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                                                {suggestions.map((suggestion) => (
                                                    <div
                                                        key={suggestion}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => addType(suggestion)}
                                                    >
                                                        {suggestion}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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

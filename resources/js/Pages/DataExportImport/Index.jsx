import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const handleExport = () => {
        window.location.href = route('data.export');
    };

    const handleImport = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', data.file);
        post(route('data.import'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Gestión de Datos</h2>}
        >
            <Head title="Gestión de Datos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-medium">Exportar Datos</h3>
                            <p className="mb-4 text-gray-600">
                                Descarga todos tus datos en formato CSV. Incluye ejercicios, rutinas y registros de entrenamiento.
                            </p>
                            <PrimaryButton onClick={handleExport}>
                                Exportar Datos
                            </PrimaryButton>
                        </div>

                        <div className="border-t pt-8">
                            <h3 className="mb-4 text-lg font-medium">Importar Datos</h3>
                            <p className="mb-4 text-gray-600">
                                Importa datos previamente exportados (archivo ZIP con CSVs)
                            </p>
                            <form onSubmit={handleImport}>
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={e => setData('file', e.target.files[0])}
                                    className="mb-4 block w-full"
                                />
                                <InputError message={errors.file} className="mb-4" />
                                <PrimaryButton disabled={processing}>
                                    Importar Datos
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

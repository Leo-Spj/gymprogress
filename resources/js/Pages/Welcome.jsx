import { Head, Link } from '@inertiajs/react';
import { FaDumbbell, FaChartLine, FaRegCalendarCheck } from 'react-icons/fa'; // Añadir íconos

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 min-h-screen">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    {/* Header/Nav */}
                    <nav className="absolute top-0 right-0 p-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    href={route('login')}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Hero Section */}
                    <div className="text-center px-6 py-20 bg-white bg-opacity-90 rounded-lg shadow-lg">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            GymProgress
                        </h1>
                        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                            Registra tus entrenamientos, lleva un seguimiento detallado y observa tu progreso día a día.
                        </p>

                        {/* CTA Button */}
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Comienza Ahora
                            </Link>
                        )}
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                            <FaDumbbell className="text-blue-500 text-4xl mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Rutinas</h3>
                            <p className="text-gray-600 text-center">
                                Crea y personaliza tus rutinas de entrenamiento para maximizar tus resultados.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                            <FaChartLine className="text-teal-500 text-4xl mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Seguimiento</h3>
                            <p className="text-gray-600 text-center">
                                Registra tus series, pesos y repeticiones para un seguimiento detallado.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                            <FaRegCalendarCheck className="text-indigo-500 text-4xl mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Progreso</h3>
                            <p className="text-gray-600 text-center">
                                Visualiza tu evolución a lo largo del tiempo con gráficos intuitivos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

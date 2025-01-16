import { Head, Link } from '@inertiajs/react';
import { FaDumbbell, FaChartLine, FaRegCalendarCheck, FaMobileAlt } from 'react-icons/fa'; // Añadir íconos

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div
                className="min-h-screen bg-cover bg-center" // Eliminado "bg-fixed"
                style={{
                    backgroundImage: "url('https://via.placeholder.com/1500')",
                }}
            >
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 bg-opacity-80 min-h-screen">
                    {/* Header/Nav - Mejorado para móvil */}
                    <nav className="w-full flex justify-end p-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-blue-500 text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-md hover:bg-blue-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href={route('login')}
                                    className="text-white hover:text-gray-200 text-sm md:text-base flex items-center"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-blue-500 text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-md hover:bg-blue-600"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Hero Section - Ajustado para móvil */}
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                        <div className="text-center px-4 py-8 md:px-6 md:py-16 bg-white bg-opacity-90 rounded-lg shadow-xl w-[95%] md:w-11/12 max-w-3xl mx-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                                GymProgress
                            </h1>
                            <h2 className="text-base md:text-lg text-gray-500 mb-4 md:mb-6 px-2">
                                ¡Convierte cada entrenamiento en un paso firme hacia tu meta!
                            </h2>
                            <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                                Registra tus entrenamientos, lleva un seguimiento detallado y observa tu progreso día a día.
                            </p>

                            {/* Botones CTA - Mejorados para móvil */}
                            <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-md text-base md:text-lg font-semibold hover:bg-blue-700"
                                    >
                                        Comienza Ahora
                                    </Link>
                                )}
                                {/* <Link
                                    href="#features"
                                    className="w-full md:w-auto bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-base md:text-lg font-semibold hover:bg-blue-100"
                                >
                                    Ver Funciones
                                </Link> */}
                            </div>
                        </div>

                        {/* PWA Section */}
                        <div className="text-center px-4 py-8 md:px-6 md:py-16 bg-white bg-opacity-90 rounded-lg shadow-xl w-[95%] md:w-11/12 max-w-3xl mx-4 mt-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                <FaMobileAlt className="inline-block text-blue-500 mr-2" />
                                ¡Novedad!
                            </h2>
                            <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                                Ahora puedes instalar GymProgress como una aplicación en tu celular. Abre esta página en tu navegador y sigue las instrucciones para agregarla a tu pantalla de inicio.
                            </p>
                        </div>

                        {/* Feature Grid - Optimizado para móvil */}
                        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-[95%] md:max-w-5xl mx-auto my-6 md:my-12 px-4 md:px-0">
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
            </div>
        </>
    );
}

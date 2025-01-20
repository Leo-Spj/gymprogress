<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use League\Csv\Writer;
use League\Csv\Reader;
use App\Models\Routine;
use App\Models\Exercise;
use App\Models\Workout;
use App\Models\WorkoutSet;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DataExportImportController extends Controller
{
    public function index()
    {
        return Inertia::render('DataExportImport/Index');
    }

    public function export()
    {
        $user = Auth::user();
        
        // Asegurar que los directorios existan
        $basePath = storage_path('app');
        $publicPath = storage_path('app/public');
        $tempPath = storage_path('app/temp');
        
        if (!file_exists($publicPath)) {
            mkdir($publicPath, 0755, true);
        }
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0755, true);
        }

        // Crear directorio temporal único para este usuario
        $timestamp = time();
        $userTempDir = $tempPath . '/' . $user->id . '_' . $timestamp;
        if (!file_exists($userTempDir)) {
            mkdir($userTempDir, 0755, true);
        }

        // Crear CSV para ejercicios con tipos corregidos
        $exercisesCsv = Writer::createFromString('');
        $exercisesCsv->insertOne(['name', 'type', 'image_url']);
        $exercises = Exercise::where('user_id', $user->id)->get();
        foreach ($exercises as $exercise) {
            $exercisesCsv->insertOne([
                $exercise->name,
                is_array($exercise->type) ? implode(', ', $exercise->type) : $exercise->type,
                $exercise->image_url
            ]);
        }

        // Crear CSV para rutinas
        $routinesCsv = Writer::createFromString('');
        $routinesCsv->insertOne(['name', 'exercises']);
        $routines = Routine::where('user_id', $user->id)->with('exercises')->get();
        foreach ($routines as $routine) {
            $routinesCsv->insertOne([
                $routine->name,
                implode(',', $routine->exercises->pluck('name')->toArray())
            ]);
        }

        // Crear CSV para workouts y sets
        $workoutsCsv = Writer::createFromString('');
        $workoutsCsv->insertOne(['date', 'exercise_name', 'reps', 'weight', 'duration_seconds']);
        $workouts = Workout::where('user_id', $user->id)->with('workoutSets.exercise')->get();
        foreach ($workouts as $workout) {
            foreach ($workout->workoutSets as $set) {
                $workoutsCsv->insertOne([
                    $workout->workout_date,
                    $set->exercise->name,
                    $set->reps,
                    $set->weight,
                    $set->duration_seconds
                ]);
            }
        }

        // Guardar CSVs en el directorio temporal
        file_put_contents($userTempDir . '/exercises.csv', $exercisesCsv->toString());
        file_put_contents($userTempDir . '/routines.csv', $routinesCsv->toString());
        file_put_contents($userTempDir . '/workouts.csv', $workoutsCsv->toString());

        // Crear archivo ZIP
        $zipName = 'export_' . $user->id . '_' . $timestamp . '.zip';
        $zipPath = $publicPath . '/' . $zipName;

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== TRUE) {
            return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP');
        }

        // Añadir archivos al ZIP directamente
        $zip->addFile($userTempDir . '/exercises.csv', 'exercises.csv');
        $zip->addFile($userTempDir . '/routines.csv', 'routines.csv');
        $zip->addFile($userTempDir . '/workouts.csv', 'workouts.csv');
        $zip->close();

        // Limpiar archivos temporales
        array_map('unlink', glob($userTempDir . '/*.*'));
        rmdir($userTempDir);

        // Verificar que el archivo ZIP existe
        if (!file_exists($zipPath)) {
            return redirect()->back()->with('error', 'Error al crear el archivo ZIP');
        }

        return response()->download($zipPath, 'gym_data_export.zip')->deleteFileAfterSend();
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:zip'
        ]);

        $user = Auth::user();
        
        // Extraer usando unzip del sistema
        $tempPath = storage_path('app/temp/' . $user->id);
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0755, true);
        }
        
        $zipPath = $request->file('file')->path();
        exec("unzip " . escapeshellarg($zipPath) . " -d " . escapeshellarg($tempPath));

        try {
            // Importar ejercicios con manejo correcto de tipos
            $exercisesCsv = Reader::createFromPath($tempPath . '/exercises.csv', 'r');
            $exercisesCsv->setHeaderOffset(0);
            foreach ($exercisesCsv as $record) {
                Exercise::create([
                    'user_id' => $user->id,
                    'name' => $record['name'],
                    'type' => explode(', ', $record['type']), // Convertir string a array si es necesario
                    'image_url' => $record['image_url']
                ]);
            }

            // Importar rutinas y sus ejercicios
            $routinesCsv = Reader::createFromPath($tempPath . '/routines.csv', 'r');
            $routinesCsv->setHeaderOffset(0);
            foreach ($routinesCsv as $record) {
                $routine = Routine::create([
                    'user_id' => $user->id,
                    'name' => $record['name']
                ]);

                $exerciseNames = explode(',', $record['exercises']);
                $exercises = Exercise::where('user_id', $user->id)
                    ->whereIn('name', $exerciseNames)
                    ->get();
                
                foreach ($exercises as $index => $exercise) {
                    $routine->exercises()->attach($exercise->id, ['order_index' => $index]);
                }
            }

            // Importar workouts y sets
            $workoutsCsv = Reader::createFromPath($tempPath . '/workouts.csv', 'r');
            $workoutsCsv->setHeaderOffset(0);
            foreach ($workoutsCsv as $record) {
                $workout = Workout::firstOrCreate([
                    'user_id' => $user->id,
                    'workout_date' => $record['date']
                ]);

                $exercise = Exercise::where('user_id', $user->id)
                    ->where('name', $record['exercise_name'])
                    ->first();

                if ($exercise) {
                    WorkoutSet::create([
                        'workout_id' => $workout->id,
                        'exercise_id' => $exercise->id,
                        'reps' => $record['reps'],
                        'weight' => $record['weight'],
                        'duration_seconds' => $record['duration_seconds']
                    ]);
                }
            }

            // Limpiar archivos temporales
            exec("rm -rf " . escapeshellarg($tempPath));

            return redirect()->back()->with('message', 'Datos importados correctamente');
        } catch (\Exception $e) {
            exec("rm -rf " . escapeshellarg($tempPath));
            return redirect()->back()->with('error', 'Error al importar datos: ' . $e->getMessage());
        }
    }
}

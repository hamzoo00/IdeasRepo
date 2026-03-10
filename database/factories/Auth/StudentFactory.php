<?php
namespace Database\Factories\Auth;

use App\Models\Auth\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'), // Default password
            'university_name' => 'Institue Of Managment Sciences',
            'degree' => $this->faker->randomElement(['BS']),
            'program' => $this->faker->randomElement(['BS Computer Science', 'BS Software Engineering', 'BS DataScience', 'BS AI', 'BS BBA', 'BS Economics']),
            'batch' => $this->faker->randomElement(['2022', '2023', '2024', '2025']),
            'semester' => $this->faker->numberBetween(1, 8),
            'student_id' => $this->faker->unique()->numerify('#########'),
            'is_suspended' => false,
            'warning_count' => 0,
            'created_at' => now(),
        ];
    }
}
<?php

namespace Database\Factories\Ideas;

use App\Models\Ideas\Ideas;
use App\Models\Auth\Student;
use App\Models\Auth\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class IdeasFactory extends Factory
{
    protected $model = Ideas::class;

    public function definition(): array
    {
        $themes = ['AI-Powered', 'Cloud-Based', 'Blockchain', 'IoT', 'Mobile App for', 'Automated'];
        $topics = ['Health Tracking', 'Waste Management', 'E-Learning', 'Smart Parking', 'Rural Agriculture', 'Inventory Control'];
        $techs = ['React, Laravel, PostgreSQL', 'Flutter, Firebase', 'Python, TensorFlow, Flask', 'Next.js, Node.js, MongoDB'];

        // Generate a sensible title
        $title = $this->faker->randomElement($themes) . ' ' . $this->faker->randomElement($topics);

        // Determine if author is Student or Teacher randomly
        $isStudent = $this->faker->boolean(80); // 80% chance it's a student
        $authorType = $isStudent ? Student::class : Teacher::class;
        $authorId = $isStudent ? Student::inRandomOrder()->first()->id : Teacher::inRandomOrder()->first()->id;

        return [
            'author_id' => $authorId,
            'author_type' => $authorType,
            'title' => $title,
            'summary' => $this->faker->sentence(12),
            'description' => $this->faker->realText(600),
            'tech_stack' => $this->faker->randomElement($techs),
            'status' => $this->faker->randomElement(['Idea', 'In Progress', 'Completed']),
            'report_count' => $this->faker->numberBetween(0, 10), // Useful for testing your new Admin Queues!
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function aiProject()
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'AI ' . $this->faker->word,
            'tech_stack' => 'Python, PyTorch, Jupyter',
        ]);
    }
}
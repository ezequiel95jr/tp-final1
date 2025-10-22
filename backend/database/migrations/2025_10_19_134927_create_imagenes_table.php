<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('imagenes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_post');
            $table->string('url');
            $table->timestamps();

            $table->foreign('id_post')->references('id')->on('posts')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imagenes');
    }
};


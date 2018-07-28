<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGridsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grids', function (Blueprint $table) {
            $table->increments( 'id' );
            $table->enum( 'section', [ 'admin', 'front' ] )->index();
            $table->integer( 'user_id' )->index();
            $table->string( 'grid_id' )->index();
            $table->string( 'entity' )->index();
            $table->text( 'value' );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grids');
    }
}

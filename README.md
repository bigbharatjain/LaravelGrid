# STEPS TO IMPLEMENT GRID IN LARAVEL 5.x

1. Copy App/Http/Controllers/GridsController.php.
2. Copy App/Http/Grids/Grids.php.
3. Copy public/js/grid.js and public/css/grid.css.
4. Copy resources/views/grid-template.blade.php.
5. Copy database/migrations/xxxx_xx_xx_xxxxxx_create_grids_table.php. and run 'php artisan migrate'
6. In layout, add paths of css and js.
7. In your routes/web.php, add following routes:
	Route::post('/save-grid-data/{gridID}/{entity}', 'GridController@store');
	Route::delete('/save-grid-data/{gridID}/{entity}/{entityID}', 'GridController@destroy');

8. To create Grid, 
	Create a file similar to App/Grids/SampleGrids.php
		- Write your query in 'QueryBuilder' method.
		- Map your columns in 'mapColumnsWithDB' method.
		- Provide array for the column display in 'getColumns' method.
		- and so on.

9. In your Controller,
	```
	use App\Grids\InvoicesGrids;

	public function datatableList(Request $request) {    // create route for this
		$invoicesGrids = new InvoicesGrids();
		return $invoicesGrids->getJSON();    
	}
	```

   ```
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
   */
    public function index()
    {
        $invoicesGrids = new InvoicesGrids();
        $dataGridHtml = $invoicesGrids->getHtml();
        return view('your-view-name', compact('dataGridHtml'));
    }
    ```

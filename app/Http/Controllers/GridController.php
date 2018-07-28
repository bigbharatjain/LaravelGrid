<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use DB;

/**
 * Class GridController
 * @package App\Http\Controllers
 */
class GridController extends Controller
{

    /**
     * @return mixed
     */
    private function getUserID() {
        return auth()->guard('admin')->user()->id;
    }

    /**
     * @return string
     */
    private function getSection() {
        return 'admin';
    }

    /**
     * @param $gridID
     * @param $entity
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store($gridID, $entity, Request $request )
    {
        $gridRow = false;
        if(!in_array($entity, ['download_template', 'filter_template', 'advance_search_template'])) {
            $gridRow = DB::table('grids')
                ->select('id')
                ->where('section', $this->getSection())
                ->where('user_id', $this->getUserID())
                ->where('grid_id', $gridID)
                ->where('entity', $entity)
                ->first();
        }


        $entityValue = $request->input('value');
        $entityValue = is_array($entityValue) ? json_encode($entityValue) : ($entityValue ?: false);

        if(!$gridRow) {

            if($entityValue !== false) {

                $insertID = DB::table('grids')->insertGetId([
                        'section' => $this->getSection(),
                        'user_id' => $this->getUserID(),
                        'grid_id' => $gridID,
                        'entity' => $entity,
                        'value' => $entityValue,
                    ]);

                return response()->json([
                    'id' => $insertID,
                    'entity' => $entity,
                    'value' => $request->input('value')
                ]);

            }


        } else {
            if($entityValue === false) {

                DB::table('grids')->where('id', $gridRow->id)->delete();

            } else {

                DB::table('grids')
                    ->where('id', $gridRow->id)
                    ->update([
                        'section' => $this->getSection(),
                        'user_id' => $this->getUserID(),
                        'grid_id' => $gridID,
                        'entity' => $entity,
                        'value' => $entityValue,
                    ]);

            }
        }

        return response()->json([
            'status' => 1
        ]);

    }

    /**
     * @param $gridID
     * @param $entity
     * @param $entityID
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($gridID, $entity, $entityID) {
        DB::table('grids')
            ->where('id', $entityID)
            ->where('section', $this->getSection())
            ->where('user_id', $this->getUserID())
            ->where('grid_id', $gridID)
            ->where('entity', $entity)
            ->delete();

        return response()->json([
            'status' => 1
        ]);
    }
    
}

<?php

namespace App\Grids;

use DB;
use Carbon\Carbon;
use Excel;


/**
 * Class Grids
 * @package App\Grids
 */
abstract class Grids
{

    /**
     * @var
     */
    var $primaryKey;

    /**
     * @var int
     */
    var $recordPage = 10;

    /**
     * @var array
     */
    var $inactiveColumns = [];

    /**
     * @var array
     */
    var $downloadTemplates = [];

    /**
     * @var array
     */
    var $filterTemplates = [];

    /**
     * @var array
     */
    var $advanceSearchTemplates = [];

    /**
     * @var
     */
    private $request;

    /**
     * @var array
     */
    private $returnData = [];

    /**
     * @var bool
     */
    var $debug = true;

    /**
     * @var bool
     */
    var $downloadFilePrefix = false;


    private function setDynamicGridData()
    {
        $gridData = DB::table('grids')
            ->select('id', 'entity', 'value')
            ->where('section', 'admin')
            ->where('user_id', auth()->guard('admin')->user()->id)
            ->where('grid_id', $this->getID())
            ->get();

        if(!empty($gridData)) {
            foreach($gridData as $gridData) {
                if($gridData->entity == 'limit' && $gridData->value > 0) {
                    $this->recordPage = $gridData->value;
                } else if($gridData->entity == 'inactive_columns') {
                    $inactiveColumns = $gridData->value ? json_decode($gridData->value, true) : [];
                    if(!empty($inactiveColumns)) {
                        $this->inactiveColumns = $inactiveColumns;
                    }
                } else if($gridData->entity == 'download_template') {
                    if($gridData->value) {
                        $tpl = json_decode($gridData->value, true);
                        $this->downloadTemplates[] = ['id' => $gridData->id, 'title' => $tpl['title'], 'fields' => $tpl['fields']];
                    }
                } else if($gridData->entity == 'filter_template') {
                    if($gridData->value) {
                        $tpl = json_decode($gridData->value, true);
                        $this->filterTemplates[] = ['id' => $gridData->id, 'title' => $tpl['title'], 'filters' => $tpl['filters']];
                    }
                } else if($gridData->entity == 'advance_search_template') {
                    if($gridData->value) {
                        $tpl = json_decode($gridData->value, true);
                        $this->advanceSearchTemplates[] = ['id' => $gridData->id, 'title' => $tpl['title'], 'rules' => $tpl['rules']];
                    }
                }

            }
        }
    }
    
    /**
     * Build Grid Component HTML
     * @return string;
     */
    public function getHTML() {
        $this->setDynamicGridData();
        $gridID = $this->getID();
        $ajaxURI = $this->getAjaxURI();
        $columns = $this->getColumns();
        $sortableColumns = $this->getSortableColumns();
        $searchableColumns = $this->getSearchableColumns();
        $filters = $this->getFilterOptions();
        $advanceSearchOptions = $this->getAdvanceSearchOptions();
        $downloadOptions = $this->getDownloadOptions();
        $recordsPerPage = $this->recordPage && $this->recordPage > 0 ? $this->recordPage : 10;

        $recordsPerPageDropDown = $this->getRecordsPerPageDropDown();
        $orderBy = $this->orderBy();
        // && isset($columns[$orderBy[0]])
        if(is_array($orderBy) && !empty($orderBy)) {
            $orderBy = ['sort' => $orderBy[0], 'sort_direction' => (isset($orderBy[1]) && $orderBy[1] ? strtolower($orderBy[1]) : 'asc')];
        } else {
            $orderBy = ['sort' => '', 'sort_direction' => ''];
        }

        if(!in_array($recordsPerPage, $recordsPerPageDropDown)) {
            $recordsPerPageDropDown[] = $recordsPerPage;
        }

        $bulkActionButtons = $this->getBulkAction();
        $hasBulkAction = (!empty($bulkActionButtons) && $this->primaryKey) ? $this->primaryKey : false;
        if($hasBulkAction == false) {
            $bulkActionButtons = [];
        }

        $inactiveColumns = $this->inactiveColumns;
        $downloadTemplates = $this->downloadTemplates;
        $filterTemplates = $this->filterTemplates;
        $advanceSearchTemplates = $this->advanceSearchTemplates;

        return view('grid-template', compact('gridID', 'ajaxURI', 'columns', 'sortableColumns', 'searchableColumns', 'filters', 'advanceSearchOptions', 'downloadOptions', 'recordsPerPageDropDown', 'recordsPerPage', 'orderBy', 'bulkActionButtons', 'hasBulkAction', 'inactiveColumns', 'downloadTemplates', 'filterTemplates', 'advanceSearchTemplates'));
    }


    /**
     * Get Grid Data and pagination info
     * @return array;
     */
    public function getJSON() {

        $this->returnData = [];
        $this->returnData['total_pages'] = 1;
        $this->returnData['current_page'] = 1;
        $this->returnData['from'] = 0;
        $this->returnData['to'] = 0;
        $this->returnData['total_records'] = 0;
        $this->returnData['data'] = [];


        $this->request = request()->all();
        $this->request['page'] = ( !is_numeric($this->request['page']) || $this->request['page'] < 1 ) ? 1 : $this->request['page'];
        $this->request['limit'] = ( !is_numeric($this->request['limit']) || $this->request['limit'] < 1 ) ? 10 : $this->request['limit'];

        $queryBuilder = $this->QueryBuilder();

        if(isset($this->request['sort']) && $this->request['sort']) {
            $queryBuilder->orderBy($this->getSqlColumn($this->request['sort']), ( (isset($this->request['sort_direction']) && $this->request['sort_direction'] == 'desc') ? 'desc' : 'asc') );
        }

        if($groupBy = $this->groupBy()) {
            $queryBuilder->groupBy($groupBy);
        }

        if($this->request['action'] == 'list')
        {

        } else if ($this->request['action'] == 'search-column' && isset($this->request['filters']) && !empty($this->request['filters']))
        {

            $searchableColumns = $this->getSearchableColumns();
            $queryBuilder->where(function($query) use ($searchableColumns) {
                foreach($this->request['filters'] as $key => $val) {
                    if(isset($searchableColumns[$key])) {
                        if($searchableColumns[$key] == 'date') {
                            $fromDate = date('Y-m-d 00:00:00', strtotime($val));
                            $toDate = date('Y-m-d 23:59:59', strtotime($val));
                            //$query->whereBetween($this->getSqlColumn($key), array($fromDate, $toDate));
                            $query->whereRaw("DATE(".$this->getSqlColumn($key).") BETWEEN DATE('{$fromDate}') AND DATE('{$toDate}')");
                        } else if( is_array($searchableColumns[$key]) ) {
                            //$query->where($this->getSqlColumn($key), '=', htmlentities($val, ENT_NOQUOTES));
                            $query->where($this->getSqlColumn($key), '=', $val);
                        } else {
                            //$query->where($this->getSqlColumn($key), 'like', '%'.htmlentities($val).'%');
                            $query->where($this->getSqlColumn($key), 'like', '%'.$val.'%');
                        }

                    }

                }
            });

        } else if($this->request['action'] == 'search' && isset($this->request['filters']) && !empty($this->request['filters'])) {

            $queryBuilder->where(function($query){

                foreach($this->getSearchableColumns() as $key => $keyType) {

                    if($keyType == 'string') {
                        //$query->orWhere($this->getSqlColumn($key), 'like', '%'.htmlentities($this->request['filters']).'%');
                        $query->orWhere($this->getSqlColumn($key), 'like', '%'.$this->request['filters'].'%');
                    } else if($keyType == 'date') {
                        $fromDate = date('Y-m-d 00:00:00', strtotime($this->request['filters']));
                        $toDate = date('Y-m-d 23:59:59', strtotime($this->request['filters']));
                        $query->orWhereBetween($this->getSqlColumn($key), array($fromDate, $toDate));
                    } else {
                        $query->orWhere($this->getSqlColumn($key), '=', $this->request['filters']);
                    }

                }

            });

        } else if($this->request['action'] == 'filter' && isset($this->request['filters']) && !empty($this->request['filters'])) {

            $queryBuilder->where(function($query){

                $allFilters = $this->getFilterOptions();

                foreach($this->request['filters'] as $filterKey => $filterVal) {

                    if(isset($allFilters[$filterKey])) {

                        $currentFilter = $allFilters[$filterKey];

                        if(isset($currentFilter['type']) && $currentFilter['type'] == 'date') {

                            if(isset($filterVal['from']) && isset($filterVal['to'])) {

                                if($filterVal['from'] && $filterVal['to']) {
                                    $fromDate = date('Y-m-d 00:00:00', strtotime($filterVal['from']));
                                    $toDate = date('Y-m-d 23:59:59', strtotime($filterVal['to']));
                                    //$query->orWhereBetween($this->getSqlColumn($filterKey), array($fromDate, $toDate));
                                    $query->whereBetween($this->getSqlColumn($filterKey), array($fromDate, $toDate));
                                } else if($filterVal['from']) {
                                    $fromDate = date('Y-m-d 00:00:00', strtotime($filterVal['from']));
                                    $query->where($this->getSqlColumn($filterKey), '>=' , $fromDate);
                                } else if($filterVal['to']) {
                                    $toDate = date('Y-m-d 23:59:59', strtotime($filterVal['to']));
                                    $query->where($this->getSqlColumn($filterKey), '<=' , $toDate);
                                }

                            }

                        } else if(is_array($filterVal) && !empty($filterVal)) {
                            $query->whereIn($this->getSqlColumn($filterKey), $filterVal);
                        }

                    }

                }

            });

        } else if($this->request['action'] == 'advance_search' && isset($this->request['filters']) && $this->request['filters'] ) {

            $filters = htmlentities(urldecode($this->request['filters']), ENT_NOQUOTES);
            $sqlColumns = [];
            if(method_exists($this, "mapColumnsWithDB")) {
                $sqlColumns = $this->mapColumnsWithDB();
            }
            if(!empty($sqlColumns)) {
                foreach($sqlColumns as $fieldID => $filedSql) {
                    $filters = str_replace("{$fieldID} = ", "{$filedSql} = ", $filters);
                    $filters = str_replace("{$fieldID} != ", "{$filedSql} != ", $filters);
                }
            }
            $queryBuilder->whereRaw($filters);
        }


        if(isset($this->request['download']) && in_array($this->request['download'], array('csv', 'xls', 'pdf'))) {

            $downloadColumns = $this->getDownloadOptions();
            $iac = [];
            if(isset($this->request['iac']) && is_array($this->request['iac']) && !empty($this->request['iac'])) {
                $iac = $this->request['iac'];
            }
            $columns = array_diff(array_keys($downloadColumns), $iac);

            $data = $queryBuilder->get();
            if($data && !is_array($data)) {
                $data = $data->toArray();
            }

            $downloadData = array();

            foreach($downloadColumns as $downloadColumnKey => $downloadColumnVal) {
                if(in_array($downloadColumnKey, $columns)) {
                    $downloadData[0][$downloadColumnKey] = $downloadColumnVal;
                }
            }

            if(!empty($data)) {
                foreach($data as $row) {
                    $row = (array) $row;
                    $tmpArray = [];
                    foreach($columns as $column) {
                        if(method_exists($this, "display_column_{$column}")) {
                            $val = call_user_func_array(array($this, "display_column_{$column}"), array($row, 'download'));
                        } else if( isset($row[$column]) ) {
                            $val = $row[$column];
                        } else {
                            $val = "";
                        }
                        $tmpArray[$column] = $val;
                    }
                    $downloadData[] = $tmpArray;
                }
            }

            if($this->request['download'] == 'csv' || $this->request['download'] == 'xls') {

                Excel::create($this->downloadFilePrefix . time(), function($excel) use ($downloadData) {
                    $excel->sheet('Sheet 1', function($sheet) use ($downloadData) {
                        $sheet->setAllBorders('thin');
                        $sheet->fromArray($downloadData, null, 'A1', false, false);
                        $sheet->setAutoSize(true);
                    });
                })->export($this->request['download']);

            } else if($this->request['download'] == 'pdf') {

                $html = '<table repeat_header="1" cellspacing="0" border="1" width="100%" style="width: 100%; font-family: Arial; font-size: 12px;">';
                $heading = array_shift($downloadData);
                $html .= '<thead><tr>';
                foreach($heading as $h) {
                    $html .= '<td style="background: #D3D3D3; padding: 5px 7px; font-weight: bold; text-align: center; vertical-align: middle;">'.$h.'</td>';
                }
                $html .= '</tr></thead>';

                if(!empty($downloadData)) {
                    foreach($downloadData as $downloadData) {
                        $html .= '<tr>';
                        foreach($downloadData as $d) {
                            $html .= '<td style="padding: 5px 7px;">'.$d.'</td>';
                        }
                        $html .= '</tr>';
                    }
                } else {
                    $html .= '<tr><td colspan="'.count($heading).'" style="text-align: center; padding: 5px 7px;"></td></tr>';
                }

                $html .= '</table>';

                if(!is_dir(storage_path() . '/mpdf/')){
                    mkdir(storage_path() . '/mpdf/');
                }
                define("_MPDF_TEMP_PATH", storage_path() . '/mpdf/');
                define("_MPDF_TTFONTDATAPATH", storage_path() . '/mpdf/');
                
                $mPDF = new \mPDF($mode = '', $format = 'A4-L', $default_font_size = 0, $default_font = '', $mgl = 1, $mgr = 1, $mgt = 1, $mgb = 1, $mgh = 9, $mgf = 9, $orientation = 'P');
                $mPDF->SetDisplayMode('fullwidth');
                $mPDF->WriteHTML($html);
                $mPDF->Output($this->downloadFilePrefix . time().'.pdf', 'D');

                /*Excel::create($this->downloadFilePrefix . time(), function($excel) use ($downloadData) {
                    $excel->sheet('Sheet 1', function($sheet) use ($downloadData) {
                        $sheet->setAllBorders('thin');
                        $sheet->fromArray($downloadData, null, 'A1', false, false);
                        $sheet->row(1, function($row) {
                            $row->setBackground('#D3D3D3');
                            $row->setFontWeight('bold');
                            $row->setAlignment('center');
                            $row->setValignment('center');
                        });
                        $sheet->setOrientation('landscape');
                    });
                })->export('pdf');*/

            }

            return $downloadData;


        } else {
            $data = $queryBuilder->paginate( $this->request['limit'] )->toArray();
            if($this->debug == true) {
                $this->returnData['sql'] = $queryBuilder->toSql();
            }
            $this->returnData['data'] = $this->ProcessRecords($data['data']);

            $this->returnData['total_pages'] = isset($data['last_page']) ? $data['last_page'] : 1;
            $this->returnData['current_page'] = isset($data['current_page']) ? $data['current_page'] : 1;
            $this->returnData['from'] = isset($data['from']) ? $data['from'] : 0;
            $this->returnData['to'] = isset($data['to']) ? $data['to'] : 0;
            $this->returnData['total_records'] = isset($data['total']) ? $data['total'] : 0;
            $this->returnData['data'] = isset($this->returnData['data']) ? $this->returnData['data'] : [];

            return $this->returnData;
        }


    }

    /**
     * Process Each Result row
     * @param array $data
     * @return array
     */
    private function ProcessRecords($data = array())
    {
        $returnData = [];
        $columns = $this->getColumns();
        $inActiveColumns = isset($this->request['iac']) && is_array($this->request['iac']) ? $this->request['iac'] : [];

        if( empty($columns) ) {
            return [];
        }

        if( !empty($data) ) {
            foreach($data as $row) {
                $row = (array) $row;
                $tmpArray = [];
                foreach($columns as $key => $title) {
                    if(!in_array($key, $inActiveColumns)) {
                        if(method_exists($this, "display_column_{$key}")) {
                            $val = call_user_func_array(array($this, "display_column_{$key}"), array($row, $this->request['action']));
                        } else if( isset($row[$key]) ) {
                            $val = $row[$key];
                        } else {
                            $val = "";
                        }
                        $tmpArray[$key] = $val;
                    }
                }
                $returnData[] = $tmpArray;
            }
        }
        return $returnData;
    }


    /**
     * Record per page selection option
     * @return array
     */
    public function getRecordsPerPageDropDown()
    {
        return [10, 25, 50];
    }


    /**
     * Get ColumnID to sql field name
     * @param $column
     * @return mixed
     */
    public function getSqlColumn($column) {

        if(method_exists($this, "mapColumnsWithDB")) {
            $sqlMap = $this->mapColumnsWithDB();
            if(isset($sqlMap[$column])) {
                return $sqlMap[$column];
            }
        }

        return $column;
    }

    /**
     * Get Query Illuminate Database Builder
     * @return cursor
     */
    abstract public function QueryBuilder();


    /**
     * Map Columns ID with Database Table columns for Search, Columns Search, Advance Search, Filter and Sorting
     * @return array
     */
    abstract public function mapColumnsWithDB();


    /**
     * Unique Grid ID
     * @return string
     */
    abstract public function getID();


    /**
     * return uri to get grid ajax data
     * @return string URI
     */
    abstract public function getAjaxURI();


    /**
     * Return Columns to Display on Table
     * @return array ['id' => 'title']
     */
    abstract public function getColumns();


    /**
     * Sortable Columns, return array with each columnsID which you want to sort.
     * @return array ['id', 'first_name']
     * ORDER BY FIElD(id, 'sort1', 'sort3', 'sort2', ...);
     */
    public function getSortableColumns() {
        return [];
    }


    /**
     * Sortable Columns, return array with each columnsID with type which you want to search.
     * @return array ['id' => 'integer', 'first_name' => 'string', 'status' => ['Active' => 'Active', 'Inactive' => 'Inactive'] ]
     */
    public function getSearchableColumns() {
        return [];
    }


    /**
     * Get Filters
     * @return array ['id' => ['title' => 'Title', 'data' => [], 'width' => '250', 'type' => 'date'], 'id1' => ['title' => 'Title 1', 'data' => ['db_value' => 'display Title']], ]
     */
    public function getFilterOptions() {
        return [];
    }


    /**
     * Get Advance Search fields
     * To view more config option at http://querybuilder.js.org/#options
     * @return array [['id' => 'field_id', 'label' => 'ID', 'type' => 'string']]
     */
    public function getAdvanceSearchOptions( )
    {
        return [];
    }


    /**
     * Get Download fields
     * @return array [['id' => 'field_id', 'label' => 'ID', 'type' => 'string']]
     */
    public function getDownloadOptions( )
    {
        return [];
    }

    /**
     * @return array
     */
    public function orderBy(  )
    {
        return [];
    }

    /**
     * @return bool
     */
    public function groupBy(  )
    {
        return false;
    }

    /**
     * @return array
     */
    public function getBulkAction(  )
    {
        return [];
    }

}
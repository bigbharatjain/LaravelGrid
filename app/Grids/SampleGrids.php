<?php

namespace App\Grids;

/**
 * Class SampleGrids
 * @package App\Grids
 */
class SampleGrids extends Grids
{

    /**
     * @var int
     */
    var $recordPage = 20;
    /**
     * @var string
     */
    var $downloadFilePrefix = 'employee-';

    /**
     * SampleGrids constructor.
     */
    public function __construct() { 

    }

    /**
     * @return string
     */
    public function getID() {
        return 'employees';
    }

    /**
     * @return string
     */
    public function getAjaxURI() {
        return route('admin.employees.datatableList');
    }

    /**
     * @return \App\Models\type|mixed
     */
    public function QueryBuilder() {
        return \DB::table('employees')
                    ->leftJoin('district_informations', 'employees.district_information_id', 'district_informations.id')
                    ->leftJoin('templates', 'employees.template_id', 'templates.id')
                    ->select('employees.*', 'district_informations.district_name', 'templates.template_name');        
    }

    /**
     * @return array
     */
    public function mapColumnsWithDB() {

        return [
                'first_name' => 'employees.first_name', 
                'last_name' => 'employees.last_name', 
                'email' => 'employees.email', 
                'phone_number' => 'employees.phone_number', 
                'employee_code' => 'employees.employee_code', 
                'employee_pay' => 'employees.employee_pay', 
                'district_name'=>'district_informations.district_name', 
                'template_name' => 'templates.template_name',
                'status' => 'employees.status', 
                'action' => 'Action'];

    }

    /**
     * @return array
     */
    public function getColumns() {

        return ['action' => 'Action',
                'status' => 'Status',
                'first_name' => 'First Name', 
                'last_name' => 'Last Name', 
                'email' => 'Email', 
                'phone_number' => 'Phone Number', 
                'employee_code' => 'Emp ID', 
                'employee_pay' => 'Emp Pay', 
                'district_name'=>'District', 
                'template_name' => 'Template',                 
                ];

    }


    /**
     * @return array
     */
    public function getSortableColumns() {

        return ['id', 
                'first_name', 
                'last_name', 
                'email', 
                'mobile'];

    }

    /**
     * @return array
     */
    public function getSearchableColumns() {
         $templateList = \App\Models\Template::select(["id","template_name"])->pluck('template_name','template_name')->toArray();
        $districtList = \App\Models\DistrictInformation::select(["id","district_name"])->pluck('district_name','district_name')->toArray();
        return ['first_name' => 'string', 
                'last_name' => 'string', 
                'email' => 'string', 
                'phone_number' => 'string', 
                'employee_code' => 'string', 
                'employee_pay' => 'string', 
                'district_name' => $districtList,
                'template_name' => $templateList,
                'status' => getEnumValues('employees', 'status')
            ];

    }

    /**
     * @return array
     */
    public function getFilterOptions(  )
    {
        /*return [
            'created_at' => ['title' => 'Created On', 'data' => [], 'width' => '250', 'type' => 'date'],

	       'status' => ['title' => 'Status', 'data' => getEnumValues('admins', 'status')]
           
        ];*/
    }

    /**
     * @return array
     */
    public function getAdvanceSearchOptions( )
    {
        return [
            ['id' => 'first_name', 'label' => 'First Name', 'type' => 'string'],
            ['id' => 'last_name', 'label' => 'Last Name', 'type' => 'string'],
            ['id' => 'email', 'label' => 'Email', 'type' => 'string'],
            ['id' => 'status', 'label' => 'Status', 'type' => 'string', 'input' => 'select', 'values' => getEnumValues('admins', 'status')]
           
        ];
    }

    /**
     * @return array
     */
    public function getDownloadOptions( )
    {
        /*return [
           'id' => 'ID', 
            'first_name' => 'First Name', 
            'last_name' => 'Last Name', 
            'email' => 'Email', 
            'mobile' => 'Mobile'
        ];*/
    }

    /**
     * @return array
     */
    public function orderBy() {
	return ['updated_at' ,'DESC']; 
	
    }

    /**
     * @param $data
     * @return string
     */
    public function display_column_status($data) {
	    $action['type'] = $data['status']=='Active' ? 'success' : 'danger';
        $action['icon'] = $data['status']=='Active' ? 'check' : 'close';
        return '<a title="Change Status" class="btn btn-sm btn-'.$action['type'].' toggleEmployee" href="javascript:void(0)" data-id="'.encrypt($data['id']).'" data-token="'.csrf_token().'">'.$data['status'].'</a>';
    }

          

    /**
     * @param $data
     * @return string
     */
    public function display_column_action($data )
    {
        return '<a class="btn btn-primary" title="'.__('employees.lbl_edit_employee_title').'" href="'.route('admin.addemployee').'/'.$data['id'].'"><i class="fa fa-pencil"></i></a> &nbsp; <a class="btn btn-danger removeEmployee" data-toggle="tooltip" title="'.__('employees.lbl_delete_employee_title').'" data-original-title="'.__('employees.lbl_delete_employee_title').'" href="javascript:void(0)" data-id="'.encrypt($data['id']).'" data-token="'.csrf_token().'"><i class="fa fa-trash"></i></a>';
    }

}
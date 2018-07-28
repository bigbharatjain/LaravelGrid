<div class="row new--grid--style" id="inic_grid_{{$gridID}}">
    <div class="col-md-12">
        <div class="panel panel-default">
            <!-- Default panel contents -->
            <div class="panel-heading">
                <div class="form-inline">

                    <div class="row">


                        <div class="col-sm-6">
                            @if (count($searchableColumns) > 0)
                            <div class="form-group">
                                <div class="input-group">
                                    <input name="search" class="form-control" type="search" />
                                    <a href="javascript:;" class="input-group-addon search-global"><i class="glyphicon glyphicon-search"></i></a>
                                </div>
                            </div>
                            @endif

                            @if(!empty($bulkActionButtons))
                                <div style="margin-left: 30px; display: inline;">
                                @foreach($bulkActionButtons as $bulkKey => $bulkActionButton)
                                    <button class="btn btn-sm {{$bulkActionButton['class'] or 'btn-info'}}" data-bulkaction="{{ $bulkActionButton['url'] }}" type="button" disabled>{{ $bulkActionButton['title'] }}</button>
                                @endforeach
                                </div>
                            @endif
                        </div>

                        <div class="col-sm-6">
                            <div class="btn-toolbar pull-right" role="toolbar">

                                @if( count($advanceSearchOptions) > 0 )
                                    <div class="btn-group" role="group">
                                        <button show-hide="advance-search-options" type="button" class="btn btn-default" data-placement="top" data-toggle="tooltip" title="Advance Search"><i class="glyphicon glyphicon-search"></i></button>
                                    </div>
                                @endif

                                @if( count($filters) > 0 )
                                <div class="btn-group" role="group">
                                    <button show-hide="filter" type="button" class="btn btn-default" data-placement="top" data-toggle="tooltip"  title="Filters"><i class="glyphicon glyphicon-filter"></i></button>
                                </div>
                                @endif

                                <div class="btn-group" role="group">
                                    <button show-hide="screen-options" type="button" class="btn btn-default" data-placement="top" data-toggle="tooltip"  title="Screen Options"><i class="glyphicon glyphicon glyphicon-cog"></i></button>
                                </div>

                                @if( count($downloadOptions) > 0 )
                                <div class="btn-group" role="group">
                                    <button show-hide="download-options" type="button" class="btn btn-default" data-placement="top" data-toggle="tooltip"  title="Download Options"><i class="glyphicon glyphicon-download-alt"></i></button>
                                </div>
                                @endif

                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-default refreshGrid" data-placement="top" data-toggle="tooltip"  title="Refresh"><i class="glyphicon glyphicon-refresh"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @if( count($advanceSearchOptions) > 0 )
                <div class="panel-body advance-search-options hidden">
                    <div class="row">
                        <div class="col-sm-12">
                            <h4 class="ftitle">Advance Search</h4>
                            <div class="filter-option">
                                <div class="advance-search-list">
                                    <div class="query_builder"></div>
                                </div>
                                <div class="filter_result" id="inic_grid_{{$gridID}}_advance_search_templates" {!! count($advanceSearchTemplates) < 1 ? ' style="display:none;"' : '' !!}>
                                    <strong>Your Templates: </strong>
                                    <ul>
                                        @foreach($advanceSearchTemplates as $advanceSearchTemplate)
                                            <li data-id="{{ $advanceSearchTemplate['id'] }}"><a href="javascript:;" class="setAdvanceSearchTemplate">{{ $advanceSearchTemplate['title'] }}</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>
                                        @endforeach
                                    </ul>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="btn btn-sm btn-success build_query_btn">Search</button>
                                    <button type="button" class="btn btn-sm btn-default resetQueryBuilder">Reset</button>
                                    <button type="button" class="btn blue displaySaveAdvanceSearchTemplatePopup"><i class="fa fa-floppy-o"></i> SAVE</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endif

            @if( count($filters) > 0 )
                <div class="panel-body filter hidden">
                    <!-- Filter Start -->
                    <div class="row">
                        <div class="col-sm-12">
                            <h4 class="ftitle">Filters</h4>
                            <form name="inic_grid_{{$gridID}}_filter_form" class="filter-list">
                                <table style="width:auto;" cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                    <tr>
                                        @foreach($filters as $id => $filter)
                                            @if( isset($filter['data']) && is_array($filter['data']) && (!empty($filter['data']) || ( isset($filter['type']) && $filter['type'] == 'date')) )
                                            <td{!! isset($filter['width']) ? ' width="'.$filter['width'].'"' : "" !!}>
                                                <h5>{{ $filter['title'] or $id }}</h5>

                                                @if( isset($filter['type']) && $filter['type'] == 'date' )

                                                    <div class="form-group">
                                                        <span>From Date</span>
                                                        <input name="filters[{{ $id }}][from]" placeholder="mm/dd/yyyy" type="text" class="form-control date-picker filter_{{ $id }}_from" style="width: 150px">
                                                    </div>

                                                    <div class="form-group">
                                                        <span>To Date</span>
                                                        <input name="filters[{{ $id }}][to]" placeholder="mm/dd/yyyy" type="text" class="form-control date-picker filter_{{ $id }}_to" style="width: 150px">
                                                    </div>

                                                @elseif( is_array($filter['data']) && !empty(is_array($filter['data'])) )

                                                    <div class="scrolled-item">
                                                        @foreach( $filter['data'] as $filterVal => $filterTitle )
                                                            <div class="checkbox mt-checkbox-inline">
                                                                <label class="mt-checkbox mt-checkbox-outline">
                                                                    <input class="filter_{{ $id }}_{{ str_replace(' ', '', $filterVal) }}" name="filters[{{ $id }}][]" type="checkbox" value="{{ $filterVal }}"> {{ $filterTitle }}
                                                                <span></span></label>
                                                            </div>
                                                        @endforeach
                                                    </div>

                                                @endif

                                            </td>
                                            @endif
                                        @endforeach
                                    </tr>
                                    </tbody>
                                </table>
                            </form>
                            <div class="filter_result" id="inic_grid_{{$gridID}}_filter_templates" {!! count($filterTemplates) < 1 ? ' style="display:none;"' : '' !!}>
                                <strong>Your Templates: </strong>
                                <ul>
                                    @foreach($filterTemplates as $filterTemplate)
                                        <li data-id="{{ $filterTemplate['id'] }}"><a href="javascript:;" class="setFilterTemplate">{{ $filterTemplate['title'] }}</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>
                                    @endforeach
                                </ul>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-sm btn-success filter_now_btn">Apply</button>
                                <button type="button" class="btn btn-sm btn-default resetGrid">Reset</button>
                                <button type="button" class="btn blue displaySaveFilterTemplatePopup"><i class="fa fa-floppy-o"></i> SAVE</button>
                            </div>
                        </div>
                    </div>
                    <!-- Filter End -->
                </div>
            @endif

            <div class="panel-body screen-options hidden">
                <!-- Screen options Start -->
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="ftitle">Screen Options</h4>

                        <div class="row">
                            <div class="col-md-12">
                                @foreach ($columns as $id => $title)
                                    <div class="checkbox mt-checkbox-inline">
                                        <label class="mt-checkbox mt-checkbox-outline"><input class="screen_options_ele" checked="checked" name="screen_options[{{ $id }}]" value="{{ $id }}" type="checkbox"> {!! $title !!} <span></span></label>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-sm btn-success save-screen-options">Save</button>
                        </div>
                    </div>
                </div>
                <!-- Screen options End -->
            </div>

            @if( count($downloadOptions) > 0 )
            <div class="panel-body download-options hidden">
                <!-- Download options Start -->
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="ftitle">Download Options</h4>
                        <form  name="inic_grid_{{$gridID}}_download_form" class="filter-list">
                            <div class="download-item">
                                @foreach ($downloadOptions as $id => $title)
                                    <div class="checkbox mt-checkbox-inline">
                                        <label class="mt-checkbox mt-checkbox-outline"><input class="download_options_ele" checked="checked" name="download[{{ $id }}]" value="{{ $id }}" type="checkbox"> {!! $title !!} <span></span></label>
                                    </div>
                                @endforeach
                            </div>
                        </form>
                        <div class="filter_result" id="inic_grid_{{$gridID}}_download_templates" {!! count($downloadTemplates) < 1 ? ' style="display:none;"' : '' !!}>
                            <strong>Your Templates: </strong>
                            <ul>
                                @foreach($downloadTemplates as $downloadTemplate)
                                <li data-id="{{ $downloadTemplate['id'] }}"><a href="javascript:;" class="setDownloadTemplate">{{ $downloadTemplate['title'] }}</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>
                                @endforeach
                            </ul>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-sm btn-success download-grid-data" data-type="csv"><i class="fa fa-file-text-o"></i> Download CSV</button>
                            <button type="button" class="btn btn-sm btn-success download-grid-data" data-type="xls"><i class="fa fa-file-excel-o"></i> Download Excel</button>
                            <button type="button" class="btn btn-sm btn-success download-grid-data" data-type="pdf"><i class="fa fa-file-pdf-o"></i> Download PDF</button>
                            <button type="button" class="btn blue displaySaveDownloadTemplatePopup"><i class="fa fa-floppy-o"></i> SAVE</button>
                            <a href="#" class="btn btn-link selectAllDownload">Select all</a> | <a href="#" class="btn btn-link clearAllDownload">Clear all</a>
                        </div>
                    </div>
                </div>
                <!-- Download options End -->
            </div>
            @endif

            <div class="table-responsive">
                <table class="table table-striped table-bordered grid-data-table">
                    <thead>
                    <tr>
                        @if($hasBulkAction)
                            <th style="width: 30px;" class="column-bulk-action"><input type="checkbox" class="bulk_action_checkbox_check_uncheck_all" /></th>
                        @endif
                        @foreach ($columns as $id => $title)
                            <th data-column-id="{{ $id }}" class="column-{{ $id }}{{ in_array($id, $sortableColumns) ? ' sorting' : '' }}{{ $id == $orderBy['sort'] ? ' ' . $orderBy['sort_direction'] : '' }}"{!! in_array($id, $sortableColumns) ? ('sorting="'.$id.'"') : "" !!}>{!! $title !!}</th>
                        @endforeach
                    </tr>
                    @if (count($searchableColumns) > 0)
                        <tr class="column_search_row">
                        @if($hasBulkAction)
                            <th class="column-bulk-action"></th>
                        @endif
                        @foreach ($columns as $id => $title)
                            @if ( isset($searchableColumns[$id]) )
                                <th data-column-id="{{ $id }}" class="column-search-{{ $id }}">
                                @if( $searchableColumns[$id] == 'integer' )
                                        <input name="column_search[{{ $id }}]" column-search="{{ $id }}" class="form-control" type="number" />
                                @elseif( is_array($searchableColumns[$id]) )
                                        <select name="column_search[{{ $id }}]" column-search="{{ $id }}" class="form-control input-sm">
                                            <option value="">All</option>
                                            @foreach( $searchableColumns[$id] as $val => $title )
                                                <option value="{{ $val }}">{{ $title }}</option>
                                            @endforeach
                                        </select>
                                @elseif( $searchableColumns[$id] == 'date' )
                                        <input name="column_search[{{ $id }}]" column-search="{{ $id }}" placeholder="mm/dd/yyyy" class="form-control date-picker" type="text" />
                                @else
                                        <input name="column_search[{{ $id }}]" column-search="{{ $id }}" class="form-control" type="text" />
                                @endif
                                </th>
                            @else
                                <th data-column-id="{{ $id }}" class="column-search-{{ $id }}"></th>
                            @endif
                        @endforeach
                        </tr>
                    @endif
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <nav class="pagination-wrap">

                <div class="show-per-page"> Record per page <select name="row_per_page" class="form-control">
                        @foreach($recordsPerPageDropDown as $recordsPerPageDropDown)
                            <option value="{{ $recordsPerPageDropDown }}"{!! $recordsPerPageDropDown == $recordsPerPage ? ' selected="selected"' : '' !!}>{{ $recordsPerPageDropDown }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="view-per-page">Showing 0 to 0 of 0 entries</div>


                <ul class="pagination"></ul>
            </nav>
        </div>


    </div>

    <div class="modal fade" id="inic_grid_{{$gridID}}_save_download_template" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Save Template</h4>
                </div>
                <div class="modal-body">
                    <form class="form">
                        <div class="form-group required">
                            <label class="control-label">Template Name</label>
                            <input type="text" name="template_name" class="form-control" value="" autocomplete="off">
                            <div class="help-block error"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary saveDownloadTemplate">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="inic_grid_{{$gridID}}_save_filter_template" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Save Template</h4>
                </div>
                <div class="modal-body">
                    <form class="form">
                        <div class="form-group required">
                            <label class="control-label">Template Name</label>
                            <input type="text" name="template_name" class="form-control" value="" autocomplete="off">
                            <div class="help-block error"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary saveFilterTemplate">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="inic_grid_{{$gridID}}_save_advance_search_template" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Save Template</h4>
                </div>
                <div class="modal-body">
                    <form class="form">
                        <div class="form-group required">
                            <label class="control-label">Template Name</label>
                            <input type="text" name="template_name" class="form-control" value="" autocomplete="off">
                            <div class="help-block error"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary saveAdvanceSearchTemplate">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="inic_grid_{{$gridID}}_template_warning" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>

{{--<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">--}}

@push('scripts')
<script type="text/javascript">
    $(document).ready(function() {
        window.inic_grid_{{$gridID}} = new iNICGrid('inic_grid_{{$gridID}}', {
            id: '{{ $gridID }}',
            baseURI: '{{ URL::to('/') }}',
            ajaxURI: '{{ $ajaxURI }}',
            columns: JSON.parse('{!! json_encode(array_keys($columns)) !!}'),
            recordsPerPage: {{ $recordsPerPage }},
            orderBy: JSON.parse('{!! json_encode($orderBy) !!}'),
            bulkAction: '{{$hasBulkAction}}',
            inactiveColumns: JSON.parse('{!! json_encode($inactiveColumns) !!}'),
            downloadTemplates: JSON.parse('{!! json_encode($downloadTemplates) !!}'),
            filterTemplates: JSON.parse('{!! json_encode($filterTemplates) !!}'),
            advanceSearchTemplates: JSON.parse('{!! json_encode($advanceSearchTemplates) !!}'),
            advanceSearchOptions: JSON.parse('{!! json_encode($advanceSearchOptions) !!}')
        });
    });
</script>
@endpush


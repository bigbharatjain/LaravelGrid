var iNICGrid = function (id, options) {
    this.id = id;
    this.options = options;
    this.loading = false;

    this.inactiveColumns = this.options.inactiveColumns;
    //this.downloadTemplates = this.options.downloadTemplates;
    //console.log(this.options.downloadTemplates);

    var self = this;
    $('#'+id+' select[name=row_per_page] option[value='+this.options.recordsPerPage+']').attr('selected', true);

    $('#'+id+' *[show-hide]').click(function() {
        var panelBodyEle = $('#'+id+' .panel-body.'+$(this).attr('show-hide'));
        if($(panelBodyEle).hasClass('hidden') == false) {
            $(panelBodyEle).addClass('hidden');
        } else {
            $('#'+id+' .panel-body').addClass('hidden');
            $(panelBodyEle).removeClass('hidden');
        }

    });

    $('#'+id+'_save_download_template').on('show.bs.modal', function (e) {
        $('#'+id+'_save_download_template input[name=template_name]').val('');
    });

    $('#'+id+'_save_filter_template').on('show.bs.modal', function (e) {
        $('#'+id+'_save_filter_template input[name=template_name]').val('');
    });

    $('#'+id+'_save_advance_search_template').on('show.bs.modal', function (e) {
        $('#'+id+'_save_filter_template input[name=template_name]').val('');
    });

    $('#'+id+' a.search-global').click(this.globalSearch.bind(this));
    $('#'+id+' input[name=search]').keyup(this.globalSearch.bind(this));
    $('#'+id+' *[column-search]').change(this.columnSearch.bind(this));
    $('#'+id+' *[sorting]').click(this.sortColumn.bind(this));
    $('#'+id+' .screen-options .save-screen-options').click(this.saveScreenOptions.bind(this));
    $('#' + id + ' .filter_now_btn').click(this.filterNow.bind(this));
    $('#'+id+' select[name=row_per_page]').change(this.changeRecordsPerPage.bind(this));

    $('#'+id+' .resetGrid').click(this.initList.bind(this));

    $('#'+id+' .download-grid-data').click(this.download.bind(this));

    $('#'+id+' .bulk_action_checkbox_check_uncheck_all').click(this.bulkActionCheckUncheckAll.bind(this));
    $('#'+id).on('click', '.bulk_action_checkbox', this.bulkActionCheckUncheck.bind(this));

    $('#'+id).on('click', '.selectAllDownload', function(e) {
        e.preventDefault();
        $('#'+id+' .download-item input[type=checkbox]').prop('checked', true);
    });

    $('#'+id).on('click', '.clearAllDownload', function(e) {
        e.preventDefault();
        $('#'+id+' .download-item input[type=checkbox]').prop('checked', false);
    });

    $('#'+id+' .displaySaveDownloadTemplatePopup').click(this.displaySaveDownloadTemplatePopup.bind(this));

    $('#'+id+' .saveDownloadTemplate').click(this.saveDownloadTemplate.bind(this));

    $('#'+id).on('click', '.setDownloadTemplate', function(e) {
        e.preventDefault();
        var activeTemplateID = $(this).closest('li').data('id');

        for(var gdt = 0; gdt < self.options.downloadTemplates.length; gdt++) {
            if(self.options.downloadTemplates[gdt]['id'] == activeTemplateID) {
                $('#'+id+' .download-item input[type=checkbox]').prop('checked', false);
                for(var tpl = 0; tpl < self.options.downloadTemplates[gdt]['fields'].length; tpl++) {
                    $('#'+id+' .download-item input[value="'+self.options.downloadTemplates[gdt]['fields'][tpl]+'"]').prop('checked', true);
                }
            }
        }

    });

    $('#'+id+'_download_templates ul').on('click', 'li span.remove', function(e) {
        var tplID = $(this).closest('li').data('id');
        self.removeGridData('download_template', tplID);
        $(this).closest('li').remove();
        if($('#'+id+'_download_templates ul li').length < 1) {
            $('#'+id+'_download_templates').attr('style', 'display:none;');
        }
    });


    $('#'+id+' .displaySaveFilterTemplatePopup').click(this.displaySaveFilterTemplatePopup.bind(this));

    $('#'+id+' .saveFilterTemplate').click(this.saveFilterTemplate.bind(this));
    $('#'+id+' input[name=template_name]').keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            $(this).closest('.modal-content').find('.modal-footer .btn-primary').trigger('click');
        }
    });

    $('#'+id).on('click', '.setFilterTemplate', function(e) {
        e.preventDefault();
        var activeTemplateID = $(this).closest('li').data('id');

        for(var gft = 0; gft < self.options.filterTemplates.length; gft++) {
            if(self.options.filterTemplates[gft].id == activeTemplateID) {
                $('#'+id+' .filter-list input[type=checkbox]').prop('checked', false);
                $('#'+id+' .filter-list input[type=text]').val('');

                for(var i in self.options.filterTemplates[gft].filters) {
                    if(self.options.filterTemplates[gft].filters[i] instanceof Array) {
                        for(var f = 0; f < self.options.filterTemplates[gft].filters[i].length; f++) {
                            console.log(self.options.filterTemplates[gft].filters[i][f]);
                            $('#'+id+' .filter-list input.filter_'+i+'_'+self.options.filterTemplates[gft].filters[i][f].replace(/ /g,'')).prop('checked', true);
                        }
                    } else {
                        $('#'+id+' .filter-list input.filter_'+i+'_from').val(self.options.filterTemplates[gft].filters[i].from);
                        $('#'+id+' .filter-list input.filter_'+i+'_to').val(self.options.filterTemplates[gft].filters[i].to);
                    }
                }
                self.filterNow(this);
            }
        }

    });

    $('#'+id+'_filter_templates ul').on('click', 'li span.remove', function(e) {
        var tplID = $(this).closest('li').data('id');
        self.removeGridData('filter_template', tplID);
        $(this).closest('li').remove();
        if($('#'+id+'_filter_templates ul li').length < 1) {
            $('#'+id+'_filter_templates').attr('style', 'display:none;');
        }
    });


    $('#'+id+' .displaySaveAdvanceSearchTemplatePopup').click(this.displaySaveAdvanceSearchTemplatePopup.bind(this));

    $('#'+id+' .saveAdvanceSearchTemplate').click(this.saveAdvanceSearchTemplate.bind(this));

    $('#'+id).on('click', '.setAdvanceSearchTemplate', function(e) {
        e.preventDefault();
        var activeTemplateID = $(this).closest('li').data('id');

        for(var gft = 0; gft < self.options.advanceSearchTemplates.length; gft++) {
            if(self.options.advanceSearchTemplates[gft].id == activeTemplateID) {
                $('#'+id+' .query_builder').queryBuilder('setRules', self.options.advanceSearchTemplates[gft].rules);
                $('#'+id+' .build_query_btn').trigger('click');
            }
        }

    });

    $('#'+id+'_advance_search_templates ul').on('click', 'li span.remove', function(e) {
        var tplID = $(this).closest('li').data('id');
        self.removeGridData('advance_search_template', tplID);
        $(this).closest('li').remove();
        if($('#'+id+'_advance_search_templates ul li').length < 1) {
            $('#'+id+'_advance_search_templates').attr('style', 'display:none;');
        }
    });


    for(var i = 0; i < this.inactiveColumns.length; i++) {
        $('#'+this.id+' *[data-column-id="'+this.inactiveColumns[i]+'"]').addClass('hidden');
        $('#'+this.id+' input[name="screen_options['+this.inactiveColumns[i]+']"]').attr('checked', false);
    }

    $('#'+id+' .refreshGrid').click(this.getData.bind(this));

    this.initList();

    if(this.options.advanceSearchOptions.length > 0) {
        $('#'+id+' .query_builder').queryBuilder({
            sortable: true,
            filters: this.options.advanceSearchOptions
        });

        var self = this;

        $('#'+id+' .resetQueryBuilder').click(function() {
            $('.dropdown-menu.open, .bootstrap-select.open').removeClass('open');
            $('#'+id+' .query_builder').queryBuilder('reset');
            self.initList();
        });

        $('#'+id+' .build_query_btn').click(function() {
            var resSql = $('#'+id+' .query_builder').queryBuilder('getSQL', false);
            if(resSql.sql && resSql.sql.length > 3) {
                self.queryData.page = 1;
                self.queryData.action = 'advance_search';
                self.queryData.filters = resSql.sql.replace(/\n/g, " ");
                self.getData();
                self.resetSearch('advance');
            }
        });

    }

};

iNICGrid.prototype.refresh = function() {
    this.getData();
};

iNICGrid.prototype.initList = function() {
    this.queryData = {action: 'list', page:1, limit: this.options.recordsPerPage, filters:''};

    if(this.options.orderBy.sort && this.options.orderBy.sort_direction) {
        this.queryData.sort = this.options.orderBy.sort;
        this.queryData.sort_direction = this.options.orderBy.sort_direction;
    }

    this.getData();
    var filterForm = $('form[name='+this.id+'_filter_form]');
    if(filterForm.length > 0) {
        filterForm[0].reset();
    }
};

iNICGrid.prototype.getData = function() {

    this.loading = true;
    $('#'+this.id+' .grid-data-table tbody').html('<tr><td class="text-center" colspan="'+(this.options.columns.length - this.inactiveColumns.length)+'">Loading...</td></tr>');

    var self = this;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {

        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                //{"total_pages":8,"current_page":
                if(response.current_page > response.total_pages && response.total_pages > 0) {
                    self.queryData.page = response.total_pages;
                    self.getData();
                }

                self.dataResponse = response;
                self.buildPagination();
                self.buildDataRows();
                if (typeof response.callback !== 'undefined') {
                    eval(response.callback + "(response)");
                }
            } catch (e) {
                alert(e);
            }
        }


    });

    this.queryData.iac = this.inactiveColumns;
    var filters = '';
    if(this.queryData.action == 'filter') {
        filters = '&'+this.queryData.filters;
    }
    oReq.open("GET", this.options.ajaxURI + '?' + $.param(this.queryData)+filters);
    oReq.send();
};

iNICGrid.prototype.download = function(e) {

    if($('#'+this.id+' input[type=checkbox].download_options_ele:checked').length < 1) {
        alert("Minimum one option should be selected.");
    } else {
        var inactiveColumns = [];
        $('#'+this.id+' input[type=checkbox].download_options_ele').not(':checked').each(function() {
            inactiveColumns.push($(this).val());
        });
        this.queryData.iac = inactiveColumns;

        var filters = '';
        if(this.queryData.action == 'filter') {
            filters = '&'+this.queryData.filters;
        }
        window.open(this.options.ajaxURI + '?' + $.param(this.queryData)+filters+'&download='+$(e.target).data('type'));
    }

};

iNICGrid.prototype.buildDataRows = function() {

    var tableRows = '';

    if(this.dataResponse.data.length > 0) {
        for(var i = 0; i < this.dataResponse.data.length; i++) {
            tableRows += '<tr>';

            if(this.options.bulkAction) {
                tableRows += '<td class="column-bulk-action"><input class="bulk_action_checkbox" type="checkbox" value="" /></td>';
            }

            for(var x = 0; x < this.options.columns.length; x++) {

                if(this.inArray(this.options.columns[x], this.inactiveColumns) == false) {
                    if(typeof this.dataResponse.data[i][this.options.columns[x]] == 'undefined') {
                        tableRows += '<td data-column-id="'+this.options.columns[x]+'"></td>';
                    } else {
                        tableRows += '<td data-column-id="'+this.options.columns[x]+'"><span>'+ this.dataResponse.data[i][this.options.columns[x]] +'</span></td>';
                    }
                }

            }
            tableRows += '</tr>';
        }
    } else {
        tableRows = '<tr><td align="center" colspan="'+(this.options.columns.length - this.inactiveColumns.length)+'">No record found.</td></tr>'
    }

    $('#'+this.id+' .grid-data-table tbody').html(tableRows);
    this.loading = false;

};

iNICGrid.prototype.buildPagination = function() {

    $('#'+this.id+' .view-per-page').html('Showing '+this.dataResponse.from+' to '+this.dataResponse.to+' of '+this.dataResponse.total_records+' entries');
    $('#'+this.id+' .pagination').html('');

    var pagination = '';
    if(this.dataResponse.total_pages > 1) {

        if(this.dataResponse.current_page > 1) {
            pagination += '<li><a href="javascript:;" gotopage="1"><span>&laquo;</span></a></li>';
        }

        var minPageDisplay = parseInt(this.dataResponse.current_page - 3);
        var maxPageDisplay = parseInt(this.dataResponse.current_page + 3);

        if(minPageDisplay > 0) {
            pagination += '<li><a href="javascript:;" style="cursor: default;">...</a></li>';
        }

        for(var i = 1; i <= this.dataResponse.total_pages; i++ ) {

            if(this.dataResponse.current_page == i) {
                pagination += '<li class="active"><a href="javascript:;">'+i+'</a></li>';
            } else if( i < maxPageDisplay && i > minPageDisplay) {
                pagination += '<li><a href="javascript:;" gotopage="'+i+'">'+i+'</a></li>';
            }

        }

        if(maxPageDisplay < i) {
            pagination += '<li><a href="javascript:;" style="cursor: default;">...</a></li>';
        }

        if(this.dataResponse.current_page < this.dataResponse.total_pages) {
            pagination += '<li><a href="javascript:;" gotopage="'+this.dataResponse.total_pages+'"><span>&raquo;</span></a></li>';
        }

        $('#'+this.id+' .pagination').html(pagination);

        var self = this;
        $('#'+this.id+' *[gotopage]').click(function(e) {
            var goToPage = parseInt($(this).attr('gotopage'));
            if(goToPage > 0 && goToPage <= self.dataResponse.total_pages) {
                self.queryData.page = goToPage;
                self.getData();
            }
        });

    }

};

iNICGrid.prototype.displaySaveAdvanceSearchTemplatePopup = function(e) {

    e.preventDefault();

    //$('#'+this.id+' .query_builder').queryBuilder('setRulesFromSQL', "product_name = 'test'");

    var resSql = $('#'+this.id+' .query_builder').queryBuilder('getSQL', false);
    if(!resSql.sql || resSql.sql.length < 3) {
        this.showTemplateWarning('Advance Search', 'Minimum 1 rule should be applied.');
    } else {
        $('#'+this.id+'_save_advance_search_template').modal('show');
    }

};

iNICGrid.prototype.saveAdvanceSearchTemplate = function(e) {

    e.preventDefault();
    var templateNameInput = $('#'+this.id+'_save_advance_search_template input[name=template_name]');
    templateNameInput.closest('.form-group').removeClass('has-error');
    templateNameInput.next('.help-block').text('');
    if(templateNameInput.val().length < 1) {
        templateNameInput.closest('.form-group').addClass('has-error');
        templateNameInput.next('.help-block').text('Template Name is required.');
    } else {
        //var resSql = $('#'+this.id+' .query_builder').queryBuilder('getSQL', false);
        var rules = $('#'+this.id+' .query_builder').queryBuilder('getRules', { get_flags: true });
        var template = {title: templateNameInput.val(), rules: rules};
        var self = this;
        this.storeData('advance_search_template', template, function(res) {
            self.options.advanceSearchTemplates.push({id: res.id, title: templateNameInput.val(), rules: rules});
            $('#'+self.id+'_advance_search_templates ul').append('<li data-id="'+res.id+'"><a href="javascript:;" class="setAdvanceSearchTemplate">'+templateNameInput.val()+'</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>');
            $('#'+self.id+'_advance_search_templates').removeAttr('style');
            $('#'+self.id+'_save_advance_search_template').modal('hide');
        });
    }
};

iNICGrid.prototype.displaySaveFilterTemplatePopup = function(e) {

    e.preventDefault();

    var filterFormFields = $('form[name='+this.id+'_filter_form]').serializeArray();
    var haveValue = false;
    for(var filterCheckedCounter = 0; filterCheckedCounter < filterFormFields.length; filterCheckedCounter++) {
        if(filterFormFields[filterCheckedCounter].value.length > 0) {
            haveValue = true;
            break;
        }
    }
    if(haveValue == false) {
        this.showTemplateWarning('Filters', 'Minimum 1 filter should be applied.');
    } else {
        $('#'+this.id+'_save_filter_template').modal('show');
    }

};

iNICGrid.prototype.saveFilterTemplate = function(e) {

    e.preventDefault();
    var templateNameInput = $('#'+this.id+'_save_filter_template input[name=template_name]');
    templateNameInput.closest('.form-group').removeClass('has-error');
    templateNameInput.next('.help-block').text('');
    if(templateNameInput.val().length < 1) {
        templateNameInput.closest('.form-group').addClass('has-error');
        templateNameInput.next('.help-block').text('Template Name is required.');
    } else {
        var template = $('form[name='+this.id+'_filter_form]').serializeJSON();
        template.title = templateNameInput.val();
        var self = this;
        this.storeData('filter_template', template, function(res) {
            self.options.filterTemplates.push({id: res.id, title: templateNameInput.val(), filters: template.filters});
            console.log(self.options.filterTemplates);
            $('#'+self.id+'_filter_templates ul').append('<li data-id="'+res.id+'"><a href="javascript:;" class="setFilterTemplate">'+templateNameInput.val()+'</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>');
            $('#'+self.id+'_filter_templates').removeAttr('style');
            $('#'+self.id+'_save_filter_template').modal('hide');
        });
    }
};

iNICGrid.prototype.displaySaveDownloadTemplatePopup = function(e) {

    e.preventDefault();
    if($('#'+this.id+' input[type=checkbox].download_options_ele:checked').length < 1) {
        this.showTemplateWarning('Download Options', 'Minimum 1 checkbox should be checked.');
    } else {
        $('#'+this.id+'_save_download_template').modal('show');
    }

};

iNICGrid.prototype.saveDownloadTemplate = function(e) {

    e.preventDefault();
    var templateNameInput = $('#'+this.id+'_save_download_template input[name=template_name]');
    templateNameInput.closest('.form-group').removeClass('has-error');
    templateNameInput.next('.help-block').text('');
    if(templateNameInput.val().length < 1) {
        templateNameInput.closest('.form-group').addClass('has-error');
        templateNameInput.next('.help-block').text('Template Name is required.');
    } else {
        var fields = [];
        $('#'+this.id+' input[type=checkbox].download_options_ele:checked').each(function() {
            fields.push(this.value);
        });
        var self = this;
        this.storeData('download_template', {title: templateNameInput.val(), fields: fields}, function(res) {
            $('#'+self.id+'_download_templates ul').append('<li data-id="'+res.id+'"><a href="javascript:;" class="setDownloadTemplate">'+templateNameInput.val()+'</a> <span class="remove"><i class="glyphicon glyphicon-remove"></i></span></li>');
            $('#'+self.id+'_download_templates').removeAttr('style');
            $('#'+self.id+'_save_download_template').modal('hide');
            self.options.downloadTemplates.push({id: res.id, title: templateNameInput.val(), fields: fields});
        });
    }
};

iNICGrid.prototype.showTemplateWarning = function(title, content) {

    $('#'+this.id+'_template_warning .modal-title').text(title);
    $('#'+this.id+'_template_warning .modal-body').html(content);
    $('#'+this.id+'_template_warning').modal('show');
};

iNICGrid.prototype.bulkActionCheckUncheckAll = function(e) {

    if($(e.target).is(':checked') == true) {
        $('#'+this.id+' button[data-bulkaction]').removeAttr('disabled');
        $('#'+this.id+' input.bulk_action_checkbox').prop('checked', true);
    } else {
        $('#'+this.id+' button[data-bulkaction]').attr('disabled', true);
        $('#'+this.id+' input.bulk_action_checkbox').prop('checked', false);
    }

};

iNICGrid.prototype.bulkActionCheckUncheck = function(e) {

    var totalCheckbox = $('#'+this.id).find('.bulk_action_checkbox').length;
    var checkedCheckbox = $('#'+this.id).find('.bulk_action_checkbox:checked').length;

    if(totalCheckbox == checkedCheckbox && checkedCheckbox > 0) {
        $('#'+this.id+' input.bulk_action_checkbox_check_uncheck_all').prop('checked', true);
    } else {
        $('#'+this.id+' input.bulk_action_checkbox_check_uncheck_all').prop('checked', false);
    }

    if(checkedCheckbox > 0) {
        $('#'+this.id+' button[data-bulkaction]').removeAttr('disabled');
    } else {
        $('#'+this.id+' button[data-bulkaction]').attr('disabled', true);
    }
};

iNICGrid.prototype.saveScreenOptions = function() {

    if($('#'+this.id+' input[type=checkbox].screen_options_ele:checked').length < 1) {
        alert("Minimum one option should be selected.");
    } else {

        $('#'+this.id).find('*[data-column-id]').removeClass('hidden');

        var self = this;
        var inactiveColumns = [];
        $('#'+this.id+' input[type=checkbox].screen_options_ele').not(':checked').each(function() {
            var eleVal = $(this).val();
            inactiveColumns.push(eleVal);
            $('#'+self.id).find('*[data-column-id="'+eleVal+'"]').addClass('hidden');
        });
        this.inactiveColumns = inactiveColumns;
        this.storeData('inactive_columns', inactiveColumns);
        //localStorage.setItem(this.id + "_inactive_columns", JSON.stringify(this.inactiveColumns));
        this.getData();
    }

};

iNICGrid.prototype.globalSearch = function(e) {

    if(e.type == 'keyup' && e.keyCode != 13) {
        return;
    }

    this.resetSearch('global');

    var searchKeyword = $('#'+this.id+' input[name=search]').val();

    if(searchKeyword.length < 1) {
        this.initList();
    } else {
        this.queryData.page = 1;
        this.queryData.action = 'search';
        this.queryData.filters = searchKeyword;
        this.getData();
    }

};

iNICGrid.prototype.columnSearch = function() {

    this.queryData.page = 1;
    this.queryData.action = 'search-column';
    this.queryData.filters = {};

    var self = this;
    $('#'+this.id+' *[column-search]').each(function() {
        if($(this).val().length > 0) {
            self.queryData.filters[$(this).attr('column-search')] = $(this).val();
        }
    });

    this.resetSearch('column');

    if(Object.keys(this.queryData.filters).length < 1) {
        this.initList();
    } else {
        this.getData();
    }

};

iNICGrid.prototype.sortColumn = function(e) {

    var direction = $(e.target).hasClass('asc') ? 'desc' : 'asc';
    this.queryData.sort = $(e.target).attr('sorting');
    this.queryData.sort_direction = direction;

    this.getData();

    $(e.target).closest('tr').find('.sorting').removeClass('asc desc');
    $(e.target).addClass(direction);

};

iNICGrid.prototype.changeRecordsPerPage = function(e) {

    var limit = parseInt($(e.target).val());

    if( limit > 0 && (typeof limit === "number") ) {
        //localStorage.setItem(this.id + '_limit', limit);
        this.storeData('limit', limit);
        this.options.recordsPerPage = this.queryData.limit = limit;
        this.queryData.page = 1;
        this.getData();
    }

};

iNICGrid.prototype.storeData = function(entity, value, callable) {
    $.post(this.options.baseURI + '/save-grid-data/'+this.options.id+'/'+entity, {value: value}, function(res) {
        if(typeof callable == 'function') {
            callable(res);
        }
    });
};

iNICGrid.prototype.removeGridData = function(entity, value) {

    $.ajax({
        url: this.options.baseURI + '/save-grid-data/'+this.options.id+'/'+entity+'/'+value,
        type: 'DELETE',
        dataType: 'json',
        data: {method: '_DELETE', submit: true}
    });

};

iNICGrid.prototype.filterNow = function() {
    this.queryData.page = 1;
    this.queryData.action = 'filter';
    this.queryData.filters = $('form[name='+this.id+'_filter_form]').serialize();
    this.getData();
    this.resetSearch('filter');
};

iNICGrid.prototype.resetSearch = function(except) {

    //global, advance, column, filter

    if(except !== 'global') {
        $('#'+this.id+' input[name=search]').val('');
    }

    if(except !== 'column') {
        $('#'+this.id+' tr.column_search_row th').find('input[type=text], select').each(function() {
            $(this).val('');
        });
    }

    if(except !== 'advance') {
        $('.dropdown-menu.open, .bootstrap-select.open').removeClass('open');
        if($('#'+this.id+' .query_builder').length > 0) {
            $('#'+this.id+' .query_builder').queryBuilder('reset');
        }
    }

    if(except !== 'filter') {
        var filterForm = $('form[name='+this.id+'_filter_form]');
        if(filterForm.length > 0) {
            filterForm[0].reset();
        }
    }


};

iNICGrid.prototype.inArray = function(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
};



// JavaScript Document

/*!
 * jQuery QueryBuilder 1.3.0-SNAPSHOT
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
/*jshint multistr:true */

(function($){
    "use strict";

    // GLOBAL STATIC VARIABLES
    // ===============================
    var types = [
            'string',
            'integer',
            'double',
            'date',
            'time',
            'datetime'
        ],
        inputs = [
            'text',
            'radio',
            'checkbox',
            'select'
        ];


    // CLASS DEFINITION
    // ===============================
    var QueryBuilder = function($el, options) {
        // variables
        this.$el = $el;

        this.settings = merge(QueryBuilder.DEFAULTS, options);
        this.status = { group_id: 0, rule_id: 0, generatedId: false };

        this.filters = this.settings.filters;
        this.lang = this.settings.lang;
        this.operators = this.settings.operators;
        this.template = this.settings.template;

        if (this.template.group === null) {
            this.template.group = this.getGroupTemplate;
        }
        if (this.template.rule === null) {
            this.template.rule = this.getRuleTemplate;
        }

        // ensure we have a container id
        if (!this.$el.attr('id')) {
            this.$el.attr('id', 'qb_'+Math.floor(Math.random()*99999));
            this.status.generatedId = true;
        }
        this.$el_id = this.$el.attr('id');

        // check filters
        if (!this.filters || this.filters.length < 1) {
            $.error('Missing filters list');
        }
        this.checkFilters();

        // init
        this.init(options);
    };


    // DEFAULT CONFIG
    // ===============================
    QueryBuilder.DEFAULTS = {
        onValidationError: null,
        onAfterAddGroup: null,
        onAfterAddRule: null,

        allow_groups: true,
        sortable: false,
        filters: [],
        conditions: ['AND', 'OR'],
        default_condition: 'AND',
        readonly_behavior: {
            delete_group: false,
            sortable: true
        },

        template: {
            group: null,
            rule: null
        },

        lang: {
            add_rule: 'Add rule',
            add_group: 'Add group',
            delete_rule: 'Delete',
            delete_group: 'Delete',

            condition_and: 'AND',
            condition_or: 'OR',

            filter_select_placeholder: '------',

            operator_equal: 'equal',
            operator_not_equal: 'not equal',
            operator_in: 'in',
            operator_not_in: 'not in',
            operator_less: 'less',
            operator_less_or_equal: 'less or equal',
            operator_greater: 'greater',
            operator_greater_or_equal: 'greater or equal',
            operator_begins_with: 'begins with',
            operator_not_begins_with: 'doesn\'t begin with',
            operator_contains: 'contains',
            operator_not_contains: 'doesn\'t contain',
            operator_ends_with: 'ends with',
            operator_not_ends_with: 'doesn\'t end with',
            operator_is_empty: 'is empty',
            operator_is_not_empty: 'is not empty',
            operator_is_null: 'is null',
            operator_is_not_null: 'is not null'
        },

        operators: [
            {type: 'equal',            accept_values: true,  apply_to: ['string', 'number', 'datetime']},
            {type: 'not_equal',        accept_values: true,  apply_to: ['string', 'number', 'datetime']},
            /*{type: 'less',             accept_values: true,  apply_to: ['number', 'datetime']},
            {type: 'less_or_equal',    accept_values: true,  apply_to: ['number', 'datetime']},
            {type: 'greater',          accept_values: true,  apply_to: ['number', 'datetime']},
            {type: 'greater_or_equal', accept_values: true,  apply_to: ['number', 'datetime']},
            {type: 'in',               accept_values: true,  apply_to: ['string', 'number', 'datetime']},
            {type: 'not_in',           accept_values: true,  apply_to: ['string', 'number', 'datetime']},
            {type: 'begins_with',      accept_values: true,  apply_to: ['string']},
            {type: 'not_begins_with',  accept_values: true,  apply_to: ['string']},
            {type: 'contains',         accept_values: true,  apply_to: ['string']},
            {type: 'not_contains',     accept_values: true,  apply_to: ['string']},
            {type: 'ends_with',        accept_values: true,  apply_to: ['string']},
            {type: 'not_ends_with',    accept_values: true,  apply_to: ['string']},
            {type: 'is_empty',         accept_values: false, apply_to: ['string']},
            {type: 'is_not_empty',     accept_values: false, apply_to: ['string']},
            {type: 'is_null',          accept_values: false, apply_to: ['string', 'number', 'datetime']},
            {type: 'is_not_null',      accept_values: false, apply_to: ['string', 'number', 'datetime']}*/
        ],

        icons: {
            add_group: 'glyphicon glyphicon-plus-sign',
            add_rule: 'glyphicon glyphicon-plus',
            remove_group: 'glyphicon glyphicon-remove',
            remove_rule: 'glyphicon glyphicon-remove',
            sort: 'glyphicon glyphicon-sort'
        }
    };


    // PUBLIC METHODS
    // ===============================
    /**
     * Init event handlers and default display
     */
    QueryBuilder.prototype.init = function(options) {
        var that = this;

        // EVENTS
        // group condition change
        this.$el.on('change.queryBuilder', '.rules-group-header input[name$=_cond]', function() {
            var $this = $(this);

            if ($this.is(':checked')) {
                $this.parent().addClass('active');
                $this.parent().siblings().removeClass('active');
            }
        });

        // rule filter change
        this.$el.on('change.queryBuilder', '.rule-filter-container select[name$=_filter]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            that.createRuleOperators($rule, $this.val());
            that.createRuleInput($rule, $this.val());
        });

        // rule operator change
        this.$el.on('change.queryBuilder', '.rule-operator-container select[name$=_operator]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            that.updateRuleOperator($rule, $this.val());
        });

        // add rule button
        this.$el.on('click.queryBuilder', '[data-add=rule]', function() {
            var $this = $(this),
                $ul = $this.closest('.rules-group-container').find('>.rules-group-body>.rules-list');

            that.addRule($ul);
        });

        // add group button
        if (this.settings.allow_groups) {
            this.$el.on('click.queryBuilder', '[data-add=group]', function() {
                var $this = $(this),
                    $ul = $this.closest('.rules-group-container').find('>.rules-group-body>.rules-list');

                that.addGroup($ul);
            });
        }

        // delete rule button
        this.$el.on('click.queryBuilder', '[data-delete=rule]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            $('.dropdown-menu.open, .bootstrap-select.open').removeClass('open');

            $rule.remove();
        });

        // delete group button
        this.$el.on('click.queryBuilder', '[data-delete=group]', function() {
            var $this = $(this),
                $group = $this.closest('.rules-group-container');

            that.deleteGroup($group);
        });

        // INIT
        if (this.settings.sortable) {
            this.initSortable();
        }

        this.$el.addClass('query-builder');

        if (options.rules) {
            this.setRules(options.rules);
        }
        else {
            this.addGroup(this.$el);
        }
    };

    /**
     * Destroy the plugin
     */
    QueryBuilder.prototype.destroy = function() {
        if (this.status.generatedId) {
            this.$el.removeAttr('id');
        }

        this.$el.empty()
            .off('click.queryBuilder change.queryBuilder')
            .removeClass('query-builder')
            .removeData('queryBuilder');
    };

    /**
     * Reset the plugin
     */
    QueryBuilder.prototype.reset = function() {
        this.status.group_id = 1;
        this.status.rule_id = 0;

        this.addRule(this.$el.find('>.rules-group-container>.rules-group-body>.rules-list').empty());
    };

    /**
     * Clear the plugin
     */
    QueryBuilder.prototype.clear = function() {
        this.status.group_id = 0;
        this.status.rule_id = 0;

        this.$el.empty();
    };

    /**
     * Get an object representing current rules
     * @return {object}
     */
    QueryBuilder.prototype.getRules = function() {
        this.markRuleAsError(this.$el.find('.rule-container'), false);

        var $group = this.$el.find('>.rules-group-container'),
            that = this;

        return (function parse($group) {
            var out = {},
                $elements = $group.find('>.rules-group-body>.rules-list>*');

            out.condition = $group.find('>.rules-group-header input[name$=_cond]:checked').val();
            out.rules = [];

            for (var i=0, l=$elements.length; i<l; i++) {
                var $rule = $elements.eq(i),
                    rule;

                if ($rule.hasClass('rule-container')) {
                    var filterId = that.getRuleFilter($rule);

                    if (filterId == '-1') {
                        continue;
                    }

                    var filter = that.getFilterById(filterId),
                        operator = that.getOperatorByType(that.getRuleOperator($rule)),
                        value = null;

                    if (operator.accept_values) {
                        value = that.getRuleValue($rule, filter);
                        if (filter.valueParser) {
                            value = filter.valueParser.call(this, $rule, value, filter, operator);
                        }

                        var valid = that.validateValue($rule, value, filter, operator);
                        if (valid !== true) {
                            that.markRuleAsError($rule, true);
                            that.triggerValidationError(valid, $rule, value, filter, operator);
                            return {};
                        }
                    }

                    rule = {
                        id: filter.id,
                        field: filter.field,
                        type: filter.type,
                        input: filter.input,
                        operator: operator.type,
                        value: value
                    };

                    out.rules.push(rule);
                }
                else {
                    rule = parse($rule);
                    if (!$.isEmptyObject(rule)) {
                        out.rules.push(rule);
                    }
                    else {
                        return {};
                    }
                }
            }

            if (out.rules.length === 0) {
                that.triggerValidationError('empty_group', $group, null, null, null);

                return {};
            }

            return out;
        }($group));
    };

    /**
     * Set rules from object
     * @param data {object}
     */
    QueryBuilder.prototype.setRules = function(data) {
        this.clear();

        if (!data || !data.rules || data.rules.length===0) {
            $.error('Incorrect data object passed');
        }

        var $container = this.$el,
            that = this;

        (function add(data, $container){
            var $group = that.addGroup($container, false),
                $ul = $group.find('>.rules-group-body>.rules-list'),
                $buttons = $group.find('>.rules-group-header input[name$=_cond]');

            if (data.condition === undefined) {
                data.condition = that.settings.default_condition;
            }

            for (var i=0, l=that.settings.conditions.length; i<l; i++) {
                var cond = that.settings.conditions[i];
                $buttons.filter('[value='+ cond +']').prop('checked', data.condition.toUpperCase() == cond.toUpperCase());
            }
            $buttons.trigger('change');

            $.each(data.rules, function(i, rule) {
                if (rule.rules && rule.rules.length>0) {
                    if (!that.settings.allow_groups) {
                        $.error('Groups are disabled');
                    }
                    else {
                        add(rule, $ul);
                    }
                }
                else {
                    if (rule.id === undefined) {
                        $.error('Missing rule field id');
                    }
                    if (rule.value === undefined) {
                        rule.value = '';
                    }
                    if (rule.operator === undefined) {
                        rule.operator = 'equal';
                    }

                    var $rule = that.addRule($ul),
                        filter = that.getFilterById(rule.id),
                        operator = that.getOperatorByType(rule.operator),
                        $value = $rule.find('.rule-value-container');

                    $rule.find('.rule-filter-container select[name$=_filter]').val(rule.id).trigger('change');
                    $rule.find('.rule-operator-container select[name$=_operator]').val(rule.operator).trigger('change');

                    if (operator.accept_values) {
                        switch (filter.input) {
                            case 'radio':
                                $value.find('input[name$=_value][value="'+ rule.value +'"]').prop('checked', true).trigger('change');
                                break;

                            case 'checkbox':
                                if (!$.isArray(rule.value)) {
                                    rule.value = [rule.value];
                                }
                                $.each(rule.value, function(i, value) {
                                    $value.find('input[name$=_value][value="'+ value +'"]').prop('checked', true).trigger('change');
                                });
                                break;

                            case 'select':
                                $value.find('select[name$=_value]').val(rule.value).trigger('change');
                                break;

                            /* falls through */
                            case 'text': default:
                            $value.find('input[name$=_value]').val(rule.value).trigger('change');
                            break;
                        }

                        if (rule.readonly) {
                            $rule.find('input, select').prop('disabled', true);
                            $rule.addClass('disabled').find('[data-delete=rule]').remove();

                            if (that.settings.sortable && !that.settings.readonly_behavior.sortable) {
                                $rule.find('.drag-handle').remove();
                            }
                        }
                    }

                    if (filter.onAfterSetValue) {
                        filter.onAfterSetValue.call(that, $rule, rule.value, filter, operator);
                    }
                }
            });

        }(data, $container));
    };


    // MAIN METHODS
    // ===============================
    /**
     * Checks the configuration of each filter
     */
    QueryBuilder.prototype.checkFilters = function() {
        var definedFilters = [],
            that = this;

        $.each(this.filters, function(i, filter) {
            if (!filter.id) {
                $.error('Missing filter id: '+ i);
            }
            if (definedFilters.indexOf(filter.id) != -1) {
                $.error('Filter already defined: '+ filter.id);
            }
            definedFilters.push(filter.id);

            if (!filter.type) {
                $.error('Missing filter type: '+ filter.id);
            }
            if (types.indexOf(filter.type) == -1) {
                $.error('Invalid type: '+ filter.type);
            }

            if (!filter.input) {
                filter.input = 'text';
            }
            else if (typeof filter.input != 'function' && inputs.indexOf(filter.input) == -1) {
                $.error('Invalid input: '+ filter.input);
            }

            if (!filter.field) {
                filter.field = filter.id;
            }
            if (!filter.label) {
                filter.label = filter.field;
            }

            switch (filter.type) {
                case 'string':
                    filter.internalType = 'string';
                    break;
                case 'integer': case 'double':
                filter.internalType = 'number';
                break;
                case 'date': case 'time': case 'datetime':
                filter.internalType = 'datetime';
                break;
            }

            switch (filter.input) {
                case 'radio': case 'checkbox':
                if (!filter.values || filter.values.length < 1) {
                    $.error('Missing values for filter: '+ filter.id);
                }
                break;
            }
        });
    };

    /**
     * Add a new rules group
     * @param container {jQuery} (parent <li>)
     * @param addRule {bool} (optional - add a default empty rule)
     * @return $group {jQuery}
     */
    QueryBuilder.prototype.addGroup = function(container, addRule) {
        var group_id = this.nextGroupId(),
            first = group_id == this.$el_id + '_group_0',
            $group = $(this.template.group.call(this, group_id, first));

        container.append($group);

        if (this.settings.onAfterAddGroup) {
            this.settings.onAfterAddGroup.call(this, $group);
        }

        if (addRule === undefined || addRule === true) {
            this.addRule($group.find('>.rules-group-body>.rules-list'));
        }

        return $group;
    };

    /**
     * Tries to delete a group after checks
     * @param $group {jQuery}
     */
    QueryBuilder.prototype.deleteGroup = function($group) {
        if ($group[0].id == this.$el_id + '_group_0') {
            return;
        }

        if (this.settings.readonly_behavior.delete_group) {
            $group.remove();
        }

        var that = this,
            keepGroup = false;

        $group.find('>.rules-group-body>.rules-list>*').each(function() {
            var $element = $(this);

            if ($element.hasClass('rule-container')) {
                if ($element.hasClass('disabled')) {
                    keepGroup = true;
                }
                else {
                    $element.remove();
                }
            }
            else {
                that.deleteGroup($element);
            }
        });

        if (!keepGroup) {
            $group.remove();
        }
    };

    /**
     * Add a new rule
     * @param container {jQuery} (parent <ul>)
     * @return $rule {jQuery}
     */
    QueryBuilder.prototype.addRule = function(container) {
        var rule_id = this.nextRuleId(),
            $rule = $(this.template.rule.call(this, rule_id)),
            $filterSelect = $(this.getRuleFilterSelect(rule_id));

        container.append($rule);
        $rule.find('.rule-filter-container').append($filterSelect);

        if ($.fn.selectpicker) {
            $filterSelect.selectpicker({
                container: 'body',
                style: 'btn-inverse btn-xs',
                width: 'auto',
                showIcon: false
            });
        }

        if (this.settings.onAfterAddRule) {
            this.settings.onAfterAddRule.call(this, $rule);
        }

        return $rule;
    };

    /**
     * Create operators <select> for a rule
     * @param $rule {jQuery} (<li> element)
     * @param filterId {string}
     */
    QueryBuilder.prototype.createRuleOperators = function($rule, filterId) {
        var $operatorContainer = $rule.find('.rule-operator-container').empty();

        if (filterId == '-1') {
            return;
        }

        var operators = this.getOperators(filterId),
            $operatorSelect = $(this.getRuleOperatorSelect($rule.attr('id'), operators));

        $operatorContainer.html($operatorSelect);

        if ($.fn.selectpicker) {
            $operatorSelect.selectpicker({
                container: 'body',
                style: 'btn-inverse btn-xs',
                width: 'auto',
                showIcon: false
            });
        }
    };

    /**
     * Create main <input> for a rule
     * @param $rule {jQuery} (<li> element)
     * @param filterId {string}
     */
    QueryBuilder.prototype.createRuleInput = function($rule, filterId) {
        var $valueContainer = $rule.find('.rule-value-container').empty();

        if (filterId == '-1') {
            return;
        }

        var operator = this.getOperatorByType(this.getRuleOperator($rule));

        if (!operator.accept_values) {
            return;
        }

        var filter = this.getFilterById(filterId),
            $ruleInput = $(this.getRuleInput($rule.attr('id'), filter));

        $valueContainer.append($ruleInput).show();

        //Added by Laukik
        if ($.fn.selectpicker) {
            $ruleInput.selectpicker({
                container: 'body',
                style: 'btn-inverse btn-xs',
                width: 'auto',
                showIcon: false
            });
        }
        //End Added by Laukik

        if (filter.onAfterCreateRuleInput) {
            filter.onAfterCreateRuleInput.call(this, $rule, filter);
        }

        // init external jquery plugin
        if (filter.plugin) {
            $ruleInput[filter.plugin](filter.plugin_config || {});
        }
    };

    /**
     * Update main <input> visibility when rule operator changes
     * @param $rule {jQuery} (<li> element)
     * @param operatorType {string}
     */
    QueryBuilder.prototype.updateRuleOperator = function($rule, operatorType) {
        var $valueContainer = $rule.find('.rule-value-container'),
            filter = this.getFilterById(this.getRuleFilter($rule)),
            operator = this.getOperatorByType(operatorType);

        if (!operator.accept_values) {
            $valueContainer.hide();
        }
        else {
            $valueContainer.show();

            if ($valueContainer.is(':empty')) {
                this.createRuleInput($rule, filter.id);
            }
        }

        if (filter.onAfterChangeOperator) {
            filter.onAfterChangeOperator.call(this, $rule, filter, operator);
        }
    };

    /**
     * Check if a value is correct for a filter
     * @param $rule {jQuery} (<li> element)
     * @param value {string|string[]|undefined}
     * @param filter {object}
     * @param operator {object}
     * @return {string|true}
     */
    QueryBuilder.prototype.validateValue = function($rule, value, filter, operator) {
        var validation = filter.validation || {};

        if (validation.callback) {
            return validation.callback.call(this, value, filter, operator, $rule);
        }

        switch (filter.input) {
            case 'radio':
                if (value === undefined) {
                    return 'radio_empty';
                }
                break;

            case 'checkbox':
                if (value.length === 0) {
                    return 'checkbox_empty';
                }
                break;

            case 'select':
                if (filter.multiple) {
                    if (value.length === 0) {
                        return 'select_empty';
                    }
                }
                else {
                    if (value === undefined) {
                        return 'select_empty';
                    }
                }
                break;

            /* falls through */
            case 'text': default:
            switch (filter.internalType) {
                case 'string':
                    if (validation.min !== undefined) {
                        if (value.length < validation.min) {
                            return 'string_exceed_min_length';
                        }
                    }
                    else if (value.length === 0) {
                        return 'string_empty';
                    }
                    if (validation.max !== undefined) {
                        if (value.length > validation.max) {
                            return 'string_exceed_max_length';
                        }
                    }
                    if (validation.format) {
                        if (!(validation.format.test(value))) {
                            return 'string_invalid_format';
                        }
                    }
                    break;

                case 'number':
                    if (isNaN(value)) {
                        return 'number_nan';
                    }
                    if (filter.type == 'integer') {
                        if (parseInt(value) != value) {
                            return 'number_not_integer';
                        }
                    }
                    else {
                        if (parseFloat(value) != value) {
                            return 'number_not_double';
                        }
                    }
                    if (validation.min !== undefined) {
                        if (value < validation.min) {
                            return 'number_exceed_min';
                        }
                    }
                    if (validation.max !== undefined) {
                        if (value > validation.max) {
                            return 'number_exceed_max';
                        }
                    }
                    if (validation.step) {
                        var v = value/validation.step;
                        if (parseInt(v) != v) {
                            return 'number_wrong_step';
                        }
                    }
                    break;

                case 'datetime':
                    // we need MomentJS
                    if (window.moment) {
                        if (validation.format) {
                            var datetime = moment(value, validation.format);
                            if (!datetime.isValid()) {
                                return 'datetime_invalid';
                            }
                            else {
                                if (validation.min) {
                                    if (datetime < moment(validation.min, validation.format)) {
                                        return 'datetime_exceed_min';
                                    }
                                }
                                if (validation.max) {
                                    if (datetime > moment(validation.max, validation.format)) {
                                        return 'datetime_exceed_max';
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        }

        return true;
    };

    /**
     * Add CSS for rule error
     * @param $rule {jQuery} (<li> element)
     * @param status {bool}
     */
    QueryBuilder.prototype.markRuleAsError = function($rule, status) {
        if (status) {
            $rule.addClass('has-error');
        }
        else {
            $rule.removeClass('has-error');
        }
    };

    /**
     * Trigger a validation error event with custom params
     */
    QueryBuilder.prototype.triggerValidationError = function(error, $target, value, filter, operator) {
        if (filter && filter.onValidationError) {
            filter.onValidationError.call(this, $target, error, value, filter, operator);
        }
        if (this.settings.onValidationError) {
            this.settings.onValidationError.call(this, $target, error, value, filter, operator);
        }

        var e = jQuery.Event('validationError.queryBuilder', {
            error: error,
            filter: filter,
            operator: operator,
            value: value,
            targetRule: $target[0],
            builder: this
        });

        this.$el.trigger(e);
    };

    /**
     * Init HTML5 drag and drop
     */
    QueryBuilder.prototype.initSortable = function() {
        // configure jQuery to use dataTransfer
        $.event.props.push('dataTransfer');

        var placeholder, src, isHandle = false;

        this.$el.on('mousedown', '.drag-handle', function(e) {
            isHandle = true;
        });
        this.$el.on('mouseup', '.drag-handle', function(e) {
            isHandle = false;
        });

        this.$el.on('dragstart', '[draggable]', function(e) {
            e.stopPropagation();

            if (isHandle) {
                isHandle = false;

                // notify drag and drop (only dummy text)
                e.dataTransfer.setData('text', 'drag');

                src = $(e.target);

                placeholder = $('<div class="rule-placeholder">&nbsp;</div>');
                placeholder.css('min-height', src.height());
                placeholder.insertAfter(src);

                // Chrome glitch (helper invisible if hidden immediately)
                setTimeout(function() {
                    src.hide();
                }, 0);
            }
            else {
                e.preventDefault();
            }
        });

        this.$el.on('dragenter', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var target = $(e.target), parent;

            parent = target.closest('.rule-container');
            if (parent.length) {
                placeholder.detach().insertAfter(parent);
                return;
            }

            parent = target.closest('.rules-group-container');
            if (parent.length) {
                placeholder.detach().appendTo(parent.find('.rules-list').eq(0));
                return;
            }
        });

        this.$el.on('dragover', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        this.$el.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var target = $(e.target), parent;

            parent = target.closest('.rule-container');
            if (parent.length) {
                src.detach().insertAfter(parent);
                return;
            }

            parent = target.closest('.rules-group-container');
            if (parent.length) {
                src.detach().appendTo(parent.find('.rules-list').eq(0));
                return;
            }
        });

        this.$el.on('dragend', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            src.show();
            placeholder.remove();
        });
    };


    // DATA ACCESS
    // ===============================
    /**
     * Returns an incremented group ID
     * @return {string}
     */
    QueryBuilder.prototype.nextGroupId = function() {
        return this.$el_id + '_group_' + (this.status.group_id++);
    };

    /**
     * Returns an incremented rule ID
     * @return {string}
     */
    QueryBuilder.prototype.nextRuleId = function() {
        return this.$el_id + '_rule_' + (this.status.rule_id++);
    };

    /**
     * Returns the operators for a filter
     * @param filter {string|object} (filter id name or filter object)
     * @return {object[]}
     */
    QueryBuilder.prototype.getOperators = function(filter) {
        if (typeof filter == 'string') {
            filter = this.getFilterById(filter);
        }

        var res = [];

        for (var i=0, l=this.operators.length; i<l; i++) {
            // filter operators check
            if (filter.operators) {
                if (filter.operators.indexOf(this.operators[i].type) == -1) {
                    continue;
                }
            }
            // type check
            else if (this.operators[i].apply_to.indexOf(filter.internalType) == -1) {
                continue;
            }

            res.push({
                type: this.operators[i].type,
                label: this.lang['operator_'+this.operators[i].type] || this.operators[i].type
            });
        }

        // keep sort order defined for the filter
        if (filter.operators) {
            res.sort(function(a, b) {
                return filter.operators.indexOf(a.type) - filter.operators.indexOf(b.type);
            });
        }

        return res;
    };

    /**
     * Returns a particular filter by its id
     * @param filterId {string}
     * @return {object}
     */
    QueryBuilder.prototype.getFilterById = function(filterId) {
        for (var i=0, l=this.filters.length; i<l; i++) {
            if (this.filters[i].id == filterId) {
                return this.filters[i];
            }
        }

        throw 'Undefined filter: '+ filterId;
    };

    /**
     * Return a particular operator by its type
     * @param type {string}
     * @return {object}
     */
    QueryBuilder.prototype.getOperatorByType = function(type) {
        for (var i=0, l=this.operators.length; i<l; i++) {
            if (this.operators[i].type == type) {
                return this.operators[i];
            }
        }

        throw 'Undefined operator: '+ type;
    };

    /**
     * Returns the selected filter of a rule
     * @param $rule {jQuery} (<li> element)
     * @return {string}
     */
    QueryBuilder.prototype.getRuleFilter = function($rule) {
        return $rule.find('.rule-filter-container select[name$=_filter]').val();
    };

    /**
     * Returns the selected operator of a rule
     * @param $rule {jQuery} (<li> element)
     * @return {string}
     */
    QueryBuilder.prototype.getRuleOperator = function($rule) {
        return $rule.find('.rule-operator-container select[name$=_operator]').val();
    };

    /**
     * Returns rule value
     * @param $rule {jQuery} (<li> element)
     * @param filter {object} (optional - current rule filter)
     * @return {string|string[]|undefined}
     */
    QueryBuilder.prototype.getRuleValue = function($rule, filter) {
        filter = filter || this.getFilterByType(this.getRulefilter($rule));

        var out,
            $value = $rule.find('.rule-value-container');

        switch (filter.input) {
            case 'radio':
                out = $value.find('input[name$=_value]:checked').val();
                break;

            case 'checkbox':
                out = [];
                $value.find('input[name$=_value]:checked').each(function() {
                    out.push($(this).val());
                });
                break;

            case 'select':
                if (filter.multiple) {
                    out = [];
                    $value.find('select[name$=_value] option:selected').each(function() {
                        out.push($(this).val());
                    });
                }
                else {
                    out = $value.find('select[name$=_value] option:selected').val();
                }
                break;

            /* falls through */
            case 'text': default:
            out = $value.find('input[name$=_value]').val();
        }

        return out;
    };

    /**
     * Utility to iterate over radio/checkbox/selection options.
     * it accept three formats: array of values, map, array of 1-element maps
     *
     * @param object|array options
     * @param callable tpl (takes key and text)
     */
    QueryBuilder.prototype.iterateOptions = function(options, tpl) {
        if (options) {
            if ($.isArray(options)) {
                $.each(options, function(index, entry) {
                    // array of one-element maps
                    if ($.isPlainObject(entry)) {
                        $.each(entry, function(key, val) {
                            tpl(key, val);
                            return false; // break after first entry
                        });
                    }
                    // array of values
                    else {
                        tpl(index, entry);
                    }
                });
            }
            // unordered map
            else {
                $.each(options, function(key, val) {
                    tpl(key, val);
                });
            }
        }
    };


    // TEMPLATES
    // ===============================
    /**
     * Returns group HTML
     * @param group_id {string}
     * @param main {boolean}
     * @return {string}
     */
    QueryBuilder.prototype.getGroupTemplate = function(group_id, main) {
        var h = '\
<dl id="'+ group_id +'" class="rules-group-container" '+ (this.settings.sortable ? 'draggable="true"' : '') +'> \
  <dt class="rules-group-header"> \
    <div class="btn-group pull-right"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="' + this.settings.icons.add_rule + '"></i> '+ this.lang.add_rule +' \
      </button> \
      '+ (this.settings.allow_groups ? '<button type="button" class="btn btn-xs btn-success" data-add="group"> \
        <i class="' + this.settings.icons.add_group + '"></i> '+ this.lang.add_group +' \
      </button>' : '') +' \
      '+ (!main ? '<button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
        <i class="' + this.settings.icons.remove_group + '"></i> '+ this.lang.delete_group +' \
      </button>' : '') +' \
    </div> \
    <div class="btn-group"> \
      '+ this.getGroupConditions(group_id) +' \
    </div> \
    '+ (this.settings.sortable && !main ? '<div class="drag-handle"><i class="' + this.settings.icons.sort + '"></i></div>' : '') +' \
  </dt> \
  <dd class=rules-group-body> \
    <ul class=rules-list></ul> \
  </dd> \
</dl>';

        return h;
    };

    /**
     * Returns group conditions HTML
     * @param group_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getGroupConditions = function(group_id) {
        var h = '';

        for (var i=0, l=this.settings.conditions.length; i<l; i++) {
            var cond = this.settings.conditions[i],
                active = cond == this.settings.default_condition,
                label = this.lang['condition_'+ cond.toLowerCase()] || cond;

            h+= '\
            <label class="btn btn-xs btn-success '+ (active?'active':'') +'"> \
              <input type="radio" name="'+ group_id +'_cond" value="'+ cond +'" '+ (active?'checked':'') +'> '+ label +' \
            </label>';
        }

        return h;
    };

    /**
     * Returns rule HTML
     * @param rule_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleTemplate = function(rule_id) {
        var h = '\
<li id="'+ rule_id +'" class="rule-container" '+ (this.settings.sortable ? 'draggable="true"' : '') +'> \
  <div class="rule-header"> \
    <div class="btn-group pull-right"> \
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
        <i class="' + this.settings.icons.remove_rule + '"></i> '+ this.lang.delete_rule +' \
      </button> \
    </div> \
  </div> \
  '+ (this.settings.sortable ? '<div class="drag-handle"><i class="' + this.settings.icons.sort + '"></i></div>' : '') +' \
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</li>';

        return h;
    };

    /**
     * Returns rule filter <select> HTML
     * @param rule_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleFilterSelect = function(rule_id) {
        var h = '<select name="'+ rule_id +'_filter">';
        h+= '<option value="-1">'+ this.lang.filter_select_placeholder +'</option>';

        $.each(this.filters, function(i, filter) {
            h+= '<option value="'+ filter.id +'">'+ filter.label +'</option>';
        });

        h+= '</select>';
        return h;
    };

    /**
     * Returns rule operator <select> HTML
     * @param rule_id {string}
     * @param operators {object}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleOperatorSelect = function(rule_id, operators) {
        var h = '<select name="'+ rule_id +'_operator">';

        for (var i=0, l=operators.length; i<l; i++) {
            h+= '<option value="'+ operators[i].type +'">'+ operators[i].label +'</option>';
        }

        h+= '</select>';
        return h;
    };

    /**
     * Return the rule value HTML
     * @param rule_id {string}
     * @param filter {object}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleInput = function(rule_id, filter) {
        if (typeof filter.input == 'function') {
            var $rule = this.$el.find('#'+ rule_id);
            return filter.input.call(this, $rule, filter);
        }

        var validation = filter.validation || {},
            h = '', c;

        switch (filter.input) {
            case 'radio':
                c = filter.vertical ? ' class=block' : '';
                this.iterateOptions(filter.values, function(key, val) {
                    h+= '<label'+ c +'><input type="radio" name="'+ rule_id +'_value" value="'+ key +'"> '+ val +'</label> ';
                });
                break;

            case 'checkbox':
                c = filter.vertical ? ' class=block' : '';
                this.iterateOptions(filter.values, function(key, val) {
                    h+= '<label'+ c +'><input type="checkbox" name="'+ rule_id +'_value" value="'+ key +'"> '+ val +'</label> ';
                });
                break;

            case 'select':
                h+= '<select class="form-control" name="'+ rule_id +'_value"'+ (filter.multiple ? ' multiple' : '') +'>';
                this.iterateOptions(filter.values, function(key, val) {
                    h+= '<option value="'+ key +'"> '+ val +'</option> ';
                });
                h+= '</select>';
                break;

            /* falls through */
            case 'text': default:
            switch (filter.internalType) {
                case 'number':
                    h+= '<input class="form-control" type="number" name="'+ rule_id +'_value"';
                    if (validation.step) h+= ' step="'+ validation.step +'"';
                    if (validation.min) h+= ' min="'+ validation.min +'"';
                    if (validation.max) h+= ' max="'+ validation.max +'"';
                    if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                    h+= '>';
                    break;

                /* falls through */
                case 'datetime': case 'text': default:
                h+= '<input class="form-control" type="text" name="'+ rule_id +'_value"';
                if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                h+= '>';
            }
        }

        return h;
    };


    // JQUERY PLUGIN DEFINITION
    // ===============================
    $.fn.queryBuilder = function(option) {
        if (this.length > 1) {
            $.error('Unable to initialize on multiple target');
        }

        var data = this.data('queryBuilder'),
            options = (typeof option == 'object' && option) || {};

        if (!data && option == 'destroy') {
            return this;
        }
        if (!data) {
            this.data('queryBuilder', new QueryBuilder(this, options));
        }
        if (typeof option == 'string') {
            return data[option].apply(data, Array.prototype.slice.call(arguments, 1));
        }

        return this;
    };

    $.fn.queryBuilder.defaults = {
        set: function(options) {
            merge(true, QueryBuilder.DEFAULTS, options);
        },
        get: function(key) {
            var options = QueryBuilder.DEFAULTS;
            if (key) {
                options = options[key];
            }
            return $.extend(true, {}, options);
        }
    };

    $.fn.queryBuilder.constructor = QueryBuilder;

    /**
     * From Highcharts library
     * -----------------------
     * Deep merge two or more objects and return a third object. If the first argument is
     * true, the contents of the second object is copied into the first object.
     * Previously this function redirected to jQuery.extend(true), but this had two limitations.
     * First, it deep merged arrays, which lead to workarounds in Highcharts. Second,
     * it copied properties from extended prototypes.
     */
    function merge() {
        var i,
            args = arguments,
            len,
            ret = {};

        function doCopy(copy, original) {
            var value, key;

            // An object is replacing a primitive
            if (typeof copy !== 'object') {
                copy = {};
            }

            for (key in original) {
                if (original.hasOwnProperty(key)) {
                    value = original[key];

                    // Copy the contents of objects, but not arrays or DOM nodes
                    if (value && key !== 'renderTo' && typeof value.nodeType !== 'number' &&
                        typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]') {
                        copy[key] = doCopy(copy[key] || {}, value);
                    }
                    // Primitives and arrays are copied over directly
                    else {
                        copy[key] = original[key];
                    }
                }
            }

            return copy;
        }

        // If first argument is true, copy into the existing object. Used in setOptions.
        if (args[0] === true) {
            ret = args[1];
            args = Array.prototype.slice.call(args, 2);
        }

        // For each argument, extend the return
        len = args.length;
        for (i = 0; i < len; i++) {
            ret = doCopy(ret, args[i]);
        }

        return ret;
    }

}(jQuery));

(function($){

    $.fn.queryBuilder.defaults.set({
        sqlOperators: {
            equal:            '= ?',
            not_equal:        '!= ?',
            in:               { op: 'IN(?)',     list: true },
            not_in:           { op: 'NOT IN(?)', list: true },
            less:             '< ?',
            less_or_equal:    '<= ?',
            greater:          '> ?',
            greater_or_equal: '>= ?',
            begins_with:      { op: 'LIKE(?)',     fn: function(v){ return v+'%'; } },
            not_begins_with:  { op: 'NOT LIKE(?)', fn: function(v){ return v+'%'; } },
            contains:         { op: 'LIKE(?)',     fn: function(v){ return '%'+v+'%'; } },
            not_contains:     { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v+'%'; } },
            ends_with:        { op: 'LIKE(?)',     fn: function(v){ return '%'+v; } },
            not_ends_with:    { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v; } },
            is_empty:         '== ""',
            is_not_empty:     '!= ""',
            is_null:          'IS NULL',
            is_not_null:      'IS NOT NULL'
        }
    });

    $.extend($.fn.queryBuilder.constructor.prototype, {

        /**
         * Get rules as SQL query
         * @param stmt {false|string} use prepared statements - false, 'question_mark' or 'numbered'
         * @param nl {bool} output with new lines
         * @param data {object} (optional) rules
         * @return {object}
         */
        getSQL: function(stmt, nl, data) {
            data = (data===undefined) ? this.getRules() : data;
            stmt = (stmt===true || stmt===undefined) ? 'question_mark' : stmt;
            nl =   (nl || nl===undefined) ? '\n' : ' ';

            var that = this,
                bind_index = 1,
                bind_params = [];

            var sql = (function parse(data) {
                if (!data.condition) {
                    data.condition = that.settings.default_condition;
                }
                if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                    $.error('Unable to build SQL query with '+ data.condition +' condition');
                }

                if (!data.rules) {
                    return '';
                }

                var parts = [];

                $.each(data.rules, function(i, rule) {
                    if (rule.rules && rule.rules.length>0) {
                        parts.push('('+ nl + parse(rule) + nl +')'+ nl);
                    }
                    else {
                        var sql = that.getSqlOperator(rule.operator),
                            ope = that.getOperatorByType(rule.operator),
                            value = '';

                        if (sql === false) {
                            $.error('SQL operation unknown for operator '+ rule.operator);
                        }

                        if (ope.accept_values) {
                            if (!(rule.value instanceof Array)) {
                                rule.value = [rule.value];
                            }
                            else if (!sql.list && rule.value.length>1) {
                                $.error('Operator '+ rule.operator +' cannot accept multiple values');
                            }

                            rule.value.forEach(function(v, i) {
                                if (i>0) {
                                    value+= ', ';
                                }

                                if (rule.type=='integer' || rule.type=='double') {
                                    v = changeType(v, rule.type);
                                }
                                else if (!stmt) {
                                    v = escapeString(v);
                                }

                                v = sql.fn(v);

                                if (stmt) {
                                    if (stmt == 'question_mark') {
                                        value+= '?';
                                    }
                                    else {
                                        value+= '$'+bind_index;
                                    }

                                    bind_params.push(v);
                                    bind_index++;
                                }
                                else {
                                    if (typeof v === 'string') {
                                        v = '\''+ v +'\'';
                                    }

                                    value+= v;
                                }
                            });
                        }

                        parts.push(rule.field +' '+ sql.op.replace(/\?/, value));
                    }
                });

                return parts.join(' '+ data.condition + nl);
            }(data));

            if (stmt) {
                return {
                    sql: sql,
                    params: bind_params
                };
            }
            else {
                return {
                    sql: sql
                };
            }
        },

        /**
         * Sanitize the "sql" field of an operator
         * @param sql {string|object}
         * @return {object}
         */
        getSqlOperator: function(type) {
            var sql = this.settings.sqlOperators[type];

            if (sql === undefined) {
                return false;
            }

            if (typeof sql === 'string') {
                sql = { op: sql };
            }
            if (!sql.fn) {
                sql.fn = passthru;
            }
            if (!sql.list) {
                sql.list = false;
            }

            return sql;
        }
    });


    /**
     * Does nothing !
     */
    function passthru(v) {
        return v;
    }

    /**
     * Change type of a value to int or float
     * @param value {mixed}
     * @param type {string}
     * @return {mixed}
     */
    function changeType(value, type) {
        switch (type) {
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            default: return value;
        }
    }

    /**
     * Escape SQL value
     * @param value {string}
     * @return {string}
     */
    function escapeString(value) {
        if (typeof value !== 'string') {
            return value;
        }

        return value
            .replace(/[\0\n\r\b\\\'\"]/g, function(s) {
                switch(s) {
                    case '\0': return '\\0';
                    case '\n': return '\\n';
                    case '\r': return '\\r';
                    case '\b': return '\\b';
                    default:   return '\\' + s;
                }
            })
            // uglify compliant
            .replace(/\t/g, '\\t')
            .replace(/\x1a/g, '\\Z');
    }

}(jQuery));

/*!
 SerializeJSON jQuery plugin.
 https://github.com/marioizquierdo/jquery.serializeJSON
 version 2.8.1 (Dec, 2016)
 Copyright (c) 2012, 2017 Mario Izquierdo
 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') { // Node/CommonJS
        var jQuery = require('jquery');
        module.exports = factory(jQuery);
    } else { // Browser globals (zepto supported)
        factory(window.jQuery || window.Zepto || window.$); // Zepto supported on browsers as well
    }

}(function ($) {
    "use strict";

    // jQuery('form').serializeJSON()
    $.fn.serializeJSON = function (options) {
        var f, $form, opts, formAsArray, serializedObject, name, value, parsedValue, _obj, nameWithNoType, type, keys, skipFalsy;
        f = $.serializeJSON;
        $form = this; // NOTE: the set of matched elements is most likely a form, but it could also be a group of inputs
        opts = f.setupOpts(options); // calculate values for options {parseNumbers, parseBoolens, parseNulls, ...} with defaults

        // Use native `serializeArray` function to get an array of {name, value} objects.
        formAsArray = $form.serializeArray();
        f.readCheckboxUncheckedValues(formAsArray, opts, $form); // add objects to the array from unchecked checkboxes if needed

        // Convert the formAsArray into a serializedObject with nested keys
        serializedObject = {};
        $.each(formAsArray, function (i, obj) {
            name  = obj.name; // original input name
            value = obj.value; // input value
            _obj = f.extractTypeAndNameWithNoType(name);
            nameWithNoType = _obj.nameWithNoType; // input name with no type (i.e. "foo:string" => "foo")
            type = _obj.type; // type defined from the input name in :type colon notation
            if (!type) type = f.attrFromInputWithName($form, name, 'data-value-type');
            f.validateType(name, type, opts); // make sure that the type is one of the valid types if defined

            if (type !== 'skip') { // ignore inputs with type 'skip'
                keys = f.splitInputNameIntoKeysArray(nameWithNoType);
                parsedValue = f.parseValue(value, name, type, opts); // convert to string, number, boolean, null or customType

                skipFalsy = !parsedValue && f.shouldSkipFalsy($form, name, nameWithNoType, type, opts); // ignore falsy inputs if specified
                if (!skipFalsy) {
                    f.deepSet(serializedObject, keys, parsedValue, opts);
                }
            }
        });
        return serializedObject;
    };

    // Use $.serializeJSON as namespace for the auxiliar functions
    // and to define defaults
    $.serializeJSON = {

        defaultOptions: {
            checkboxUncheckedValue: undefined, // to include that value for unchecked checkboxes (instead of ignoring them)

            parseNumbers: false, // convert values like "1", "-2.33" to 1, -2.33
            parseBooleans: false, // convert "true", "false" to true, false
            parseNulls: false, // convert "null" to null
            parseAll: false, // all of the above
            parseWithFunction: null, // to use custom parser, a function like: function(val){ return parsed_val; }

            skipFalsyValuesForTypes: [], // skip serialization of falsy values for listed value types
            skipFalsyValuesForFields: [], // skip serialization of falsy values for listed field names

            customTypes: {}, // override defaultTypes
            defaultTypes: {
                "string":  function(str) { return String(str); },
                "number":  function(str) { return Number(str); },
                "boolean": function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1; },
                "null":    function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1 ? str : null; },
                "array":   function(str) { return JSON.parse(str); },
                "object":  function(str) { return JSON.parse(str); },
                "auto":    function(str) { return $.serializeJSON.parseValue(str, null, null, {parseNumbers: true, parseBooleans: true, parseNulls: true}); }, // try again with something like "parseAll"
                "skip":    null // skip is a special type that makes it easy to ignore elements
            },

            useIntKeysAsArrayIndex: false // name="foo[2]" value="v" => {foo: [null, null, "v"]}, instead of {foo: ["2": "v"]}
        },

        // Merge option defaults into the options
        setupOpts: function(options) {
            var opt, validOpts, defaultOptions, optWithDefault, parseAll, f;
            f = $.serializeJSON;

            if (options == null) { options = {}; }   // options ||= {}
            defaultOptions = f.defaultOptions || {}; // defaultOptions

            // Make sure that the user didn't misspell an option
            validOpts = ['checkboxUncheckedValue', 'parseNumbers', 'parseBooleans', 'parseNulls', 'parseAll', 'parseWithFunction', 'skipFalsyValuesForTypes', 'skipFalsyValuesForFields', 'customTypes', 'defaultTypes', 'useIntKeysAsArrayIndex']; // re-define because the user may override the defaultOptions
            for (opt in options) {
                if (validOpts.indexOf(opt) === -1) {
                    throw new  Error("serializeJSON ERROR: invalid option '" + opt + "'. Please use one of " + validOpts.join(', '));
                }
            }

            // Helper to get the default value for this option if none is specified by the user
            optWithDefault = function(key) { return (options[key] !== false) && (options[key] !== '') && (options[key] || defaultOptions[key]); };

            // Return computed options (opts to be used in the rest of the script)
            parseAll = optWithDefault('parseAll');
            return {
                checkboxUncheckedValue:    optWithDefault('checkboxUncheckedValue'),

                parseNumbers:  parseAll || optWithDefault('parseNumbers'),
                parseBooleans: parseAll || optWithDefault('parseBooleans'),
                parseNulls:    parseAll || optWithDefault('parseNulls'),
                parseWithFunction:         optWithDefault('parseWithFunction'),

                skipFalsyValuesForTypes:   optWithDefault('skipFalsyValuesForTypes'),
                skipFalsyValuesForFields:  optWithDefault('skipFalsyValuesForFields'),
                typeFunctions: $.extend({}, optWithDefault('defaultTypes'), optWithDefault('customTypes')),

                useIntKeysAsArrayIndex: optWithDefault('useIntKeysAsArrayIndex')
            };
        },

        // Given a string, apply the type or the relevant "parse" options, to return the parsed value
        parseValue: function(valStr, inputName, type, opts) {
            var f, parsedVal;
            f = $.serializeJSON;
            parsedVal = valStr; // if no parsing is needed, the returned value will be the same

            if (opts.typeFunctions && type && opts.typeFunctions[type]) { // use a type if available
                parsedVal = opts.typeFunctions[type](valStr);
            } else if (opts.parseNumbers  && f.isNumeric(valStr)) { // auto: number
                parsedVal = Number(valStr);
            } else if (opts.parseBooleans && (valStr === "true" || valStr === "false")) { // auto: boolean
                parsedVal = (valStr === "true");
            } else if (opts.parseNulls    && valStr == "null") { // auto: null
                parsedVal = null;
            }
            if (opts.parseWithFunction && !type) { // custom parse function (apply after previous parsing options, but not if there's a specific type)
                parsedVal = opts.parseWithFunction(parsedVal, inputName);
            }

            return parsedVal;
        },

        isObject:          function(obj) { return obj === Object(obj); }, // is it an Object?
        isUndefined:       function(obj) { return obj === void 0; }, // safe check for undefined values
        isValidArrayIndex: function(val) { return /^[0-9]+$/.test(String(val)); }, // 1,2,3,4 ... are valid array indexes
        isNumeric:         function(obj) { return obj - parseFloat(obj) >= 0; }, // taken from jQuery.isNumeric implementation. Not using jQuery.isNumeric to support old jQuery and Zepto versions

        optionKeys: function(obj) { if (Object.keys) { return Object.keys(obj); } else { var key, keys = []; for(key in obj){ keys.push(key); } return keys;} }, // polyfill Object.keys to get option keys in IE<9


        // Fill the formAsArray object with values for the unchecked checkbox inputs,
        // using the same format as the jquery.serializeArray function.
        // The value of the unchecked values is determined from the opts.checkboxUncheckedValue
        // and/or the data-unchecked-value attribute of the inputs.
        readCheckboxUncheckedValues: function (formAsArray, opts, $form) {
            var selector, $uncheckedCheckboxes, $el, uncheckedValue, f, name;
            if (opts == null) { opts = {}; }
            f = $.serializeJSON;

            selector = 'input[type=checkbox][name]:not(:checked):not([disabled])';
            $uncheckedCheckboxes = $form.find(selector).add($form.filter(selector));
            $uncheckedCheckboxes.each(function (i, el) {
                // Check data attr first, then the option
                $el = $(el);
                uncheckedValue = $el.attr('data-unchecked-value');
                if (uncheckedValue == null) {
                    uncheckedValue = opts.checkboxUncheckedValue;
                }

                // If there's an uncheckedValue, push it into the serialized formAsArray
                if (uncheckedValue != null) {
                    if (el.name && el.name.indexOf("[][") !== -1) { // identify a non-supported
                        throw new Error("serializeJSON ERROR: checkbox unchecked values are not supported on nested arrays of objects like '"+el.name+"'. See https://github.com/marioizquierdo/jquery.serializeJSON/issues/67");
                    }
                    formAsArray.push({name: el.name, value: uncheckedValue});
                }
            });
        },

        // Returns and object with properties {name_without_type, type} from a given name.
        // The type is null if none specified. Example:
        //   "foo"           =>  {nameWithNoType: "foo",      type:  null}
        //   "foo:boolean"   =>  {nameWithNoType: "foo",      type: "boolean"}
        //   "foo[bar]:null" =>  {nameWithNoType: "foo[bar]", type: "null"}
        extractTypeAndNameWithNoType: function(name) {
            var match;
            if (match = name.match(/(.*):([^:]+)$/)) {
                return {nameWithNoType: match[1], type: match[2]};
            } else {
                return {nameWithNoType: name, type: null};
            }
        },


        // Check if this input should be skipped when it has a falsy value,
        // depending on the options to skip values by name or type, and the data-skip-falsy attribute.
        shouldSkipFalsy: function($form, name, nameWithNoType, type, opts) {
            var f = $.serializeJSON;

            var skipFromDataAttr = f.attrFromInputWithName($form, name, 'data-skip-falsy');
            if (skipFromDataAttr != null) {
                return skipFromDataAttr !== 'false'; // any value is true, except if explicitly using 'false'
            }

            var optForFields = opts.skipFalsyValuesForFields;
            if (optForFields && (optForFields.indexOf(nameWithNoType) !== -1 || optForFields.indexOf(name) !== -1)) {
                return true;
            }

            var optForTypes = opts.skipFalsyValuesForTypes;
            if (type == null) type = 'string'; // assume fields with no type are targeted as string
            if (optForTypes && optForTypes.indexOf(type) !== -1) {
                return true
            }

            return false;
        },

        // Finds the first input in $form with this name, and get the given attr from it.
        // Returns undefined if no input or no attribute was found.
        attrFromInputWithName: function($form, name, attrName) {
            var escapedName, selector, $input, attrValue;
            escapedName = name.replace(/(:|\.|\[|\]|\s)/g,'\\$1'); // every non-standard character need to be escaped by \\
            selector = '[name="' + escapedName + '"]';
            $input = $form.find(selector).add($form.filter(selector)); // NOTE: this returns only the first $input element if multiple are matched with the same name (i.e. an "array[]"). So, arrays with different element types specified through the data-value-type attr is not supported.
            return $input.attr(attrName);
        },

        // Raise an error if the type is not recognized.
        validateType: function(name, type, opts) {
            var validTypes, f;
            f = $.serializeJSON;
            validTypes = f.optionKeys(opts ? opts.typeFunctions : f.defaultOptions.defaultTypes);
            if (!type || validTypes.indexOf(type) !== -1) {
                return true;
            } else {
                throw new Error("serializeJSON ERROR: Invalid type " + type + " found in input name '" + name + "', please use one of " + validTypes.join(', '));
            }
        },


        // Split the input name in programatically readable keys.
        // Examples:
        // "foo"              => ['foo']
        // "[foo]"            => ['foo']
        // "foo[inn][bar]"    => ['foo', 'inn', 'bar']
        // "foo[inn[bar]]"    => ['foo', 'inn', 'bar']
        // "foo[inn][arr][0]" => ['foo', 'inn', 'arr', '0']
        // "arr[][val]"       => ['arr', '', 'val']
        splitInputNameIntoKeysArray: function(nameWithNoType) {
            var keys, f;
            f = $.serializeJSON;
            keys = nameWithNoType.split('['); // split string into array
            keys = $.map(keys, function (key) { return key.replace(/\]/g, ''); }); // remove closing brackets
            if (keys[0] === '') { keys.shift(); } // ensure no opening bracket ("[foo][inn]" should be same as "foo[inn]")
            return keys;
        },

        // Set a value in an object or array, using multiple keys to set in a nested object or array:
        //
        // deepSet(obj, ['foo'], v)               // obj['foo'] = v
        // deepSet(obj, ['foo', 'inn'], v)        // obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
        // deepSet(obj, ['foo', 'inn', '123'], v) // obj['foo']['arr']['123'] = v //
        //
        // deepSet(obj, ['0'], v)                                   // obj['0'] = v
        // deepSet(arr, ['0'], v, {useIntKeysAsArrayIndex: true})   // arr[0] = v
        // deepSet(arr, [''], v)                                    // arr.push(v)
        // deepSet(obj, ['arr', ''], v)                             // obj['arr'].push(v)
        //
        // arr = [];
        // deepSet(arr, ['', v]          // arr => [v]
        // deepSet(arr, ['', 'foo'], v)  // arr => [v, {foo: v}]
        // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}]
        // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}, {bar: v}]
        //
        deepSet: function (o, keys, value, opts) {
            var key, nextKey, tail, lastIdx, lastVal, f;
            if (opts == null) { opts = {}; }
            f = $.serializeJSON;
            if (f.isUndefined(o)) { throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined"); }
            if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }

            key = keys[0];

            // Only one key, then it's not a deepSet, just assign the value.
            if (keys.length === 1) {
                if (key === '') {
                    o.push(value); // '' is used to push values into the array (assume o is an array)
                } else {
                    o[key] = value; // other keys can be used as object keys or array indexes
                }

                // With more keys is a deepSet. Apply recursively.
            } else {
                nextKey = keys[1];

                // '' is used to push values into the array,
                // with nextKey, set the value into the same object, in object[nextKey].
                // Covers the case of ['', 'foo'] and ['', 'var'] to push the object {foo, var}, and the case of nested arrays.
                if (key === '') {
                    lastIdx = o.length - 1; // asume o is array
                    lastVal = o[lastIdx];
                    if (f.isObject(lastVal) && (f.isUndefined(lastVal[nextKey]) || keys.length > 2)) { // if nextKey is not present in the last object element, or there are more keys to deep set
                        key = lastIdx; // then set the new value in the same object element
                    } else {
                        key = lastIdx + 1; // otherwise, point to set the next index in the array
                    }
                }

                // '' is used to push values into the array "array[]"
                if (nextKey === '') {
                    if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
                        o[key] = []; // define (or override) as array to push values
                    }
                } else {
                    if (opts.useIntKeysAsArrayIndex && f.isValidArrayIndex(nextKey)) { // if 1, 2, 3 ... then use an array, where nextKey is the index
                        if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
                            o[key] = []; // define (or override) as array, to insert values using int keys as array indexes
                        }
                    } else { // for anything else, use an object, where nextKey is going to be the attribute name
                        if (f.isUndefined(o[key]) || !f.isObject(o[key])) {
                            o[key] = {}; // define (or override) as object, to set nested properties
                        }
                    }
                }

                // Recursively set the inner object
                tail = keys.slice(1);
                f.deepSet(o[key], tail, value, opts);
            }
        }

    };

}));

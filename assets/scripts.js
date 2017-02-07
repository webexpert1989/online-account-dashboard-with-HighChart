window.site_url = 'http://'+ window.location.hostname;
//window.site_url = 'http://localhost:17742/';



Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}}

function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var idleMinutes = 0;

function timerIncrement() {
    /// Changed this to keep sessio alive
    /// Only thing that seemed effective was
    /// an ajax post call
    idleMinutes = idleMinutes + 1;

    //console.log('check');
    //console.log("Entered keep session");

    $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "Add-Floor-Agent.aspx/Get_Supervisors",
                success: function (data) {
                    // var fakedatajs = JSON.parse(data.d);
                    //console.log("Entered keep session data ", datajs);
                }, error: function (jqXHR, textStatus, errorThrown) {

                }
    });
    idleMinutes = 0;
    
}

function save_scorecard(loading_div, redirect_url){
    loading_div = typeof loading_div !== 'undefined' ?  loading_div : '';
    redirect_url = typeof redirect_url !== 'undefined' ?  redirect_url : '';

    $(loading_div).addClass('loader vertical-align-middle loader-circle').html('Saving Scorecard...');

    jQuery.post(window.site_url+'/scorecard/ajax_save_scorecard', jQuery('#scorecard-form').serialize()).done(function(data){

        $(loading_div).removeClass('loader vertical-align-middle loader-circle').html('Scorecard Saved');
        if (redirect_url != ''){
            window.location.href = redirect_url;
        }
        if (redirect_url == '1'){
            self.close();
        }
    });
}

function DateFormate(dateFormate, datetime) {
    return jQuery.datepicker.formatDate(dateFormate, datetime);
};

jQuery(document).ready(function($){
    // Initialize helper scripts

    $('a.btn.btn-primary, .page-header-actions:not(.page-header-actions[data-toggle="modal"]), .floor-agents a.btn').click(function(){
		if (!$(this).hasClass('disableLoadingEffect')){
			$(this).html('Loading...').css('opacity', '.2');
		}
        return true;
    });

    $('form').submit(function(){
       $(this).find('button').html('Loading...').css('opacity', '.2');
       return true;
    });

    var tableToolsButtonsOptions = {
			bSelectedOnly: true,
			oSelectorOpts: {
				filter: "applied"
			}
		};
       $('.dataTable-tools').dataTable( {
           // "aoColumnDefs": [{ "bVisible": false, "aTargets": [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42] }],
           "aaSorting": [],
            "dom": 'TC<"clear">lfrtip',
            "tableTools": {
                "sSwfPath": window.site_url + "/app/assets/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf",
    			aButtons: [$.extend({
    					sExtends: "copy",
    					sButtonText: "Copy to clipboard"
    				}, tableToolsButtonsOptions), {
    					sExtends: "collection",
    					sButtonText: "Export",
    					aButtons: [
    						$.extend({
    							sExtends: "csv",
                                sButtonText: "CSV"
    						}, tableToolsButtonsOptions),
    						$.extend({
    							sExtends: "xls",
                                sButtonText: 'TSV'
    						}, tableToolsButtonsOptions),
    					]
    				}
    			]
            }
        });



    $('.dataTable:not(.dataTable-tools)').dataTable({
       "aaSorting": []
    });
    $('.chosen').select2();
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        clearBtn: true,
        autoclose: true
    });

    $(".from_date").datepicker({
    format: 'yyyy-mm-dd',
    clearBtn: true,
    autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('.to_date').datepicker('setStartDate', startDate);
    }).on('clearDate', function (selected) {
        $('.to_date').datepicker('setStartDate', null);
    });

    $(".to_date").datepicker({
        format: 'yyyy-mm-dd',
        clearBtn: true,
        autoclose: true,
        startDate: new Date($('.from_date').val()),
    }).on('changeDate', function (selected) {
        var endDate = new Date(selected.date.valueOf());
        $('.from_date').datepicker('setEndDate', endDate);
    }).on('clearDate', function (selected) {
        $('.from_date').datepicker('setEndDate', null);
    });

    $('.tagsinput').tagsinput({
        confirmKeys: [13],
        trimValue: true,
        allowDuplicates: false
    });

    var elems = Array.prototype.slice.call(document.querySelectorAll('.radio-toggle'));
    if (elems){
        elems.forEach(function(html) {
           var switchery = new Switchery(html);
        });
    }

    // login
    jQuery('#login-form').submit(function(event){
        // override the form, set loading message
        event.preventDefault();
        cur_msg = jQuery(this).find('.form_msg');
        cur_msg.html('Checking Credentials...');

        // send details to login script
        jQuery.post(window.site_url+'/user/login', jQuery(this).serialize()).done(function(data){
			console.log(data);
            // get results and parse them
            results = data.split('|');

            if (results[0] == '1'){
                // it worked, redirect me
                cur_msg.html(results[1]);
                window.location.href=results[2];
            }
            if (results[0] == '3'){
                $('#default-product-id').html(results[2]);
                $('#set-default-product').modal('show');
            }
            if (results[0] != '1' && results[0] != '3') {
				$('#login-form .btn').css('opacity', '1');
				$('#login-form .btn').html('Sign In');
                // failed login or inactive user
				if (results[0] == '0'){
					cur_msg.html(results[1]);
				}
				else {
					cur_msg.html('Your login was incorrect. <a onclick=\'forgot_password("'+$("#user_login").val()+'");\'>Forgot Password</a>');
				}
            }
        });
    });

    jQuery('#set-default-product-form').submit(function(event){
        event.preventDefault();
        jQuery.post(window.site_url+'/user/set_default_page', jQuery('#set-default-product-form').serialize()).done(function(data){
            window.location.href = data;

        });
    });

    jQuery('#forgot-password-form').submit(function(event){
        event.preventDefault();
        // override form, set loading message
        cur_msg = jQuery(this).find('.form_msg');
        cur_msg.html('Checking Credentials...');

        // send request for password reset
        jQuery.post(window.site_url+'/user/forgot_password', jQuery(this).serialize()).done(function(data){
             var results = data.split('|');
            // get results and parse them
            if (results[0] == '1'){
                // success, set message and close the modal
                cur_msg.html('');
                jQuery('#login-form .form_msg').html(results[1]);
                jQuery('#forgot-password').modal('hide');
            }
            else {
                cur_msg.html(results[1]);
            }
        });

    });

    //$('#flag-call-form').submit(function(event){
    //    event.preventDefault();

    //    $('#call_flagged_reason').val($('#flag_reason').val());
    //    $('#flagCall').modal('hide');

    //    if ($('#flag_reason').val() != ''){
    //        $('body').append('<div class="alert alert-alt alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>Call flagged for review.</div>');
    //    }

    //});

    $('#feedback-form').submit(function(event){
        event.preventDefault();
        $('.feedback-form-msg').addClass('loader vertical-align-middle loader-circle').html('Sending Feedback...');

        //$.post(window.site_url+'/feedback/ajax-send-feedback', $('#feedback-form').serialize()).done(function(data){
        //    var result = data.split('|');
        //    $('.feedback-form-msg').removeClass('loader vertical-align-middle loader-circle').html(result[1]);
        //    if (result[0] == '1'){
        //        $('#feedback-form input[type="text"], #feedback-form textarea').val('');
        //    }
        //});
    });

    $('#log-settings-form').submit(function(event){
        event.preventDefault();
        $('.log-settings-msg').addClass('loader vertical-align-middle loader-circle').html('Saving Settings...');

        $.post(window.site_url+'/logs/ajax-update-settings', $('#log-settings-form').serialize()).done(function(data){
            var result = data.split('|');
            $('.log-settings-msg').removeClass('loader vertical-align-middle loader-circle').html(result[1]);
        });
    });

    
    idleMinutes = setInterval(timerIncrement, 60000); // 1 minute

    //function stopTimer() {
    //    clearInterval(idleInterval);
    //}

    //var msg = document.getElementById("resetTimer");
    ////console.log("value of resetMsg is: ", msg);
    //if (msg == null) {
    //    idleInterval = setInterval(timerIncrement, 60000); // 1 minute
    //  //  console.log("idleInterval is set: ", idleInterval);
    //} else {
    //    stopTimer();
    //    // console.log("idleInterval is stopped: ", idleInterval);
    //}

    //zero the idle timer on mouse movement.
    $(this).mousemove(function(e) {
        idleMinutes = 0;
    });

    $(this).keypress(function(e) {
        idleMinutes = 0;
    });


    checkSize();

    $('.mobile-open-dropdown').click(function(){
        $(this).closest('.dropdown').toggleClass('open');
    });

    $('#check-all-rlconfig').click(function(){
        if ($(this).prop('checked')){
            $('.ranked-list-config-checkbox-wrap input[type="checkbox"]').prop('checked', true);
        }
        else {
            $('.ranked-list-config-checkbox-wrap input[type="checkbox"]').prop('checked', false);
        }
    });

});

// forgot my password
function forgot_password(default_username){
     // set default username for modal
     jQuery('#forgot-password input[name="user_login"]').val(default_username);
     // open modal
     jQuery('#forgot-password').modal('show');
}

// filters current queue by date
function filter_call_queue(){
    // set all rows to null
    $('#current-queue-table').dataTable().fnClearTable();
    $.post(window.site_url+'/current-queue/ajax_filter_queue', {filter_from: $('.filter-call-queue-from').val(), filter_to: $('.filter-call-queue-to').val()}).done(function(data){
        $('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });
}

// filter admin dashboard
function filter_admin_dashboard(){
    // reset charts to nothing
     jQuery('#lineGraph__container').html('<div class="loader vertical-align-middle loader-grill"></div>');
     jQuery('#dashboard_bob_donut').html('').addClass('loader vertical-align-middle loader-grill');
     jQuery('.total-calls-made, .total-calls-reviewed, .call-quality-average').html('').addClass('loader vertical-align-middle loader-circle');
     jQuery('.call-quality-average-progress').css('width', '0%');

    // fetch all chart / call data
     jQuery.post(window.site_url + ':17742/dashboard.aspx/ajax_filter_dashboard', jQuery('#dashboard-filter').serialize()).done(function (data) {
         console.log(data);
         
            // break the results into something we can use
            results = data.split('|');

            // rebuild number of calls
            jQuery('.total-calls-made').html(results[2]).removeClass('loader vertical-align-middle loader-circle');
            jQuery('.total-calls-reviewed').html(results[3]).removeClass('loader vertical-align-middle loader-circle');
            jQuery('.call-quality-average').html(results[8]).removeClass('loader vertical-align-middle loader-circle');
            quality_avg = parseInt(results[8]) * 20;
            jQuery('.call-quality-average-progress').css('width', quality_avg+'%');

            // Rebuild call percent pie progress charts
            jQuery(".bad-calls-pie-progress").asPieProgress("go", results[5]+'%');
            jQuery(".average-calls-pie-progress").asPieProgress("go", results[6]+'%');
            jQuery(".good-calls-pie-progress").asPieProgress("go", results[7]+'%');

            jQuery('#dashboard_call_quality').removeClass('loader vertical-align-middle loader-grill');
            jQuery('#dashboard_bob_donut').removeClass('loader vertical-align-middle loader-grill');

            // rebuild main chart
             Morris.Line({
              element: 'dashboard_call_quality',
              data: JSON.parse(results[0]),
              xkey: 'y',
              ykeys: ['a', 'b'],
              labels: ['Total Calls', 'Total Reviewed'],
              resize: true,
              yLabelFormat: function (y) {
                return parseFloat(y).toFixed(0);
              },
              ymax: results[1],
              pointSize: 3,
              smooth: true,
              gridTextColor: '#474e54',
              gridLineColor: '#eef0f2',
              goalLineColors: '#e3e6ea',
              gridTextFamily: $.configs.get('site', 'fontFamily'),
              gridTextWeight: '300',
              numLines: 7,
              gridtextSize: 14,
              lineWidth: 1,
            });

            // rebuild BOB donut chart
            Morris.Donut({
              element: 'dashboard_bob_donut',
              data: JSON.parse(results[13]),
              // barSizeRatio: 0.35,
              resize: true,
            });


    });
}

// Edit scorecard question popup
function edit_question(question_id, category_id, max_score, active){
    // sets all the form values
    jQuery('#edit_criterion_category').val(category_id);
    jQuery('#edit_criterion_category').selectpicker('refresh');
    jQuery('#edit_criterion_max_score').val(max_score);
    jQuery('#edit_criterion_text').val(jQuery('#question-text-'+question_id).html());
    jQuery('#edit-criterion-form').attr('action', jQuery('#edit_question_action').val()+question_id);
    // check the switchery box
    if (active == '0'){
        jQuery('#edit_criterion_active').prop('checked', false);
    }
    if (active == '1'){
       jQuery('#edit_criterion_active').prop('checked', true);
    }
    // code to fire event to switch the switchery box
    el = document.querySelector('#edit_criterion_active');
    if (typeof Event === 'function' || !document.fireEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        el.dispatchEvent(event);
    } else {
        el.fireEvent('onchange');
    }
    // open modal
    jQuery('#editQuestion').modal('show');
}

// delete a scorecard question modal
function delete_question(question_id){
    jQuery('#delete-question-form').attr('action', jQuery('#delete_question_action').val()+question_id);
    jQuery('#deleteQuestion').modal('show');
}

// Edit scorecard category popup
function edit_category(category_id, active){
    // sets all the form values
    jQuery('#edit_criterion_category_name').val(jQuery('#category-text-'+category_id).html());
    jQuery('#edit-category-form').attr('action', jQuery('#edit_category_action').val()+category_id);
    // check the switchery box
    if (active == '0'){
        jQuery('#edit_criterion_category_active').prop('checked', false);
    }
    if (active == '1'){
       jQuery('#edit_criterion_category_active').prop('checked', true);
    }
    // code to fire event to switch the switchery box
    el = document.querySelector('#edit_criterion_category_active');
    if (typeof Event === 'function' || !document.fireEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        el.dispatchEvent(event);
    } else {
        el.fireEvent('onchange');
    }
    // open modal
    jQuery('#editCategory').modal('show');
}

// delete a scorecard category modal
function delete_category(category_id){
    jQuery('#delete-category-form').attr('action', jQuery('#delete_category_action').val()+category_id);
    jQuery('#deleteCategory').modal('show');
}

// delete a scorecard template
function delete_template(template_id){
    //jQuery('#delete-template-form').attr('action', jQuery('#delete_template_action').val()+template_id);
    jQuery('#delete_template_action').val(template_id);
    jQuery('#deleteTemplate').modal('show');
}

function filter_current_queue_table(){

    jQuery('#total-calls, #average-rating').html('').addClass('loader vertical-align-middle loader-circle');

    jQuery('#current-queue-table').dataTable().fnClearTable();

    jQuery.post(window.site_url+'/current-queue/ajax_filter_current_queue', jQuery('#current-queue-filter').serialize()).done(function(data){
        var results = data.split('|');
        jQuery('#current-queue-table').dataTable().fnAddData(JSON.parse(results[0]), false);
        jQuery('#current-queue-table').dataTable().fnDraw();
        jQuery('#total-calls').html(results[1]).removeClass('loader vertical-align-middle loader-circle');
        jQuery('#average-rating').html(results[2]).removeClass('loader vertical-align-middle loader-circle');
        jQuery('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });

}

function filter_completed_scorecards_table(){

    jQuery('#total-calls').html('').addClass('loader vertical-align-middle loader-circle');

    jQuery('#completed-scorecards-table').dataTable().fnClearTable();

    jQuery.post(window.site_url+'/scorecard/ajax_filter_completed', jQuery('#completed-scorecards-filter').serialize()).done(function(data){
        console.log(data);
        var results = data.split('|');
        jQuery('#completed-scorecards-table').dataTable().fnAddData(JSON.parse(results[0]), false);
        jQuery('#completed-scorecards-table').dataTable().fnDraw();
        jQuery('#total-calls').html(results[1]).removeClass('loader vertical-align-middle loader-circle');
        $('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });
}

function filter_flagged_calls_table(){

    jQuery('#total-calls, #average-rating').html('').addClass('loader vertical-align-middle loader-circle');

    jQuery('#flagged-calls-table').dataTable().fnClearTable();

    jQuery.post(window.site_url+'/flagged-calls/ajax-filter-flagged-calls', jQuery('#flagged-calls-filter').serialize()).done(function(data){
        console.log(data);
        var results = data.split('|');
        jQuery('#flagged-calls-table').dataTable().fnAddData(JSON.parse(results[0]), false);
        jQuery('#flagged-calls-table').dataTable().fnDraw();
        jQuery('#total-calls').html(results[1]).removeClass('loader vertical-align-middle loader-circle');
        $('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });

}

function filter_log_table(){

    jQuery('#diagnostic-logs-table').dataTable().fnClearTable();

    jQuery.post(window.site_url+'/logs/ajax-filter-logs-table', jQuery('#diagnostic-logs-filter').serialize()).done(function(data){
        console.log(data);
        var results = data.split('|');
        jQuery('#diagnostic-logs-table').dataTable().fnAddData(JSON.parse(results[0]), false);
        jQuery('#diagnostic-logs-table').dataTable().fnDraw();
        $('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });

}

function filter_ranked_list_calls(){

    jQuery('#ranked-list-calls-table').dataTable().fnClearTable();

    jQuery.post(window.site_url+'/ranked-list/ajax_filter_ranked_list_calls', jQuery('#ranked-list-calls-filter').serialize()).done(function(data){
        var results = data.split('|');
        jQuery('#ranked-list-calls-table').dataTable().fnAddData(JSON.parse(results[0]), false);
        jQuery('#ranked-list-calls-table').dataTable().fnDraw();
        jQuery('.headSelect .btn.btn-primary').html('Filter').css('opacity', '1');
    });

}

function toggleHeader(table_id){
		$('#'+table_id+' thead').fadeToggle();
}

function checkSize() {
    if ($(window).width() <= 768) {
        $('.dataTable').each(function() {
            var the_count = 1;
            var table_id = $(this).attr('id');
            $('#' + table_id + ' thead').hide();
            $('<a class="showHeader btn btn-primary" onClick=\'toggleHeader("' + table_id + '");\'>Sort Table</a>').insertBefore('#' + table_id);

            $(this).find("th").each(function() {
                $('#' + table_id + ' tbody tr td:nth-child(' + the_count + ')').prepend('<span><strong>' + $(this).html() + '</strong></span><br/>');
                the_count++;
            });
        });
    } else {
        $('.responsive-table').width('100%');
    }
}

// Colors
var colors__fill = 'rgba(220,220,220,0.2)';
var colors__good = '#46BFBD';
var colors__bad = '#F7464A';
var colors__neutral = '#FFC870';
var colors__total = '#5b90bf';
var obj = '';

var totalData = [];
var goodsData = [];
var badsData = [];
var neutsData = [];
var labels = [];
var totals = [];
var goods = [];
var bads = [];
var neuts = [];
var pieChart = null;
var barGraph = null;
var dataSet = null;
var callqualityoverview;
var byAgentData;
function lineGraphr(dataSet){

	var labels = [];
	var bads   = [];
	var goods  = [];
	var neuts  = [];
	callqualityoverview = dataSet;
	$.each(JSON.parse(dataSet), function(){
		labels.push(this.date);
		bads.push(this.bad);
		goods.push(this.good);
		neuts.push(this.neutral);
	});

	var data = {
		labels: labels,
		datasets: [
			{
				label: 'Good Calls',
				fillColor: colors__fill,
				strokeColor: colors__good,
				pointColor: colors__good,
				pointStrokeColor: '#fff',
				pointHighlightFill: '#fff',
				pointHighlightStroke: colors__good,
				data: goods

			},
			{
				label: 'Bad Calls',
				fillColor: colors__fill,
				strokeColor: colors__bad,
				pointColor: colors__bad,
				pointStrokeColor: '#fff',
				pointHighlightFill: '#fff',
				pointHighlightStroke: colors__bad,
				data: bads
			}
		]
	}

	var ctx = document.getElementById("lineGraph").getContext("2d");
	window.lineGraph = new Chart(ctx).Line(data, {
        responsive: true,
        maintainAspectRatio: true,
        multiTooltipTemplate: "<%= value.toLocaleString() %>"

    });

    jQuery('#lineGraph__container').removeClass('loader vertical-align-middle loader-circle');
}





var callQuaityData;
function lineGraphz(dataSet){

    if (dataSet == null) {
        $('#qualityavg').hide();
    }
    else {
        $('#qualityavg').show();
    }

    callQuaityData = dataSet;
    var labels = [];
    var average = [];

    $.each(dataSet, function () {
        labels.push(this.date);
        average.push(this.average);
    });

	callQuaityData = dataSet;
	var data = {
		labels: labels,
		datasets: [
			{
				label: 'Average Score',
				fillColor: colors__fill,
				strokeColor: colors__good,
				pointColor: colors__good,
				pointStrokeColor: '#fff',
				pointHighlightFill: '#fff',
				pointHighlightStroke: colors__good,
				data: average
			}
		]
	}

	var ctx = document.getElementById("lineGraphAverage").getContext("2d");
	window.lineGraphAverage = new Chart(ctx).Line(data, {
        responsive: true,
        maintainAspectRatio: true,
        scaleSteps: 1,
        scaleStepWidth: 1,
        scaleStartValue: 0,
        scaleOverride: true
    });

    jQuery('#lineGraphAverage__container .loader.vertical-align-middle.loader-circle').remove();

    if ($('.call-quality-average-equal').height() > $('.call-quality-agent-equal').height()){
        $('.call-quality-agent-equal').css('height', $('.call-quality-average-equal').height());
    }
    else {
       $('.call-quality-average-equal').css('height', $('.call-quality-agent-equal').height());
    }
}

function rankedListLineGraphz(dataSet){

	var labels = [];
	var total_calls  = [];

	$.each(dataSet, function(){
		labels.push(this.date);
		total_calls.push(this.total_calls);
	});

	var data = {
		labels: labels,
		datasets: [
			{
				label: 'Ranked List Size',
				fillColor: colors__fill,
				strokeColor: colors__good,
				pointColor: colors__good,
				pointStrokeColor: '#fff',
				pointHighlightFill: '#fff',
				pointHighlightStroke: colors__good,
				data: total_calls
			}
		]
	}

	var ctx = document.getElementById("rankedListLineGraph").getContext("2d");
	window.rankedListLineGraph = new Chart(ctx).Line(data, {
        responsive: true,
        maintainAspectRatio: true,
        multiTooltipTemplate: "<%= value.toLocaleString() %>"
    });

    jQuery('#rankedListLineGraph').removeClass('loader vertical-align-middle loader-circle');
}

function pieChartr( goodsData, badsData, neutsData ){

	// Add all the datas
	var totalGoods = 0;
	var totalBads = 0;
	var totalNeuts = 0;


	if ( typeof goodsData === 'object' ) {
		$.each(goodsData, function(){
			totalGoods += this;
		});
	} else {
		totalGoods = goodsData;
	}

	if ( typeof badsData === 'object' ) {
		$.each(badsData, function(){
			totalBads += this;
		});
	} else {
		totalBads = badsData;
	}

	if ( typeof neutsData === 'object' ) {
		$.each(neutsData, function(){
			totalNeuts += this;
		});
	} else {
		totalNeuts = neutsData;
	}

	var data = [
	    {
	        value: totalGoods,
	        color:"#65cca9",
	        label: "Good"
	    },
	    {
	        value: totalBads,
	        color: "#F7464A",
	        label: "Bad"
	    },
	    {
	        value: totalNeuts,
	        color: "#ffbb33",
	        label: "Neutral"
	    }
	]


	var ctx = document.getElementById("pieChart").getContext("2d");
	window.pieChart = new Chart(ctx).Pie(data, {
        responsive: true,
        maintainAspectRatio: true,
        animateRotate : false
    });

    $('#pie-selected-bob').html('All Clients');
}


function barGraphr(dataSet, pTrigger) {

    totalData = [];
    goodsData = [];
    badsData = [];
    neutsData = [];
    labels = [];
    totals = [];
    goods = [];
    bads = [];
    neuts = [];
    $('#piechart').show();
    console.log(dataSet);

    // get the key for the first date in dataSet object
    for (var firstData in dataSet) break;

    // Create labels from the first date in dataSet object's bobs
    $.each(dataSet[firstData].bobs, function () {
        labels.push(this.name);
        // Create integer total value for each bob
        totals[this.name] = 0;
        goods[this.name] = 0;
        bads[this.name] = 0;
        neuts[this.name] = 0;
    });

    // For each date
    $.each(dataSet, function () {
        // For each bob
        $.each(this.bobs, function () {
            // Add all totals for this bob
            totals[this.name] += +this.total_calls;
            goods[this.name] += +this.good;
            bads[this.name] += +this.bad;
            neuts[this.name] += +this.neutral;

        });
    });

    // for each total, push to array
    Object.keys(totals).forEach(function (key) {
        totalData.push(totals[key]);
    });

    Object.keys(goods).forEach(function (key) {
        goodsData.push(goods[key]);
    });

    Object.keys(bads).forEach(function (key) {
        badsData.push(bads[key]);
    });

    Object.keys(neuts).forEach(function (key) {
        neutsData.push(neuts[key]);
    });

    var fData = totalData;

    switch (pTrigger) {
        case 'Good':
            fData = goodsData;
            break;
        case 'Bad':
            fData = badsData;
            break;
        case 'Neutral':
            fData = neutsData;
            break;
        default:
            break;
    }

    var data = {
        labels: labels,
        datasets: [
			{
			    label: 'Total Calls',
			    fillColor: colors__total,
			    strokeColor: colors__total,
			    pointColor: colors__total,
			    pointStrokeColor: '#fff',
			    pointHighlightFill: '#fff',
			    pointHighlightStroke: colors__total,
			    data: fData
			}]
    }
    $('.check_demo').attr("label", labels);
    var ctx = document.getElementById("barGraph").getContext("2d");
    window.barGraph = new Chart(ctx).Bar(data, {
        responsive: true,
        maintainAspectRatio: true
    });

    good_total = goodsData.reduce(function (a, b) { return a + b; });
    average_total = neutsData.reduce(function (a, b) { return a + b; });
    bad_total = badsData.reduce(function (a, b) { return a + b; });

    $('#pie_good_total').html(number_format(good_total));
    $('#pie_average_total').html(number_format(average_total));
    $('#pie_bad_total').html(number_format(bad_total));

    var master_total = +good_total + +average_total + +bad_total;
    pie_good_avg = Math.round((good_total / master_total) * 100);
    pie_bad_avg = Math.round((bad_total / master_total) * 100);
    pie_average_avg = Math.round((average_total / master_total) * 100);

    $('#pie_good_avg').html(pie_good_avg + '%');
    $('#pie_average_avg').html(pie_average_avg + '%');
    $('#pie_bad_avg').html(pie_bad_avg + '%');

    //	pieChart( goodsData, badsData, neutsData );

    if (!pTrigger) {
        pieChartr(goodsData, badsData, neutsData);
        $('.check_demo').attr("goodsData", goodsData);
        $('.check_demo').attr("badsData", badsData);
        $('.check_demo').attr("neutsData", neutsData);
    }

    if ($('.call-quality-overview-equal').height() > $('.call-quality-bob-equal').height()) {
        $('.call-quality-bob-equal').css('height', $('.call-quality-overview-equal').height() - 40);
    }
    else {
        $('.call-quality-overview-equal').css('height', $('.call-quality-bob-equal').height());
    }

};

function getDataSetLevelThree(){
     $.post(window.site_url+'/dashboard/ajax_filter_dashboard_level_3', $('#dashboard-filter').serialize()).done(function(data){
        var results = data.split('|');
        $('#mtd-agent .loader.vertical-align-middle.loader-circle').remove();
        console.log(data);
        if (JSON.parse(results[4]) == '0'){
            $('#mtd-agent').html('No data found for your filter.');
            $('#single-day-agent').html('No data found for your filter.');
        }
        else {
            Morris.Area({
              element: 'mtd-agent',
              parseTime: false,
              pointSize: 0,
              ymax: 1,
              ymin: 0,
              numLines: 11,
            //  xLabelFormat: function (x) { return 'test 1'; },
              yLabelFormat: function (y) { return Math.round(y * 100); },
              data: JSON.parse(results[4]),
              xkey: 'y',
              ykeys: ['good', 'average', 'bad'],
              labels: ['Good', 'Average', 'Bad'],
              lineColors: ['#65cca9', '#ffbb33', '#F7464A'],
              hideHover: 'auto',
              fillOpacity: '1.0'
            });
        }

        lineGraphz(JSON.parse(results[14]));

            $('.headSelect .btn-sm-wide.pull-right.fltrMobile').html('Filter').css('opacity', '1');

     });
}

var griddata = "";

function getDataSetLevelTwo(){
    $.post(window.site_url+'/dashboard/ajax_filter_dashboard_level_2', $('#dashboard-filter').serialize()).done(function(data){
        var results = data.split('|');
        $('.call-quality-qa-bad-total strong, .call-quality-qa-good-total strong, .call-quality-queue-bad-total strong, .call-quality-queue-good-total strong').html('');

        $('.call-quality-qa-bad').asPieProgress('go', results[5]+'%');
        $('.call-quality-qa-good').asPieProgress('go', results[6]+'%');
        $('.call-quality-qa-bad-total strong').html(results[7]+' Calls');
        $('.call-quality-qa-good-total strong').html(results[8]+' Calls');

        console.log(data);

        $('.call-quality-queue-bad').asPieProgress('go', results[9]+'%');
        $('.call-quality-queue-good').asPieProgress('go', results[10]+'%');
        $('.call-quality-queue-bad-total strong').html(results[11]+' Calls');
        $('.call-quality-queue-good-total strong').html(results[12]+' Calls');

        getDataSetLevelThree();
    });
}

//function getDataSet(){
//     $('.call-quality-overview-equal, .call-quality-bob-equal').css('height', '');
//     $('#lineGraph').remove();
//     $('#lineGraph__container').html('<div class="loader vertical-align-middle loader-circle"></div><canvas id="lineGraph"></canvas>');
//     $('#barGraph').remove();
//     $('#barGraph__container').html('<div class="loader vertical-align-middle loader-circle"></div><canvas id="barGraph"></canvas>');
//     $('#mtd-agent').html('<div class="loader vertical-align-middle loader-circle"></div>');
//     $('#lineGraphAverage').remove();
//     $('#lineGraphAverage__container').html('<div class="loader vertical-align-middle loader-circle"></div><canvas id="lineGraphAverage"></canvas>');
//     $('#start_bob').val('');
//     $('.single-date-holder').html('');
//     $('.call-quality-qa-bad').asPieProgress('go', '0%');
//     $('.call-quality-qa-good').asPieProgress('go', '0%');
//     $('.call-quality-queue-bad').asPieProgress('go', '0%');
//     $('.call-quality-queue-good').asPieProgress('go', '0%');
//     $('.call-quality-qa-bad-total strong, .call-quality-qa-good-total strong, .call-quality-queue-bad-total strong, .call-quality-queue-good-total strong').html('<div class="loader vertical-align-middle loader-circle"></div>');
//     $('#pieChart').remove();
//     $('#pieChart__container').html('<div class="loader vertical-align-middle loader-circle"></div><div id="pie-selected-bob"></div><canvas id="pieChart"></canvas>');

//     $('#overall_total_good').html('0');
//     $('#overall_total_bad').html('0');
//     $('#pie-selected-bob').html('');

//     //$.post('dashboard.aspx/ajax_filter_dashboard', $('#dashboard-filter').serialize()).done(function (data) {
//     //    alert(data);
//     //    var results = data.split('|');
         
//     //    obj = JSON.parse(results[0]);
        
//     //   $('#overall_total_good').html(results[1]);
//     //   $('#overall_total_bad').html(results[2]);
//     //   lineGraphr(obj);
//     //   totalData = [];
//     //   goodsData = [];
//     //   badsData = [];
//     //   neutsData = [];
//     //   labels = [];
//     //   totals = [];
//     //   goods = [];
//     //   bads = [];
//     //   neuts = [];
//     //   alert(data);
//     //   if (JSON.parse(results[3]) == '0') {
    	  
//     //       $('#lineGraph__container').html('No data found for your filter.');
//     //       $('#barGraph__container').html('No data found for your filter.');
//     //       if ($('.call-quality-overview-equal').height() > $('.call-quality-bob-equal').height()){
//     //           $('.call-quality-bob-equal').css('height', $('.call-quality-overview-equal').height() - 40);
//     //       }
//     //       else {
//     //          $('.call-quality-overview-equal').css('height', $('.call-quality-bob-equal').height() - 40);
//     //       }
//     //   }
//     //   else {
//     //       barGraphr(JSON.parse(results[3]));
//     //   }

//     //   $('#lineGraph__container .loader.vertical-align-middle.loader-circle, #barGraph__container .loader.vertical-align-middle.loader-circle, #pieChart__container .loader.vertical-align-middle.loader-circle').remove();

//     //   window.dataSet = JSON.parse(results[3]);

//     //   getDataSetLevelTwo();

//     //});

//}

function getbardata(data)
{
    var results = data.d.split('|');

    $('#overall_total_good').html(results[1]);
    $('#overall_total_bad').html(results[2]);
    obj = JSON.parse(results[0]);

    totalData = [];
    goodsData = [];
    badsData = [];
    neutsData = [];
    labels = [];
    totals = [];
    goods = [];
    bads = [];
    neuts = [];
    obj = JSON.parse(obj);
    barGraphr(obj);
}

function getBarDataSet(start, end){
      // Reset
     $('#barGraph').remove();
     $('#barGraph__container').append('<canvas id="barGraph"></canvas>');
     var qualities = localStorage.getItem("qualities");
     var strbob = localStorage.getItem("strbob");
    
     $('#start_bob').val(start);
     $.ajax({
         type: "POST",
         url: "dashboard.aspx/calldashboard",
         data: '{sdate: "' + start + '" , edate: "' + start + '" , qualities: "' + qualities + '" , strbob: "' + strbob + '" , from: "' + "1" + '"}',
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: getbardata,
         failure: function (response) {
             alert(response.d);
         }
     });
    

}

function getDataSetRankedList(){

     $('#rankedListLineGraph').remove();
     $('#rankedListLineGraph__container').html('<div class="loader vertical-align-middle loader-circle"></div><canvas id="rankedListLineGraph"></canvas>');

     $.post(window.site_url+'/ranked-list/ajax_filter_ranked_list', $('#dashboard-filter').serialize()).done(function(data){

        var results = data.split('|');
        obj = JSON.parse(results[0]);
        rankedListLineGraphz(obj);
        totalData = [];
    	goodsData = [];
    	badsData = [];
    	neutsData = [];
    	labels = [];
    	totals = [];
    	goods = [];
    	bads = [];
    	neuts = [];

        if (JSON.parse(results[3]) == '0'){
            $('#rankedListLineGraph__container').html('No data found for your filter.');
        }

        $('#rankedListLineGraph__container .loader.vertical-align-middle.loader-circle, #barGraph__container .loader.vertical-align-middle.loader-circle, #pieChart__container .loader.vertical-align-middle.loader-circle').remove();
        $('.headSelect .btn-primary').css('opacity', '1').html('Filter');

        window.dataSet = JSON.parse(results[3]);

     });

}

$(document).on('click', '#barGraph', function (e) {
    // Get the point that is clicked
    var activePoint = barGraph.activeElements;
    var chartbob = "'" + activePoint[0].label + "'";
    console.log(chartbob);
    localStorage.setItem("chartdate", $('.single-date-holder').html());
    localStorage.setItem("chartFrom", "2");
    localStorage.setItem("chartbob", chartbob);
    window.open("viewdetails.aspx");
});


// On click of lineGraph, get the selected day
$(document).on('click', '#lineGraph', function(e) {
    // Get the point that is clicked
    var activePoint = lineGraph.getPointsAtEvent(e);

    // get the label for that point
   	var date = activePoint[0].label;
    var dataSet = getBarDataSet(date, date);
    $('.single-date-holder').html(date);
    localStorage.setItem("chartdate", date);
    localStorage.setItem("chartFrom", "1");
    window.open("viewdetails.aspx");
});
// On click of lineGraph, get the selected day
$(document).on('click', '#mtd-agent', function (e) {
    
    var clicktext="";
    $.each($("#mtd-agent")[0].children[1].children, function () {
        clicktext+=this.outerText;
    });
    var flooragentmid = $("#mtd-agent")[0].children[1].children[0].outerText;
    
  
    localStorage.setItem("chartFrom", "3");
    localStorage.setItem("flooragentmid", flooragentmid);
    window.open("viewdetails.aspx");
});

// On click of lineGraph, get the selected day
$(document).on('click', '#lineGraphAverage', function (e) {
    // Get the point that is clicked
    var activePoint = lineGraphAverage.activeElements;
    var date = activePoint[0].label;
    localStorage.setItem("chartdate", date);
    localStorage.setItem("chartFrom", "4");
    window.open("viewdetails.aspx");
});

$(document).on('click', '#rankedListLineGraph', function(e) {
    // Get the point that is clicked
    var activePoint = rankedListLineGraph.getPointsAtEvent(e);

    // get the label for that point
   	var date = activePoint[0].label;
    window.location.href= window.site_url+'/ranked-list/ranked-list/'+date;
});

var bob = '';
var last_bob = '';
var pT = '';


$(document).on('mousemove', '#barGraph', function(e){

	// Get the point that is clicked
	var activeBars = barGraph.getBarsAtEvent(e);
	if ( typeof activeBars[0] !== "undefined" ) {
		if ( activeBars[0].label != 'bob' ) {
			bob = activeBars[0].label;
			console.log( goods[bob], bads[bob], neuts[bob] );
            $('#pie_good_total').html(number_format(goods[bob]));
            $('#pie_average_total').html(number_format(neuts[bob]));
            $('#pie_bad_total').html(number_format(bads[bob]));

            var master_total = +goods[bob] + +neuts[bob] + +bads[bob];
            pie_good_avg = Math.round((goods[bob] / master_total) * 100);
            pie_bad_avg = Math.round((bads[bob] / master_total) * 100);
            pie_average_avg = Math.round((neuts[bob] / master_total) * 100);

            $('#pie_good_avg').html(pie_good_avg+'%');
            $('#pie_average_avg').html(pie_average_avg+'%');
            $('#pie_bad_avg').html(pie_bad_avg+'%');
            if (activeBars[0].label != last_bob){
			    pieChartr( goods[bob], bads[bob], neuts[bob] );
                last_bob = activeBars[0].label;

            }
            $('#pie-selected-bob').html(activeBars[0].label);
		}
	}
})

$(document).on('mouseout', '#barGraph', function(e){
	console.log(goodsData, badsData, neutsData);

    good_total = goodsData.reduce(function(a, b){return a+b;});
    average_total = neutsData.reduce(function(a, b){return a+b;});
    bad_total = badsData.reduce(function(a, b){return a+b;});

    $('#pie_good_total').html(number_format(good_total));
    $('#pie_average_total').html(number_format(average_total));
    $('#pie_bad_total').html(number_format(bad_total));

    var master_total = +good_total + +average_total + +bad_total;
    pie_good_avg = Math.round((good_total / master_total) * 100);
    pie_bad_avg = Math.round((bad_total / master_total) * 100);
    pie_average_avg = Math.round((average_total / master_total) * 100);

    $('#pie_good_avg').html(pie_good_avg+'%');
    $('#pie_average_avg').html(pie_average_avg+'%');
    $('#pie_bad_avg').html(pie_bad_avg+'%');

    $('#pie-selected-bob').html('All Clients');
    pT = null;
	pieChartr( goodsData, badsData, neutsData );
});

$(document).on('mousemove', '#pieChart', function(e){

	var activeSegment = pieChart.getSegmentsAtEvent(e);
	if ( typeof activeSegment[0] !== "undefined" ) {
		if ( activeSegment[0].label != pT ) {
			// Reset
		    $('#barGraph').remove();
		    $('#barGraph__container').append('<canvas id="barGraph"></canvas>');
		    pT = activeSegment[0].label;
		    console.log(pT);
			barGraphr(dataSet, pT);
		}
	}

});

$(document).on('mouseout', '#pieChart', function(e){
    pT = null;
	barGraphr(dataSet);
});
function flashMessages(type, msg, severity, advanced_data) {
    severity = '99';
    advanced_data = '';
    // make sure the message is sending something to the user
    if (msg == '') {
        msg = 'There was an error processing your request. Please try again.';
    }

    // determine which type of message this is and respond accordingly.
    if (type == "0") {
        msg = '<div class="alert alert-alt alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>'
         + msg +
     '   </div>';
    }
    else if (type == "1") {
        msg = '<div class="alert alert-alt alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>'
         + msg +
     '   </div>';
    }
    else {
    }
    $(".page-content").append(msg);
     
}
function funrankedQuality(bounds, score) {

    var b = bounds;//JSON.parse(bounds);//[0].prediction_mapping_function);

    if (score >= b[0].lower_bound && score <= b[0].upper_bound)
    {

        $("#lblrankedquality").html("Bad");
        $("#rankedquality").addClass("bg-red-600");
    }
    else if (score >= b[1].lower_bound && score <= b[1].upper_bound)
    {

        $("#lblrankedquality").html("Average");
        $("#rankedquality").addClass("bg-orange-600");
    }
    else if (score >= b[2].lower_bound && score <= b[2].upper_bound)
    {

        $("#lblrankedquality").html("Good");
        $("#rankedquality").addClass("bg-green-600");
    }
    else
    {
        $("#lblrankedquality").html("N/A");
        $("#rankedquality").addClass("bg-primary-600");
    }

}
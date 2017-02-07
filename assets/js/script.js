(function($) {
    $(document).ready(function(){
        
        // sample data
        var performanceData = {
            historical: {
                healthy: 0.36,
                struggling: 0.34,
                unhealthy: 0.30
            },
            current: {
                today: {
                    healthy: 0.43,
                    struggling: 0.38,
                    unhealthy: 0.19
                },
                month: {
                    healthy: 0.49,
                    struggling: 0.32,
                    unhealthy: 0.19
                },
                quarter: {
                    healthy: 0.45,
                    struggling: 0.36,
                    unhealthy: 0.19
                },
                year: {
                    healthy: 0.36,
                    struggling: 0.39,
                    unhealthy: 0.25
                }
            }
        };
        
        var statsData = {
            total_account: 0,
            total_calls: 0,
            total_agents: 506,
            resource_efficiency: 0.84
        };
        // options 
        var opts = {
            // limit
            limit: {
                health: 0.6667,
                struggling: 0.3333,
                unhealthy: 0.0
            },
            
            // chart option
            chartOptions: {
                credits: {
                    enabled: false
                },
                chart: {
                    type: "column"
                },
                title: {
                    text: ""
                },
                xAxis: {
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: "transparent",
                    labels: {
                       enabled: false
                    },
                    minorTickLength: 0,
                    tickLength: 0
                },
                yAxis: {
                    min: 0,
                    visible: false
                },
                tooltip: {
                    pointFormat: "<span>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
                    shared: false,
                    headerFormat: ""
                },
                plotOptions: {
                    column: {
                        stacking: "percent"
                    }
                },
                series: [{
                    name: "Health",
                    data: []
                }, {
                    name: "Struggling",
                    data: []
                }, {
                    name: "Unhealthy",
                    data: []
                }],
                colors: ["#006600", "#ffcc00", "#990000"],
                exporting: {
                    enabled:false
                }
            },
            
            //predescription
            predescription: {
                healthy: "<li>{{crease}} resources on <span class=\"color-green\">those most likely to buy</span> by {{percentage}}%.</li>",
                struggling: "<li>{{crease}} resources for <span class=\"color-yellow\">the greatest opportunities</span> by {{percentage}}%.</li>",
                unhealthy: "<li>{{crease}} resources on <span class=\"color-red\">unlikely buyers</span> by {{percentage}}%.</li>"
            }
        };
        
        // get data
        $.get("account-visual-2.db", function(r){
            var chartData = new Array;
            
            var t = r.split("\n");
            for(var i in t){
                chartData.push(t[i].split("\t"));
            }
            console.log(chartData);
            
            initFrom(calculation(chartData));
        });
        
        // calculation data
        var calculation = function(d){
            var calData = {
                current: {
                     healthy: 0,
                     struggling: 0,
                     unhealthy: 0
                },
                predicted: {
                     healthy: 0,
                     struggling: 0,
                     unhealthy: 0
                },
                total: {
                    current: 0,
                    predicted: 0
                }
            };
            
            // calculation
            for(var i in d){
                if(d[i][1] > opts.limit.health){
                    calData.current.healthy += parseFloat(d[i][2]);
                    calData.predicted.healthy += parseFloat(d[i][3]);
                } else if(d[i][1] > opts.limit.struggling) {
                    calData.current.struggling += parseFloat(d[i][2]);
                    calData.predicted.struggling += parseFloat(d[i][3]);
                    
                } else if(d[i][1] > opts.limit.unhealthy) {
                    calData.current.unhealthy += parseFloat(d[i][2]);
                    calData.predicted.unhealthy += parseFloat(d[i][3]);                    
                }
                
                calData.total.current += parseFloat(d[i][2]);
                calData.total.predicted += parseFloat(d[i][3]);
                
                statsData.total_account++;
                statsData.total_calls++;
            }
            
            //
            for(var i in performanceData.current.today){
                performanceData.current.today[i] = calData.current[i];
            }
            
            return calData;
        };
        
        // print form
        var initFrom = function(d){
            console.log(d);
            
            // init chart for historical/current(left) section
            performance_compare();            
            $("#performance-compare").change(function(){
                performance_compare($(this).val());
            });
                        
            // init chart for current section
            var currentChartOpt = $.extend(true, {}, opts.chartOptions);
            currentChartOpt.series[0].data[0] = parseFloat(d.current.healthy.toFixed(2));
            currentChartOpt.series[1].data[0] = parseFloat(d.current.struggling.toFixed(2));
            currentChartOpt.series[2].data[0] = parseFloat(d.current.unhealthy.toFixed(2));
            Highcharts.chart("chart-current", currentChartOpt);
            
            // init chart for predicted section
            var predictedChartOpt = $.extend(true, {}, opts.chartOptions);
            predictedChartOpt.series[0].data[0] = parseFloat(d.predicted.healthy.toFixed(2));
            predictedChartOpt.series[1].data[0] = parseFloat(d.predicted.struggling.toFixed(2));
            predictedChartOpt.series[2].data[0] = parseFloat(d.predicted.unhealthy.toFixed(2));
            
            Highcharts.chart("chart-predicted", predictedChartOpt);
                
            //
            /*Highcharts.chart("chart-prescription", {
                title: {
                    text: ""
                },                
                xAxis: {
                    lineWidth: 1,
                    tickInterval: 1,
                },
                yAxis: {
                    title: {
                        text: ""
                    },
                    type: "logarithmic"
                },
                tooltip: {
                    headerFormat: "<b>Value</b><br />",
                    pointFormat: "x = {point.x}, y = {point.y}"
                },
                series: [{
                    name: "Prescription",
                    data: [1, 2, 4, 8, 16, 32, 64, 128, 156, 1512]
                }],
                exporting: {
                    enabled:false
                }
            });*/

            
            // calculation percentage
            var percentage = {
                current: {
                    healthy: parseFloat((d.current.healthy / d.total.current * 100).toFixed(2)),
                    struggling: parseFloat((d.current.struggling / d.total.current * 100).toFixed(2)),
                    unhealthy: parseFloat((d.current.unhealthy / d.total.current * 100).toFixed(2)),
                },
                predicted: {
                    healthy: parseFloat((d.predicted.healthy / d.total.predicted * 100).toFixed(2)),
                    struggling: parseFloat((d.predicted.struggling / d.total.predicted * 100).toFixed(2)),
                    unhealthy: parseFloat((d.predicted.unhealthy / d.total.predicted * 100).toFixed(2)),
                }
            };
            
            // prescription
            $("#prescription-list").html("");
            
            for(var i in opts.predescription){
                // prescription
                var gap = Math.round(percentage.current[i] - percentage.predicted[i]);
                if(gap < 0){
                    opts.predescription[i] = opts.predescription[i].replace(/{{crease}}/g, "Increase").replace(/{{percentage}}/g, Math.abs(parseInt(gap)));
                } else {
                    opts.predescription[i] = opts.predescription[i].replace(/{{crease}}/g, "Decrease").replace(/{{percentage}}/g, parseInt(gap));
                }
                
                $("#prescription-list").append(opts.predescription[i]);
            }
            
            // print stats boxes
            $("#total-account").text(statsData.total_account);
            $("#total-calls").text(statsData.total_calls);
            $("#total-agents").text(statsData.total_agents);
            $("#resource-efficiency").text(parseFloat(statsData.resource_efficiency * 100).toFixed(2) + "%");
            
            /////
            
            $("#merge").click(function(){
                var buttonText = ["Calculate Resource Adjustments", "Restore"];
                if($(this).val() == buttonText[0]){
                    $(this).val(buttonText[1]);
                } else {
                    $(this).val(buttonText[0]);
                }
                
                $(".compare-wrap").fadeToggle(200);
                $("#compare-current-predicted").html("").fadeToggle(200, function(){
                    
                    // init compare chart for predicted section
                    var compareChartOpt = $.extend(true, {}, opts.chartOptions);
                    compareChartOpt.plotOptions.series = {showInLegend: false};
                    compareChartOpt.colors = ["#c3c3c3", "#cef200", "#c3c3c3", "#fb9700", "#c3c3c3"];
                    compareChartOpt.series = [];
                    
                    var gapHelthy = percentage.current.healthy - percentage.predicted.healthy;
                    var remainByHealthy = 0;
                    
                    if(gapHelthy < 0){
                        compareChartOpt.series.push({
                            data: [percentage.current.healthy],
                            enableMouseTracking: false
                        });
                        
                        compareChartOpt.series.push({
                            data: [Math.abs(gapHelthy)],
                            tooltip: { pointFormat: "<span>Increase</span>: <b>{point.percentage:.0f}%</b><br/>"}
                        });
                        
                        remainByHealthy = percentage.predicted.healthy;
                    } else {
                        compareChartOpt.series.push({
                            data: [percentage.predicted.healthy],
                            enableMouseTracking: false
                        });
                        
                        compareChartOpt.series.push({
                            data: [gapHelthy],
                            tooltip: { pointFormat: "<span>Decrease</span>: <b>{point.percentage:.0f}%</b><br/>"}
                        });
                        
                        remainByHealthy = percentage.current.healthy;
                    }
                    
                    //
                    compareChartOpt.series.push({data: [0]});
                    
                    //
                    var gapUnhealthy = percentage.current.unhealthy - percentage.predicted.unhealthy;
                    var remainByUnhealthy = 0;
                    
                    if(gapUnhealthy < 0){   
                        
                        compareChartOpt.series.push({
                            data: [Math.abs(gapUnhealthy)],
                            tooltip: { pointFormat: "<span>Increase</span>: <b>{point.percentage:.0f}%</b><br/>"}
                        });
                        
                        compareChartOpt.series.push({
                            data: [percentage.predicted.unhealthy],
                            enableMouseTracking: false
                        });
                        
                        remainByUnhealthy = percentage.predicted.healthy;
                        
                    } else {
                                                
                        compareChartOpt.series.push({
                            data: [gapUnhealthy],
                            tooltip: { pointFormat: "<span>Decrease</span>: <b>{point.percentage:.0f}%</b><br/>"}
                        });
                        
                        compareChartOpt.series.push({
                            data: [percentage.current.unhealthy],
                            enableMouseTracking: false
                        });
                        
                        remainByUnhealthy = percentage.current.unhealthy;
                    }
                    
                    //
                    compareChartOpt.series[2] = {
                        data: [100 - remainByHealthy - remainByUnhealthy],
                        enableMouseTracking: false
                    }
                    
                    

                    Highcharts.chart("compare-current-predicted", compareChartOpt);
                });                    
            });
            
            return;
        };
        
        
        // change chart of performance section when change date
        var performance_compare = function(term){
            term = term? term: "today";
            
            // historical
            $("#chart-historical").html("");
            var historicalChartOpt = $.extend(true, {}, opts.chartOptions);                 
            historicalChartOpt.series[0].data[0] = Math.round(performanceData.historical.healthy * 100);
            historicalChartOpt.series[1].data[0] = Math.round(performanceData.historical.struggling * 100);
            historicalChartOpt.series[2].data[0] = Math.round(performanceData.historical.unhealthy * 100);
            Highcharts.chart("chart-historical", historicalChartOpt);
            
            // current
            $("#chart-current-compare").html("");
            var currentChartOpt = $.extend(true, {}, opts.chartOptions);
            currentChartOpt.series[0].data[0] = parseFloat((performanceData.current[term].healthy * 100).toFixed(2));
            currentChartOpt.series[1].data[0] = parseFloat((performanceData.current[term].struggling * 100).toFixed(2));
            currentChartOpt.series[2].data[0] = parseFloat((performanceData.current[term].unhealthy * 100).toFixed(2));
            Highcharts.chart("chart-current-compare", currentChartOpt);
            
            return;
        };

    });
})(jQuery);
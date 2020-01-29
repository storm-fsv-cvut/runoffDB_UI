$(document).ready(function (e) {
    $(".addFormRow").on('click',function (e) {
        let table = $(this).parents('table');
        let rows = $(table).find('tr').length;
        let tr =  $(this).parents('tr').clone();
        $(tr).find("td").each(function (i,e) {
            let prototype = $(e).data('prototype');
            if (prototype != undefined) {
                let element = prototype.replace(/__name__/g, rows);
                $(e).html(element);
            }
        });
        $(tr).appendTo(table);
        $(tr).find(".addFormRow").remove();
        $(tr).find(".removeRow").show();
        $(tr).find(".removeRow").on('click',function (e) {
            $(this).parents('tr').remove();
        });
    });

    $("[data-change-label]").each((i,e)=>{
        $('[data-depends="'+$(e).attr('name')+'"]').text($(e).find("option:selected").text());
        $(e).change((event)=>{
            $('[data-depends="'+$(e).attr('name')+'"]').text($(e).find("option:selected").text());
        })
    });

    $("input:file[data-validate]").change(function (){
        var form = $(this).parents("form");
        let data = new FormData(form[0]);
        $.ajax({
            url : $(this).data('validate'),
            type : 'POST',
            data : data,
            processData: false,
            contentType: false,
            success : function(data) {
                if (data.error != undefined) {
                    alert(data.error);
                } else {
                    let table = $(form).find('table');
                    $(table).find("tr").each((i,e) => {
                        if (i>0) {
                            $(e).remove();
                        }
                    })

                    for(i in data.data) {
                        let rows = $(table).find('tr').length;
                        let tr =  $(table).find('tr').first().clone();
                        $(tr).appendTo(table);
                        $(tr).find(".addFormRow").remove();
                        $(tr).find(".removeRow").show();
                        $(tr).find(".removeRow").on('click', function (e) {
                            $(this).parents('tr').remove();
                        });

                        $(tr).find("td").each(function (i, e) {
                            let prototype = $(e).data('prototype');
                            if (prototype != undefined) {
                                let element = prototype.replace(/__name__/g, rows);
                                $(e).html(element);
                            }
                        });

                        $(tr).find('.value').val(data.data[i].value);
                        $(tr).find('.time').val(data.data[i].time);

                    }
                }
            }
        });
    });
})

$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-blue'
})

function drawChart(element_id, ids) {

    var data = new google.visualization.DataTable();
    data.addColumn('timeofday', '');
    data.addColumn('number', 'intenzita srážky [mm.h-1]');
    data.addColumn('number', 'povrchový odtok [l.min-1]');

    data.addRows([
        [[0, 0, 0], 60, null],
        [[1, 5, 30], 0, null],
    ]);

    var options = {
        vAxes: {0: {}, 1: {}},
        series: {
            0: {
                type: 'steppedArea',
                targetAxisIndex: 0
            },
            1: {
                type: 'line',
                targetAxisIndex: 1
            },
        },
        bar: {groupWidth: "100%"},
        title: 'Suchá simulace',
        curveType: 'function',
        legend: {position: 'bottom'},
    };

    var chart = new google.visualization.ComboChart(document.getElementById('line-chart'));

    chart.draw(data, options);
}

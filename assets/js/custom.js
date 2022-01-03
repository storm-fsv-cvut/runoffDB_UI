$(document).ready(function (e) {
    $('.textarea-wys').wysihtml5();
    $("li.current ul").css({display: "block"});
    $("li.current").addClass("menu-open");

    $(".addFormRow").on('click', function (e) {
        let table = $(this).parents('table');
        let rows = $(table).find('tr').length;
        let tr = $(this).parents('tr').clone();
        $(tr).find("td").each(function (i, e) {
            let prototype = $(e).data('prototype');
            if (prototype != undefined) {
                let element = prototype.replace(/__name__/g, rows);
                $(e).html(element);
            }
        });
        $(tr).appendTo(table);
        $(tr).find(".addFormRow").remove();
        $(tr).find(".removeRow").show();
        $(tr).find(".removeRow").on('click', function (e) {
            $(this).parents('tr').remove();
        });
    });

    $(".removeRow").on('click', function (e) {
        $(this).parents('tr').remove();
    });

    $("[data-change-label]").each((i, e) => {
        let parentModal = $(e).parents('.modal');

        if ($(e).find("option:selected").val()) {
            $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').show();
        } else {
            $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').hide();
        }
        $(parentModal).find('[data-depends="' + $(e).attr('name') + '"]').text($(e).find("option:selected").text());
        $(e).change((event) => {
            if ($(e).find("option:selected").val()) {
                $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').show();
            } else {
                $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').hide();
            }
            $(parentModal).find('[data-depends="' + $(e).attr('name') + '"]').text($(e).find("option:selected").text());
        })

    });

    $("[data-confirm]").on('click', function (e) {
        if (window.confirm($(this).data('confirm'))) {
            return true;
        } else {
            return false;
        }
    })

    $('[data-parent]').click(function (e) {
        let modal = $($(this).data('target'));
        $(modal).find('[name="' + $(modal).attr('id') + '[parent_id]"]').val($(this).data('parent'));
    })

    $(".modal.appendToCollection").on('show.bs.modal', function (e) {
        let nr = $('[data-collection="' + $(this).data('append') + '"]').length;
        $(this).find('input,submit,select,option,textarea').each(function (i, e) {
            if ($(e).attr('name') != undefined) {
                $(e).attr('name', $(e).attr('name').replace(/__name__/g, nr));
            }
        })
    });

    $('form.ajax').on('submit', function (e) {
        e.preventDefault();
        let data = new FormData(this);
        var form = this;
        $.ajax({
            url: $(this).data('validate'),
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.error != undefined) {
                    alert(data.error);
                } else {
                    if (data.id != 'undefined') {
                        let modal = $(form).parents('.modal');
                        let select = $('[data-target="#' + $(modal).attr("id") + '"]').parents('.form-group').find('select');
                        $(select).find('option:selected').prop("selected", false)
                        $('<option value="' + data.id + '">' + data.label + '</option>').appendTo(select).prop("selected", true);
                        $(modal).find('[data-dismiss]').click();
                    }
                }
            }
        });
    })

    $("input:file[data-validate]").change(function () {
        var form = $(this).parents("form");
        var modal = $(this).parents(".modal");
        var inputs = $(this).parents(".file_upload").find('[data-name]');
        let data = new FormData(form[0]);
        let data2 = new FormData();
        $(inputs).each(function (index, input) {
            data2.append($(input).data('name'), data.get(input.name));
        })

        $.ajax({
            url: $(this).data('validate'),
            type: 'POST',
            data: data2,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.error != undefined) {
                    alert(data.error);
                } else {
                    let table = $(modal).find('table');
                    $(table).find("tr").each((i, e) => {
                        if (i > 0) {
                            $(e).remove();
                        }
                    })

                    for (i in data.data) {
                        let rows = $(table).find('tr').length;
                        let tr = $(table).find('tr').first().clone();
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
                        $(tr).find('.related_value_X').val(data.data[i].related_value_X);
                        $(tr).find('.related_value_Y').val(data.data[i].related_value_Y);
                        $(tr).find('.related_value_Z').val(data.data[i].related_value_Z);
                        $(tr).find('.time').val(data.data[i].time);

                    }
                }
            }
        });
    });

    $("[data-toggle='chart']").on('change', function (event) {
        var ids = [];
        $(this).parents('.records').find("[data-toggle='chart']").each(function (i, e) {
            if ($(e).is(':checked')) {
                ids.push($(e).data('record'));
            }
        })

        drawChart($($(this).data('target')), ids);
    })

    $('[data-toggle="tooltip"]').tooltip()

})

$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-blue'
})

$('input[type="checkbox"].append-run').on('change', function (e) {
    $.ajax($(this).data('link'), {
        method: 'GET',
        data: {'run_id': $(this).val()},
        complete: function (xhr, status) {
        }
    })
});

$('input[type="checkbox"].href').on('change', function (e) {
    window.location = $(this).data('hardlink');
});

function drawChart(element, ids) {
    var data = new google.visualization.DataTable();
    var chart = new google.visualization.ComboChart(document.getElementById($(element).attr('id')));

    var options = {
        bar: {groupWidth: "100%"},
        seriesType: 'line',
        series: {},
        legend: {position: 'bottom'},
        vAxes: {
            0: {
                direction: -1
            },
            1: {
                direction: 1
            }
        }
    };

    $.ajax($(element).data('datalink'), {
            method: 'GET',
            data: {'ids': ids},
            complete: function (xhr, status) {
                if (xhr.responseText != '0') {
                    $(element).parents('.chart-box').find('.box-body').collapse('show');
                    let json = xhr.responseJSON;
                    for (i in json[0]) {
                        data.addColumn(json[0][i][0], json[0][i][1]);
                        if (i != 0) {
                            if (options.series[i - 1] == undefined) {
                                options.series[i - 1] = {};
                            }
                            if (json[0][i][3] != undefined && json[0][i][3] == 'precip') {
                                options.series[i - 1].targetAxisIndex = 0;
                                options.series[i - 1].backgroundColor = '#66bc40';
                            } else {
                                options.series[i - 1].targetAxisIndex = i;
                            }
                            if (json[0][i][2] != undefined) {
                                options.series[i - 1].type = json[0][i][2];
                            }
                        }
                    }
                    data.addRows(json[1]);
                    chart.draw(data, options);
                } else {
                    $(element).parents('.chart-box').find('.box-body').collapse('hide');
                    chart.clearChart();
                }
            }
        }
    );
}


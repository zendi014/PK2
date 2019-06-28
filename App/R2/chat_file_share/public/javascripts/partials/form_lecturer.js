$('form').submit(function(e){
    e.preventDefault();
});

$(document).on("click", ".submit_form_lecturer", function(){
    const lr_id = $(this).attr("dt_lr_id");

    const baseUrl = '/api/lecturer'
    const type = lr_id !="null" ? 'PUT' : 'POST'
    const url  = lr_id !="null" ? `${baseUrl}/${lr_id}` : baseUrl

    const ajaxOptions = {
      url,
      type,
      data: $('form').serializeJSON()
    }

    $.ajax(ajaxOptions)
      .done(afterSubmit)
      .fail(function(e) {
        console.log(e); alert("Something went wrong");
      })
});

function afterSubmit(){
    get_api_table_lecturer()
    get_form_lecturer("null")
}

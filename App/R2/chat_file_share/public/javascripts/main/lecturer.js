get_form_lecturer("null");
get_table_lecturer();

function get_form_lecturer(lr_id){
  $.post('/form_lecturer', {lr_id: lr_id}, function(dt){
      $("#form_content").empty().append(dt);
      if(lr_id!="null"){
        parseData(lr_id);
      }
  });
}


function get_table_lecturer(){
  $.get('/table_lecturer').done(function(dt){
      $("#table_content").empty().append(dt);
  });
}



function parseData(lr_id){
  $.get(`/api/lecturer/${lr_id}`).done(function(dt){
      $('[name="lecturer_name"]').val(dt.lecturer_name).focus();
      $('[name="email"]').val(dt.email);
      $('[name="interest"]').val(dt.interest);
  });
}

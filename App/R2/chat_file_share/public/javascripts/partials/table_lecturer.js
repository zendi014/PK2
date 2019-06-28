get_api_table_lecturer();


function get_api_table_lecturer(){
  $.get('/api/lecturer').done(function(dt){
      $("table tbody").empty();
      $.each(dt, function(i, val){
          ct = `
            <tr>
              <td>
                  <b>${val.lecturer_name}</b><br/>
                  (${val.interest})
              </td>
              <td>
                <a href="#" class="edit" dt_lr_key="${val.lecturer_key}">edit</a>
                <a href="#" class="delete" dt_lr_key="${val.lecturer_key}">delete</a>
              </td>
            </tr>`;
          $("table tbody").append(ct);
      })
  });


  $("#table_lecturers").on("click", ".edit", function(){
      lr_key = $(this).attr("dt_lr_key");
      get_form_lecturer(lr_key);
  });

  $("#table_lecturers").on("click", ".delete", function(){
      lr_key = $(this).attr("dt_lr_key");
      console.log(lr_key);
  });
}

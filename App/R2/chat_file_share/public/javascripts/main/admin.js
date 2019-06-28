get_data();

function get_data(){
  $.get("/api/lectures").done(function(dt){
      if(dt){
        $('#table_lectures tbody').empty();
        dt.forEach((v)=>{
            $('#table_lectures tbody').append(`
                <tr>
                    <td>
                      <div class="md-list-content" style="cursor:pointer">
                          <span class="md-list-heading">
                              ${v.code} | ${v.lecture_name}
                          </span>
                          <br/>
                          <span class="uk-text-small uk-text-muted">
                              ${v.room} at ${v.time}
                          </span>
                      </div>
                    </td>
                    <td>
                      <span class="md-list-heading" style="cursor:pointer">
                          ${v.displayName}
                      </span>
                      <br/>
                      <span class="uk-text-small uk-text-muted">
                          ${v.major}
                      </span>
                    </td>
                    <td>
                        <i class="md-icon material-icons uk-text-primary view_table_lectures" lid="${v.lecture_key}">visibility</i>
                        <i class="md-icon material-icons uk-text-warning edit_table_lectures" lid="${v.lecture_key}">edit</i>
                        <i class="md-icon material-icons uk-text-danger delete_table_lectures" lid="${v.lecture_key}">delete</i>
                    </td>
                </tr>
            `);
        })
      }
  })
}



$("#search_table_lectures").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#table_lectures tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


let is_edit = false;

$(document).on("click",  "#add_lectures", function(){
    get_form_lectures("null");
    is_edit = false;
});


function get_form_lectures(lid){
  $.get("/form_lectures/"+lid).done(function(html){
    Swal.fire({
      html: html,
      showCloseButton: false,
      showConfirmButton: false,
      showCancelButton: false,
      // width: "40%",
      focusConfirm: false,
      animation: false,
      // customClass: 'animated bounceIn',
      closeOnClickOutside: false,
      allowOutsideClick: false
    });
    $.get("/api/lecturer").done(function(dt){
      var lecturers = $('#lecturers');
      // lecturers.find('option').remove();
      dt.forEach((v)=>{
          lecturers.append(`<option value="${v.user_key}">${v.displayName}</option>`);
      })
    })
  })
}


$('form').submit(function (e) {
    e.preventDefault();
});


$(document).on('click', "#add_new_lecture", function(e) {
    var json = $('form').serializeJSON();
    if(is_edit == false){
        $.post("/api/lectures", json, function(res){
            if(res){
              Swal.fire({
                  position: 'top-end',
                  type: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1500
              })

              get_data();
            }
        })
    }else{

    }
});



$(document).on("click",  ".view_table_lectures", function(){
    $.get('/api/lectures/'+$(this).attr("lid")).done(function(dt){
      if(dt){
        let html = `
        <ul class="md-list">
            <li>
                <div class="md-list-content">
                    <span class="md-list-heading">
                      ${dt.code} | ${dt.lecture_name}
                      <br/>
                      ${dt.room} at ${dt.time}
                    </span>
                    <span class="uk-text-small uk-text-muted">
                      lecture
                    </span>
                </div>
            </li>
            <li>
                <div class="md-list-content">
                    <span class="md-list-heading">
                      ${dt.displayName}<br/>${dt.major}
                    </span>
                    <span class="uk-text-small uk-text-muted">
                      lecturer
                    </span>
                </div>
            </li>
            <li style="min-height:5px">
            </li>
        </ul>
        `;
        Swal.fire({
          html: html,
          showCloseButton: false,
          showConfirmButton: true,
          showCancelButton: false,
          // width: "40%",
          focusConfirm: false,
          animation: false,
          // customClass: 'animated bounceIn',
          closeOnClickOutside: false,
          allowOutsideClick: false
        });
      }
    });
});



$(document).on("click",  ".edit_table_lectures", function(){
    $.get('/api/lectures/'+$(this).attr("lid")).done(function(dt){
      if(dt){
          get_form_lectures(dt.lecture_key);

          // $('[name="lecture_name"]').val(dt.lecture_name)
          document.getElementsByName("lecture_name").value = dt.lecture_name;
          // document.getElementById("lecture_name").value = dt.lecture_name;

          $('[name="code"]').val(dt.code);
          $('[name="mark"]').val(dt.mark);
          $('[name="room"]').val(dt.room);
          $('[name="time"]').val(dt.time);

          is_edit = true;
      }
    })
});



$(document).on("click",  ".delete_table_lectures", function(){
    console.log($(this).attr("lid"))
});

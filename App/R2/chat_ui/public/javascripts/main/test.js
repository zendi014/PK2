let dt = [];
$('#btn_submit').on('click', function (e) {
    var json = {
      "book_name": $("#book_name").val(),
      "author"   : $('[name="author"]').val(),
      "field"    : $("#field").val(),
    }
    dt.push(json);

    // $.post("/api/your_function", {key : k}, function(dt){
    //     if(dt){
          reset_form();

          push_to_table();
    //     }
    // })
});


function reset_form(){
  $("#book_name").val('').focus();
  $("#author").val('');
  $("#field").val('');
}


$("#search").on("keyup", function(){
    var val = $(this).val().toLowerCase();
    $("#table_test tr").filter(function(){
        $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1)
    })
});


function push_to_table(){
    let a=0;
    // $.get('/api/your_function').done(function(dt){
        $("#table_test tbody").empty();

        dt.forEach((v) => {
            $("#table_test tbody").append(`
                <tr>
                  <td>
                      <b>${v.book_name}</b>
                      <br/>
                      ${v.author}
                      <br/>
                      ${v.field}
                  </td>
                  <td style="margin-top:10px">
                      <a class="view" href="#" tid="${a}">
                         <i class="material-icons">
                            visibility
                         </i>
                      </a>
                      <a class="edit" href="#" tid="${a}">
                         <i class="material-icons">
                            edit
                         </i>
                      </a>
                      <a class="delete" href="#" tid="${a}">
                         <i class="material-icons">
                            delete
                         </i>
                      </a>
                  </td>
                </tr>
            `);
            a++;
        })
    // })

}


$(document).on('click', '.view', function(){
    k = $(this).attr("tid");
    // $.get("api/your_function/"+k).done(function(dt){
        html = `
          <span>
              Book Name<br/><b>${dt[k].book_name}</b>
          </span>
          <br/><br/>
          <span>
              Author<br/><b>${dt[k].author}</b>
          </span>
          <br/><br/>
          <span>
              Field<br/><b>${dt[k].field}</b>
          </span>
          <br/><br/>
        `;
        Swal.fire({
          html : html
        })
    // })
})


$(document).on('click', '.edit', function(){
    k = $(this).attr("tid")
    // $.get("api/your_function/"+k).done(function(dt){
        $("#book_name").val(dt[k].book_name);
        $("#author").val(dt[k].author);
        $("#field").val(dt[k].field);
    // })
})

$(document).on('click', '.delete', function(){
    k = $(this).attr("tid")
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
          // $.post("/api/your_function/delete", {key : k}, function(dt){
          //     if(dt){
                  Swal.fire(
                      'Deleted',
                      'Your data successfully deleted',
                      'success'
                  )
          //     }
          // })
      }
    })

})

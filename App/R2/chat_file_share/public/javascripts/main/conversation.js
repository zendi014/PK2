var arr = window.location.href.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect(result);



socket_service();


get_user_lists();

function get_user_lists() {
    $.get("/api/users").done(function (dt) {
        if (dt.length > 0) {
            $("#userlist").empty();
            dt.forEach((v) => {
                $("#userlist").append(`
                    <div class="media text-muted pt-3 userlist" ukey="${v.user_key}">
                        <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong class="d-block text-gray-dark">
                                ${v.email}
                            </strong>
                            ${v.major}
                        </p>
                    </div>
                `)
            })
        }
    })
}


var ukey = "";

$(document).on("click", ".userlist", function () {
    ukey = $(this).attr("ukey");

    get_conversations(ukey);
});


$("#search_user").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#userlist p").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});






function get_conversations(ukey) {
    $("#message_content").empty();

    $.get(`/api/conversations/${ukey}`).done(function (dt) {
        $.get(`/api/user/${ukey}`).done(function(usr){            
            if (dt.length > 0) {
                dt.forEach((v) => {
                    var ct = "";
                    msg = v.message;

                    if (v.type == "file") {
                        msg = `<span>${v.message}</span><br/>
                        <img src="/uploads/${v.file_name}" style="width:100%"/>`;
                    }

                    if (v.to == ukey) {
                        ct = `
                            <div class="row">
                                <div class="col-sm">
                                </div>
                                <div class="col-sm">
                                    <div class="alert alert-secondary" role="alert" style="text-align:justify">
                                        <code>@me</code><br/> 
                                        ${msg}
                                    </div>
                                </div>
                            </div>
                        `
                    } else {
                        ct = `
                            <div class="row">
                                <div class="col-sm">
                                    <div class="alert alert-primary" role="alert" style="text-align:justify">
                                        <code>${usr.email}</code><br/> 
                                        ${msg}
                                    </div>
                                </div>
                                <div class="col-sm">
                                </div>
                            </div>
                        `
                    }
                    $("#message_content").append(ct)
                })
            } else {
                ct = `
                    <div class="row" style="margin-top:30px">
                        <div class = "col-2">
                        </div>
                        <div class="col-8" style="text-align:center">
                            <div class="alert alert-warning" role="alert">
                                no message found!
                            </div>
                        </div>
                        <div class="col-2">
                        </div>
                    </div>
                `
                $("#message_content").append(ct)
            }
            autoscroll();
        })       
    });
}




function socket_service() {
    socket.emit('connection', 'a user connected');
    socket.on('message', function (data) {
        console.log(data)
    });

    socket.on('conversations', function (v) {
        $.get(`/api/user/${ukey}`).done(function (usr) {
            msg = v.message;

            if (v.type == "file") {
                msg =  `<span>${v.message}</span>
                        <br/>
                        <img src="/uploads/${v.file_name}" style="width:100%"/>`;
            }

            if (v.to == ukey) {//me                
                ct = `
                    <div class="row">
                        <div class="col-sm">
                        </div>
                        <div class="col-sm">
                            <div class="alert alert-secondary" role="alert" style="text-align:justify">
                                <code>@me</code><br/>
                                ${msg}
                            </div>
                        </div>
                    </div>
                `
            } else {
                ct = `
                    <div class="row">
                        <div class="col-sm">
                            <div class="alert alert-primary" role="alert" style="text-align:justify">
                                <code>${usr.email}</code><br/>
                                ${msg}
                            </div>
                        </div>
                        <div class="col-sm">
                        </div>
                    </div>
                `
            }
            $("#message_content").append(ct)
            autoscroll();
        })
    });
    
    
    socket.emit('disconnect', 'a user disconnected');
}





var files = null;
$(document).on('change', "#file_share", function () {
    files = this.files;
    if (files.length > 0) {
        $.each(files, function (j, val) {
            if (val) {
                var reader = new FileReader();
                var size = 0;
                if ((val.size / 1048576) > 1) {
                    size = (val.size / 1048576).toFixed(2) + " MB";
                } else {
                    size = (val.size / 1024).toFixed(2) + " KB";
                }

                reader.onload = function (e) {
                    ct = `
                        <div class="row">
                            <div class="col-sm">
                            </div>
                            <div class="col-sm">
                                <div class="alert alert-secondary" role="alert" style="text-align:justify">
                                    <code>@me</code> Share files into the conversation
                                    <br/>
                                    <img src="${e.target.result}" style="width:100%"/>
                                    <br/>
                                    <span>
                                        <b>${val.name}</b> <a href="#">${size}</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    `
                    $("#message_content").append(ct);
                }
                reader.readAsDataURL(val);
            }
        })
        autoscroll();
    }    
});




$(document).on("click", "#send_message", function () {
    message = $("#message").val();

    if (message != "") {
        if (files!=null) {
            $.each(files, function (j, val) {
                upload_file(val);
            })
        }else{
            send_message(message);
        }
    }
})


function send_message(message, fname=null) {
    var tp = '', fnm = '';
    if (fname!=null){
        tp = "file";
        fnm = fname;
    }else{
        tp = "text";
    }

    dt = {
        message: message,
        to: ukey,
        type: tp,
        side: "R",
        file_name : fnm
    }

    $.post("api/conversations", dt, function (res) {
        if (res) {
            $("#message").val("").focus();
        }
    })
}


function upload_file(f){
    var form_data = new FormData();
    form_data.append('file', f);

    $.ajax({
        url: '/api/conversations/upload_file', // point to server-side controller method
        dataType: 'text', // what to expect back from the server
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (res) {
            if (res){
                console.log(JSON.parse(res).name)
                send_message(message, JSON.parse(res).name);
            }
        }
    });
}




function autoscroll(){
    $("#message_content").stop().animate({
        scrollTop: $("#message_content")[0].scrollHeight
    }, 5);
}





























/*


img_type = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp"];
audio_type = ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm", "audio/3gpp", "audio/mp3", "audio/3gp"];
video_type = ["video/x-msvideo", "video/mpeg", "video/ogg", "video/webm", "video/3gpp", "video/mp4", "video/3gp"];
app_type = ["application/msword", "application/pdf", "application/vnd.ms-powerpoint", "application/x-7z-compressed", "application/zip", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/x-rar-compressed", "application/x-tar", "application/vnd.visio", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];






$(document).on('change', "#file_share", function (e) {
    filePreview(this, "#message_content");
});


var file_data = null;
function filePreview(input, content) {
    file_data = input.files; //type size name

    if (file_data.length > 0) {
        var fct = '';

        $.each(file_data, function (j, val) {
            var size = 0;
            var icon = '';

            if ((val.size / 1048576) > 1) {
                size = (val.size / 1048576).toFixed(2) + " MB";
            } else {
                size = (val.size / 1024).toFixed(2) + " KB";
            }

            if (img_type.includes(val.type) == true) {
                icon = "photo";
            } else {
                
                if (audio_type.includes(val.type) == true) {
                    icon = "fa-music";
                } else if (video_type.includes(val.type) == true) {
                    icon = "fa-film";
                } else if (app_type.includes(val.type) == true) {
                    if (val.type == "application/pdf") {
                        icon = "fa-file-pdf-o";
                    } else if (val.type == "application/msword" || val.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                        icon = "fa-file-word-o";
                    } else if (val.type == "application/vnd.ms-powerpoint" || val.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                        icon = "fa-file-powerpoint-o";
                    } else if (val.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || val.type == "application/vnd.ms-excel") {
                        icon = "fa-file-excel-o";
                    } else if (val.type == "application/x-7z-compressed" || val.type == "application/zip" || val.type == "application/x-tar" || val.type == "application/x-rar-compressed") {
                        icon = "fa-file-archive-o";
                    } else {
                        icon = "fa-file";
                    }
                } else {
                    icon = "fa-file";
                }
                
            }


            var fname = '';
            if (val.name) {
                fname = val.name.length > 30 ?
                    val.name.substring(0, 30 - 4) + "..." :
                    val.name;
            }

            fct = `${fct}
                    <a href="#">
                        <i class="material-icons" style="font-size:58px;">${icon}</i>                        
                    </a>
                    <br/>
                    <span><strong>${fname}</strong></span>
                    <br/>
                    <a href="#"><span class="lh"> ${size} </span></a>
                    <br/>`;

            if ((j + 1) == file_data.length) {                
                ct = `
                    <div class="row">
                        <div class="col-sm">
                        </div>
                        <div class="col-sm">
                            <div class="alert alert-secondary" role="alert" style="text-align:justify">
                                <code>@me</code><br/> Share ${val.type} files into the conversation
                                <br/>
                                ${fct}
                            </div>
                        </div>
                    </div>
                `

                $(String(content)).append(ct);

                $(String(content)).animate({
                    scrollTop: $(String(content))[0].scrollHeight
                }, 200);
            }
        });
    }
}
*/
var giftedClassId;
$(document).ready(function () {
    $.ajax({
        url: '/api/admin/giftedclasslist',
        type: 'POST',
        success: function (data) {
            $.each(data.giftedClassList, function (i, item) {
                $('#gifftedClass').append(`<option value="` + item.giftedClassId + `">` + item.name + `</option>`);
            });
        },
        failure: function (errMsg) {
            console.log(errMsg);
        },
        dataType: "json",
        contentType: "application/json"
    });
});

//change value of combobox
function changeSelected() {
    giftedClassId = $('#gifftedClass option:selected').val();
}

$('#deleteGC').click(function (e) {
    if (giftedClassId == null || giftedClassId == 0) {
        $('.giftedClass-err').text("");
        $('.giftedClass-err').text("Hãy chọn hệ chuyên để xóa !");
    } else {
        $('.giftedClass-err').text("");
        $('#deleteGifftedClassModal').addClass('fade');
        $('#deleteGC').attr('data-target', '#deleteGifftedClassModal');
        $("#deleteGifftedClass").click(function (e) {
            deleteGifted(e);
        });
    }
});

//edit gifted class function
function deleteGifted(e) {
    $('.giftedClass-err').text("");
    var giftedClass = {
        giftedClassId: giftedClassId
    }
    e.preventDefault();
    $.ajax({
        url: '/api/admin/deletegiftedclass',
        type: 'POST',
        data: JSON.stringify(giftedClass),
        beforeSend: function () {
            $('body').addClass("loading")
        },
        complete: function () {
            $('body').removeClass("loading")
        },
        success: function (data) {
            var messageCode = data.messageCode;
            var message = data.message;
            if (messageCode == 0) {
                $("#deleteSuccess .modal-body").html("");
                $('#deleteSuccess .modal-body').append(`
                    <img class="mb-3 mt-3" src="img/img-success.png"/>
                    <h5>Xoá hệ chuyên thành công !</h5>
                `);
                $("#deleteSuccess .modal-footer input").addClass('hide');
                $("#deleteSuccess .modal-footer a").removeClass('hide');
                $('#deleteSuccess').css('display', 'block');
                $('.giftedClass-err').text("");
            } else {
                $("#deleteSuccess .modal-body").html("");
                $('#deleteSuccess .modal-body').append(`
                    <img class="mb-3 mt-3" src="img/img-error.png"/>
                    <h5>` + message + `</h5>
                `);
                $("#deleteSuccess .modal-footer input").removeClass('hide');
                $("#deleteSuccess .modal-footer a").addClass('hide');
            }
        },
        failure: function (errMsg) {
            console.log(errMsg);
        },
        dataType: "json",
        contentType: "application/json"
    });
}

/*Check Role has create or not*/
if (localStorage.getItem('roleID') != 1) {
    $('.giftedClass-err').text("Bạn không có quyền xóa hệ chuyên!");
    $('#deleteGC').prop('disabled', true);
}
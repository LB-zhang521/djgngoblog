var token = $('[name="csrfmiddlewaretoken"]').attr("value");
var C_T = function () {
    let token = $('[name="csrfmiddlewaretoken"]').attr("value");
    $.ajax(
        {
            url: '/blog/blog-publish/',
            type: 'get',
            data: {
                "csrfmiddlewaretoken": token
            },
            success: function (data) {

                var op_tags = data.tags;
                var op_categorys = data.categorys;
                for (let i = 0; i < op_tags.length; i++) {

                    var op_tag =
                        $('<option value=' + op_tags[i]['id'] + ">" + op_tags[i]["name"] + "</opention>");
                    $("#blog_tags").append(op_tag)
                }
                for (let i = 0; i < op_categorys.length; i++) {
                    var op_category = $("<option value=" + op_categorys[i]['id'] + ">" + op_categorys[i]["name"] + "</opention>");
                    $("#blog_categorys").append(op_category)
                }
            }
            ,
            error: function () {
                bs4pop.alert('编辑器初始化异常！请刷新重试')
            }
        }
    )

};
C_T();
$('.btn-publish').click(function () {
    var title_blog = $('.article-bar__title').val();
    if (title_blog != "") {
        $('#publics_modal').modal('show')
    } else {
        alert("标题必须填写")
    }
});
$('#btn-update').click(function () {
    var token = $('[name="csrfmiddlewaretoken"]').attr("value");
    let tag = "";
    let type = $("input[name='blog_type']:checked").val();
    let category = $("select#blog_categorys option:checked").val();
    let tags = $('select#blog_tags option:selected').each(function (index, element) {
        tag += ($(this).val() + ",");
    });
    let blog_id = $('#editormd').attr('data-id');
    let statu = $("input[name='is_active']:checked").val();
    tag = tag.substr(0, tag.length - 1);
    let tags_add = $('input[name="blog_tag"]').val();
    let content = testEditor.getMarkdown();
    if (type == undefined) {
        alert('文章发布类型必须选')
    } else if (category == 0) {
        alert('文章分类必须选哦')
    } else if (statu == undefined) {
        alert("发布形式必选")
    } else if (content == "") {
        alert("博文内容不能为空")
    } else {
        $.ajax(
            {
                url: '/blog/blog-publish/',
                type: 'post',
                data: {
                    "title": $('.article-bar__title').val(),
                    "content": content,
                    "type": type,
                    "category": category,
                    "tag": tag,
                    "tag_add": tags_add,
                    "statu": statu,
                    "csrfmiddlewaretoken": token,
                    "id": blog_id ? blog_id : 0
                },
                success: function (data) {
                    $('#publics_modal').modal('hide');
                    bs4pop.notice(data.msg, {type: data.flag ? 'success' : 'danger', position: 'topcenter'});
                    if (data.flag) {
                        window.location = '/blog/blog-detail/' + data.id
                    }
                },
                error: function () {
                    alert('文章提交异常，重新提交，不要刷新',)
                }
            }
        )
    }
});
$('.article-bar__title').bind('input propertychange', function () {
    let len = $(this).val().length;
    let max = $(this).attr('maxlength');
    $('.input-len').text(len);
    cur_len = parseInt($('.input-len').text());
    if (cur_len == max) {
        alert('你的标题太长啦~，人家装不下了啦~');
    }
});

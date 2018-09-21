function saveTextarea(){
    var parent_div = $(this).closest(".page-entry");
    var texte = parent_div.find(".journal_entree_texte").val();
    var id = parent_div.find(".journal_entree_id").attr("value");

    $.ajaxSetup({headers: {'X-CSRFToken': $("[name='csrfmiddlewaretoken']").val()}});
    $.ajax({
        url: '/projets/' + $('#slug').val() + 'maj-journal',
        data: {
            'id': id,
            'texte': texte,
        },
        dataType: 'json',
        method: 'POST',
        success: function(data){
            hide_error();
            if(data.success){
                if(data.nouveau_journal){
                    $(".today-page").find(".journal_entree_id").attr('value',data.id);
                }
                //$('.today-entry .journal-entry .save-info').fadeIn('slow', function(){$('.today-entry .journal-entry .save-info').fadeOut('slow');});
                save_journal = $(".journal_entree_id[value = " + data.id + "]").closest(".page-entry").find(".save-info");
                save_journal.fadeIn('slow', function(){
                    save_journal = $(".journal_entree_id[value = " + data.id + "]").closest(".page-entry").find(".save-info");
                    save_journal.fadeOut('slow');
                });
            }
            else{
                $('#id_form-' + form_id + '-id').parent().prepend("<p id='id_form-" + form_id +
                    "-error' class='error'>" + data.form_errors + "</p>");
            }
        },
        error: function (jqXHR, exception) {
            show_error(jqXHR, exception);
        }
    });
}

$(".journal_typewatch").typeWatch( {
    callback: saveTextarea,
    wait: 500,
    highlight: false,
    allowSubmit: false,
    captureLength: 1,
});

function maj_todo(){
    var parent_div = $(this).closest('.task');
    var realisee = parent_div.find('.todo_entree_checkbox').prop('checked');
    var texte = get_text(parent_div.find('.todo_entree_texte'));
    var id = parent_div.find('.todo_entree_id').attr('value');
    if(texte != ''){
        $.ajaxSetup({headers: {'X-CSRFToken': $("[name='csrfmiddlewaretoken']").val()}});
        $.ajax({
            url: '/projets/' + $('#slug').val() + 'maj-todo',
            data: {
                'todo_id': id,
                'texte': texte,
                'realisee': realisee,
            },
            dataType: 'json',
            method: 'POST',
            //La fonction fléche permet de transmetre le $(this) dont on a besoin pour retirer la classe 'unclickable'
            success: (data) => {
                hide_error();
                if(data.success){
                    if(data.nouvelle_tache){
                        //On retire le texte du formulaire initial
                        $('.new-task .todo_entree_texte').val('');
                        //On cherche la celule d'ajout d'une tache
                        var parent_div = $('.today-page .old-tasks');
                        //On ajoute des <div> au formulaire retourné pour pouvoir naviguer dedans avec jquery
                        out_form_str = '<div>' + data.out_form + '</div>'
                        //On ajoute correctement le formulaire de retour en dessous de l'ajout de tache
                        var new_checkbox = $('.todo_entree_checkbox',out_form_str).clone().wrap('<div>').parent().html()
                        var new_textearea = $('.todo_entree_texte',out_form_str).clone().wrap('<div>').parent().html()
                        var new_id = $('.todo_entree_id',out_form_str).clone().wrap('<div>').parent().html()
                        parent_div.prepend(
                            '<article class="task">' +                            
                            new_id +
                            '<div class="disp-todo_entree_checkbox">' +
                            new_checkbox + 
                            '</div>' +
                            '<div class="disp-todo_entree_texte">' +
                            new_textearea +
                            '</div>' +
                            '</article>'
                        );
                        var jqry_textearea = $('.todo_entree_id[value = ' + data.id +']').closest('article').find('.todo_entree_texte');
                        $(jqry_textearea).typeWatch( {
                            callback: maj_todo,
                            wait: 500,
                            highlight: false,
                            allowSubmit: false,
                            captureLength: 1,
                        });
                    }
                    else{
                        //On recherche le div de sauvegarde à faire clignoter
                        save_todo = $('.todo_entree_id[value = ' + data.id + ']').closest('.page-tasks').find('.save-info');
                        save_todo.fadeIn('slow', function(){
                            save_todo = $('.todo_entree_id[value = ' + data.id + ']').closest('.page-tasks').find('.save-info');
                            save_todo.fadeOut('slow');
                        });
                    }
                }
                else{
                    error_todo = $('.todo_entree_id[value = ' + data.id + ']').closest('table').parent();
                    error_todo.prepend('<p id="maj_todo-error" class="error">' + data.form_errors + '</p>');
                }
                //Une fois la fonction fini on retire la classe unclickable pour pouvoir de nouveau ajouter une tache
                $(this).removeClass('unclickable');
            },
            error: function (jqXHR, exception) {
                show_error(jqXHR, exception);
            }
        });
    }
    else{
        //Une fois la fonction fini on retire la classe unclickable pour pouvoir de nouveau ajouter une tache
        $(this).removeClass('unclickable');
    }
}

$(document).on('click','.add-item-button:not(.unclickable)',function(){
    // On pose la classe 'unclickable" pour empécher la multi soumission
    $(this).addClass('unclickable');
    maj_todo.call(this);
});

$(document).on('change','.todo_entree_checkbox', maj_todo);  


$(".task:not(.new-task) .todo_entree_texte").typeWatch( {
    callback: maj_todo,
    wait: 500,
    highlight: false,
    allowSubmit: false,
    captureLength: 1,
});

autosize($('.today-page .journal_entree_texte'));

function enable_edit_page()
{
    var parent_div = $(this).closest('.page-entry').find('.journal_entree_texte');
    var div_content = parent_div.text();
    var editableText = $('<textarea class="journal_entree_texte journal_typewatch" />');
    editableText.val(div_content);
    parent_div.replaceWith(editableText);
    editableText.focus();
    editableText.get(0).setSelectionRange(0, 0);
    editableText.typeWatch( {
        callback: saveTextarea,
        wait: 500,
        highlight: false,
        allowSubmit: false,
        captureLength: 1,
    });
    //setup the blur event for this new textarea
    editableText.blur(disable_edit_page);
    //setup autosize
    autosize(editableText);
    //hide the pencil
    $(this).hide();
}

function disable_edit_page() {
    //Before disabling the texarea, we save it
    saveTextarea.call(this);
    var html_content = $(this).val();
    var viewableText = $('<pre class="journal_entree_texte disabled-textarea"/>');
    viewableText.text(html_content);
    $(this).replaceWith(viewableText);
    //show the pencil again
    viewableText.closest('.page-entry').find('.edit-pen').show(); 
}


$('.page-entry .edit-pen').click(enable_edit_page);


function enable_edit_task()
{
    var task_list = $(this).closest('.page-tasks').find('.todo_entree_texte');
    task_list.each(function(index){
        var parent_div = $(this)
        var div_content = parent_div.text();
        var editableText = $('<textarea class="todo_entree_texte todo_typewatch" />');
        editableText.val(div_content);
        parent_div.replaceWith(editableText);
        editableText.typeWatch( {
            callback: maj_todo,
            wait: 500,
            highlight: false,
            allowSubmit: false,
            captureLength: 1,
        });
        //setup autosize
        autosize(editableText);
    });
    //hide the pencil
    $(this).hide();
}

$('.page-tasks .edit-pen').click(enable_edit_task);

$(document).on("keypress",'.journal_entree_texte:not(disabled-textarea)',
    function (e){
        //Si on appuis sur TAB
        if (e.keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(this).val($(this).val().substring(0, start)
                        + "\t"
                        + $(this).val().substring(end)
                        );

            // put caret at right position again
            this.selectionStart = start +1;
            this.selectionEnd = start + 1;
        } 
        //Sinon on ne fait rien
    }
);


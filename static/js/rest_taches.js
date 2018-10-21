task_hash={};

function update_task_hash(texte,id){
//Update the hash corresponding to the id//  
    //trim the text so it's the same as in the database
    task_hash[id] = texte.trim().hashCode();
}

function show_task_save(parent_div){
//Notice the user that the page was saved//
    var save_tache = parent_div.closest('.page-tasks').find('.save-info');
    //animate the save div
    save_tache.fadeIn('slow', function(){
        save_tache.fadeOut('slow');
    });    
}

function show_task_error(parent_div,local_error){
//Notice the user that the page couldn't be saved
    var error = $('<div class="local-error">').text(local_error); 
    parent_div.closest('.page-task').find('header').append(error);
    parent_div.find('.todo_entree_texte').addClass('textarea-error');
}

function show_new_task(result){
//Add the new task to the dom//
    //Get the old_tasks div
    var old_tasks_div = $('.today-page .old-tasks');
    
    //On ajoute des <div> au formulaire retourné pour pouvoir naviguer dedans avec jquery
    var out_form_str = '<div>' + result.out_form + '</div>'
    //On ajoute correctement le formulaire de retour en dessous de l'ajout de tache
    var new_checkbox = $('.todo_entree_checkbox',out_form_str).clone().wrap('<div>').parent().html()
    var new_textearea = $('.todo_entree_texte',out_form_str).clone().wrap('<div>').parent().html()
    var new_id = $('.todo_entree_id',out_form_str).clone().wrap('<div>').parent().html()
    old_tasks_div.prepend(
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
}

function post_tache(){
//Create a new task//
    var parent_div = $(this).closest('.task');
    var realisee = parent_div.find('.todo_entree_checkbox').prop('checked');
    var texte = get_text(parent_div.find('.todo_entree_texte'));

    if(texte != ''){

        //setup csrf token
        $.ajaxSetup({headers: {'X-CSRFToken': $("[name='csrfmiddlewaretoken']").val()}});
        //setup ajax call
        $.ajax({
            url: '/projets/' + $('#slug').val() + 'rest-tache',
            data: {
                'texte': texte,
            },
            dataType: 'json',
            method: 'POST',
            success: function(result) {
                
                hide_error();
                if(result.success){
                    //update the hash of the text for the next update
                    update_task_hash(texte,result.id);                    

                    //delete text from the inital from
                    $('.new-task .todo_entree_texte').val('');
                        
                    //add the new task to the dom
                    show_new_task(result)
                                        
                    //set typeWatch
                    var jqry_textearea = $('.todo_entree_id[value = ' + result.id +']').closest('article').find('.todo_entree_texte');
                    jqry_textearea.typeWatch( {
                        callback: put_or_delete_tache,
                        wait: 500,
                        highlight: false,
                        allowSubmit: false,
                        captureLength: 1,
                    });
                    //give a success feedback to the user
                    show_task_save(parent_div);
                }
                else{
                    //give an error feedback to the user
                    show_task_error(parent_div,result.local_error);
                }
                //Une fois la fonction fini on retire la classe unclickable pour pouvoir de nouveau ajouter une tache
                $('.add-item-button').removeClass('unclickable');

            },
            error: (jqXHR, exception) => {
                show_error(jqXHR, exception);
                //Une fois la fonction fini on retire la classe unclickable pour pouvoir de nouveau ajouter une tache
                $('.add-item-button').removeClass('unclickable');

            }
        });
    }
    else{
        //Une fois la fonction fini on retire la classe unclickable pour pouvoir de nouveau ajouter une tache
        $('.add-item-button').removeClass('unclickable');
    }
}

function put_tache(parent_div,realisee,texte,id){
//Update task//

    var hash = task_hash[id];
    //update the hash of the text for the next update
    update_task_hash(texte,id);

    //setup crsf token
    $.ajaxSetup({headers: {'X-CSRFToken': $("[name='csrfmiddlewaretoken']").val()}});
    //setup ajax call
    $.ajax({
        url: '/projets/' + $('#slug').val() + 'rest-tache',
        data: {
            'id': id,
            'texte': texte,
            'realisee': realisee,
            'hash': hash,
        },
        dataType: 'json',
        method: 'PUT',
        success: function(result) {
            hide_error();
            if(result.success){
                //give a feedback to the user
                show_task_save(parent_div);  
            }
            else{
                //give a feedback to the user
                show_task_error(parent_div,result.local_error);
            }
        },
        error: function (jqXHR, exception) {
            show_error(jqXHR, exception);
        }
    });
}

function delete_tache(parent_div,id){
//Delete a task//
    
    //delete task from the dom
    parent_div.remove()
    
    //setup csrf token
    $.ajaxSetup({headers: {'X-CSRFToken': $("[name='csrfmiddlewaretoken']").val()}});
    //setup ajax call
    $.ajax({
        url: '/projets/' + $('#slug').val() + 'rest-tache',
        data: {
            'id': id,
        },
        dataType: 'json',
        method: 'DELETE',
        success: function(result) {
            hide_error();
            if(result.success){
                
                //give a feedback to the user
                show_task_save(parent_div);                
            }
            else{
                //give a feedback to the user
                show_task_error(parent_div,result.local_error);
            }
        },
        error: function (jqXHR, exception) {
            show_error(jqXHR, exception);
        }
    });
}

function put_or_delete_tache(){
    var parent_div = $(this).closest('.task');
    var realisee = parent_div.find('.todo_entree_checkbox').prop('checked');
    var texte = get_text(parent_div.find('.todo_entree_texte'));
    var id = parent_div.find('.todo_entree_id').attr('value');
    if(texte != ''){
        put_tache(parent_div,realisee,texte,id);
    }
    else{
        delete_tache(parent_div,id);
    }
}

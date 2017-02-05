// Initialize your app
var myApp = new Framework7({
    
    material:true,
    swipeBackPage:false,
    
});

// Export selectors engine
var $$ = Dom7;

/* 
    ---------------------------------
    Applications Logic begins here.
    ---------------------------------

 */

///////////////////
// Init the tabs //
///////////////////

fetchTodo('todo');
fetchTodo('doing');
fetchTodo('done');

////////////////////
// Add a new Task //
////////////////////

$$('#saveNewTask').click(function(event) {
    
    // Get new task values
    var newTaskTitle = $$('#newTaskTitle').val();
    var newTaskDescription = $$('#newTaskDescription').val();
    var newTaskTime = $$('#newTaskTime').val();

    var todo = {
        title: newTaskTitle,
        description: newTaskDescription,
        time: newTaskTime,
        tab: 'todo'
    }

    // Test if todo is null
    if(localStorage.getItem('todos') === null){
        // Init the array
        var todos = [];

        // Add task to array
        todos.push(todo);

        // Add to local stroage
        localStorage.setItem('todos',JSON.stringify(todos));

    }else{

        // get tasks todo from local storage
        var todos = JSON.parse(localStorage.getItem('todos'));

        // Add task to array
        todos.push(todo);

        // Add to local stroage
        localStorage.setItem('todos',JSON.stringify(todos));

    }

    // reload the todo taskaan list
    fetchTodo('todo');


    // close the add new task popup
    myApp.closeModal('.popup-new-task');

    // clear all form values
    $$('#newTaskTitle').val('');
    $$('#newTaskDescription').val('');
    $$('#newTaskTime').val('');

});

/////////////////////////
// Fetch taskann todos //
////////////////////////

function fetchTodo(tab) {

    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    var tabCount = 0;

    // only fill the list if list isnt empty
    if(todos != null){

        // build the taskann list output    
        var tasklist = document.getElementById(tab+'list');
        tasklist.innerHTML = '';
        for (var i = 0; i < todos.length; i++) {
            
            // only display tasks with tab set to todo
            if(todos[i].tab === tab){
                var title = todos[i].title;
                var description = todos[i].description;
                var time = todos[i].time;

                tasklist.innerHTML +='<li class="swipeout" data-id="'+i+'">'+
                                        '<div class="swipeout-content">'+
                                            '<a href="#" class="item-link item-content open-popover" data-popover=".popover-todo">'+
                                                '<div class="item-inner">'+
                                                    '<div class="item-title-row">'+
                                                        '<div class="item-title">'+ title +'</div>'+
                                                        '<div class="item-after">'+ time +'</div>'+
                                                    '</div>'+
                                                    '<div class="item-text">'+ description +'</div>'+
                                                '</div>'+
                                            '</a>'+    
                                        '</div>'+
                                        '<div class="swipeout-actions-left">'+
                                            '<a href="#" class="bg-orange open-edit-task-popup" id="'+ i +'">Edit</a>'+
                                            '<a href="#" class="swipeout-delete" data-confirm="Are you sure want to delete this task?" data-confirm-title="Delete?" data-close-on-cancel="true">Delete</a>'+
                                        '</div>'+
                                        '<div class="sortable-handler"></div>'+
                                    '</li>';
                tabCount++;
            }
            
        }
    }

    // set the amount of todos
    $$('#'+tab+'-count').html(tabCount);

}

/////////////////////////////////////////////////////
// Load the edit popup with selected popup content //
/////////////////////////////////////////////////////

$$('.open-edit-task-popup').click(function(event) {
    
    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // get the selected task index
    var i = $$(this).attr('id');

    // build the taskann edit task output
    var title = todos[i].title;
    var description = todos[i].description;
    var time = todos[i].time;

    var popupHTML = '<div class="popup popup-edit-task">'+
                        '<div class="navbar">'+
                            '<div class="navbar-inner">'+
                                '<div class="left">'+
                                    '<a href="#" class="icon-only link close-popup"><i class="icon icon-back"></i></a>'+
                                '</div>'+
                                '<div class="center">Modify Task</div>'+
                                '<div class="right">'+
                                   ' <a href="#" class="icon-only link" onclick="saveEditedTask('+ i +')"><i class="material-icons icon">save</i></a>'+
                               ' </div>'+
                           ' </div>'+
                        '</div>'+
                        '<div class="list-block" style="margin: auto 0;">'+
                          '<ul>'+
                            '<li>'+
                              '<div class="item-content">'+
                                '<div class="item-inner">'+
                                  '<div class="item-input">'+
                                      '<input type="text" name="title" placeholder="Title" value="'+ title +'" id="editTitle">'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</li>'+
                            '<li class="align-top">'+
                              '<div class="item-content">'+
                                '<div class="item-inner">'+
                                  '<div class="item-input">'+
                                      '<textarea name="description"  placeholder="Description" id="editDescription">'+ description +'</textarea>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<div class="item-content">'+
                                '<div class="item-inner">'+
                                  '<div class="item-input">'+
                                      '<input type="time" name="title" placeholder="00:00" value="'+ time +'" id="editTime">'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</li>'+        
                          '</ul>'+
                        '</div>'+
                    '</div>';

    myApp.popup(popupHTML);

});

////////////////////////////////////////////
// Save the modification to existing task //
////////////////////////////////////////////

function saveEditedTask(i) {
    
    console.log('attempting to save modifications');

    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // get the form values
    var title = $$('#editTitle').val();
    var description = $$('#editDescription').val();
    var time = $$('#editTime').val();

    // update selected task values
    todos[i].title = title;
    todos[i].description = description;
    todos[i].time = time;

    console.log(title+ '|' + description + "|" + time);

    // Add to local stroage
    localStorage.setItem('todos',JSON.stringify(todos));

    // reload the list
    fetchTodo(todos[i].tab);

    // close the modal
    myApp.closeModal('.popup-edit-task');

}

///////////////////////////////////
// Delete task from taskkan list //
///////////////////////////////////


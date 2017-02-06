////////////////////////////////////
// Initialize your app Framework7 //
////////////////////////////////////
var myApp = new Framework7({
    
    material:true,
    swipeBackPage:false,
    
});

/////////////////////////////
// Export selectors engine //
/////////////////////////////
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
        // var tasklist = document.getElementById(tab+'list');
        // tasklist.innerHTML = '';
        $$('#'+tab+'list').html('');
        for (var i = 0; i < todos.length; i++) {
            
            // only display tasks with tab set to todo
            if(todos[i].tab === tab){
                var title = todos[i].title;
                var description = todos[i].description;
                var time = todos[i].time;

                $$('#'+tab+'list').append('<li class="swipeout" data-id="'+i+'">'+
                                        '<div class="swipeout-content">'+
                                            '<a href="#" class="item-link item-content openpopover" data-id="'+i+'" data-tab="'+tab+'">'+
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
                                            '<a href="#" class="swipeout-delete" data-id="'+i+'" data-confirm="Are you sure want to delete this task?" data-confirm-title="Delete?" data-close-on-cancel="true">Delete</a>'+
                                        '</div>'+
                                        '<div class="sortable-handler"></div>'+
                                    '</li>');

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

$$(document).on('click','.open-edit-task-popup',function(event) {
    
    console.log('editing');

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
    var tab = todos[i].tab;
    fetchTodo(tab);

    console.log(tab);

    // close the modal
    myApp.closeModal('.popup-edit-task');

    // delete modal from the dom
    $$('.popup-edit-task').remove(); 

}

///////////////////////////////////
// Delete task from taskkan list //
///////////////////////////////////

$$(document).on('delete','.swipeout', function () {
    
    console.log('attempting to delete task');

    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // get the selected tasks index
    var i = $$(this).data('id');

    // get the tab this task is in
    var tab = todos[i].tab;

    // get current amount of tasks in tab this task is in.
    var tabCount = $$('#'+tab+'-count').text();

    // change amount of todos of tab this task was in
    $$('#'+tab+'-count').html(tabCount - 1);

    // remove task from array
    todos.splice(i,1);

    // Add to local stroage
    localStorage.setItem('todos',JSON.stringify(todos));

});

//////////////////////////////////////////
// Add popover on selected task element //
//////////////////////////////////////////

$$(document).on('click', '.openpopover', function(event) {
    event.preventDefault();
    
    // the target element to add the popover to, set to the clicked task 
    var clickedLink = this;

    // get the id of the selected task
    var i = $$(this).data('id');

    // get the tab this task is in
    var tab = $$(this).data('tab');

    // set correct links according to tab task is in
    var popoverLinksHTML = '';
    if(tab === 'todo'){
        popoverLinksHTML = '<ul>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"doing")><i class="icon material-icons color-red">work</i> Move to Doing </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"done")><i class="icon material-icons color-green">done</i> Move to Done</a></li>'+
                            '</ul>';

    }else if(tab === 'doing'){
        popoverLinksHTML = '<ul>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"todo")><i class="icon material-icons color-orange">note</i> Move to Todo </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"done")><i class="icon material-icons color-green">done</i> Move to Done</a></li>'+
                            '</ul>';
                            
    }else if(tab === 'done'){
        popoverLinksHTML = '<ul>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"todo")><i class="icon material-icons color-orange">note</i> Move to Todo </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"done")><i class="icon material-icons color-green">done</i> Move to Doing</a></li>'+
                            '</ul>';
                            
    }

    // build the popoverHTML
    var popoverHTML = '<div class="popover popover-todo" style="width: 200px">'+
                            '<div class="popover-angle"></div>'+
                                '<div class="popover-inner">'+
                                    '<div class="list-block">'+ 
                                        popoverLinksHTML+
                                    '</div>'+
                            '</div>'+
                        '</div>';

    console.log('task-id:' + i + ' | task-tab:' +tab);

    // load/display the popover
    myApp.popover(popoverHTML,clickedLink);

}); 

///////////////////////////////
// move task to selected tab //
///////////////////////////////

function moveTask(i,tab) {
    
    console.log('attempt moving task-id['+i+'] to tab: '+tab);

    // close popover and delete it
    myApp.closeModal('.popover-todo');
    $$('.popover-todo').remove();

    // show loading indicator
    myApp.showIndicator();

    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // get tasks current tab
    var currentTab = todos[i].tab;

    // move task to selected tab
    todos[i].tab = tab;

    // Add to local stroage
    localStorage.setItem('todos',JSON.stringify(todos));    

    // reload affected tabs
    fetchTodo(currentTab);
    fetchTodo(tab);

    // hide the loading indicator
    myApp.hideIndicator();
}

////////////////
// sort tasks //
////////////////

$$(document).on('sortable:sort', '.swipeout', function(event) {
    event.preventDefault();
    
    console.log('startIndex: ' + event.detail.startIndex + " | newIndex: " + event.detail.newIndex);

    // get old position
    var startIndex = event.detail.startIndex;
    
    // get new position
    var newIndex = event.detail.newIndex;

    // get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // perform swapping
    var temp = todos[startIndex];
    todos[startIndex] = todos[newIndex];
    todos[newIndex] = temp;

    console.log(temp);
    console.log(todos[startIndex]);
    console.log(todos[newIndex]);

    // Add to local stroage
    localStorage.setItem('todos',JSON.stringify(todos)); 

});

////////////////////////////////////////////
// disable nav links when in sorting mode //
////////////////////////////////////////////

$$(document).on('sortable:open', '.sortable', function(event) {
    event.preventDefault();
    
    // disable other top nav elements
    $$('.open-popup').addClass('disabled');

    // change the sort button icon
    $$('.toggle-sortable').find('.material-icons').text('close');

});

/////////////////////////////////////////////////
// re-enable nav links when sort mode complete //
/////////////////////////////////////////////////

$$(document).on('sortable:close', '.sortable', function(event) {
    event.preventDefault();
    
    // re-enable other top nav elements
    $$('.open-popup').removeClass('disabled');

    // change the sort button icon
    $$('.toggle-sortable').find('.material-icons').text('sort');    

});
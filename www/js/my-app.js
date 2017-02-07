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
// Init the app //
///////////////////

fetchSettings();
fetchTodo('todo');
fetchTodo('doing');
fetchTodo('done');
var myTimer = new Timer('timeElasped','timeEstimated','btnPauseTimer','Tone');

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

	    // validate unique title
		var boolUniqueTitle = uniqueTitle(newTaskTitle,todos);
		if(boolUniqueTitle == true){
			// Add task to array
	        todos.push(todo);

	        // Add to local stroage
	        localStorage.setItem('todos',JSON.stringify(todos));

	        // reload the todo taskaan list
		    fetchTodo('todo');

		    // close the add new task popup
		    myApp.closeModal('.popup-new-task');

		}else{

			// display message
			myApp.alert('Seems like the Title you entered is not unique. Try a different title','Oops');

		}

    }

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

    
    if(tab === 'doing'){
    	// set the amount of todos
        $$('#'+tab+'-count').data('count', tabCount);
        $$('#'+tab+'-count').text(tabCount + '/' + $$('#'+tab+'-count').data('wip'));

        // set the sum of amount of time task(s) will take
        $$('#timeEstimated').text(addTime());

        // undisable timer if there are tasks to do
        if(tabCount > 0) 
        	$$('.timer-container').removeClass('disabled');
        else
        	$$('.timer-container').addClass('disabled');

    }else{

        $$('#'+tab+'-count').text(''+tabCount);
    }

    console.log(tab+'-count: '+$$('#'+tab+'-count').html());

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

    // get old title
    var oldTitle = todos[i].title;

    // validate unique title
	var boolUniqueTitle = (oldTitle === title) ? true : uniqueTitle(title,todos);
	console.log('boolUniqueTitle: ' + boolUniqueTitle);
	if(boolUniqueTitle){
		
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

	    // close the modal
	    myApp.closeModal('.popup-edit-task');

	    // delete modal from the dom
	    $$('.popup-edit-task').remove(); 


	}else{

		// display message
		myApp.alert('Seems like the Title you entered is not unique. Try a different title','Oops');

	}

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
    var tabCount = (tab == 'doing') ? $$('#'+tab+'-count').data('count') : $$('#'+tab+'-count').text() ;

    // change amount of todos of tab this task was in
    var txt = (tab == 'doing') ? (tabCount - 1) + '/' + $$('#'+tab+'-count').data('wip') : (tabCount - 1) ;
    $$('#'+tab+'-count').text(txt);

    if(tab == 'doing')
        $$('#'+tab+'-count').data('count',tabCount - 1);
    
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
        					  '<li><a href="#" class="list-button item-link view-task" onclick=viewTask('+i+')><i class="icon material-icons color-bluegray">visibility</i> View</a></li>'+	
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"doing")><i class="icon material-icons color-red">work</i> Move to Doing </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"done")><i class="icon material-icons color-green">done</i> Move to Done</a></li>'+
                            '</ul>';

    }else if(tab === 'doing'){
        popoverLinksHTML = '<ul>'+
        					'<li><a href="#" class="list-button item-link view-task" onclick=viewTask('+i+')><i class="icon material-icons color-bluegray">visibility</i> View</a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"todo")><i class="icon material-icons color-orange">note</i> Move to Todo </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"done")><i class="icon material-icons color-green">done</i> Move to Done</a></li>'+
                            '</ul>';
                            
    }else if(tab === 'done'){
        popoverLinksHTML = '<ul>'+
        					'<li><a href="#" class="list-button item-link view-task" onclick=viewTask('+i+')><i class="icon material-icons color-bluegray">visibility</i> View</a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"todo")><i class="icon material-icons color-orange">note</i> Move to Todo </a></li>'+
                              '<li><a href="#" class="list-button item-link" onclick=moveTask('+i+',"doing")><i class="icon material-icons color-green">done</i> Move to Doing</a></li>'+
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

    // check whether wip allows more work
    if(tab === 'doing'){

        var wip = parseInt($$('#doing-count').data('wip'));
        var tabCount = parseInt($$('#doing-count').data('count'));
        var boolMoveTask  = (tabCount < wip) ? true : false ;

        console.log('wip:' + wip + " | tabCount:" + tabCount + " | boolMoveTask:" + boolMoveTask)

        if (boolMoveTask) {
            // Add to local stroage
            localStorage.setItem('todos',JSON.stringify(todos));
        }else{
            // display message
            myApp.alert('You have reached the maximum amount of tasks to be doing. Complete your current task(s) or increase you WIP amount.','Oops');
        }

    }else{
        // Add to local stroage
        localStorage.setItem('todos',JSON.stringify(todos));
    }


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
    $$('.view-task').addClass('disabled');

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
    $$('.view-task').removeClass('disabled');

    // change the sort button icon
    $$('.toggle-sortable').find('.material-icons').text('sort');    

});

///////////////////////
// fetch settings //
///////////////////////

function fetchSettings(){

    console.log('attempting to fetch settings');

    // init the array
    settings = [];

    // set default settings on new install of app
    if(localStorage.getItem('settings') === null){

        console.log('creating default settings');

        var theSettings = {
            wip:2
        }

        // add default settings to array
        settings.push(theSettings);

        // Add to local stroage
        localStorage.setItem('settings',JSON.stringify(settings));

    }else{

        // get the apps settings from local storage
        settings = JSON.parse(localStorage.getItem('settings'));

    }

    console.log(settings[0].wip);

    // load setting
    $$('#doing-count').data('wip',settings[0].wip);
    $$('#wipSetting').val(settings[0].wip);

}

///////////////////
// save settings //
///////////////////

$$(document).on('click', '#saveSettings', function(event) {
    event.preventDefault();
    
    // get new settings from form elements
    var wip = $$('#wipSetting').val();

    // get the apps settings from local storage
    settings = JSON.parse(localStorage.getItem('settings'));

    // set settings
    settings[0].wip = wip;

    // Add to local stroage
    localStorage.setItem('settings',JSON.stringify(settings));

    // reload tabs
    fetchSettings();
    fetchTodo('todo');
	fetchTodo('doing');
	fetchTodo('done');

	// close the popup
	myApp.closeModal('.popup-settings');

});

///////////////////////
// view task details //
///////////////////////

function viewTask(i) {
	
	// close popover and delete it
	myApp.showIndicator()
    myApp.closeModal('.popover-todo');
    $$('.popover-todo').remove();


	// get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // get the tasks info
    var title = todos[i].title;
    var description = todos[i].description;
    var time = todos[i].time;

    // build the views output
    var popupHTML = '<div class="popup popup-view-task">'+
                        '<div class="navbar">'+
                            '<div class="navbar-inner">'+
                                '<div class="left">'+
                                    '<a href="#" class="icon-only link close-popup"><i class="icon icon-back"></i></a>'+
                                '</div>'+
                                '<div class="center">View</div>'+
                           ' </div>'+
                        '</div>'+
                        '<form class="list-block inputs-list" style="margin: auto 0;">'+
                          '<ul>'+
                            '<li>'+
                              '<div class="item-content">'+
                                '<div class="item-inner">'+
                                  '<div class="item-title label">Title</div>'+
                                  '<div class="item-input item-input-field">'+
                                      '<input type="text" name="title" placeholder="Title" value="'+ title +'" class="disabled" >'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</li>'+
                            '<li class="align-top">'+
                              '<div class="item-content">'+
                              	  '<div class="item-inner">'+
                              	  	'<div class="item-title label">Description</div>'+
                                    '<div class="item-input item-input-field">'+
                                      '<textarea name="description"  placeholder="Description" id="editDescription" class="disabled">'+ description +'</textarea>'+
                                    '</div>'+
                                  '</div>'+
                              '</div>'+
                            '</li>'+
                            '<li>'+
                              '<div class="item-content">'+
                                '<div class="item-inner">'+
                                  '<div class="item-title label">Time</div>'+
                                  '<div class="item-input item-input-field">'+
                                      '<input type="time" name="title" placeholder="00:00" value="'+ time +'" class="disabled">'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</li>'+        
                          '</ul>'+
                        '</form>'+
                    '</div>';

    myApp.hideIndicator();
    myApp.popup(popupHTML);
}

///////////////////////////
// validate unique title //
///////////////////////////

function uniqueTitle(title,todos) {
	
	// remove any trailing whitespaces from 
	title = title.trim();
	
	// check whether title is empty
	if(title.length == 0){
		console.log('title is empty | containg whitespaces');
		return false;
	}else{
		
		// check whether title is unique
		for (var i = 0; i < todos.length; i++) {
			if(todos[i].title === title){
				return false;
			}
		}

	}

	return true;

}

//////////////////////////////////////
// Add all times of tasks in doing  //
//////////////////////////////////////

function addTime() {
	
	// get tasks todo from local storage
    var todos = JSON.parse(localStorage.getItem('todos'));

    // init variables to store task time, sum of all seconds
    var seconds = 0;
    var t = 0;

    // get times of tasks
    for (var i = 0; i < todos.length; i++) {
    	
    	// only get times of tasks in doing tab
    	if (todos[i].tab === 'doing') {

    		t = todos[i].time;
    		t = t.split(':');

    		// convert time to seconds and add
    		seconds += parseInt(t[0])*60*60 + parseInt(t[1])*60 + parseInt(t[2]);
    
    	}

    }

    // convert seconds to HH:MM:SS format.
    var m=Math.floor(seconds/60); seconds=seconds%60;
	var h=Math.floor(m/60); m=m%60;
	var d=Math.floor(h/24); h=h%24;
	
	// Add leading zeros to numbers below 10
	d = (d < 10) ? '0'+d:d;
	h = (h < 10) ? '0'+h:h;
	m = (m < 10) ? '0'+m:m;
	seconds = (seconds < 10) ? '0'+seconds:seconds;

	console.log(d+':'+h+':'+m+':'+seconds);

	return d+':'+h+':'+m+':'+seconds;

	/* function logic adapted from blog answer made 23 Jul 2005. url: https://bytes.com/topic/javascript/answers/148262-adding-2-times-together*/
}

/////////////////
// start timer //
/////////////////

$$(document).on('click', '#btnTimer', function(event) {
	event.preventDefault();

	console.log('attempting to start timer');
	console.log('data-running: '+$$('#btnTimer').data('running'));
	
	var running = $$(this).data('running');

	if(running == 'no'){

		myTimer.start();

		// change btnTimer icon
		$$(this).find('.material-icons').text('stop');

		// change data-running to yes
		$$(this).data('running','yes')

		console.log('timer started');

	}else{
		
		myTimer.stop();

		// reset icon
		$$(this).find('.material-icons').text('timer');

		// reset data-running to yes 
		$$(this).data('running','no');

		console.log('timer stoped');

		// if timer was paused reset the icon and data-paused too
		if($$('#btnPauseTimer').data('paused') == 'yes'){

			console.log('timer was paused before stopping, data-paused:' + $$('#btnPauseTimer').data('paused'));

			// change icon
			$$('#btnPauseTimer').find('.material-icons').text('pause');

			// change data-paused to yes
			$$('#btnPauseTimer').data('paused', 'no');
		}

	}

});

/////////////////////
// pause the timer //
/////////////////////

$$(document).on('click', '#btnPauseTimer', function(event) {
	event.preventDefault();
	
	var paused = $$(this).data('paused');

	console.log(myTimer.isrunning());

	// do nothing when timer isnt running
	if (myTimer.isrunning() != true) return;

	if(paused == 'no'){
		
		// pause the timer
		myTimer.pause();

		// change icon
		$$(this).find('.material-icons').text('forward');

		// change data-paused to yes
		$$(this).data('paused', 'yes');

	}else{
		// resume the timer
		myTimer.start();

		// change icon
		$$(this).find('.material-icons').text('pause');

		// change data-paused to yes
		$$(this).data('paused', 'no');

	}

});

////////////////////////////////////////
// the timer prototype object (class) //
////////////////////////////////////////

function Timer(elem,estimatedTime,pausebtn,tone) {
	
	// init element to display time in
	this.elem = elem;

	// init timer private properties
	var d=00;
	var h=00;
	var m=00;
	var s=00;
	var timr;

	// month, year status; false, by defalut
	var mup,hup;

	// setting timer status
	var timrstatus=true; 

	// init timer public methods
	var start = null;
	var pause = null;
	var stop = null;

	// start the timer
	this.start = function(){ 
		if(timrstatus==true){
			timr=setInterval(ticking,1000); /* calls ticking() repeatedly after 1 sec */ 
			timrstatus=false; /* altering timerstatus */

			// remove disabling of pause btn
			$$('#'+pausebtn).removeClass('disabled');
		}
	}

	// pause the timer
	this.pause = function() { 
		clearInterval(timr); /* stop repeated calling of ticking function */ 
		timrstatus=true; /* altering timerstaus */ 
	}

	// stop the timer
	this.stop = function() { 
		clearInterval(timr); /* stop repeated calling of ticking function */ 
		d=00;
		h=00;
		m=00;
		s=00;

		/* resetting all values back to 00 */ 
		$$("#"+elem).text("00:00:00:00");
		timrstatus=true; /* altering timerstaus */ 
	} 

	// return the timers status
	this.isrunning = function() {
		if(d == 00 && h == 00 & m == 00 && s == 00)
			return false;
		else
			return true;
	}

	// perform ticking. called after every 1000ms
	function ticking(){ 

		if(s<59){
			s=s+01;
			mup=false;
			hup=false;
		} /* 1 */ else if(s==59){
			s=00;
			mup=true;
		} /* 2 */ 

		if(mup==true && m<59){
			m=m+01;
		} /* 3 */ else if(mup==true && m==59){
			m=00;
			hup=true;
		} /* 4 */ 

		if(hup==true && h<23){
			h=h+01;
		} /* 5 */ else if(hup==true && h==23){
			h=00;
			d=d+01;
		} /* 6 */ 

		// Add leading zeros to numbers below 10
		d_ = (d < 10) ? '0'+d:d;
		h_ = (h < 10) ? '0'+h:h;
		m_ = (m < 10) ? '0'+m:m;
		s_ = (s < 10) ? '0'+s:s;

		$$("#"+elem).text(d_+":"+h_+":"+m_+":"+s_); 

		playtone();

	}

	// playsound when estimated time is reached
	function playtone() {
		if($$('#'+elem).text() === $$('#'+estimatedTime).text()){
			
			// play the sound
			$$('#'+tone)[0].play();
			
			// pause the timer
			clearInterval(timr); 
			timrstatus=true;

			// dont allow clicking of pause button
			$$('#'+pausebtn).addClass('disabled');

			// display message
			myApp.alert('The estimated time to complete the task(s) has expired.','')

		}
	}

	// - See more at: http://yourravi.com/create-simple-javascript-stopwatch-timer-tutorial-and-download/#sthash.wXPywPTc.dpuf
}

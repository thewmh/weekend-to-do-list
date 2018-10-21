console.log('JS');

let toDoID;

$(document).ready(onReady); 

function onReady() {
    console.log('JQ');
    clickListeners();
    getToDoList();
} // end dependency checks

// setup clickListeners

function clickListeners(){
    $('#btn-addToDo').on('click', function(){
        console.log('in Add To Do Button');
        let task = $('#in-addToDo').val();
        let newToDo = {
            task_desc: task,
            completed: '0'
        };
        addToDo( newToDo );
    });
    $('#showToDoList').on('click', '.btn-completeTask', function(event){
        event.preventDefault();
        console.log('clicked .btn-completeTask');
        toDoID = $(this).closest('tr').data('id');
        console.log(toDoID);
        markToDoComplete( toDoID );
    })
}

// GET for to_do_list

function getToDoList() {
    console.log('in getToDoList function');
    $('#showToDoList').empty();
    $.ajax ({
        method: 'GET',
        url: '/to-do',
    }) .then(function (response) {
        console.log('got to-do list', response);
        for(let todo of response) {
            let newToDo = '';
        if (todo.completed === '1'){
        newToDo = $(`
        <tr>
        <td class="task_desc">${todo.task_desc}</td><td><button class="btn btn-completedTask" type="button" onclick="return false">Task Complete</button></td><td><button class="btn btn-danger deleteTask" type="button">Delete Task</button></td>
        </tr>
        `)
        } else {
            newToDo = $(`
            <tr>
            <td class="task_desc">${todo.task_desc}</td><td><button class="btn btn-success btn-completeTask" type="button" onclick="return false">Mark Complete</button></td><td><button class="btn btn-danger deleteTask" type="button">Delete Task</button></td>
            </tr>
            `)  
        }
        newToDo.data('id', todo.id);
        newToDo.data('completed', todo.completed);
        console.log(newToDo.data('completed'));
        if ( newToDo.data('completed') == '1'){
            $(newToDo).toggleClass('completed', true);
        }
        $('#showToDoList').append(newToDo);
        }
    })
} // end GET for to_do_list

// POST for to_do_list

function addToDo( newToDo ){
    if ($('input').val() !== ''){
    console.log('In addToDo', newToDo);
    $.ajax({
        method: 'POST',
        url: '/to-do',
        data: newToDo
    }).then(function(response) {
        console.log('added new todo to the database', response);
        getToDoList();
        $('input').val('');
    }).catch(function(error) {
        console.log('error adding new todo to the database', error);
    })
} else {
    alert('Please type your to-do in before clicking the button.');
    return false;
}
} // end POST for to_do_list

// PUT for change complete of to_do_list item

function markToDoComplete( toDoID ) {
    console.log('In markToDoComplete', toDoID);
    $.ajax({
        method: 'PUT',
        url: `/to-do/${toDoID}`,
        data: {
            completed: '1'
        }
    }).then(function(response) {
        console.log('updated status of to-do list item to complete', response);
        getToDoList();
    }).catch(function(error) {
        console.log('There was an error marking the to-do list item as complete', error);
    })
} // end PUT for change complete of to_do_list item

// DELETE for to_do_list

function deleteToDoItem( toDoID ) {
    console.log('In deleteToDoItem', toDoID);
    $.ajax({
        method: 'DELETE',
        url: `/to-do/${toDoID}`
    })
}
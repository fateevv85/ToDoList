var addButton = document.querySelector('#add');
// console.log(addButton);
var inputTask = document.querySelector('#new-task');
var unfinishedTasks = document.querySelector('#unfinished-tasks');
var finishedTasks = document.querySelector('#finished-tasks');
var noActiveTasks = document.querySelector('#noActiveTasks');
var noFinishedTasks = document.querySelector('#noFinishedTasks');
var data = load();
var deleteAll = document.querySelector('#deleteAll');

for (var i = 0; i < data.unfinishedTasks.length; i++) {
    var listItem = createNewElement(data.unfinishedTasks[i]);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem);
}

for (var i = 0; i < data.finishedTasks.length; i++) {
    var listItem = createNewElement(data.finishedTasks[i]);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem);
    var tasks = finishedTasks.querySelectorAll('.checkbox');
    for (var j = 0; j < tasks.length; j++) {
        tasks[i].innerText = 'check_box';
    }
}

//todo
//1.delete all tasks button
//2.confirm for delete task

deleteAll.onclick = deleteAllTasks;

function deleteAllTasks() {
    var finishedTasks = document.querySelector('#finished-tasks');
    var numberElements = finishedTasks.children.length;
    if (confirm('Do you want to remove all tasks?')) {
        for (var i = numberElements - 1; i >= 0; i--) {
            finishedTasks.children[i].remove();
            // console.log(i);
        }
    }
    noFinishedTasks.classList.remove("hidden");
    document.querySelector('.deleteAll').classList.add('hidden');
    save();
}

notifyTasks();

addButton.addEventListener('click', addTask);

inputTask.addEventListener('keydown', function (ev) {
    if (ev.keyCode == 13) {
        addTask();
    }
});

/**
 function pressEnter() {
    if (inputTask.focused) {
        console.log('ibput is focused');
    }
}*/

/**
 function test() {
    console.log(inputTask.value);
}*/

function createNewElement(task) {
    var listItem = document.createElement('li');
    var label = document.createElement('label');
    var input = document.createElement('input');

    label.innerText = task;
    input.type = 'text';
    listItem.appendChild(buttonElementTask('checkbox'));
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(buttonElementTask('delete'));
    listItem.appendChild(buttonElementTask('edit'));

    return listItem;
}

function notifyTasks() {
    if (unfinishedTasks.children.length < 1) {
        noActiveTasks.classList.remove('hidden');
    } else {
        noActiveTasks.classList.add('hidden');
    }
    if (finishedTasks.children.length < 1) {
        noFinishedTasks.classList.remove('hidden');
    } else {
        noFinishedTasks.classList.add('hidden');
        document.querySelector('.deleteAll').classList.remove('hidden');
    }
}

function addTask() {
    if (!inputTask.value) {
        return alert('Insert task name!');
    }
    var listItem = createNewElement(inputTask.value);
    unfinishedTasks.insertBefore(listItem, unfinishedTasks.firstChild);
    bindTaskEvents(listItem);
    inputTask.value = '';
    save();
    notifyTasks();
}

function editTask() {
    var taskElement = this.parentNode;
    var input = taskElement.querySelector('input');
    var label = taskElement.querySelector('label');
    var editButton = taskElement.querySelectorAll('button')[2];

    if (!taskElement.classList.contains('editMode')) {
        taskElement.classList.toggle('editMode');
        input.value = label.textContent;
        input.focus();
        editButton.innerText = 'save';

        input.onblur = saveInput;
        input.addEventListener('keydown', function (event) {
            if (event.keyCode == 13) {
                saveInput();
            }
        })

        function saveInput() {
            label.textContent = input.value;
            editButton.innerText = 'edit';
            taskElement.classList.remove('editMode');
            save();
        }
    }
    else {
        taskElement.classList.toggle('editMode');
        label.textContent = input.value;
        editButton.innerText = 'edit';
    }
    save();
    removeEventListener('click', editTask);
}

function deleteTask() {
    this.parentNode.remove();
    save();
    notifyTasks();
}

function finishTask() {
    var listItem = this.parentNode;
    if (!listItem.classList.contains('finished')) {
        listItem.classList.add('finished');
        this.innerText = 'check_box';
        finishedTasks.insertBefore(listItem, finishedTasks.firstChild);
    }
    else {
        this.innerText = 'check_box_outline_blank';
        listItem.classList.remove('finished');
        unfinishedTasks.insertBefore(listItem, unfinishedTasks.firstChild);
    }
    save();
    notifyTasks();
}

function bindTaskEvents(listItem) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');
    var label = listItem.querySelector('label');

    checkbox.onclick = finishTask;
    deleteButton.onclick = deleteTask;
    editButton.addEventListener('click', editTask);
    label.addEventListener('dblclick', editTask);
}

function save() {
    var unfinishedTasksArr = [];
    var finishedTasksArr = [];
    for (var i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr[i] = unfinishedTasks.children[i].children[1].innerText;
    }
    for (var j = 0; j < finishedTasks.children.length; j++) {
        finishedTasksArr.push(finishedTasks.children[j].getElementsByTagName('label')[0].innerText);
    }

    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

function buttonElementTask(action) {
    var button = document.createElement('button');
    button.classList.add('material-icons');

    if (action == 'checkbox') {
        button.classList.add('checkbox');
        button.innerText = 'check_box_outline_blank';
    }
    else if (action == 'delete') {
        button.classList.add('delete');
        button.innerText = 'delete';
    }
    else {
        button.classList.add('edit');
        button.innerText = 'edit';
    }
    return button;
}




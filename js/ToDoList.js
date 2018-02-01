var addButton = document.querySelector('#add');
// console.log(addButton);
var inputTask = document.querySelector('#new-task');
var unfinishedTasks = document.querySelector('#unfinished-tasks');
var finishedTasks = document.querySelector('#finished-tasks');
var noActiveTasks = document.querySelector('#noActiveTasks');
var noFinishedTasks = document.querySelector('#noFinishedTasks');
var data = load();

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

notifyTasks();
//toDo
//кнопка Ентер дожлна отвечать за нажатие определенной
//кнопки в зависимости от полоения курсора
//двойной щелчок на названии задачи
//редактирует ее

 addButton.addEventListener('click', addTask);
 /**
  * addEventListener('keydown', function (ev) {
    if (ev.keyCode == 13) {
        addTask();
    }
});*/


function pressEnter() {
    if (inputTask.focused) {
        console.log('ibput is focused');
    }
}

// document.querySelector('#test').addEventListener('click', save);

function test() {
    console.log(inputTask.value);
}

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
    var editButton = this;

    if (!taskElement.classList.contains('editMode')) {
        taskElement.classList.toggle('editMode');
        input.value = label.textContent;
        input.focus();
        // this.style.display = 'none';
        editButton.innerText = 'save';

        input.onblur = function () {
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

    checkbox.onclick = finishTask;
    deleteButton.onclick = deleteTask;
    editButton.addEventListener('click', editTask);
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




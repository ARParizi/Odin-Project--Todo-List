// import './styles.css';
import { ManagedArray } from "./managedArray.js";

console.log("Hello World from the Todo List project.");

// if (process.env.NODE_ENV === 'production')
//     console.log("We're in production mode!");
// else
//     console.log("We're in development mode.");

const PRIORITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
});

class TodoItem {
    constructor(title, description, date, priority, completed) {
        this.title       = title;
        this.description = description;
        this.date        = date;
        this.priority    = priority;
        this.completed   = completed;
        this.id          = crypto.randomUUID();
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.id    = crypto.randomUUID();
        this.todos = new ManagedArray(TodoItem);
    }
}

const projectArray = new ManagedArray(Project);
const defaultProject = new Project('default project');
projectArray.addItem(defaultProject);

let currentProjectId = defaultProject.id;
const getCurrentProject = () => projectArray.getItemById(currentProjectId);


renderProjectList();
function renderProjectList(){
    const projectList = document.querySelector('#project-list');
    const projectArrayCopy = projectArray.getArray();

    if (projectArrayCopy.length === 0)
        projectList.replaceChildren('');

    for (let ii = 0; ii < projectArrayCopy.length; ii++){
        const newLi   = document.createElement('li');
        const newBtn  = document.createElement('button');
        
        newLi.textContent = projectArrayCopy[ii].title;
        
        newBtn.textContent = 'delete';
        newBtn.type = 'button';
        newBtn.setAttribute('data-id', projectArrayCopy[ii].id.toString());
        newBtn.classList.add('delete-project-button');
        newBtn.addEventListener('click', deleteProjectClicked);
        newLi.appendChild(newBtn);
        newLi.setAttribute('data-id', projectArrayCopy[ii].id.toString());
        newLi.addEventListener('click', liClicked);
        if (ii === 0)
            projectList.replaceChildren(newLi);
        else
            projectList.appendChild(newLi);
    }
}

function liClicked() {
    const id = this.dataset.id;
    console.log(`list item clicked, project id: ${id}`);
    currentProjectId = id;
    const currentProjectHeading = document.querySelector('#current-project-heading');
    currentProjectHeading.textContent = getCurrentProject().title;
    renderTodoContainer();
}
    

function deleteProjectClicked(event){
    event.stopPropagation();
    const id = this.dataset.id;
    projectArray.removeItemById(id);
    renderProjectList();
}


const addProjectButton = document.querySelector('#add-project-button');
const addProjectDialog = document.querySelector('#add-project-dialog');
const addProjectForm   = addProjectDialog.querySelector('form');

addProjectButton.addEventListener('click', () => addProjectDialog.showModal());
addProjectForm  .addEventListener('submit', addProjectFormSubmit);

function addProjectFormSubmit(event) {
    event.preventDefault();
    const title = this.title.value.trim();

    if (title === '')
        throw new Error('new project title is empty');

    projectArray.addItem(new Project(title))
    renderProjectList();

    addProjectDialog.close();
    this.reset();
}


const addTodoButton = document.querySelector('#add-todo-button');
const addTodoDialog = document.querySelector('#add-todo-dialog');
const addTodoForm   = addTodoDialog.querySelector('form');

addTodoButton.addEventListener('click', () => addTodoDialog.showModal());
addTodoForm  .addEventListener('submit', addTodoFormSubmit);

function addTodoFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const todoData = {
      title      : formData.get("title").trim(),
      description: formData.get("description").trim(),
      priority   : formData.get("priority"),
      dueDate    : formData.get("due-date"),
      completed  : formData.get("completed") === "on",
    };
    
    if (todoData.title === '')
        throw new Error('new todo title is empty');

    getCurrentProject().todos.addItem(new TodoItem(
                                                    todoData.title,
                                                    todoData.description,
                                                    todoData.dueDate,
                                                    todoData.priority,
                                                    todoData.completed))
    renderTodoContainer();

    addTodoDialog.close();
    this.reset();
}

function renderTodoContainer() {
    const todoContainer = document.querySelector('#todo-container');
    const todoArray = getCurrentProject().todos.getArray();

    if (todoArray.length === 0)
        todoContainer.replaceChildren('');

    for (let ii = 0; ii < todoArray.length; ii++){
        const newDiv    = document.createElement('div');
        const deleteBtn = document.createElement('button');
        
        newDiv.classList.add('todo-item');
        newDiv.textContent  = 'Title:  ';
        newDiv.textContent += todoArray[ii].title;
        newDiv.textContent += '\nDescription:  ';
        newDiv.textContent += todoArray[ii].description;
        newDiv.textContent += '\nDue Date:  ';
        newDiv.textContent += todoArray[ii].date;
        newDiv.textContent += '\nPriority:  ';
        newDiv.textContent += todoArray[ii].priority;
        newDiv.textContent += '\nCompleted:  ';
        newDiv.textContent += todoArray[ii].completed;
        newDiv.textContent += '\n';
        
        deleteBtn.textContent = 'delete';
        deleteBtn.type = 'button';
        deleteBtn.setAttribute('data-id', todoArray[ii].id.toString());
        deleteBtn.classList.add('delete-todo-button');
        deleteBtn.addEventListener('click', deleteTodoClicked);
        newDiv.appendChild(deleteBtn);

        if (ii === 0)
            todoContainer.replaceChildren(newDiv);
        else
            todoContainer.appendChild(newDiv);
    }
}

function deleteTodoClicked(event) {
    const todoId = this.dataset.id;
    getCurrentProject().todos.removeItemById(todoId);
    renderTodoContainer();
}
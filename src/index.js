// import './styles.css';
import { ManagedArray } from "./managedArray.js";

console.log("Hello World from the Todo List project.");

// if (process.env.NODE_ENV === 'production')
//     console.log("We're in production mode!");
// else
//     console.log("We're in development mode.");

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
projectArray.addItem(new Project('default project'));

let currentProjectId;
const getCurrentProject = () => projectArray.getItemById(currentProjectId);

changeCurrentProject(projectArray.getLastItem().id);

function changeCurrentProject(newId) {
    currentProjectId = newId;
    const currentProjectHeading = document.querySelector('#current-project-heading');
    currentProjectHeading.textContent = getCurrentProject().title;
    renderProjectList();
    renderTodoContainer();
}


function renderProjectList(){
    const projectList = document.querySelector('#project-list');
    const projectArrayCopy = projectArray.getArray();

    if (projectArrayCopy.length === 0)
        projectList.replaceChildren('');

    projectArrayCopy.forEach((element, index) => {
        const newLi   = document.createElement('li');
        const newBtn  = document.createElement('button');
        
        newLi.textContent = element.title;
        
        newBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>`;
        newBtn.type = 'button';
        newBtn.setAttribute('data-id', element.id.toString());
        newBtn.classList.add('delete-project-button');
        newBtn.addEventListener('click', deleteProjectClicked);
        newLi.appendChild(newBtn);
        newLi.setAttribute('data-id', element.id.toString());
        newLi.addEventListener('click', liClicked);

        if(currentProjectId === element.id)
            newLi.classList.add('selected-project');

        if (index === 0)
            projectList.replaceChildren(newLi);
        else
            projectList.appendChild(newLi);
    });
}

function liClicked() {
    const id = this.dataset.id;
    console.log(`list item clicked, project id: ${id}`);
    changeCurrentProject(id);
}
    

function deleteProjectClicked(event){
    event.stopPropagation();
    const id = this.dataset.id;
    projectArray.removeItemById(id);
    renderProjectList();
    
    if(currentProjectId === id){
        changeCurrentProject(projectArray.getLastItem().id);
    }
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
    changeCurrentProject(projectArray.getLastItem().id);
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

    todoArray.forEach((element, index) => {
        const newDiv    = document.createElement('div');
        const deleteBtn = document.createElement('button');
        
        newDiv.classList.add('todo-item');
        newDiv.textContent  = 'Title:  ';
        newDiv.textContent += element.title;
        newDiv.textContent += '\nDescription:  ';
        newDiv.textContent += element.description;
        newDiv.textContent += '\nDue Date:  ';
        newDiv.textContent += element.date;
        newDiv.textContent += '\nPriority:  ';
        newDiv.textContent += element.priority;
        newDiv.textContent += '\nCompleted:  ';
        newDiv.textContent += element.completed;
        newDiv.textContent += '\n';
        
        deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>`;
        deleteBtn.type = 'button';
        deleteBtn.setAttribute('data-id', element.id.toString());
        deleteBtn.classList.add('delete-todo-button');
        deleteBtn.addEventListener('click', deleteTodoClicked);
        newDiv.appendChild(deleteBtn);

        if (index === 0)
            todoContainer.replaceChildren(newDiv);
        else
            todoContainer.appendChild(newDiv);
    });
}

function deleteTodoClicked() {
    const todoId = this.dataset.id;
    getCurrentProject().todos.removeItemById(todoId);
    renderTodoContainer();
}
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
    constructor(title, description, date, priority, completed, projectId) {
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

projectArray.addItem(new Project('default'));

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
        if (ii === 0)
            projectList.replaceChildren(newLi);
        else
            projectList.appendChild(newLi);
    }
}
    

function deleteProjectClicked(event){
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
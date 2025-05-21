// import './styles.css';
import { ManagedArray } from "./managedArray";

console.log("Hello World from the Todo List project.");

if (process.env.NODE_ENV === 'production')
    console.log("We're in production mode!");
else
    console.log("We're in development mode.");

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

const projectList = new ManagedArray(Project);
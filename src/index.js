// import './styles.css';

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
        // this.projectId   = projectId;
    }
}

class Project {
    constructor(title) {
        this.title       = title;
        this.id          = crypto.randomUUID();
        this.todos  = new ManagedArray(TodoItem);
    }
}

class ManagedArray {
    constructor(type) {
        this.type = type;
        this.#array = [];
    }
    #array;
    addItem(item) {
        if (typeof item !== this.type)
            throw new Error("Wrong type in function addItem");
        this.#array.push();
    }
    removeItemById(itemId) {
        for (let ii = 0; ii < this.#array.length; ii++) {
            if (this.#array[ii].id === itemId) {
                this.#array.splice(ii, 1);
                return;
            }
        }
        throw new Error ("item to remove not found");
    }
    getArray = () => this.#array.map(i => i);
}

const projectList = new ManagedArray(Project);
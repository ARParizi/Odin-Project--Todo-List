import './styles.css';

console.log("Hello World from the Todo List project.");

if (process.env.NODE_ENV === 'production')
    console.log("We're in production mode!");
else
    console.log("We're in development mode.");
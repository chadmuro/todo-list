// SELECTORS
const date = document.querySelector('.date');
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');

// UNSPLASH BACKGROUND
// const url = 'https://api.unsplash.com/photos/random?featured&client_id=';
// const mykey = config.MY_KEY;

// const requestUrl= `${url}${mykey}`;

// function getNewImage() {
//     return fetch(requestUrl)
//         .then(res => res.json())
//         .then(data => {
//             document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${data.urls.regular})`;
//         });
// }

// GET CURRENT DATE
let objToday = new Date(),
    weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayOfWeek = weekday[objToday.getDay()],
    dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() : objToday.getDate(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    curMonth = months[objToday.getMonth()],
    curYear = objToday.getFullYear();
let today = `${dayOfWeek}, ${curMonth} ${dayOfMonth}, ${curYear}`;

date.textContent = today;


let todos = [];
let completes = [];
let stars = [];

// INIT
function init(arr1, arr2, arr3) {
    todoList.innerHTML = '';
    arr1.forEach(item => {
        todoList.insertAdjacentHTML('beforeend', `
            <div class="todo starred" id="${item.id}">
            <button class="star-btn star-yellow"><i class="fas fa-star"></i></button>
            <li class="todo-item">${item.text}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="trash-btn"><i class="fas fa-trash"></i></button>
            </div>
        `);
    });
    arr2.forEach(item => {
        todoList.insertAdjacentHTML('beforeend', `
            <div class="todo" id="${item.id}">
            <button class="star-btn"><i class="fas fa-star"></i></button>
            <li class="todo-item">${item.text}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="trash-btn"><i class="fas fa-trash"></i></button>
            </div>
        `);
    });
    arr3.forEach(item => {
        todoList.insertAdjacentHTML('beforeend', `
            <div class="todo completed" id="${item.id}">
            <button class="star-btn"><i class="fas fa-star"></i></button>
            <li class="todo-item">${item.text}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="trash-btn"><i class="fas fa-trash"></i></button>
            </div>
        `);
    });
}


// EVENT LISTENERS
//document.addEventListener('DOMContentLoaded', getNewImage);
document.addEventListener('DOMContentLoaded', getLocalStorage);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);


// FUNCTIONS
function addTodo(e) {
    e.preventDefault();

    const todo = {
        text: todoInput.value,
        id: Date.now()
    };

    if (todo.text !== '') {
        todos.push(todo);   
        init(stars, todos, completes);
    }
    todoInput.value = '';
    saveLocalStorage(stars, todos, completes);
}

function deleteCheck(e) {
    const item = e.target;

    // Delete Todo
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        
        // Animation
        todo.classList.add('fall');
        todo.addEventListener('transitionend', function () {
            todo.remove();
        });
                
        // Remove from arrays
        let nodes = todo.childNodes[3].innerHTML;

        if (!todo.classList.contains('starred') && !todo.classList.contains('completed')) {
            let index = todos.findIndex(x => x.text === nodes);
            todos.splice(index, 1);
        }
        
        if(todo.classList.contains('starred')) {
            let indexStar = stars.findIndex(x => x.text === nodes);
            stars.splice(indexStar, 1);
        }
        
        if(todo.classList.contains('completed')) {
            let indexComplete = completes.findIndex(x => x.text === nodes);
            completes.splice(indexComplete, 1);
        }   
        saveLocalStorage(stars, todos, completes);
    }

    // Complete Todo
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement;

        todo.classList.toggle('completed');

        if(todo.classList.contains('completed')) {
            let nodes = todo.childNodes[3].innerHTML;
            // Create temporary element to add to new array

            if(!todo.classList.contains('starred')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = todos.findIndex(x => x.text === nodes);
                todos.splice(index, 1);
                completes.unshift(tempTodo);
                init(stars, todos, completes);
            }
            if(todo.classList.contains('starred')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = todos.findIndex(x => x.text === nodes);
                stars.splice(index, 1);
                completes.unshift(tempTodo);
                init(stars, todos, completes);
            }
        } 

        if (!todo.classList.contains('completed')) {
            let nodes = todo.childNodes[3].innerHTML;
            // Create temporary element to add to new array
            const tempTodo = {
                text: nodes,
                id: todo.id
            };

            if (todo.classList.contains('starred')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = completes.findIndex(x => x.text === nodes);
                completes.splice(index, 1);
                starss.push(tempTodo);
                init(stars, todos, completes);
            }
            if (!todo.classList.contains('starred')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = completes.findIndex(x => x.text === nodes);
                completes.splice(index, 1);
                todos.push(tempTodo);
                init(stars, todos, completes);
            }
        } 
        saveLocalStorage(stars, todos, completes);
    }

    // Star todo
    if (item.classList[0] === 'star-btn') {
        const todo = item.parentElement;
        item.classList.toggle('star-yellow');
        todo.classList.toggle('starred');
        

        if (todo.classList.contains('starred')) {
            let nodes = todo.childNodes[3].innerHTML;

            if (todo.classList.contains('completed')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = completes.findIndex(x => x.text === nodes);
                completes.splice(index, 1);
                completes.unshift(tempTodo);
                init(stars, todos, completes);
            }
            if (!todo.classList.contains('completed')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = todos.findIndex(x => x.text === nodes);
                todos.splice(index, 1);
                stars.push(tempTodo);
                init(stars, todos, completes);
            }
        }

        if (!todo.classList.contains('starred')) {
            let nodes = todo.childNodes[3].innerHTML;
            // Create temporary element to add to new array
            const tempTodo = {
                text: nodes,
                id: todo.id
            };

            if (todo.classList.contains('completed')) {
                init(stars, todos, completes);
            }
            if (!todo.classList.contains('completed')) {
                const tempTodo = {
                    text: nodes,
                    id: todo.id
                };

                let index = completes.findIndex(x => x.text === nodes);
                stars.splice(index, 1);
                todos.push(tempTodo);
                init(stars, todos, completes);
            }
        } 
        saveLocalStorage(stars, todos, completes);
    }
}


// LOCAL STORAGE FUNCTIONS
function saveLocalStorage(star, todo, complete) {
    localStorage.setItem('stars', JSON.stringify(star));
    localStorage.setItem('todos', JSON.stringify(todo));
    localStorage.setItem('completes', JSON.stringify(complete));
}

function getLocalStorage() {
    stars = JSON.parse(localStorage.getItem('stars')) || [];
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    completes = JSON.parse(localStorage.getItem('completes')) || [];

    init(stars, todos, completes);
}
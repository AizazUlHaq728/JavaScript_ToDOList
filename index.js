let formcontainer= document.getElementById("formContainer");
const taskcontainer= document.getElementById("list");
let TaskIndexes= []; //Indexes to display (all by default, filtered indexes on filter)
let state= 1; // 1 for all items, 2 for all done list, 3 for all undone list
let tasks=[]; // store actual list with it's state(undone, done)

function SaveLocalStorage(){
    localStorage.setItem('Aizazleo8', JSON.stringify(tasks));
}

function LoadLocalStorage(){
    const storedArrayString = localStorage.getItem('Aizazleo8');
    tasks = JSON.parse(storedArrayString);
    console.log(tasks); 
}

// For Adding an item to list
function DisplayForm(){
    formcontainer.style.display = "block";
}

function HideForm(){
    formcontainer.style.display = "none";
}

function AddItem(event) {
    event.preventDefault(); // Prevent the default form submission
    // Get the form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    tasks.push({name:name, isChecked: false });
    event.target.reset();
    console.log(tasks);
    
    SaveLocalStorage();
    TaskIndexes= Array.from({ length: tasks.length }, (value, index) => index);
    DisplayList();
    HideForm();
}

// For Filtering

function handlestate() {
    const dropdown = document.getElementById("dropdown");
    const selectedValue = +dropdown.value;
    // Call your desired function with the selected value here
    state = selectedValue;
    DisplayList();
}

function Filter(checker){
    TaskIndexes= TaskIndexes.filter(value => tasks[value].isChecked == checker);
}


// For up and down movement


function Swap(index1, index2){
    const temp = tasks[index1];
    tasks[index1] = tasks[index2];
    tasks[index2] = temp;
}

function MoveUp(currindex){
    let temp= TaskIndexes.indexOf(currindex);
    
    if(temp !=0){
        Swap(TaskIndexes[temp],TaskIndexes[temp-1]);
    }
    SaveLocalStorage();
    
    DisplayList();
}

function MoveDown(currindex){
    let temp= TaskIndexes.indexOf(currindex);
    if(temp != TaskIndexes.length-1){
        Swap(TaskIndexes[temp],TaskIndexes[temp+1]);
    }
    SaveLocalStorage();
    DisplayList();
}



// For Displaying list


function createListItem(text, index) {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item", "d-flex", "align-items-center");
    liElement.draggable = true;

    const textContainer = document.createElement("div");
    textContainer.classList.add("flex-grow-1");
    textContainer.textContent = text.name;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("d-flex", "gap-2");

    const checkbutton = document.createElement("button");
    checkbutton.classList.add("btn", "btn-sm", "btn-primary", "me-2");
    checkbutton.innerHTML = text.isChecked ? '<i class="fas fa-check"></i> ' : '<i class="fas fa-times"></i> ';
    checkbutton.onclick = function () {
        text.isChecked = !text.isChecked;
        SaveLocalStorage();
        DisplayList();
    };

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> ';
    deleteButton.onclick = function () {
        tasks.splice(index, 1);
        SaveLocalStorage();
        DisplayList();
    };

    const UpButton = document.createElement("button");
    UpButton.classList.add("btn", "btn-sm", "btn-secondary", "me-2");
    UpButton.innerHTML = '<i class="fas fa-arrow-up"></i> ';
    UpButton.onclick = function () {
        MoveUp(index);
        DisplayList();
    };

    const DownButton = document.createElement("button");
    DownButton.classList.add("btn", "btn-sm", "btn-secondary");
    DownButton.innerHTML = '<i class="fas fa-arrow-down"></i> ';
    DownButton.onclick = function () {
        MoveDown(index);
        DisplayList();
    };

    buttonContainer.appendChild(checkbutton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(UpButton);
    buttonContainer.appendChild(DownButton);

    liElement.appendChild(textContainer);
    liElement.appendChild(buttonContainer);

    return liElement;
}




function removeAllChildrenFromDiv() {
    const divElement = document.getElementById("list");
    while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
    }
}


function DisplayList() {
    removeAllChildrenFromDiv();
    LoadLocalStorage();
    if(tasks == null){
        tasks=[];
    }
    const listElement = document.getElementById("list");
 // Create array of length of tasks array and store index as value, If filter, it will only store the actual
 // indexes in tasks array of filtered items onl
  TaskIndexes= Array.from({ length: tasks.length }, (value, index) => index);
  if(state ==1){
    
  }else if(state == 2){
    Filter( true);
  }else if(state == 3){
    Filter(false);
  }

  // Create Only those items available in filtered result. 
  TaskIndexes.forEach(function (index) {
        const task = tasks[index];
        const listItem = createListItem(task, index); // Pass task name and index
        listElement.appendChild(listItem);
    });
    
}

DisplayList();
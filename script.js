const add_task_button = document.getElementById("add_button"); //gets element by id and stores it in variable
//console.log(add_task_button); //used for printing on console
const task_input_box = document.getElementById("input_text");
add_task_button.addEventListener("click", () => {   //creating an event listener for add_task_button
    //console.log("add task button clicked!");
    task_adder();
})
task_input_box.addEventListener("keypress", function(e){ 
    if(e.key === "Enter"){
        e.preventDefault();
        let error_message = document.getElementById("error_message");
        if(error_message.style.display === "block"){
            error_message.style.display = "none";
        }
        task_adder();
    }
})

function task_adder(){
    let input_task = document.getElementById("input_text").value; //getting value (string) input by user
    //console.log(input_task);
    if(task_validation(input_task)){
        const task_list_obj =  JSON.parse(localStorage.getItem("task_key")) || {}; //creating object from string and empty object if recieved null
        //JSon.parse and stringify only works when we get a string value (value must not be null (in case od empty local storage))
        //JSON.parse converts string to obj and JSON.stringify converts object to string
        //json -> java script object notation
       // console.log(task_list_obj);
        const new_key = Date.now(); //gives present time in ms
        task_list_obj[new_key] = {task: input_task, isCompleted: false}; //creating new key-value pair
        //console.log(task_list_obj);
        const task_string_obj = JSON.stringify(task_list_obj); //converting object to string
       // console.log(task_string_obj);   
        //console.log(new_key, task_value);
        localStorage.setItem("task_key", task_string_obj); //storing key-value pair in local storage
        create_card(new_key, input_task, "task_container");
    }
    document.getElementById("input_text").value=""; //for clearing text box after adding task
}

function create_card(key, value, container){
    const container_div = document.getElementById(`${container}`);
    const list_item = document.createElement("div");
    list_item.classList.add("list_item");
    
    let check_box_status = "";
    let text_deco = "none";
    if(container === "completed_task_container"){
        check_box_status = "checked";
        text_deco = "line-through";     
    }
    list_item.innerHTML = `<input id = "${key}" class="check_box" type = "checkbox" ${check_box_status}></input><p style="text-decoration:${text_deco};">${value}</p><button id = "${key}" class="editButton"><img src="edit.svg"></img></button><button id = "${key}" class="delete_button"><img src="delete.svg"></img></button>`
    // console.log(list_item);
   // console.log(tasks_container_div);
    container_div.appendChild(list_item);
    checkChildren("task_container");
    checkChildren("completed_task_container");
    task_completed();
    delete_card();
    editCard();
}
function load_page(){
    const allTask = JSON.parse(localStorage.getItem("task_key")) || {};
    for (const id in allTask) {
        let status = allTask[id].isCompleted;
        if(status == false){
            create_card(id, allTask[id].task , "task_container");
        }
        else{
            create_card(id, allTask[id].task, "completed_task_container");
        }
    }
}

function delete_card(){
    let delete_button_class = document.getElementsByClassName("delete_button");
    Array.from(delete_button_class).forEach((e) => {
    e.addEventListener("click",() => {
        const task_id_obj = JSON.parse(localStorage.getItem("task_key")) || {};
        delete task_id_obj[e.id];
        localStorage.setItem('task_key', JSON.stringify(task_id_obj));
        e.parentElement.remove();
        checkChildren("task_container");
        checkChildren("completed_task_container");
    });
   })
}

function task_completed(){
    const tasks = document.getElementsByClassName("check_box");
    Array.from(tasks).forEach((checkBox) => {
        checkBox.addEventListener("change", () => {
            const taskElement = checkBox.nextSibling;
            if(checkBox.checked){
                taskElement.style.textDecoration = "line-through";
                taskElement.parentElement.remove();
                document.getElementById("completed_task_container").append(taskElement.parentElement);
                
                const task_list_obj = JSON.parse(localStorage.getItem("task_key")) || {};
                task_list_obj[checkBox.id].isCompleted = true;
                localStorage.setItem("task_key",JSON.stringify(task_list_obj));
            }
            else{
                taskElement.style.textDecoration = "none";
                taskElement.parentElement.remove();             
                document.getElementById("task_container").append(taskElement.parentElement);
                
                const task_list_obj = JSON.parse(localStorage.getItem("task_key")) || {};
                task_list_obj[checkBox.id].isCompleted = false;
                localStorage.setItem("task_key", JSON.stringify(task_list_obj));
            }
            checkChildren("task_container");
            checkChildren("completed_task_container");
        })
    })
}

function task_validation(input_task){
    let trimmed_text = input_task.trim();
    if(trimmed_text.length == 0){
        error_message();
        return 0;
    }
    else{
        return 1;
    }
}

function error_message(){
    const error_message = document.getElementById("error_message");
    error_message.style.display = "block";
    document.getElementById("input_text").addEventListener("click", () => {
        error_message.style.display = "none";
    })
}

function checkChildren(container){
    const containerElement = document.getElementById(`${container}`);
    let childCount = containerElement.childElementCount;
    const containerHead = containerElement.previousElementSibling;
    if(childCount == 0){
        containerHead.hidden = true;
    }
    else{
        let headText = "COMPLETED TASKS";
        if(container == "task_container"){
            headText = "INCOMPLETE TASKS";
        }
        containerHead.innerText = (`${headText} (${childCount})`);
        containerHead.hidden = false;
    }
}

function hideErrorMsg(element){
element.addEventListener("click", function(e){ 
        e.preventDefault();
        let error_message = document.getElementById("error_message");
        if(error_message.style.display === "block"){
            error_message.style.display = "none";
        }
    })
}

function editCard(){
    let editButtonClass = document.getElementsByClassName("editButton");
    Array.from(editButtonClass).forEach((tsk) => {
    tsk.addEventListener("click",() => {
        
        taskId = tsk.id;
        const task_obj = JSON.parse(localStorage.getItem("task_key"))||{};
        let currText = task_obj[taskId].task;
        const task_container = tsk.parentElement;
        if(!task_container){
            return;
        }
        const taskPara = task_container.querySelector("p");
        const deleteBtn = task_container.querySelector(".delete_button");
        const checkBox = task_container.querySelector("input");
        checkBox.hidden = true;

        const saveBtn = document.createElement("button");
        saveBtn.classList.add("saveBtn");
        saveBtn.innerHTML = `<img src="save.svg"></img>`;

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancelBtn");
        cancelBtn.innerHTML = `<img src="cancel.svg"></img>`;
        hideErrorMsg(cancelBtn);

        const inputBox = document.createElement("input");
        inputBox.name = "ipBox";
        inputBox.type = "text";
        inputBox.value = currText;
        inputBox.classList.add("inputBox");
        hideErrorMsg(inputBox);

        inputBox.addEventListener("keypress",(e)=>{
            if(e.key === "Enter"){
                e.preventDefault();
                saveBtn.click();
            }
        })

        taskPara.replaceWith(inputBox);
        tsk.replaceWith(saveBtn);
        deleteBtn.replaceWith(cancelBtn);

        saveBtn.addEventListener("click",(sBtn)=>{
            const newText = inputBox.value;
            if(task_validation(newText)){
                taskPara.innerText = newText;
                task_obj[taskId].task = newText;
                localStorage.setItem("task_key",JSON.stringify(task_obj));
                inputBox.replaceWith(taskPara);
                saveBtn.replaceWith(tsk);
                cancelBtn.replaceWith(deleteBtn);
                checkBox.hidden = false;
            }
        })

        cancelBtn.addEventListener("click",()=>{
            inputBox.replaceWith(taskPara);
            saveBtn.replaceWith(tsk);
            cancelBtn.replaceWith(deleteBtn);
            checkBox.hidden = false;
        })
        

        localStorage.setItem('task_key', JSON.stringify(task_obj));
    });
   })
}

load_page();
checkChildren("task_container");
checkChildren("completed_task_container");
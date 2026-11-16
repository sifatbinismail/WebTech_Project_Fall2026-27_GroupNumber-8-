console.log("Manager.js Connected");

// room type gulo, price shoho
let roomTypes = [
    { name: "Standard", price: 50 },
    { name: "Deluxe", price: 90 },
    { name: "Suite", price: 150 }
];

// room er data array te rakhsi, page reload dile abar shuru theke hobe
let rooms = [
    { id: 1, number: "101", type: "Standard", floor: 1, status: "Available" },
    { id: 2, number: "102", type: "Standard", floor: 1, status: "Occupied" },
    { id: 3, number: "201", type: "Deluxe", floor: 2, status: "Occupied" },
    { id: 4, number: "301", type: "Suite", floor: 3, status: "Maintenance" }
];

// task er data
let tasks = [
    { id: 1, room: "301", task: "Fix air conditioner", assignedTo: "Karim", status: "Pending" },
    { id: 2, room: "101", task: "Clean bathroom", assignedTo: "Rina", status: "Done" }
];

let nextRoomId = 5;
let nextTaskId = 3;
let editRoomId = 0;   // 0 mane notun room add korsi, 0 na hole oi id er room edit korsi
let editTaskId = 0;   // 0 mane notun task add korsi

// Page load hole prothome dropdown bhore ar table gulo dekhai
document.addEventListener("DOMContentLoaded", function () {
    loadTypeOptions();
    refreshAll();
});

// data change hole shob abar dekhai
function refreshAll() {
    loadRoomOptions();
    showRooms();
    showTasks();
}

// sidebar e click korle ekta section dekhai, arekta hide kori
function showSection(name) {
    document.getElementById("roomsSection").style.display = "none";
    document.getElementById("tasksSection").style.display = "none";
    document.getElementById("menuRooms").className = "";
    document.getElementById("menuTasks").className = "";

    // jeta click korsi sheta show kori
    if (name == "tasks") {
        document.getElementById("tasksSection").style.display = "block";
        document.getElementById("menuTasks").className = "active";
    } else {
        document.getElementById("roomsSection").style.display = "block";
        document.getElementById("menuRooms").className = "active";
    }
    return false;   // false dilam jate page upore jump na kore
}

// room type er nam diye price ber kori
function getPrice(typeName) {
    for (let i = 0; i < roomTypes.length; i++) {
        if (roomTypes[i].name == typeName) {
            return roomTypes[i].price;
        }
    }
    return 0;
}

// id diye room ta array er koto number e ache ber kori
function findRoomIndex(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) {
            return i;
        }
    }
    return -1;
}

// id diye task ta array er koto number e ache ber kori
function findTaskIndex(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return i;
        }
    }
    return -1;
}

// oi room e kono pending task ache kina dekhi
function roomHasPendingTask(number) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].room == number && tasks[i].status == "Pending") {
            return true;
        }
    }
    return false;
}

// room type er dropdown bhore dei
function loadTypeOptions() {
    let text = "";
    for (let i = 0; i < roomTypes.length; i++) {
        text += "<option value='" + roomTypes[i].name + "'>" + roomTypes[i].name + " ($" + roomTypes[i].price + ")</option>";
    }
    document.getElementById("RoomType").innerHTML = text;
}

// task form er room dropdown e ekhon jei room gulo ache sheigulo dei
function loadRoomOptions() {
    let select = document.getElementById("TaskRoom");
    let old = select.value;
    let text = "";
    for (let i = 0; i < rooms.length; i++) {
        text += "<option value='" + rooms[i].number + "'>" + rooms[i].number + " (" + rooms[i].type + ")</option>";
    }
    select.innerHTML = text;
    // age jei room select kora chilo sheta thakle sheta abar select kori
    if (old != "") {
        select.value = old;
    }
}
// kotogula room ache dekhbo je oitar kaj ta korchi 
function showRooms() {
    let search = document.getElementById("SearchRoom").value.trim();
    let filter = document.getElementById("FilterStatus").value;

    let table = document.getElementById("roomTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    let count = 0;
    for (let i = 0; i < rooms.length; i++) {
        let r = rooms[i];
        if (filter != "All" && r.status != filter) {
            continue;
        }
        if (search != "" && r.number.indexOf(search) == -1) {
            continue;
        }
        let row = table.insertRow();
        row.insertCell().innerHTML = r.number;
        row.insertCell().innerHTML = r.type;
        row.insertCell().innerHTML = r.floor;
        row.insertCell().innerHTML = "$" + getPrice(r.type);
        row.insertCell().innerHTML = "<span class='badge " + r.status + "'>" + r.status + "</span>";
        row.insertCell().innerHTML = "<button onclick='editRoom(" + r.id + ")'>Edit</button><button class='danger' onclick='deleteRoom(" + r.id + ")'>Delete</button>";
        count++;
    }
    if (count == 0) {
        let cell = table.insertRow().insertCell();
        cell.colSpan = 6;
        cell.innerHTML = "No rooms found";
    }
}

// room form er data thik ache kina dekhi
function validateRoom() {
    let number = document.getElementById("RoomNumber").value.trim();
    let floorText = document.getElementById("RoomFloor").value;
    let floor = Number(floorText);
    let error = document.getElementById("RoomError");

    if (number == "") {
        error.innerHTML = "Enter the room number";
        return false;
    }
    if (/^[0-9]{3,4}$/.test(number) == false) {
        error.innerHTML = "Room number must be 3 or 4 digits";
        return false;
    }
    // ei number er room ager theke ache kina, edit korle nijer ta bad dei
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].number == number && rooms[i].id != editRoomId) {
            error.innerHTML = "This room number already exists";
            return false;
        }
    }
    if (floorText === "") {
        error.innerHTML = "Enter the floor";
        return false;
    }
     if (floor < 1 || floor > 20 || floor != Math.floor(floor)) {
        error.innerHTML = "Floor must be a whole number from 1 to 20";
        return false;
    }

    error.innerHTML = "";
    return true;
}

// Add Room button, notun room add kori, edit korle update kori
function addRoom() {
    document.getElementById("RoomMsg").innerHTML = "";
    if (validateRoom() == false) {
        return;
    }
    let number = document.getElementById("RoomNumber").value.trim();
    let type = document.getElementById("RoomType").value;
    let floor = Number(document.getElementById("RoomFloor").value);
    let status = document.getElementById("RoomStatus").value;
    let msg = "";

    if (editRoomId == 0) {
        rooms.push({ id: nextRoomId, number: number, type: type, floor: floor, status: status });
        nextRoomId++;
        msg = "Room " + number + " added.";
    } else {
        let index = findRoomIndex(editRoomId);
        let oldNumber = rooms[index].number;
        rooms[index].number = number;
        rooms[index].type = type;
        rooms[index].floor = floor;
        rooms[index].status = status;

        // room er number change hole task gulor room number-o change kori
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].room == oldNumber) {
                tasks[i].room = number;
            }
        }
        msg = "Room " + number + " updated.";
    }
    clearRoomForm();
    refreshAll();
    document.getElementById("RoomMsg").innerHTML = msg;
}

// Edit e click korle room er data form e boshai
function editRoom(id) {
    let index = findRoomIndex(id);
    editRoomId = id;
    document.getElementById("RoomNumber").value = rooms[index].number;
    document.getElementById("RoomType").value = rooms[index].type;
    document.getElementById("RoomFloor").value = rooms[index].floor;
    document.getElementById("RoomStatus").value = rooms[index].status;
    document.getElementById("RoomMode").innerHTML = "Mode: Editing room " + rooms[index].number;
    document.getElementById("RoomError").innerHTML = "";
    document.getElementById("RoomMsg").innerHTML = "";
}

// room delete korar age kichu check kori
function deleteRoom(id) {
    let index = findRoomIndex(id);
    let number = rooms[index].number;

    if (rooms[index].status == "Occupied") {
        alert("Room " + number + " is occupied. Change its status before deleting.");
        return;
    }
    if (roomHasPendingTask(number)) {
        alert("Room " + number + " has pending tasks. Finish or delete the tasks first.");
        return;
    }
    if (confirm("Delete room " + number + "?") == false) {
        return;
    }

    // oi room ta bad diye notun array banai
    let newRooms = [];
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id != id) {
            newRooms.push(rooms[i]);
        }
    }
    rooms = newRooms;

    // oi room er task gulo-o bad dei
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].room != number) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;

    if (editRoomId == id) {
        clearRoomForm();
    }
    refreshAll();
    document.getElementById("RoomMsg").innerHTML = "Room " + number + " deleted.";
}

function clearRoomForm() {
    editRoomId = 0;
    document.getElementById("RoomNumber").value = "";
    document.getElementById("RoomFloor").value = "";
    document.getElementById("RoomType").selectedIndex = 0;
    document.getElementById("RoomStatus").value = "Available";
    document.getElementById("RoomError").innerHTML = "";
    document.getElementById("RoomMsg").innerHTML = "";
    document.getElementById("RoomMode").innerHTML = "Mode: Add new room";
}

function showTasks() {
    let filter = document.getElementById("FilterTask").value;

    let table = document.getElementById("taskTable");
    while (table.rows.length > 1) {      // header row thakbe, baki muche felbo
        table.deleteRow(1);
    }

    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        let t = tasks[i];
        if (filter != "All" && t.status != filter) {
            continue;
        }
        let buttons = "";
        if (t.status == "Pending") {
            buttons += "<button onclick='markDone(" + t.id + ")'>Mark Done</button>";
        }
        buttons += "<button onclick='editTask(" + t.id + ")'>Edit</button>";
        buttons += "<button class='danger' onclick='deleteTask(" + t.id + ")'>Delete</button>";

        let row = table.insertRow();
        row.insertCell().innerHTML = t.room;
        row.insertCell().innerHTML = t.task;
        row.insertCell().innerHTML = t.assignedTo;
        row.insertCell().innerHTML = "<span class='badge " + t.status + "'>" + t.status + "</span>";
        row.insertCell().innerHTML = buttons;
        count++;
    }
    if (count == 0) {
        let cell = table.insertRow().insertCell();
        cell.colSpan = 5;
        cell.innerHTML = "No tasks found";
    }
}

// task form er data thik ache kina 
function validateTask() {
    let room = document.getElementById("TaskRoom").value;
    let text = document.getElementById("TaskText").value.trim();
    let worker = document.getElementById("TaskWorker").value.trim();
    let error = document.getElementById("TaskError");

    if (room == "") {
        error.innerHTML = "Add a room first, then select it";
        return false;
    }
    if (text == "") {
        error.innerHTML = "Enter the task";
        return false;
    }
    if (text.length < 5) {
        error.innerHTML = "Task must be at least 5 characters";
        return false;
    }
    if (worker == "") {
        error.innerHTML = "Enter the staff name";
        return false;
    }
    if (worker.length < 3) {
        error.innerHTML = "Name must be at least 3 characters";
        return false;
    }

    error.innerHTML = "";
    return true;
}

// Add Task button, notun task add kori, edit korle update kori
function addTask() {
    document.getElementById("TaskMsg").innerHTML = "";
    if (validateTask() == false) {
        return;
    }
    let room = document.getElementById("TaskRoom").value;
    let text = document.getElementById("TaskText").value.trim();
    let worker = document.getElementById("TaskWorker").value.trim();
    let status = document.getElementById("TaskStatus").value;
    let msg = "";

    if (editTaskId == 0) {
        tasks.push({ id: nextTaskId, room: room, task: text, assignedTo: worker, status: status });
        nextTaskId++;
        msg = "Task added.";
    } else {
        let index = findTaskIndex(editTaskId);
        tasks[index].room = room;
        tasks[index].task = text;
        tasks[index].assignedTo = worker;
        tasks[index].status = status;
        msg = "Task updated.";
    }
    clearTaskForm();
    refreshAll();
    document.getElementById("TaskMsg").innerHTML = msg;
}

// Edit e click korle task er data form e boshai
function editTask(id) {
    let index = findTaskIndex(id);
    editTaskId = id;
    document.getElementById("TaskRoom").value = tasks[index].room;
    document.getElementById("TaskText").value = tasks[index].task;
    document.getElementById("TaskWorker").value = tasks[index].assignedTo;
    document.getElementById("TaskStatus").value = tasks[index].status;
    document.getElementById("TaskMode").innerHTML = "Mode: Editing task of room " + tasks[index].room;
    document.getElementById("TaskError").innerHTML = "";
    document.getElementById("TaskMsg").innerHTML = "";
}

// task delete kori
function deleteTask(id) {
    if (confirm("Delete this task?") == false) {
        return;
    }
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id != id) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    if (editTaskId == id) {
        clearTaskForm();
    }
    refreshAll();
    document.getElementById("TaskMsg").innerHTML = "Task deleted.";
}

// task done kori. room Maintenance e thakle ar kono pending task na thakle room Available kore dei
function markDone(id) {
    let index = findTaskIndex(id);
    tasks[index].status = "Done";
    let msg = "Task marked as done.";

    let roomNumber = tasks[index].room;
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].number == roomNumber && rooms[i].status == "Maintenance") {
            if (roomHasPendingTask(roomNumber) == false) {
                rooms[i].status = "Available";
                msg = "Task done. Room " + roomNumber + " is Available again.";
            }
        }
    }
    refreshAll();
    document.getElementById("TaskMsg").innerHTML = msg;
}

// task form ta faka kori
function clearTaskForm() {
    editTaskId = 0;
    document.getElementById("TaskText").value = "";
    document.getElementById("TaskWorker").value = "";
    document.getElementById("TaskStatus").value = "Pending";
    document.getElementById("TaskError").innerHTML = "";
    document.getElementById("TaskMsg").innerHTML = "";
    document.getElementById("TaskMode").innerHTML = "Mode: Add new task";
}

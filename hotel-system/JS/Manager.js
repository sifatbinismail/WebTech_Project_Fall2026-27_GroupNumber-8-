console.log("Manager.js Connected");
let roomTypes = [
    { name: "Standard", price: 50 },
    { name: "Deluxe", price: 90 },
    { name: "Suite", price: 150 }
];

let rooms = [
    { id: 1, number: "101", type: "Standard", floor: 1, status: "Available" },
    { id: 2, number: "102", type: "Standard", floor: 1, status: "Occupied" },
    { id: 3, number: "201", type: "Deluxe", floor: 2, status: "Occupied" },
    { id: 4, number: "301", type: "Suite", floor: 3, status: "Maintenance" }
];

let tasks = [
    { id: 1, room: "301", task: "Fix air conditioner", assignedTo: "Karim", status: "Pending" },
    { id: 2, room: "101", task: "Clean bathroom", assignedTo: "Rina", status: "Done" }
];

let nextRoomId = 5;
let nextTaskId = 3;
let editRoomId = 0;   // 0 means "adding a new room"
let editTaskId = 0;   // 0 means "adding a new task"

document.addEventListener("DOMContentLoaded", function () {
    loadTypeOptions();
    refreshAll();
});

function refreshAll() {
    loadRoomOptions();
    showReport();
    showRooms();
    showSummary();
    showTasks();
}

function showSection(name) {
    document.getElementById("roomsSection").style.display = "none";
    document.getElementById("tasksSection").style.display = "none";
    document.getElementById("menuRooms").className = "";
    document.getElementById("menuTasks").className = "";

    if (name == "tasks") {
        document.getElementById("tasksSection").style.display = "block";
        document.getElementById("menuTasks").className = "active";
    } else {
        document.getElementById("roomsSection").style.display = "block";
        document.getElementById("menuRooms").className = "active";
    }
    return false;
}

function getPrice(typeName) {
    for (let i = 0; i < roomTypes.length; i++) {
        if (roomTypes[i].name == typeName) {
            return roomTypes[i].price;
        }
    }
    return 0;
}

function findRoomIndex(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) {
            return i;
        }
    }
    return -1;
}

function findTaskIndex(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return i;
        }
    }
    return -1;
}

function roomHasPendingTask(number) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].room == number && tasks[i].status == "Pending") {
            return true;
        }
    }
    return false;
}

function loadTypeOptions() {
    let text = "";
    for (let i = 0; i < roomTypes.length; i++) {
        text += "<option value='" + roomTypes[i].name + "'>" + roomTypes[i].name + " ($" + roomTypes[i].price + ")</option>";
    }
    document.getElementById("RoomType").innerHTML = text;
}

function loadRoomOptions() {
    let select = document.getElementById("TaskRoom");
    let old = select.value;
    let text = "";
    for (let i = 0; i < rooms.length; i++) {
        text += "<option value='" + rooms[i].number + "'>" + rooms[i].number + " (" + rooms[i].type + ")</option>";
    }
    select.innerHTML = text;
    select.value = old;
}

function showReport() {
    let available = 0;
    let occupied = 0;
    let maintenance = 0;
    let revenue = 0;
    let pending = 0;

    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].status == "Available") {
            available++;
        } else if (rooms[i].status == "Occupied") {
            occupied++;
            revenue += getPrice(rooms[i].type);
        } else {
            maintenance++;
        }
    }
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "Pending") {
            pending++;
        }
    }

    let percent = 0;
    if (rooms.length > 0) {
        percent = Math.round((occupied / rooms.length) * 100);
    }

    let text = "";
    text += "<div class='mgr-stat'><b>" + rooms.length + "</b>Total Rooms</div>";
    text += "<div class='mgr-stat'><b>" + available + "</b>Available</div>";
    text += "<div class='mgr-stat'><b>" + occupied + "</b>Occupied</div>";
    text += "<div class='mgr-stat'><b>" + maintenance + "</b>Maintenance</div>";
    text += "<div class='mgr-stat'><b>" + percent + "%</b>Occupancy</div>";
    text += "<div class='mgr-stat'><b>$" + revenue + "</b>Night Revenue</div>";
    text += "<div class='mgr-stat'><b>" + pending + "</b>Pending Tasks</div>";
    document.getElementById("reportBox").innerHTML = text;
}

function showRooms() {
    let search = document.getElementById("SearchRoom").value.trim();
    let filter = document.getElementById("FilterStatus").value;

    let text = "<table class='datatable'>";
    text += "<tr><th>Room No</th><th>Type</th><th>Floor</th><th>Price</th><th>Status</th><th>Action</th></tr>";

    let count = 0;
    for (let i = 0; i < rooms.length; i++) {
        let r = rooms[i];
        if (filter != "All" && r.status != filter) {
            continue;
        }
        if (search != "" && r.number.indexOf(search) == -1) {
            continue;
        }
        text += "<tr>";
        text += "<td>" + r.number + "</td>";
        text += "<td>" + r.type + "</td>";
        text += "<td>" + r.floor + "</td>";
        text += "<td>$" + getPrice(r.type) + "</td>";
        text += "<td><span class='badge " + r.status + "'>" + r.status + "</span></td>";
        text += "<td><button onclick='editRoom(" + r.id + ")'>Edit</button>";
        text += "<button class='danger' onclick='deleteRoom(" + r.id + ")'>Delete</button></td>";
        text += "</tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='6'>No rooms found</td></tr>";
    }
    text += "</table>";
    document.getElementById("roomTable").innerHTML = text;
}

function validateRoom() {
    let ok = true;
    let number = document.getElementById("RoomNumber").value.trim();
    let floorText = document.getElementById("RoomFloor").value;
    let floor = Number(floorText);
    let errNumber = document.getElementById("RoomNumberError");
    let errFloor = document.getElementById("RoomFloorError");
    errNumber.innerHTML = "";
    errFloor.innerHTML = "";

    if (number == "") {
        errNumber.innerHTML = "Enter the room number";
        ok = false;
    } else if (/^[0-9]{3,4}$/.test(number) == false) {
        errNumber.innerHTML = "Room number must be 3 or 4 digits";
        ok = false;
    } else {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].number == number && rooms[i].id != editRoomId) {
                errNumber.innerHTML = "This room number already exists";
                ok = false;
            }
        }
    }

    if (floorText === "") {
        errFloor.innerHTML = "Enter the floor";
        ok = false;
    } else if (floor < 1 || floor > 20 || floor != Math.floor(floor)) {
        errFloor.innerHTML = "Floor must be a whole number from 1 to 20";
        ok = false;
    }
    return ok;
}

function saveRoom() {
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

function editRoom(id) {
    let index = findRoomIndex(id);
    editRoomId = id;
    document.getElementById("RoomNumber").value = rooms[index].number;
    document.getElementById("RoomType").value = rooms[index].type;
    document.getElementById("RoomFloor").value = rooms[index].floor;
    document.getElementById("RoomStatus").value = rooms[index].status;
    document.getElementById("RoomMode").innerHTML = "Mode: Editing room " + rooms[index].number;
    document.getElementById("RoomNumberError").innerHTML = "";
    document.getElementById("RoomFloorError").innerHTML = "";
    document.getElementById("RoomMsg").innerHTML = "";
}

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

    let newRooms = [];
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id != id) {
            newRooms.push(rooms[i]);
        }
    }
    rooms = newRooms;

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
    document.getElementById("RoomNumberError").innerHTML = "";
    document.getElementById("RoomFloorError").innerHTML = "";
    document.getElementById("RoomMsg").innerHTML = "";
    document.getElementById("RoomMode").innerHTML = "Mode: Add new room";
}

function showSummary() {
    let pending = 0;
    let done = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "Pending") {
            pending++;
        } else {
            done++;
        }
    }
    let text = "";
    text += "<div class='mgr-stat wide'><b>" + tasks.length + "</b>Total Tasks</div>";
    text += "<div class='mgr-stat wide'><b>" + pending + "</b>Pending</div>";
    text += "<div class='mgr-stat wide'><b>" + done + "</b>Done</div>";
    document.getElementById("taskSummary").innerHTML = text;
}

function showTasks() {
    let filter = document.getElementById("FilterTask").value;
    let text = "<table class='datatable'>";
    text += "<tr><th>Room</th><th>Task</th><th>Assigned To</th><th>Status</th><th>Action</th></tr>";

    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        let t = tasks[i];
        if (filter != "All" && t.status != filter) {
            continue;
        }
        text += "<tr>";
        text += "<td>" + t.room + "</td>";
        text += "<td>" + t.task + "</td>";
        text += "<td>" + t.assignedTo + "</td>";
        text += "<td><span class='badge " + t.status + "'>" + t.status + "</span></td>";
        text += "<td>";
        if (t.status == "Pending") {
            text += "<button onclick='markDone(" + t.id + ")'>Mark Done</button>";
        }
        text += "<button onclick='editTask(" + t.id + ")'>Edit</button>";
        text += "<button class='danger' onclick='deleteTask(" + t.id + ")'>Delete</button>";
        text += "</td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='5'>No tasks found</td></tr>";
    }
    text += "</table>";
    document.getElementById("taskTable").innerHTML = text;
}

function validateTask() {
    let ok = true;
    let room = document.getElementById("TaskRoom").value;
    let text = document.getElementById("TaskText").value.trim();
    let worker = document.getElementById("TaskWorker").value.trim();
    let errRoom = document.getElementById("TaskRoomError");
    let errText = document.getElementById("TaskTextError");
    let errWorker = document.getElementById("TaskWorkerError");
    errRoom.innerHTML = "";
    errText.innerHTML = "";
    errWorker.innerHTML = "";

    if (room == "") {
        errRoom.innerHTML = "Add a room first, then select it";
        ok = false;
    }
    if (text == "") {
        errText.innerHTML = "Enter the task";
        ok = false;
    } else if (text.length < 5) {
        errText.innerHTML = "Task must be at least 5 characters";
        ok = false;
    }
    if (worker == "") {
        errWorker.innerHTML = "Enter the staff name";
        ok = false;
    } else if (worker.length < 3) {
        errWorker.innerHTML = "Name must be at least 3 characters";
        ok = false;
    }
    return ok;
}

function saveTask() {
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

function editTask(id) {
    let index = findTaskIndex(id);
    editTaskId = id;
    document.getElementById("TaskRoom").value = tasks[index].room;
    document.getElementById("TaskText").value = tasks[index].task;
    document.getElementById("TaskWorker").value = tasks[index].assignedTo;
    document.getElementById("TaskStatus").value = tasks[index].status;
    document.getElementById("TaskMode").innerHTML = "Mode: Editing task of room " + tasks[index].room;
    document.getElementById("TaskRoomError").innerHTML = "";
    document.getElementById("TaskTextError").innerHTML = "";
    document.getElementById("TaskWorkerError").innerHTML = "";
    document.getElementById("TaskMsg").innerHTML = "";
}

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

function clearTaskForm() {
    editTaskId = 0;
    document.getElementById("TaskText").value = "";
    document.getElementById("TaskWorker").value = "";
    document.getElementById("TaskStatus").value = "Pending";
    document.getElementById("TaskRoomError").innerHTML = "";
    document.getElementById("TaskTextError").innerHTML = "";
    document.getElementById("TaskWorkerError").innerHTML = "";
    document.getElementById("TaskMsg").innerHTML = "";
    document.getElementById("TaskMode").innerHTML = "Mode: Add new task";
}

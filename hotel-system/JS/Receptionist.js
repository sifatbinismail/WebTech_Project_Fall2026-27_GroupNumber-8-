console.log("Receptionist.js Connected");
// JS/Receptionist.js - Receptionist owner only.
// Features: Reservations CRUD, availability check, check-in / check-out, invoice, history.
// Only things taught in class: arrays of objects, for loop, if/else, switch, getElementById, innerHTML, .style, onclick.
// Data is kept in arrays (in memory, resets on refresh). In the final term PHP + database will store it.
// Common.js must be loaded BEFORE this file (it gives showError, clearError, safeText, validateName, validatePhone).

// ---------- DATA (same room types and rooms as the Manager portal) ----------
let roomTypes = [
    { name: "Standard", price: 50 },
    { name: "Deluxe", price: 90 },
    { name: "Suite", price: 150 }
];

// status here only matters for "Maintenance": those rooms cannot be booked
let rooms = [
    { number: "101", type: "Standard", status: "Available" },
    { number: "102", type: "Standard", status: "Available" },
    { number: "201", type: "Deluxe", status: "Available" },
    { number: "301", type: "Suite", status: "Maintenance" }
];

// status is one of: Reserved, Checked-in, Checked-out, Cancelled (the badge colours already exist in Style.css)
// dates are saved as "YYYY-MM-DD" text, so they can be compared with < and >
let reservations = [
    { id: 1, guest: "Tania Akter", phone: "01855555555", room: "102", checkIn: dayFromToday(-1), checkOut: dayFromToday(2), status: "Checked-in" },
    { id: 2, guest: "Sabbir Hossain", phone: "01966666666", room: "201", checkIn: dayFromToday(-2), checkOut: dayFromToday(1), status: "Checked-in" },
    { id: 3, guest: "Nadia Islam", phone: "01577777777", room: "101", checkIn: dayFromToday(0), checkOut: dayFromToday(3), status: "Reserved" },
    { id: 4, guest: "Karim Uddin", phone: "01712345678", room: "101", checkIn: dayFromToday(-5), checkOut: dayFromToday(-3), status: "Checked-out" }
];

// who checked in / out and when (oldest first, shown newest first)
let actionLog = [
    { time: dayFromToday(-5) + " 14:00", text: "Karim Uddin checked in to room 101" },
    { time: dayFromToday(-3) + " 11:00", text: "Karim Uddin checked out of room 101" },
    { time: dayFromToday(-2) + " 14:10", text: "Sabbir Hossain checked in to room 201" },
    { time: dayFromToday(-1) + " 15:30", text: "Tania Akter checked in to room 102" }
];

let nextResId = 5;
let editResId = 0;   // 0 means "adding a new reservation"

document.addEventListener("DOMContentLoaded", function () {
    // after a refresh the browser remembers old search / filter values, so reset them
    document.getElementById("SearchRes").value = "";
    document.getElementById("FilterRes").value = "All";
    document.getElementById("FilterDesk").value = "All";
    loadTypeOptions();
    refreshAll();
});

// redraw everything that depends on the data
function refreshAll() {
    loadRoomOptions();
    showReservationSummary();
    showReservations();
    showCheckSummary();
    showDesk();
    showLog();
}

// ---------- MENU: show one section, hide the other ----------
// used as onclick="return showSection('check')"  (return false keeps the page from jumping)
function showSection(name) {
    document.getElementById("reservationSection").style.display = "none";
    document.getElementById("checkSection").style.display = "none";
    document.getElementById("menuReservations").className = "";
    document.getElementById("menuCheck").className = "";
    if (name == "check") {
        document.getElementById("checkSection").style.display = "block";
        document.getElementById("menuCheck").className = "active";
    } else {
        document.getElementById("reservationSection").style.display = "block";
        document.getElementById("menuReservations").className = "active";
    }
    return false;
}

// ---------- SMALL HELPER FUNCTIONS ----------
// Date -> "YYYY-MM-DD"
function formatDate(d) {
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return d.getFullYear() + "-" + month + "-" + day;
}

// date of today + n days (n can be negative)
function dayFromToday(n) {
    let d = new Date();
    d.setDate(d.getDate() + n);
    return formatDate(d);
}

function today() {
    return dayFromToday(0);
}

// number of nights between two "YYYY-MM-DD" dates
function nightsBetween(inDate, outDate) {
    let a = inDate.split("-");
    let b = outDate.split("-");
    let d1 = new Date(a[0], a[1] - 1, a[2]);
    let d2 = new Date(b[0], b[1] - 1, b[2]);
    return Math.round((d2 - d1) / 86400000);
}

function getPrice(typeName) {
    for (let i = 0; i < roomTypes.length; i++) {
        if (roomTypes[i].name == typeName) {
            return roomTypes[i].price;
        }
    }
    return 0;
}

function getRoomType(number) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].number == number) {
            return rooms[i].type;
        }
    }
    return "";
}

function findReservationIndex(id) {
    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].id == id) {
            return i;
        }
    }
    return -1;
}

// Is the room already taken in these dates? Returns the index of the reservation in the way, or -1 if free.
// Two stays overlap when: new check-in < old check-out AND new check-out > old check-in
// (so a guest can check in on the same day another guest checks out)
function findConflict(number, inDate, outDate, ignoreId) {
    for (let i = 0; i < reservations.length; i++) {
        let r = reservations[i];
        if (r.room != number || r.id == ignoreId) {
            continue;
        }
        if (r.status != "Reserved" && r.status != "Checked-in") {
            continue;
        }
        if (inDate < r.checkOut && outDate > r.checkIn) {
            return i;
        }
    }
    return -1;
}

function addLog(text) {
    actionLog.push({ time: new Date().toLocaleString(), text: text });
}

function loadTypeOptions() {
    let text = "<option value='All'>All types</option>";
    for (let i = 0; i < roomTypes.length; i++) {
        text += "<option value='" + roomTypes[i].name + "'>" + roomTypes[i].name + " ($" + roomTypes[i].price + ")</option>";
    }
    document.getElementById("AvailType").innerHTML = text;
}

// fills the Room drop-down of the reservation form (rooms under maintenance are left out)
function loadRoomOptions() {
    let select = document.getElementById("ResRoom");
    let old = select.value;
    let text = "";
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].status == "Maintenance") {
            continue;
        }
        text += "<option value='" + rooms[i].number + "'>" + rooms[i].number + " (" + rooms[i].type + ", $" + getPrice(rooms[i].type) + "/night)</option>";
    }
    select.innerHTML = text;
    if (old != "") {
        select.value = old;
    }
}

// checks the two date fields and writes the red messages. Same function for the availability form and the reservation form.
function validateStayDates(inId, outId, inErrorId, outErrorId) {
    let ok = true;
    let inDate = document.getElementById(inId).value;
    let outDate = document.getElementById(outId).value;
    clearError(inErrorId);
    clearError(outErrorId);
    if (inDate == "") {
        showError(inErrorId, "Select the check-in date");
        ok = false;
    } else if (inDate < today()) {
        showError(inErrorId, "Check-in date cannot be in the past");
        ok = false;
    }
    if (outDate == "") {
        showError(outErrorId, "Select the check-out date");
        ok = false;
    } else if (inDate != "" && outDate <= inDate) {
        showError(outErrorId, "Check-out must be after the check-in date");
        ok = false;
    } else if (inDate != "" && nightsBetween(inDate, outDate) > 30) {
        showError(outErrorId, "Maximum stay is 30 nights");
        ok = false;
    }
    return ok;
}

// =====================================================
//                 AVAILABILITY CHECK
// =====================================================
function checkAvailability() {
    let box = document.getElementById("AvailResult");
    box.className = "rec-avail";
    box.innerHTML = "";
    if (validateStayDates("AvailIn", "AvailOut", "AvailInError", "AvailOutError") == false) {
        return;
    }
    let inDate = document.getElementById("AvailIn").value;
    let outDate = document.getElementById("AvailOut").value;
    let type = document.getElementById("AvailType").value;
    let nights = nightsBetween(inDate, outDate);
    let text = "";
    let count = 0;
    for (let i = 0; i < rooms.length; i++) {
        let r = rooms[i];
        if (r.status == "Maintenance") {
            continue;
        }
        if (type != "All" && r.type != type) {
            continue;
        }
        if (findConflict(r.number, inDate, outDate, 0) == -1) {
            let price = getPrice(r.type);
            text += "Room " + r.number + " - " + r.type + " - $" + price + " per night (total $" + (price * nights) + ")<br>";
            count++;
        }
    }
    if (count == 0) {
        box.className = "rec-avail rec-busy";
        box.innerHTML = "No room is free from " + inDate + " to " + outDate + ".";
    } else {
        box.className = "rec-avail rec-free";
        box.innerHTML = "<b>" + count + " room(s) free for " + nights + " night(s) (" + inDate + " to " + outDate + "):</b><br>" + text;
    }
}

function clearAvailability() {
    document.getElementById("AvailIn").value = "";
    document.getElementById("AvailOut").value = "";
    document.getElementById("AvailType").selectedIndex = 0;
    clearError("AvailInError");
    clearError("AvailOutError");
    document.getElementById("AvailResult").className = "rec-avail";
    document.getElementById("AvailResult").innerHTML = "";
}

// =====================================================
//                RESERVATIONS  (CRUD)
// =====================================================
function showReservationSummary() {
    let reserved = 0;
    let checkedIn = 0;
    let cancelled = 0;
    for (let i = 0; i < reservations.length; i++) {
        switch (reservations[i].status) {
            case "Reserved":
                reserved++;
                break;
            case "Checked-in":
                checkedIn++;
                break;
            case "Cancelled":
                cancelled++;
                break;
        }
    }
    let text = "";
    text += "<div class='rec-stat'><b>" + reservations.length + "</b>Total Reservations</div>";
    text += "<div class='rec-stat'><b>" + reserved + "</b>Reserved</div>";
    text += "<div class='rec-stat'><b>" + checkedIn + "</b>Checked-in</div>";
    text += "<div class='rec-stat'><b>" + cancelled + "</b>Cancelled</div>";
    document.getElementById("reservationSummary").innerHTML = text;
}

// READ: newest reservation first (uses the search box and the status filter)
function showReservations() {
    let search = document.getElementById("SearchRes").value.trim().toLowerCase();
    let filter = document.getElementById("FilterRes").value;
    let text = "<table class='datatable'>";
    text += "<tr><th>Guest</th><th>Phone</th><th>Room</th><th>Type</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Total</th><th>Status</th><th>Action</th></tr>";
    let count = 0;
    for (let i = reservations.length - 1; i >= 0; i--) {
        let r = reservations[i];
        if (filter != "All" && r.status != filter) {
            continue;
        }
        if (search != "" && r.guest.toLowerCase().indexOf(search) == -1 && r.room.indexOf(search) == -1) {
            continue;
        }
        let type = getRoomType(r.room);
        let nights = nightsBetween(r.checkIn, r.checkOut);
        text += "<tr>";
        text += "<td>" + safeText(r.guest) + "</td>";
        text += "<td>" + r.phone + "</td>";
        text += "<td>" + r.room + "</td>";
        text += "<td>" + type + "</td>";
        text += "<td>" + r.checkIn + "</td>";
        text += "<td>" + r.checkOut + "</td>";
        text += "<td>" + nights + "</td>";
        text += "<td>$" + (nights * getPrice(type)) + "</td>";
        text += "<td><span class='badge " + r.status + "'>" + r.status + "</span></td>";
        text += "<td>";
        if (r.status == "Reserved" || r.status == "Cancelled") {
            text += "<button onclick='editReservation(" + r.id + ")'>Edit</button>";
        }
        if (r.status == "Reserved") {
            text += "<button class='light' onclick='cancelReservation(" + r.id + ")'>Cancel</button>";
        }
        if (r.status == "Checked-out") {
            text += "<button onclick='viewInvoice(" + r.id + ")'>Invoice</button>";
        }
        text += "<button class='danger' onclick='deleteReservation(" + r.id + ")'>Delete</button>";
        text += "</td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='10'>No reservations found</td></tr>";
    }
    text += "</table>";
    document.getElementById("reservationTable").innerHTML = text;
}

// VALIDATION for the reservation form
function validateReservation() {
    let validName = validateName("ResGuest", "ResGuestError", "guest name");
    let validPhone = validatePhone("ResPhone", "ResPhoneError");
    let validDates = validateStayDates("ResIn", "ResOut", "ResInError", "ResOutError");
    let ok = validName && validPhone && validDates;
    let room = document.getElementById("ResRoom").value;
    let status = document.getElementById("ResStatus").value;
    clearError("ResRoomError");
    if (room == "") {
        showError("ResRoomError", "Select a room");
        ok = false;
    } else if (validDates && status == "Reserved") {
        // a room cannot be booked twice for the same dates
        let inDate = document.getElementById("ResIn").value;
        let outDate = document.getElementById("ResOut").value;
        let conflict = findConflict(room, inDate, outDate, editResId);
        if (conflict != -1) {
            let c = reservations[conflict];
            showError("ResRoomError", "Room " + room + " is already booked from " + c.checkIn + " to " + c.checkOut);
            ok = false;
        }
    }
    return ok;
}

// CREATE and UPDATE (same button: it depends on editResId)
function saveReservation() {
    document.getElementById("ResMsg").innerHTML = "";
    if (validateReservation() == false) {
        return;
    }
    let guest = document.getElementById("ResGuest").value.trim();
    let phone = document.getElementById("ResPhone").value.trim();
    let room = document.getElementById("ResRoom").value;
    let inDate = document.getElementById("ResIn").value;
    let outDate = document.getElementById("ResOut").value;
    let status = document.getElementById("ResStatus").value;
    let msg = "";
    if (editResId == 0) {
        reservations.push({ id: nextResId, guest: guest, phone: phone, room: room, checkIn: inDate, checkOut: outDate, status: status });
        nextResId++;
        msg = "Reservation for " + safeText(guest) + " added (Room " + room + ").";
    } else {
        let index = findReservationIndex(editResId);
        reservations[index].guest = guest;
        reservations[index].phone = phone;
        reservations[index].room = room;
        reservations[index].checkIn = inDate;
        reservations[index].checkOut = outDate;
        reservations[index].status = status;
        msg = "Reservation of " + safeText(guest) + " updated.";
    }
    clearReservationForm();
    refreshAll();
    document.getElementById("ResMsg").innerHTML = msg;
}

// UPDATE step 1: copy the reservation into the form
function editReservation(id) {
    let index = findReservationIndex(id);
    let r = reservations[index];
    editResId = id;
    document.getElementById("ResGuest").value = r.guest;
    document.getElementById("ResPhone").value = r.phone;
    document.getElementById("ResRoom").value = r.room;
    document.getElementById("ResIn").value = r.checkIn;
    document.getElementById("ResOut").value = r.checkOut;
    document.getElementById("ResStatus").value = r.status;
    document.getElementById("ResMode").innerHTML = "Mode: Editing reservation of " + safeText(r.guest);
    clearError("ResGuestError");
    clearError("ResPhoneError");
    clearError("ResRoomError");
    clearError("ResInError");
    clearError("ResOutError");
    document.getElementById("ResMsg").innerHTML = "";
    window.scrollTo(0, 0);
}

// Cancel a reservation (it stays in the list with the status Cancelled)
function cancelReservation(id) {
    let index = findReservationIndex(id);
    let name = reservations[index].guest;
    if (confirm("Cancel the reservation of " + name + "?") == false) {
        return;
    }
    reservations[index].status = "Cancelled";
    if (editResId == id) {
        clearReservationForm();
    }
    refreshAll();
    document.getElementById("ResMsg").innerHTML = "Reservation of " + safeText(name) + " cancelled.";
}

// DELETE
function deleteReservation(id) {
    let index = findReservationIndex(id);
    let name = reservations[index].guest;
    if (reservations[index].status == "Checked-in") {
        alert(name + " is checked in. Check the guest out before deleting.");
        return;
    }
    if (confirm("Delete the reservation of " + name + "?") == false) {
        return;
    }
    let newList = [];
    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].id != id) {
            newList.push(reservations[i]);
        }
    }
    reservations = newList;
    if (editResId == id) {
        clearReservationForm();
    }
    refreshAll();
    document.getElementById("ResMsg").innerHTML = "Reservation of " + safeText(name) + " deleted.";
}

function clearReservationForm() {
    editResId = 0;
    document.getElementById("ResGuest").value = "";
    document.getElementById("ResPhone").value = "";
    document.getElementById("ResRoom").selectedIndex = 0;
    document.getElementById("ResIn").value = "";
    document.getElementById("ResOut").value = "";
    document.getElementById("ResStatus").value = "Reserved";
    clearError("ResGuestError");
    clearError("ResPhoneError");
    clearError("ResRoomError");
    clearError("ResInError");
    clearError("ResOutError");
    document.getElementById("ResMsg").innerHTML = "";
    document.getElementById("ResMode").innerHTML = "Mode: Add new reservation";
}

// =====================================================
//               CHECK-IN / CHECK-OUT DESK
// =====================================================
function showCheckSummary() {
    let arriving = 0;
    let departing = 0;
    let inHouse = 0;
    let revenue = 0;
    for (let i = 0; i < reservations.length; i++) {
        let r = reservations[i];
        if (r.status == "Reserved" && r.checkIn == today()) {
            arriving++;
        }
        if (r.status == "Checked-in") {
            inHouse++;
            if (r.checkOut == today()) {
                departing++;
            }
        }
        if (r.status == "Checked-out") {
            revenue += nightsBetween(r.checkIn, r.checkOut) * getPrice(getRoomType(r.room));
        }
    }
    let text = "";
    text += "<div class='rec-stat'><b>" + arriving + "</b>Arriving Today</div>";
    text += "<div class='rec-stat'><b>" + departing + "</b>Leaving Today</div>";
    text += "<div class='rec-stat'><b>" + inHouse + "</b>Guests In Hotel</div>";
    text += "<div class='rec-stat'><b>$" + revenue + "</b>Billed Revenue</div>";
    document.getElementById("checkSummary").innerHTML = text;
}

// shows only the guests that still need an action: Reserved (check-in) and Checked-in (check-out)
function showDesk() {
    let filter = document.getElementById("FilterDesk").value;
    let text = "<table class='datatable'>";
    text += "<tr><th>Guest</th><th>Room</th><th>Type</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Action</th></tr>";
    let count = 0;
    for (let i = 0; i < reservations.length; i++) {
        let r = reservations[i];
        if (r.status != "Reserved" && r.status != "Checked-in") {
            continue;
        }
        if (filter != "All" && r.status != filter) {
            continue;
        }
        text += "<tr>";
        text += "<td>" + safeText(r.guest) + "</td>";
        text += "<td>" + r.room + "</td>";
        text += "<td>" + getRoomType(r.room) + "</td>";
        text += "<td>" + r.checkIn + "</td>";
        text += "<td>" + r.checkOut + "</td>";
        text += "<td><span class='badge " + r.status + "'>" + r.status + "</span></td>";
        text += "<td>";
        if (r.status == "Reserved") {
            text += "<button onclick='doCheckIn(" + r.id + ")'>Check-in</button>";
        } else {
            text += "<button class='danger' onclick='doCheckOut(" + r.id + ")'>Check-out</button>";
        }
        text += "</td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='7'>No guests waiting</td></tr>";
    }
    text += "</table>";
    document.getElementById("deskTable").innerHTML = text;
}

// Reserved -> Checked-in
function doCheckIn(id) {
    let index = findReservationIndex(id);
    let r = reservations[index];
    document.getElementById("CheckMsg").innerHTML = "";
    // too early?
    if (r.checkIn > today()) {
        alert("Too early. The check-in date of " + r.guest + " is " + r.checkIn + ".");
        return;
    }
    // is the old guest of this room still inside?
    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].room == r.room && reservations[i].status == "Checked-in") {
            alert("Room " + r.room + " still has a guest (" + reservations[i].guest + "). Check that guest out first.");
            return;
        }
    }
    r.status = "Checked-in";
    addLog(safeText(r.guest) + " checked in to room " + r.room);
    refreshAll();
    document.getElementById("CheckMsg").innerHTML = r.guest + " is checked in to room " + r.room + ".";
}

// Checked-in -> Checked-out, then show the invoice
function doCheckOut(id) {
    let index = findReservationIndex(id);
    let r = reservations[index];
    if (confirm("Check out " + r.guest + " from room " + r.room + "?") == false) {
        return;
    }
    r.status = "Checked-out";
    addLog(safeText(r.guest) + " checked out of room " + r.room);
    refreshAll();
    showInvoice(index);
    document.getElementById("CheckMsg").innerHTML = r.guest + " is checked out. The invoice is shown below.";
}

// =====================================================
//                       INVOICE
// =====================================================
// nights x price of the room type (the booked nights are billed)
function showInvoice(index) {
    let r = reservations[index];
    let type = getRoomType(r.room);
    let rate = getPrice(type);
    let nights = nightsBetween(r.checkIn, r.checkOut);
    let text = "<h3>Invoice INV-" + (1000 + r.id) + "</h3>";
    text += "<table>";
    text += "<tr><td>Guest</td><td>" + safeText(r.guest) + "</td></tr>";
    text += "<tr><td>Phone</td><td>" + r.phone + "</td></tr>";
    text += "<tr><td>Room</td><td>" + r.room + " (" + type + ")</td></tr>";
    text += "<tr><td>Check-in</td><td>" + r.checkIn + "</td></tr>";
    text += "<tr><td>Check-out</td><td>" + r.checkOut + "</td></tr>";
    text += "<tr><td>Nights</td><td>" + nights + "</td></tr>";
    text += "<tr><td>Rate per night</td><td>$" + rate + "</td></tr>";
    text += "<tr class='rec-total'><td>Total Bill</td><td>$" + (nights * rate) + "</td></tr>";
    text += "</table>";
    document.getElementById("invoiceBox").innerHTML = text;
}

// "Invoice" button of a checked-out reservation in the reservation list
function viewInvoice(id) {
    showInvoice(findReservationIndex(id));
    document.getElementById("CheckMsg").innerHTML = "";
    showSection("check");
    window.scrollTo(0, 0);
}

// =====================================================
//               CHECK-IN / CHECK-OUT HISTORY
// =====================================================
function showLog() {
    let text = "";
    for (let i = actionLog.length - 1; i >= 0; i--) {
        text += "<p><b>" + actionLog[i].time + "</b> - " + actionLog[i].text + "</p>";
    }
    if (text == "") {
        text = "<p>No check-in or check-out yet.</p>";
    }
    document.getElementById("logBox").innerHTML = text;
}
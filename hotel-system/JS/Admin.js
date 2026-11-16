console.log("Admin.js Connected");
// JS/Admin.js - Member 1 (Admin portal: Dashboard, New Accounts, Manage Users, Rooms view, Payments)
// Only things taught in class: arrays of objects, for loop, if/else, switch, getElementById, innerHTML, .style, onclick.
// Data is kept in an array (in memory, resets on refresh). Sign-ups from the login pages cannot reach this page yet,
// so sample data is used. In the final term PHP + database will load the real accounts.

//  DATA (same fields as the sign up form; passwords are never shown) ----------
// the list is oldest first, so the newest account is the LAST item
let adminAccounts = [
    { id: 1, first: "Admin", last: "User", email: "admin@hotel.com", birthday: "1990-01-15", phone: "01711111111", role: "Admin", registered: "2026-10-01 09:00", status: "Active" },
    { id: 2, first: "sifat", last: "Manager", email: "manager@hotel.com", birthday: "1992-03-20", phone: "01722222222", role: "Manager", registered: "2026-10-01 09:05", status: "Active" },
    { id: 3, first: "Rafi", last: "Reception", email: "reception@hotel.com", birthday: "1995-07-08", phone: "01733333333", role: "Receptionist", registered: "2026-10-01 09:10", status: "Active" },
    { id: 4, first: "Guest", last: "User", email: "guest@hotel.com", birthday: "1998-11-30", phone: "01744444444", role: "Guest", registered: "2026-10-01 09:15", status: "Active" },
    { id: 5, first: "Nadia", last: "Akter", email: "nadia@example.com", birthday: "2000-05-12", phone: "01755555555", role: "Guest", registered: "2026-11-08 14:20", status: "Active" },
    { id: 6, first: "Tanvir", last: "Hasan", email: "tanvir@example.com", birthday: "1997-09-03", phone: "01866666666", role: "Guest", registered: "2026-11-10 11:45", status: "Active" },
    { id: 7, first: "Sara", last: "Islam", email: "sara@example.com", birthday: "2001-02-25", phone: "01977777777", role: "Guest", registered: "2026-11-12 16:30", status: "Disabled" },
    { id: 8, first: "Arif", last: "Rahman", email: "arif@example.com", birthday: "1994-12-18", phone: "01688888888", role: "Receptionist", registered: "2026-11-14 10:05", status: "Active" }
];

// same room types and rooms as Manager.js (the Manager adds/edits rooms, Admin only views them)
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

// sample payments (no Receptionist/Guest data exists yet; real records will come from the database)
let payments = [
    { id: "TXN-9001", booking: "BK-1001", guest: "Nadia Akter", room: "102", method: "Card", amount: 100, date: "2026-11-09", status: "Paid" },
    { id: "TXN-9002", booking: "BK-1002", guest: "Tanvir Hasan", room: "201", method: "Mobile Banking", amount: 180, date: "2026-11-12", status: "Pending" },
    { id: "TXN-9003", booking: "BK-1003", guest: "Arif Rahman", room: "101", method: "Cash", amount: 50, date: "2026-10-20", status: "Paid" }
];

//  MENU: show one section, hide the others 
// used as onclick="return showSection('new')"  (return false keeps the page from jumping)
function showSection(name) {
    let sections = ["dashboardSection", "newSection", "usersSection", "roomsSection", "paymentsSection"];
    let menus = ["menuDashboard", "menuNew", "menuUsers", "menuRooms", "menuPayments"];
    let pick = 0;

    switch (name) {
        case "new":
            pick = 1;
            break;
        case "users":
            pick = 2;
            break;
        case "rooms":
            pick = 3;
            break;
        case "payments":
            pick = 4;
            break;
        default:
            pick = 0;
    }

    for (let i = 0; i < sections.length; i++) {
        document.getElementById(sections[i]).style.display = "none";
        document.getElementById(menus[i]).className = "";
    }
    document.getElementById(sections[pick]).style.display = "block";
    document.getElementById(menus[pick]).className = "active";
    return false;
}

// redraw everything that depends on the data
function refreshAll() {
    showSummary();
    showNewAccounts();
    showUsers();
    showRoomSummary();
    showRooms();
    showPaymentSummary();
    showPayments();
}

function getPrice(typeName) {
    for (let i = 0; i < roomTypes.length; i++) {
        if (roomTypes[i].name == typeName) {
            return roomTypes[i].price;
        }
    }
    return 0;
}

function findAccountIndex(id) {
    for (let i = 0; i < adminAccounts.length; i++) {
        if (adminAccounts[i].id == id) {
            return i;
        }
    }
    return -1;
}


// DASHBOARD

function showSummary() {
    let active = 0;
    let disabled = 0;
    let managers = 0;
    let receptionists = 0;
    let guests = 0;

    for (let i = 0; i < adminAccounts.length; i++) {
        if (adminAccounts[i].status == "Active") {
            active++;
        } else {
            disabled++;
        }
        if (adminAccounts[i].role == "Manager") {
            managers++;
        } else if (adminAccounts[i].role == "Receptionist") {
            receptionists++;
        } else if (adminAccounts[i].role == "Guest") {
            guests++;
        }
    }

    document.getElementById("summaryBox").innerHTML =
        "<div class='adm-stat'>Total Accounts<b>" + adminAccounts.length + "</b></div>" +
        "<div class='adm-stat'>Active<b>" + active + "</b></div>" +
        "<div class='adm-stat'>Disabled<b>" + disabled + "</b></div>" +
        "<div class='adm-stat'>Managers<b>" + managers + "</b></div>" +
        "<div class='adm-stat'>Receptionists<b>" + receptionists + "</b></div>" +
        "<div class='adm-stat'>Guests<b>" + guests + "</b></div>";
}


//NEW ACCOUNTS (newest first)

function showNewAccounts() {
    let text = "<table class='datatable'><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Birthday</th><th>Phone</th><th>Role</th><th>Registered</th></tr>";
    let count = 0;

    // loop from the END of the array so the newest account comes first (show the latest 5)
    for (let i = adminAccounts.length - 1; i >= 0 && count < 5; i--) {
        let a = adminAccounts[i];
        text += "<tr><td>" + a.first + "</td><td>" + a.last + "</td><td>" + a.email + "</td><td>" + a.birthday + "</td><td>" + a.phone + "</td><td>" + a.role + "</td><td>" + a.registered + "</td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='7'>No accounts yet.</td></tr>";
    }
    document.getElementById("newTable").innerHTML = text + "</table>";
}

// MANAGE USERS

function showUsers() {
    let search = document.getElementById("SearchUser").value.trim().toLowerCase();
    let role = document.getElementById("FilterRole").value;
    let status = document.getElementById("FilterStatus").value;
    let text = "<table class='datatable'><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>";
    let count = 0;

    for (let i = adminAccounts.length - 1; i >= 0; i--) {
        let a = adminAccounts[i];
        let name = a.first + " " + a.last;

        if (role != "All" && a.role != role) {
            continue;
        }
        if (status != "All" && a.status != status) {
            continue;
        }
        if (search != "" && name.toLowerCase().indexOf(search) == -1 && a.email.toLowerCase().indexOf(search) == -1 && a.phone.indexOf(search) == -1) {
            continue;
        }

        text += "<tr><td>" + name + "</td><td>" + a.email + "</td><td>" + a.phone + "</td><td>" + a.role + "</td>";
        text += "<td><span class='badge " + a.status + "'>" + a.status + "</span></td><td>";
        if (a.role == "Admin") {
            text += "<span class='adm-protected'>Protected</span>";
        } else {
            let label = "Disable";
            if (a.status == "Disabled") {
                label = "Enable";
            }
            text += "<button type='button' class='light' onclick='changeStatus(" + a.id + ")'>" + label + "</button>";
            text += "<button type='button' class='danger' onclick='deleteUser(" + a.id + ")'>Delete</button>";
        }
        text += "</td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='6'>No accounts found.</td></tr>";
    }
    document.getElementById("userTable").innerHTML = text + "</table>";
}

function changeStatus(id) {
    let index = findAccountIndex(id);
    if (index == -1 || adminAccounts[index].role == "Admin") {
        return;
    }
    if (adminAccounts[index].status == "Active") {
        adminAccounts[index].status = "Disabled";
    } else {
        adminAccounts[index].status = "Active";
    }
    document.getElementById("UserMsg").innerHTML = "Account status updated.";
    refreshAll();
}

function deleteUser(id) {
    let index = findAccountIndex(id);
    if (index == -1 || adminAccounts[index].role == "Admin") {
        return;
    }
    if (!confirm("Delete " + adminAccounts[index].first + " " + adminAccounts[index].last + "?")) {
        return;
    }
    // rebuild the array without this account (no splice needed)
    let rest = [];
    for (let i = 0; i < adminAccounts.length; i++) {
        if (i != index) {
            rest.push(adminAccounts[i]);
        }
    }
    adminAccounts = rest;
    document.getElementById("UserMsg").innerHTML = "Account deleted.";
    refreshAll();
}


// ROOMS (view only)

function showRoomSummary() {
    let available = 0;
    let occupied = 0;
    let maintenance = 0;

    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].status == "Available") {
            available++;
        } else if (rooms[i].status == "Occupied") {
            occupied++;
        } else {
            maintenance++;
        }
    }
    let rate = 0;
    if (rooms.length > 0) {
        rate = Math.round(occupied / rooms.length * 100);
    }

    document.getElementById("roomSummary").innerHTML =
        "<div class='adm-stat'>Total Rooms<b>" + rooms.length + "</b></div>" +
        "<div class='adm-stat'>Available<b>" + available + "</b></div>" +
        "<div class='adm-stat'>Occupied<b>" + occupied + "</b></div>" +
        "<div class='adm-stat'>Maintenance<b>" + maintenance + "</b></div>" +
        "<div class='adm-stat'>Occupancy<b>" + rate + "%</b></div>";
}

function showRooms() {
    let search = document.getElementById("SearchRoom").value.trim();
    let status = document.getElementById("FilterRoomStatus").value;
    let text = "<table class='datatable'><tr><th>Room</th><th>Type</th><th>Floor</th><th>Price / Night</th><th>Status</th></tr>";
    let count = 0;

    for (let i = 0; i < rooms.length; i++) {
        let r = rooms[i];
        if (search != "" && r.number.indexOf(search) == -1) {
            continue;
        }
        if (status != "All" && r.status != status) {
            continue;
        }
        text += "<tr><td>" + r.number + "</td><td>" + r.type + "</td><td>" + r.floor + "</td><td>$" + getPrice(r.type) + "</td>";
        text += "<td><span class='badge " + r.status + "'>" + r.status + "</span></td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='5'>No rooms found.</td></tr>";
    }
    document.getElementById("roomTable").innerHTML = text + "</table>";
}


//PAYMENTS

function showPaymentSummary() {
    let paid = 0;
    let pending = 0;
    let refunded = 0;
    let collected = 0;

    for (let i = 0; i < payments.length; i++) {
        if (payments[i].status == "Paid") {
            paid++;
            collected += payments[i].amount;
        } else if (payments[i].status == "Pending") {
            pending++;
        } else {
            refunded++;
        }
    }

    document.getElementById("paymentSummary").innerHTML =
        "<div class='adm-stat'>Transactions<b>" + payments.length + "</b></div>" +
        "<div class='adm-stat'>Paid<b>" + paid + "</b></div>" +
        "<div class='adm-stat'>Pending<b>" + pending + "</b></div>" +
        "<div class='adm-stat'>Refunded<b>" + refunded + "</b></div>" +
        "<div class='adm-stat'>Collected<b>$" + collected + "</b></div>";
}

function showPayments() {
    let search = document.getElementById("SearchPayment").value.trim().toLowerCase();
    let status = document.getElementById("FilterPayStatus").value;
    let text = "<table class='datatable'><tr><th>Transaction</th><th>Booking</th><th>Guest</th><th>Room</th><th>Method</th><th>Date</th><th>Amount</th><th>Status</th><th>Change</th></tr>";
    let count = 0;

    for (let i = payments.length - 1; i >= 0; i--) {
        let p = payments[i];
        if (status != "All" && p.status != status) {
            continue;
        }
        if (search != "" && p.id.toLowerCase().indexOf(search) == -1 && p.booking.toLowerCase().indexOf(search) == -1 && p.guest.toLowerCase().indexOf(search) == -1) {
            continue;
        }
        text += "<tr><td>" + p.id + "</td><td>" + p.booking + "</td><td>" + p.guest + "</td><td>" + p.room + "</td><td>" + p.method + "</td><td>" + p.date + "</td><td>$" + p.amount + "</td>";
        text += "<td><span class='badge " + p.status + "'>" + p.status + "</span></td>";
        text += "<td><select onchange='changePayment(\"" + p.id + "\", this.value)'><option value=''>Update</option><option value='Paid'>Paid</option><option value='Pending'>Pending</option><option value='Refunded'>Refunded</option></select></td></tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='9'>No payments found.</td></tr>";
    }
    document.getElementById("paymentTable").innerHTML = text + "</table>";
}

function changePayment(id, status) {
    if (status == "") {
        return;
    }
    for (let i = 0; i < payments.length; i++) {
        if (payments[i].id == id) {
            payments[i].status = status;
        }
    }
    document.getElementById("PaymentMsg").innerHTML = "Payment " + id + " is now " + status + ".";
    refreshAll();
}

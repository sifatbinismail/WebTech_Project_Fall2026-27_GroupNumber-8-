console.log("Admin.js Connected");
// JS/Admin.js - Member 1 (Admin portal)
// Page 1: New Accounts - shows who has just created an account (newest first), with Disable / Delete.
// Only things taught in class: arrays of objects, for loop, if/else, getElementById, innerHTML, onclick.
// NOTE: no storage is allowed, so this page cannot receive the sign-ups made on the login pages yet.
// It shows sample data with the SAME fields as the sign-up form. In the final term PHP will read
// the real accounts from the database and fill this list.
// Member 1 still has to add: Room Types and Rates CRUD (see the team plan).

let allAccounts = [
    { id: 1, first: "Admin", last: "User", email: "admin@hotel.com", phone: "01711111111", birthday: "1990-01-15", role: "Admin", registered: "2026-10-01 09:00", status: "Active" },
    { id: 2, first: "Mona", last: "Manager", email: "manager@hotel.com", phone: "01722222222", birthday: "1992-03-20", role: "Manager", registered: "2026-10-01 09:05", status: "Active" },
    { id: 3, first: "Rafi", last: "Reception", email: "reception@hotel.com", phone: "01733333333", birthday: "1995-07-08", role: "Receptionist", registered: "2026-10-01 09:10", status: "Active" },
    { id: 4, first: "Tania", last: "Akter", email: "tania@gmail.com", phone: "01855555555", birthday: "1999-02-11", role: "Guest", registered: "2026-11-02 14:05", status: "Active" },
    { id: 5, first: "Sabbir", last: "Hossain", email: "sabbir@gmail.com", phone: "01966666666", birthday: "1994-09-23", role: "Guest", registered: "2026-11-03 18:40", status: "Active" },
    { id: 6, first: "Nadia", last: "Islam", email: "nadia@gmail.com", phone: "01577777777", birthday: "2000-06-05", role: "Guest", registered: "2026-11-04 09:15", status: "Active" }
];

document.addEventListener("DOMContentLoaded", function () {
    refreshAll();
});

function refreshAll() {
    showSummary();
    showAccounts();
}

function findAccountIndex(id) {
    for (let i = 0; i < allAccounts.length; i++) {
        if (allAccounts[i].id == id) {
            return i;
        }
    }
    return -1;
}

function showSummary() {
    let guests = 0;
    let staff = 0;
    let disabled = 0;
    for (let i = 0; i < allAccounts.length; i++) {
        if (allAccounts[i].role == "Guest") {
            guests++;
        } else {
            staff++;
        }
        if (allAccounts[i].status == "Disabled") {
            disabled++;
        }
    }
    let text = "";
    text += "<div class='adm-stat'><b>" + allAccounts.length + "</b>Total Accounts</div>";
    text += "<div class='adm-stat'><b>" + guests + "</b>Guests</div>";
    text += "<div class='adm-stat'><b>" + staff + "</b>Staff</div>";
    text += "<div class='adm-stat'><b>" + disabled + "</b>Disabled</div>";
    document.getElementById("accountSummary").innerHTML = text;
}

// READ: newest sign-up first (loop from the end of the array)
function showAccounts() {
    let search = document.getElementById("SearchAccount").value.trim().toLowerCase();
    let filter = document.getElementById("FilterRole").value;

    let text = "<table class='datatable'>";
    text += "<tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Birthday</th><th>Registered</th><th>Status</th><th>Action</th></tr>";

    let count = 0;
    for (let i = allAccounts.length - 1; i >= 0; i--) {
        let a = allAccounts[i];
        let fullName = a.first + " " + a.last;
        if (filter != "All" && a.role != filter) {
            continue;
        }
        if (search != "" && fullName.toLowerCase().indexOf(search) == -1 && a.email.toLowerCase().indexOf(search) == -1) {
            continue;
        }
        let toggle = "Disable";
        if (a.status == "Disabled") {
            toggle = "Enable";
        }
        text += "<tr>";
        text += "<td>" + fullName + "</td>";
        text += "<td>" + a.role + "</td>";
        text += "<td>" + a.email + "</td>";
        text += "<td>" + a.phone + "</td>";
        text += "<td>" + a.birthday + "</td>";
        text += "<td>" + a.registered + "</td>";
        text += "<td><span class='badge " + a.status + "'>" + a.status + "</span></td>";
        text += "<td><button onclick='toggleAccount(" + a.id + ")'>" + toggle + "</button>";
        text += "<button class='danger' onclick='deleteAccount(" + a.id + ")'>Delete</button></td>";
        text += "</tr>";
        count++;
    }
    if (count == 0) {
        text += "<tr><td colspan='8'>No accounts found</td></tr>";
    }
    text += "</table>";
    document.getElementById("accountTable").innerHTML = text;
}

// UPDATE: Active <-> Disabled
function toggleAccount(id) {
    let index = findAccountIndex(id);
    if (allAccounts[index].status == "Active") {
        allAccounts[index].status = "Disabled";
    } else {
        allAccounts[index].status = "Active";
    }
    refreshAll();
    document.getElementById("AccountMsg").innerHTML = allAccounts[index].first + " " + allAccounts[index].last + " is now " + allAccounts[index].status + ".";
}

// DELETE
function deleteAccount(id) {
    let index = findAccountIndex(id);
    let name = allAccounts[index].first + " " + allAccounts[index].last;
    if (allAccounts[index].role == "Admin") {
        alert("The Admin account cannot be deleted.");
        return;
    }
    if (confirm("Delete the account of " + name + "?") == false) {
        return;
    }
    let newList = [];
    for (let i = 0; i < allAccounts.length; i++) {
        if (allAccounts[i].id != id) {
            newList.push(allAccounts[i]);
        }
    }
    allAccounts = newList;
    refreshAll();
    document.getElementById("AccountMsg").innerHTML = "Account of " + name + " deleted.";
}

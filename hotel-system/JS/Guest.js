let rooms = [
    { id: 1, number: "101", type: "Standard", floor: 1, status: "Available" },
    { id: 2, number: "102", type: "Standard", floor: 1, status: "Available" },
    { id: 3, number: "201", type: "Deluxe", floor: 2, status: "Available" },
    { id: 4, number: "301", type: "Suite", floor: 3, status: "Available" }
];

let bookings = [];

function showSection(sectionId, buttonId) {
  document.getElementById("bookSection").style.display = "none";
  document.getElementById("bookingsSection").style.display = "none";
  document.getElementById("feedbackSection").style.display = "none";

  // jeta click korsi sheta show kori
  document.getElementById(sectionId).style.display = "block";

  document.getElementById("btn1").className = "";
  document.getElementById("btn2").className = "";
  document.getElementById("btn3").className = "";
  document.getElementById(buttonId).className = "active";

  if (sectionId == "bookingsSection") {
    showBookings();
  }
}
function fillDropdown() {
  let options = "<option value=''>Select a room</option>";
  for (let i =0; i <rooms.length; i++) {
    if (rooms[i].status == "Available") {
      options = options + "<option value='" + rooms[i].id + "'>" +
                rooms[i].number + " - " + rooms[i].type + "</option>";
    }
  }
  document.getElementById("roomSelect").innerHTML = options;
}

// cfm button
function confirmBooking() {
  let roomId = document.getElementById("roomSelect").value;
  let checkIn = document.getElementById("checkIn").value;
  let checkOut = document.getElementById("checkOut").value;
  let message = document.getElementById("bookMessage");

  if (roomId == "" || checkIn == "" || checkOut == "") {
    message.innerHTML = "Please fill all the fields.";
    return;
  }
  if (checkOut <= checkIn) {
    message.innerHTML = "Check-out date must be after check-in date.";
    return;
  }
  // room ta khuje ber kori
  for (let i= 0; i <rooms.length;i++) {
    if (rooms[i].id == roomId) {
      bookings.push({
        number: rooms[i].number,
        type: rooms[i].type,
        checkIn: checkIn,
        checkOut: checkOut
      });
      rooms[i].status = "Booked";
    }
  }
  fillDropdown();
  message.innerHTML = "Booking confirmed! Check My Bookings.";
}
function resetForm() {
  document.getElementById("roomSelect").value = "";
  document.getElementById("checkIn").value = "";
  document.getElementById("checkOut").value = "";
  document.getElementById("bookMessage").innerHTML = "";
}

function showBookings() {
  let box = document.getElementById("bookingList");
  if (bookings.length == 0) {
    box.innerHTML = "<p>Not booking yet</p>";
    return;
  }

  let table = "<table>";
  table = table + "<tr>";
  table = table + "<th>Room</th>";
  table = table + "<th>Type</th>";
  table = table + "<th>Check-in</th>";
  table = table + "<th>Check-out</th>";
  table = table + "</tr>";

  for (let i= 0; i< bookings.length; i++) {
    table = table + "<tr><td>" + bookings[i].number + "</td><td>" +
            bookings[i].type + "</td><td>" +
            bookings[i].checkIn + "</td><td>" 
            bookings[i].checkOut + "</td></tr>";
  }

  table = table+ "</table>";
  box.innerHTML = table;
}

function submitFeedback() {
  let text = document.getElementById("feedbackText").value;
  let message = document.getElementById("feedbackMessage");

  if (text == "") {
    message.innerHTML = "Please write something first.";
    return;
  }

  message.innerHTML = "Thank you for your feedback!";
  document.getElementById("feedbackText").value = "";
}

// Page load hole prothome eta cholbe
window.onload = function () {
  fillDropdown();
};
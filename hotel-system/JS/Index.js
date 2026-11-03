console.log("Index.js Connected");

// Called by the 4 buttons on index.html (same idea as goToRegistration() in the teacher's project)
// Takes the user type and redirects the browser to that user's login page
function goToLogin(user)
{
    switch (user)
    {
        case "admin":
            window.location.href = "Page/AdminLogin.html";
            break;
        case "manager":
            window.location.href = "Page/ManagerLogin.html";
            break;
        case "receptionist":
            window.location.href = "Page/ReceptionistLogin.html";
            break;
        case "guest":
            window.location.href = "Page/GuestLogin.html";
            break;
        default:
            alert("Unknown user type: " + user);
    }
}

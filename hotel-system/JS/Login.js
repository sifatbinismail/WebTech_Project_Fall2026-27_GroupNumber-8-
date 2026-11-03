console.log("Login.js Connected");

// Each login page sets  let loginRole = "Manager";  before loading this file.
// Accounts are kept in an array (no storage). In the final term PHP + database will keep them
// and the Admin portal will list every new sign-up from the database.
let accounts = [
    { first: "Admin", last: "User", email: "admin@hotel.com", password: "admin123", birthday: "1990-01-15", phone: "01711111111", role: "Admin", registered: "2026-10-01 09:00" },
    { first: "Mona", last: "Manager", email: "manager@hotel.com", password: "manager123", birthday: "1992-03-20", phone: "01722222222", role: "Manager", registered: "2026-10-01 09:05" },
    { first: "Rafi", last: "Reception", email: "reception@hotel.com", password: "recep123", birthday: "1995-07-08", phone: "01733333333", role: "Receptionist", registered: "2026-10-01 09:10" },
    { first: "Guest", last: "User", email: "guest@hotel.com", password: "guest123", birthday: "1998-11-30", phone: "01744444444", role: "Guest", registered: "2026-10-01 09:15" }
];

// ---------- switch between the Login form and the Sign Up form ----------
function showLogin()
{
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("tabLogin").className = "tab on";
    document.getElementById("tabSignup").className = "tab";
}

function showSignup()
{
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("tabLogin").className = "tab";
    document.getElementById("tabSignup").className = "tab on";
}

// ---------- LOGIN: <form onsubmit="return validateLoginForm()"> ----------
function validateLoginForm()
{
    let validEmail = validateEmail("LoginEmail", "LoginEmailError");
    let validPassword = validateRequired("LoginPassword", "LoginPasswordError", "password");

    if (!(validEmail && validPassword))
    {
        showResult(false, undefined, "LoginResult");
        return false;
    }

    let email = document.getElementById("LoginEmail").value.trim();
    let password = document.getElementById("LoginPassword").value;
    let found = null;
    for (let i = 0; i < accounts.length; i++)
    {
        if (accounts[i].email == email && accounts[i].password == password && accounts[i].role == loginRole)
        {
            found = accounts[i];
        }
    }

    if (found == null)
    {
        showResult(false, "Wrong email or password for the " + loginRole + " account.", "LoginResult");
        return false;
    }

    showResult(true, "Login validated. Welcome, " + safeText(found.first) + "!", "LoginResult");
    alert("Login validated. Welcome, " + found.first + "!");
    goToPortal();
    return false;   // always false: the page is changed by goToPortal()
}

// ---------- SIGN UP: <form onsubmit="return validateSignupForm()"> ----------
function validateSignupForm()
{
    let validFirst = validateName("SuFirst", "SuFirstError", "first name");
    let validLast = validateName("SuLast", "SuLastError", "last name");
    let validEmail = validateEmail("SuEmail", "SuEmailError");
    let validPassword = validatePassword("SuPassword", "SuPasswordError");
    let validConfirm = validateConfirmPassword("SuPassword", "SuConfirm", "SuConfirmError");
    let validBirthday = validateDOB("SuBirthday", "SuBirthdayError", 18);
    let validPhone = validatePhone("SuPhone", "SuPhoneError");

    let isValid = validFirst && validLast && validEmail && validPassword && validConfirm && validBirthday && validPhone;

    // the email must not be used by another account
    let email = document.getElementById("SuEmail").value.trim();
    if (validEmail)
    {
        for (let i = 0; i < accounts.length; i++)
        {
            if (accounts[i].email == email)
            {
                showError("SuEmailError", "This email is already registered");
                isValid = false;
            }
        }
    }

    if (!isValid)
    {
        showResult(false, undefined, "SignupResult");
        return false;
    }

    let first = document.getElementById("SuFirst").value.trim();
    let last = document.getElementById("SuLast").value.trim();
    accounts.push({
        first: first,
        last: last,
        email: email,
        password: document.getElementById("SuPassword").value,
        birthday: document.getElementById("SuBirthday").value,
        phone: document.getElementById("SuPhone").value.trim(),
        role: loginRole,
        registered: new Date().toLocaleString()
    });

    // clear the sign up form, go back to the login form and tell the user
    document.getElementById("signupForm").reset();
    showLogin();
    document.getElementById("LoginEmail").value = email;
    showResult(true, "Account created for " + safeText(first) + " " + safeText(last) + ". You can login now.", "LoginResult");
    return false;
}

// Opens the portal of the selected role (portal pages are in the same Page folder)
function goToPortal()
{
    switch (loginRole)
    {
        case "Admin":
            window.location.href = "Admin.html";
            break;
        case "Manager":
            window.location.href = "Manager.html";
            break;
        case "Receptionist":
            window.location.href = "Receptionist.html";
            break;
        default:
            window.location.href = "Guest.html";
    }
}

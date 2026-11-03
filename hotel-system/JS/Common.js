// ======================================================================
// Common.js - reusable validation functions (same idea as the teacher's Common.js)
// Loaded by the login pages and the guest registration page.
// Every validate function returns true (valid) or false (invalid).
// ======================================================================
console.log("Common.js Connected");

function showError(errorId, message)
{
    document.getElementById(errorId).innerHTML = message;
}

function clearError(errorId)
{
    document.getElementById(errorId).innerHTML = "";
}

// Make user text safe before putting it inside innerHTML
function safeText(text)
{
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Name: required, at least 2 characters, only letters, spaces and dots
function validateName(inputId, errorId, label)
{
    let name = document.getElementById(inputId).value.trim();
    let expression = /^[A-Za-z. ]+$/;

    if (name === "")
    {
        showError(errorId, "Please enter the " + label);
        return false;
    }
    if (name.length < 2)
    {
        showError(errorId, label + " must be at least 2 characters");
        return false;
    }
    if (!expression.test(name))
    {
        showError(errorId, label + " can contain only letters, spaces and dots");
        return false;
    }
    clearError(errorId);
    return true;
}

// Email: required, must look like something@something.something
function validateEmail(inputId, errorId)
{
    let email = document.getElementById(inputId).value.trim();
    let expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "")
    {
        showError(errorId, "Please enter the email");
        return false;
    }
    if (!expression.test(email))
    {
        showError(errorId, "Please enter a valid email (example: name@gmail.com)");
        return false;
    }
    clearError(errorId);
    return true;
}

// Login password: only has to be filled in
function validateRequired(inputId, errorId, label)
{
    let value = document.getElementById(inputId).value;
    if (value === "")
    {
        showError(errorId, "Please enter the " + label);
        return false;
    }
    clearError(errorId);
    return true;
}

// New password (registration): 8+ characters, upper case, lower case and a number
function validatePassword(inputId, errorId)
{
    let password = document.getElementById(inputId).value;

    if (password === "")
    {
        showError(errorId, "Please enter a password");
        return false;
    }
    if (password.length < 8)
    {
        showError(errorId, "Password must be at least 8 characters");
        return false;
    }
    if (!/[A-Z]/.test(password))
    {
        showError(errorId, "Password needs at least one uppercase letter");
        return false;
    }
    if (!/[a-z]/.test(password))
    {
        showError(errorId, "Password needs at least one lowercase letter");
        return false;
    }
    if (!/[0-9]/.test(password))
    {
        showError(errorId, "Password needs at least one number");
        return false;
    }
    clearError(errorId);
    return true;
}

function validateConfirmPassword(passwordId, confirmId, errorId)
{
    let password = document.getElementById(passwordId).value;
    let confirm = document.getElementById(confirmId).value;

    if (confirm === "")
    {
        showError(errorId, "Please confirm the password");
        return false;
    }
    if (confirm !== password)
    {
        showError(errorId, "Passwords do not match");
        return false;
    }
    clearError(errorId);
    return true;
}

// Phone: Bangladeshi mobile number, 11 digits, starts with 013 - 019 (example: 01712345678)
function validatePhone(inputId, errorId)
{
    let phone = document.getElementById(inputId).value.trim();
    let expression = /^01[3-9][0-9]{8}$/;

    if (phone === "")
    {
        showError(errorId, "Please enter the phone number");
        return false;
    }
    if (!expression.test(phone))
    {
        showError(errorId, "Phone must be 11 digits and start with 013 - 019");
        return false;
    }
    clearError(errorId);
    return true;
}

// Date of birth: required, not in the future, at least minAge years old
function validateDOB(inputId, errorId, minAge)
{
    let value = document.getElementById(inputId).value;   // format: "YYYY-MM-DD"

    if (value === "")
    {
        showError(errorId, "Please select the date of birth");
        return false;
    }

    let parts = value.split("-");
    let dob = new Date(parts[0], parts[1] - 1, parts[2]);  // month starts from 0 in JS
    let today = new Date();

    if (dob > today)
    {
        showError(errorId, "Date of birth cannot be in the future");
        return false;
    }

    // calculate age in full years
    let age = today.getFullYear() - dob.getFullYear();
    let monthGap = today.getMonth() - dob.getMonth();
    if (monthGap < 0 || (monthGap === 0 && today.getDate() < dob.getDate()))
    {
        age--;   // birthday has not come yet this year
    }

    if (age < minAge)
    {
        showError(errorId, "You must be at least " + minAge + " years old");
        return false;
    }
    if (age > 100)
    {
        showError(errorId, "Please enter a valid date of birth");
        return false;
    }
    clearError(errorId);
    return true;
}

// The green / red box above the buttons (<div class="resultbox" id="...">)
// boxId tells which box to use, because a login page has two forms.
function showResult(isValid, message, boxId)
{
    let result = document.getElementById(boxId);
    if (isValid)
    {
        result.className = "resultbox success";
        result.innerHTML = message;
    }
    else
    {
        result.className = "resultbox failed";
        if (message === undefined)
        {
            message = "Please fix the errors marked in red.";
        }
        result.innerHTML = message;
    }
}

// Called by <form onreset="clearAllErrors()">
function clearAllErrors()
{
    let errors = document.querySelectorAll(".error");
    for (let i = 0; i < errors.length; i++)
    {
        errors[i].innerHTML = "";
    }
    let boxes = document.querySelectorAll(".resultbox");
    for (let i = 0; i < boxes.length; i++)
    {
        boxes[i].className = "resultbox";
        boxes[i].innerHTML = "";
    }
}

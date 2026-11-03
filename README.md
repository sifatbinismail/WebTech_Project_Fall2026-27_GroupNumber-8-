# Hotel Reservation & Operation Management System (Phase 1: HTML, CSS, JavaScript)

Open `index.html` (Live Server in VS Code works well). It shows four user cards (Admin, Manager, Receptionist, Guest).
Each button opens that user's login page. Every login page has a **Login** tab and a **Sign Up** tab.
Sign up fields: first name, last name, email, birthday (18+), phone (BD mobile), password, retype password.
After signing up you can login straight away on the same page. A correct login shows a "validated" popup and opens the portal.

## Folder structure (same pattern as the teacher's Hospital project)
```
index.html          4 user cards -> goToLogin()
Page/               ALL html pages
Design/             ALL css files
JS/                 ALL javascript files
```
| Who | Page/ | Design/ | JS/ |
|---|---|---|---|
| Leader | `*Login.html` (4, login + sign up), `../index.html` | `Style.css` | `Index.js`, `Common.js`, `Login.js` |
| Member 1 - Admin | `Admin.html` | `Admin.css` | `Admin.js` |
| Member 2 - Manager | `Manager.html` | `Manager.css` | `Manager.js` |
| Member 3 - Receptionist | `Receptionist.html` | `Receptionist.css` | `Receptionist.js` |
| Member 4 - Guest | `Guest.html` | `Guest.css` | `Guest.js` |

Each member edits ONLY their own files. `Design/Style.css` is shared and owned by the Leader: ask before changing it.
If a portal needs more pages, name them `Page/<Role><Name>.html` and `JS/<Role><Name>.js`.

**Admin and new accounts:** `Admin.html` has a "New Accounts" list (newest first) with the same fields as sign up. Because storage is not allowed, it cannot receive sign-ups from another page yet, so it shows sample data. With PHP + database in the final term, `Admin.js` will load the real accounts.

**Important:** data is kept in JavaScript arrays and is lost when a page is reloaded or another page is opened.
So everything that must work together (for example rooms and tasks) lives on ONE page. The menu on the left shows and hides sections (`.style.display`).

## Test accounts
admin@hotel.com / admin123 · manager@hotel.com / manager123 · reception@hotel.com / recep123 · guest@hotel.com / guest123

## Coding rules (only what the course taught)
- HTML forms/tables, CSS classes and ids, JavaScript: `let`/`const`, arrays of objects, `for` loops, `if/else`, `switch`, functions, `onclick`/`onchange`/`onkeyup`/`onsubmit`, `getElementById`, `innerHTML`, `.style`, `.value`, `.trim()`, `.length`, `.push()`, `.indexOf()`, regex `.test()`.
- No `localStorage`, no frameworks, no arrow functions, no `map`/`filter`/`find`. Use loops instead.
- Prefix your CSS classes with your role (`adm-`, `mgr-`, `rec-`, `gst-`).
- Copy the layout (topbar, sidebar, cards, fieldset forms) from `Page/Manager.html`.

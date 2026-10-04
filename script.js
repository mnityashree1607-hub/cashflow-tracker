
/* =========================================================
   CASHFLOW - EXPENSE TRACKER
   Uses localStorage to save expenses
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const MONTHLY_INCOME = 35000;
    const MONTHLY_BUDGET = 15000;


    /* =====================================================
       GET HTML ELEMENTS
    ===================================================== */

    const expenseToggle =
        document.getElementById("expense-toggle");

    const amountInput =
        document.getElementById("expense-amount");

    const dateInput =
        document.getElementById("expense-date");

    const paymentInput =
        document.getElementById("expense-payment");

    const descriptionInput =
        document.getElementById("expense-description");

    const saveButton =
        document.getElementById("save-expense");

    const totalBalance =
        document.getElementById("total-balance");

    const totalIncome =
        document.getElementById("total-income");

    const totalExpenses =
        document.getElementById("total-expenses");

    const budgetRemaining =
        document.getElementById("budget-remaining");

    const breakdownTotal =
        document.getElementById("breakdown-total");

    const transactionList =
        document.getElementById("transaction-list");

    const categoryOptions =
        document.querySelectorAll(".category-option");

    const viewAllButton =
        document.getElementById("view-all");


    /* =====================================================
       CATEGORY INFORMATION
    ===================================================== */

    const categoryData = {

        Food: {
            icon: "fa-utensils",
            className: "food"
        },

        Travel: {
            icon: "fa-car",
            className: "travel"
        },

        Shopping: {
            icon: "fa-bag-shopping",
            className: "shopping"
        },

        Bills: {
            icon: "fa-lightbulb",
            className: "bills"
        }

    };


    /* =====================================================
       VARIABLES
    ===================================================== */

    let selectedCategory = null;

    let expenses = [];


    /* =====================================================
       LOAD EXPENSES FROM LOCAL STORAGE
    ===================================================== */

    try {

        expenses =
            JSON.parse(
                localStorage.getItem("cashflowExpenses")
            ) || [];

    } catch (error) {

        expenses = [];

    }


    /* =====================================================
       FORMAT MONEY
    ===================================================== */

    function formatMoney(amount) {

        return new Intl.NumberFormat("en-IN", {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0

        }).format(amount);

    }


    /* =====================================================
       GET TODAY'S DATE
    ===================================================== */

    function getTodayString() {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateString) {

        const date =
            new Date(dateString + "T00:00:00");

        if (isNaN(date.getTime())) {

            return "Unknown date";

        }


        const today =
            new Date();

        const yesterday =
            new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );


        function sameDay(first, second) {

            return (
                first.getDate() === second.getDate() &&
                first.getMonth() === second.getMonth() &&
                first.getFullYear() === second.getFullYear()
            );

        }


        if (sameDay(date, today)) {

            return "Today";

        }


        if (sameDay(date, yesterday)) {

            return "Yesterday";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(dateString) {

        const date =
            new Date(dateString);

        if (isNaN(date.getTime())) {

            return "";

        }


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* =====================================================
       CATEGORY SELECTION
    ===================================================== */

    categoryOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                /* Remove previous selection */

                categoryOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                /* Select clicked category */

                option.classList.add(
                    "selected"
                );


                selectedCategory =
                    option.dataset.category;

            }
        );

    });


    /* =====================================================
       SAVE DATA
    ===================================================== */

    function saveExpenses() {

        localStorage.setItem(
            "cashflowExpenses",
            JSON.stringify(expenses)
        );

    }


    /* =====================================================
       SAVE NEW EXPENSE
    ===================================================== */

    saveButton.addEventListener(
        "click",
        function () {

            const amount =
                Number(amountInput.value);

            const date =
                dateInput.value;

            const payment =
                paymentInput.value;

            const description =
                descriptionInput.value.trim();


            /* -----------------------------
               VALIDATE AMOUNT
            ----------------------------- */

            if (!amount || amount <= 0) {

                alert(
                    "Please enter a valid expense amount."
                );

                amountInput.focus();

                return;

            }


            /* -----------------------------
               VALIDATE CATEGORY
            ----------------------------- */

            if (!selectedCategory) {

                alert(
                    "Please select a category."
                );

                return;

            }


            /* -----------------------------
               VALIDATE DATE
            ----------------------------- */

            if (!date) {

                alert(
                    "Please select a date."
                );

                dateInput.focus();

                return;

            }


            /* -----------------------------
               CREATE EXPENSE
            ----------------------------- */

            const expense = {

                id: Date.now(),

                amount: amount,

                category: selectedCategory,

                date: date,

                payment: payment,

                description: description,

                createdAt:
                    new Date().toISOString()

            };


            /* Add expense */

            expenses.unshift(expense);


            /* Save */

            saveExpenses();


            /* Update dashboard */

            updateDashboard();


            /* Clear form */

            resetForm();


            /* Close popup */

            expenseToggle.checked = false;

        }
    );


    /* =====================================================
       RESET FORM
    ===================================================== */

    function resetForm() {

        amountInput.value = "";

        descriptionInput.value = "";

        paymentInput.value = "UPI";

        dateInput.value =
            getTodayString();


        selectedCategory = null;


        categoryOptions.forEach(
            function (option) {

                option.classList.remove(
                    "selected"
                );

            }
        );

    }


    /* =====================================================
       DELETE EXPENSE
    ===================================================== */

    function deleteExpense(id) {

        const expense =
            expenses.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!expense) {

            return;

        }


        const confirmed =
            confirm(
                "Delete " +
                formatMoney(expense.amount) +
                " " +
                expense.category +
                " expense?"
            );


        if (!confirmed) {

            return;

        }


        expenses =
            expenses.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        saveExpenses();

        updateDashboard();

    }


    /* =====================================================
       GET TOTAL EXPENSES
    ===================================================== */

    function getTotalExpenses() {

        return expenses.reduce(
            function (total, expense) {

                return (
                    total +
                    Number(expense.amount)
                );

            },
            0
        );

    }


    /* =====================================================
       UPDATE DASHBOARD
    ===================================================== */

    function updateDashboard() {

        const expenseTotal =
            getTotalExpenses();


        /* Balance */

        const balance =
            MONTHLY_INCOME -
            expenseTotal;


        /* Budget */

        const remaining =
            MONTHLY_BUDGET -
            expenseTotal;


        /* Income */

        totalIncome.textContent =
            formatMoney(
                MONTHLY_INCOME
            );


        /* Expenses */

        totalExpenses.textContent =
            formatMoney(
                expenseTotal
            );


        /* Balance */

        totalBalance.textContent =
            formatMoney(
                balance
            );


        /* Budget remaining */

        budgetRemaining.textContent =
            formatMoney(
                Math.max(
                    remaining,
                    0
                )
            );


        /* Breakdown total */

        breakdownTotal.textContent =
            formatMoney(
                expenseTotal
            );


        /* Update transactions */

        renderTransactions();


        /* Update chart */

        updateBreakdown();

    }


    /* =====================================================
       RENDER TRANSACTIONS
    ===================================================== */

    function renderTransactions() {

        transactionList.innerHTML = "";


        /* No expenses */

        if (expenses.length === 0) {

            transactionList.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-receipt"></i>

                    <h3>No expenses yet</h3>

                    <p>
                        Add your first expense
                        to see it here.
                    </p>

                </div>

            `;

            return;

        }


        /* Show latest 10 */

        const recentExpenses =
            expenses.slice(0, 10);


        recentExpenses.forEach(
            function (expense) {

                const category =
                    categoryData[
                        expense.category
                    ];


                if (!category) {

                    return;

                }


                const transaction =
                    document.createElement(
                        "div"
                    );


                transaction.className =
                    "transaction";


                transaction.innerHTML = `

                    <div class="
                        transaction-icon
                        ${category.className}
                    ">

                        <i class="
                            fa-solid
                            ${category.icon}
                        "></i>

                    </div>


                    <div class="
                        transaction-info
                    ">

                        <h3>
                            ${escapeHTML(
                                expense.category
                            )}
                        </h3>

                        <p>

                            ${formatDate(
                                expense.date
                            )}

                            • 

                            ${formatTime(
                                expense.createdAt
                            )}

                            ${
                                expense.description
                                ? " • " +
                                  escapeHTML(
                                      expense.description
                                  )
                                : ""
                            }

                            • 

                            ${escapeHTML(
                                expense.payment
                            )}

                        </p>

                    </div>


                    <span class="
                        expense-amount
                    ">

                        -${formatMoney(
                            expense.amount
                        )}

                    </span>


                    <button
                        class="delete-expense"
                        data-id="${expense.id}"
                        title="Delete expense">

                        <i class="
                            fa-solid
                            fa-trash
                        "></i>

                    </button>

                `;


                transactionList.appendChild(
                    transaction
                );

            }
        );


        /* Delete buttons */

        document
            .querySelectorAll(
                ".delete-expense"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteExpense(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       UPDATE EXPENSE BREAKDOWN
    ===================================================== */

    function updateBreakdown() {

        const totals = {

            Food: 0,

            Travel: 0,

            Shopping: 0,

            Bills: 0

        };


        /* Calculate category totals */

        expenses.forEach(
            function (expense) {

                if (
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            totals,
                            expense.category
                        )
                ) {

                    totals[
                        expense.category
                    ] += Number(
                        expense.amount
                    );

                }

            }
        );


        /* Total */

        const total =
            Object.values(totals)
                .reduce(
                    function (sum, value) {

                        return sum + value;

                    },
                    0
                );


        /* Percentages */

        const percentages = {

            Food: 0,

            Travel: 0,

            Shopping: 0,

            Bills: 0

        };


        if (total > 0) {

            Object.keys(totals)
                .forEach(
                    function (category) {

                        percentages[
                            category
                        ] = Math.round(

                            (
                                totals[
                                    category
                                ] / total
                            ) * 100

                        );

                    }
                );

        }


        /* Update percentages */

        document.getElementById(
            "food-percent"
        ).textContent =
            percentages.Food + "%";


        document.getElementById(
            "travel-percent"
        ).textContent =
            percentages.Travel + "%";


        document.getElementById(
            "shopping-percent"
        ).textContent =
            percentages.Shopping + "%";


        document.getElementById(
            "bills-percent"
        ).textContent =
            percentages.Bills + "%";


        /* Update donut */

        updateDonut(
            percentages
        );

    }


    /* =====================================================
       UPDATE DONUT CHART
    ===================================================== */

    function updateDonut(percentages) {

        const donut =
            document.querySelector(
                ".donut"
            );


        if (!donut) {

            return;

        }


        const food =
            percentages.Food;

        const travel =
            percentages.Travel;

        const shopping =
            percentages.Shopping;


        const foodEnd =
            food;


        const travelEnd =
            food +
            travel;


        const shoppingEnd =
            food +
            travel +
            shopping;


        donut.style.background = `

            conic-gradient(

                rgb(56, 56, 240)
                0 ${foodEnd}%,

                #52a8ff
                ${foodEnd}% ${travelEnd}%,

                #9b6de3
                ${travelEnd}% ${shoppingEnd}%,

                #f0c84b
                ${shoppingEnd}% 100%

            )

        `;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            String(value);

        return div.innerHTML;

    }


    /* =====================================================
       VIEW ALL
    ===================================================== */

    if (viewAllButton) {

        viewAllButton.addEventListener(
            "click",
            function () {

                transactionList.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* =====================================================
       ENTER KEY TO SAVE
    ===================================================== */

    amountInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                saveButton.click();

            }

        }
    );


    /* =====================================================
       INITIALIZE APP
    ===================================================== */

    dateInput.value =
        getTodayString();


    updateDashboard();

});
// ===============================
// PROFILE MENU
// ===============================

const profileBtn = document.getElementById("profile-btn");
const profileMenu = document.getElementById("profile-menu");

profileBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    profileMenu.classList.toggle("show");

});

// Close profile menu when clicking outside
document.addEventListener("click", function () {

    profileMenu.classList.remove("show");

});
// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function () {

    // Clear login session
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");

    // Go back to login page
    window.location.href = "login.html";

});
// ===============================
// MY PROFILE
// ===============================

const myProfileBtn = document.getElementById("my-profile-btn");

myProfileBtn.addEventListener("click", function () {

    const email = sessionStorage.getItem("userEmail");

    alert(
        "My Profile\n\n" +
        "Email: " + (email || "Not available")
    );

});


// ===============================
// SETTINGS PANEL
// ===============================

const settingsBtn = document.getElementById("settings-btn");
const settingsOverlay = document.getElementById("settings-overlay");
const closeSettings = document.getElementById("close-settings");

// Open Settings
settingsBtn.addEventListener("click", function () {

    settingsOverlay.classList.add("show");

});

// Close Settings
closeSettings.addEventListener("click", function () {

    settingsOverlay.classList.remove("show");

});

// Close when clicking outside the panel
settingsOverlay.addEventListener("click", function (event) {

    if (event.target === settingsOverlay) {

        settingsOverlay.classList.remove("show");

    }

});

// ===============================
// SETTINGS → PROFILE
// ===============================

const settingsProfileBtn =
    document.getElementById("settings-profile-btn");

settingsProfileBtn.addEventListener("click", function () {

    const email = sessionStorage.getItem("userEmail");

    alert(
        "Profile\n\n" +
        "Email: " + (email || "Not available")
    );

});
// ================= SETTINGS CONNECTION =================

document.addEventListener("DOMContentLoaded", function () {

    const settingsBtn = document.getElementById("settings-btn");
    const settingsOverlay = document.getElementById("settings-overlay");
    const closeSettings = document.getElementById("close-settings");

    // Open Settings
    if (settingsBtn && settingsOverlay) {

        settingsBtn.addEventListener("click", function () {

            settingsOverlay.classList.add("show");

        });

    }

    // Close Settings
    if (closeSettings && settingsOverlay) {

        closeSettings.addEventListener("click", function () {

            settingsOverlay.classList.remove("show");

        });

    }

    // Close when clicking outside the settings panel
    if (settingsOverlay) {

        settingsOverlay.addEventListener("click", function (event) {

            if (event.target === settingsOverlay) {

                settingsOverlay.classList.remove("show");

            }

        });

    }

});
// ===============================
// SETTINGS FEATURES
// ===============================

// DARK MODE
const darkModeToggle = document.getElementById("dark-mode-toggle");

if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", this.checked);
        localStorage.setItem("cashflowDarkMode", this.checked);
    });

    // Remember dark mode
    if (localStorage.getItem("cashflowDarkMode") === "true") {
        darkModeToggle.checked = true;
        document.body.classList.add("dark-mode");
    }
}


// PASSWORD & SECURITY
const passwordSecurityBtn = document.querySelector(
    ".settings-section .setting-item i.fa-chevron-right"
);

if (passwordSecurityBtn) {
    passwordSecurityBtn.parentElement.addEventListener("click", function () {
        alert(
            "🔐 Password & Security\n\n" +
            "Your password should never be stored as plain text.\n\n" +
            "The final CashFlow application should use secure password hashing, " +
            "backend validation, protected database storage and secure sessions."
        );
    });
}


// EXPORT EXPENSE DATA
const exportDataBtn = document.getElementById("export-data-btn");

if (exportDataBtn) {
    exportDataBtn.addEventListener("click", function () {

        if (expenses.length === 0) {
            alert("No expense data available to export.");
            return;
        }

        const data = JSON.stringify(expenses, null, 2);

        const blob = new Blob(
            [data],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "cashflow-expense-data.json";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        alert("Expense data exported successfully! ✅");
    });
}


// RESET SETTINGS
const resetSettingsBtn =
    document.getElementById("reset-settings-btn");

if (resetSettingsBtn) {

    resetSettingsBtn.addEventListener("click", function () {

        const confirmed = confirm(
            "Are you sure you want to reset your CashFlow settings?"
        );

        if (!confirmed) {
            return;
        }

        // Reset dark mode
        localStorage.removeItem("cashflowDarkMode");

        if (darkModeToggle) {
            darkModeToggle.checked = false;
        }

        document.body.classList.remove("dark-mode");

        // Reset other settings
        const expenseReminder =
            document.getElementById("expense-reminder-toggle");

        const budgetAlert =
            document.getElementById("budget-alert-toggle");

        const aiSuggestion =
            document.getElementById("ai-suggestion-toggle");

        if (expenseReminder) {
            expenseReminder.checked = true;
        }

        if (budgetAlert) {
            budgetAlert.checked = true;
        }

        if (aiSuggestion) {
            aiSuggestion.checked = true;
        }

        alert("CashFlow settings have been reset successfully! ✅");
    });
    }
    // ===============================
// FILE / DOCUMENTS FEATURE
// ===============================

const fileBtn = document.getElementById("file-btn");

if (fileBtn) {

    fileBtn.addEventListener("click", function () {

        const savedExpenses =
            JSON.parse(
                localStorage.getItem("cashflowExpenses")
            ) || [];

        if (savedExpenses.length === 0) {

            alert(
                "No expense records available yet.\n\n" +
                "Add an expense first and then use the File button."
            );

            return;
        }

        const data = JSON.stringify(
            savedExpenses,
            null,
            2
        );

        const blob = new Blob(
            [data],
            { type: "application/json" }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "CashFlow-Expense-Backup.json";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        alert(
            "Your CashFlow expense backup has been downloaded successfully! ✅"
        );
    });
}
// ===============================
// SEARCH BUTTON
// ===============================

const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
    searchBtn.addEventListener("click", function () {

        const searchText = prompt(
            "🔍 Search your expenses\n\nEnter category, payment method, description, amount, or date:"
        );

        if (searchText === null) {
            return;
        }

        const query = searchText.trim().toLowerCase();

        if (query === "") {
            alert("Please enter something to search.");
            return;
        }

        const expenses =
            JSON.parse(localStorage.getItem("cashflowExpenses")) || [];

        const results = expenses.filter(function (expense) {

            return (
                String(expense.category || "").toLowerCase().includes(query) ||
                String(expense.payment || "").toLowerCase().includes(query) ||
                String(expense.description || "").toLowerCase().includes(query) ||
                String(expense.amount || "").toLowerCase().includes(query) ||
                String(expense.date || "").toLowerCase().includes(query)
            );
        });

        if (results.length === 0) {
            alert("No expenses found for: " + searchText);
            return;
        }

        let message = "🔍 Search Results\n\n";

        results.forEach(function (expense, index) {

            message +=
                (index + 1) +
                ". " +
                expense.category +
                " — ₹" +
                expense.amount +
                "\n" +
                "   " +
                expense.payment +
                " • " +
                expense.date +
                "\n";

            if (expense.description) {
                message +=
                    "   " +
                    expense.description +
                    "\n";
            }

            message += "\n";
        });

        alert(message);
    });
}

/* =========================================================
   CASHFLOW EXPENSE TRACKER
========================================================= */


/* =========================================================
   GLOBAL DATA
========================================================= */

let expenses =
    JSON.parse(
        localStorage.getItem("cashflowExpenses")
    ) || [];


let monthlyIncome =
    Number(
        localStorage.getItem("cashflowIncome")
    ) || 35000;


let monthlyBudget =
    Number(
        localStorage.getItem("cashflowBudget")
    ) || 15000;


let userProfile =
    JSON.parse(
        localStorage.getItem("cashflowProfile")
    ) || {
        name: "",
        email:
            sessionStorage.getItem("userEmail") || ""
    };


/* =========================================================
   CATEGORY DATA
========================================================= */

const categoryData = {

    Food: {
        icon: "fa-utensils"
    },

    Travel: {
        icon: "fa-car"
    },

    Shopping: {
        icon: "fa-bag-shopping"
    },

    Bills: {
        icon: "fa-lightbulb"
    }

};


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveUserSettings() {

    localStorage.setItem(
        "cashflowIncome",
        monthlyIncome
    );

    localStorage.setItem(
        "cashflowBudget",
        monthlyBudget
    );

}


/* =========================================================
   SAVE EXPENSES
========================================================= */

function saveExpenses() {

    localStorage.setItem(
        "cashflowExpenses",
        JSON.stringify(expenses)
    );

}


/* =========================================================
   SAVE PROFILE
========================================================= */

function saveProfile() {

    localStorage.setItem(
        "cashflowProfile",
        JSON.stringify(userProfile)
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           ELEMENTS
        ================================================= */

        const totalBalance =
            document.getElementById(
                "total-balance"
            );

        const totalIncome =
            document.getElementById(
                "total-income"
            );

        const totalExpenses =
            document.getElementById(
                "total-expenses"
            );

        const budgetRemaining =
            document.getElementById(
                "budget-remaining"
            );

        const breakdownTotal =
            document.getElementById(
                "breakdown-total"
            );

        const transactionList =
            document.getElementById(
                "transaction-list"
            );


        /* =================================================
           FORM ELEMENTS
        ================================================= */

        const expenseAmount =
            document.getElementById(
                "expense-amount"
            );

        const expenseDate =
            document.getElementById(
                "expense-date"
            );

        const expensePayment =
            document.getElementById(
                "expense-payment"
            );

        const expenseDescription =
            document.getElementById(
                "expense-description"
            );

        const expenseForm =
            document.getElementById(
                "expense-form"
            );

        const selectedCategoryInput =
            document.getElementById(
                "selected-category"
            );


        /* =================================================
           INITIAL DATE
        ================================================= */

        if (expenseDate) {

            expenseDate.value =
                getTodayString();

        }


        /* =================================================
           CATEGORY SELECTION
        ================================================= */

        document
            .querySelectorAll(
                ".category-option"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            document
                                .querySelectorAll(
                                    ".category-option"
                                )
                                .forEach(
                                    btn =>
                                        btn.classList.remove(
                                            "selected"
                                        )
                                );

                            this.classList.add(
                                "selected"
                            );

                            selectedCategoryInput.value =
                                this.dataset.category;

                        }
                    );

                }
            );


        /* =================================================
           OPEN ADD EXPENSE
        ================================================= */

        document
            .getElementById(
                "expense-toggle"
            )
            ?.addEventListener(
                "click",
                openExpenseModal
            );


        document
            .getElementById(
                "transaction-add-btn"
            )
            ?.addEventListener(
                "click",
                openExpenseModal
            );


        document
            .getElementById(
                "report-add-btn"
            )
            ?.addEventListener(
                "click",
                openExpenseModal
            );


        /* =================================================
           CLOSE EXPENSE MODAL
        ================================================= */

        document
            .getElementById(
                "close-expense-modal"
            )
            ?.addEventListener(
                "click",
                closeExpenseModal
            );


        /* =================================================
           SAVE EXPENSE
        ================================================= */

        expenseForm?.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const amount =
                    Number(
                        expenseAmount.value
                    );


                const category =
                    selectedCategoryInput.value;


                const date =
                    expenseDate.value;


                const payment =
                    expensePayment.value;


                const description =
                    expenseDescription.value.trim();


                if (
                    !amount ||
                    amount <= 0
                ) {

                    alert(
                        "Please enter a valid amount."
                    );

                    return;

                }


                if (!category) {

                    alert(
                        "Please select an expense category."
                    );

                    return;

                }


                if (!date) {

                    alert(
                        "Please select a date."
                    );

                    return;

                }


                const expense = {

                    id: Date.now(),

                    amount: amount,

                    category: category,

                    date: date,

                    payment: payment,

                    description: description,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                expenses.unshift(
                    expense
                );


                saveExpenses();

                updateDashboard();

                renderAllTransactions();

                generateReport();

                updateBudgetPage();

                resetExpenseForm();

                closeExpenseModal();


                alert(
                    "Expense added successfully!"
                );

            }
        );


        /* =================================================
           VIEW ALL
        ================================================= */

        document
            .getElementById(
                "view-all"
            )
            ?.addEventListener(
                "click",
                function () {

                    showPage(
                        "transactions-page"
                    );

                    setActiveMenu(
                        "transactions-nav"
                    );

                    renderAllTransactions();

                }
            );


        /* =================================================
           DASHBOARD NAV
        ================================================= */

        document
            .getElementById(
                "dashboard-nav"
            )
            ?.addEventListener(
                "click",
                function () {

                    showPage(
                        "dashboard-page"
                    );

                    setActiveMenu(
                        "dashboard-nav"
                    );

                }
            );


        /* =================================================
           TRANSACTIONS NAV
        ================================================= */

        document
            .getElementById(
                "transactions-nav"
            )
            ?.addEventListener(
                "click",
                function () {

                    showPage(
                        "transactions-page"
                    );

                    setActiveMenu(
                        "transactions-nav"
                    );

                    renderAllTransactions();

                }
            );


        /* =================================================
           REPORTS NAV
        ================================================= */

        document
            .getElementById(
                "reports-nav"
            )
            ?.addEventListener(
                "click",
                function () {

                    showPage(
                        "reports-page"
                    );

                    setActiveMenu(
                        "reports-nav"
                    );

                    generateReport();

                }
            );


        /* =================================================
           BUDGET NAV
        ================================================= */

        document
            .getElementById(
                "budget-nav"
            )
            ?.addEventListener(
                "click",
                function () {

                    showPage(
                        "budget-page"
                    );

                    setActiveMenu(
                        "budget-nav"
                    );

                    updateBudgetPage();

                }
            );


        /* =================================================
           SAVE INCOME
        ================================================= */

        document
            .getElementById(
                "save-income-btn"
            )
            ?.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            "monthly-income-input"
                        );

                    const value =
                        Number(
                            input.value
                        );


                    if (
                        isNaN(value) ||
                        value < 0
                    ) {

                        alert(
                            "Please enter a valid income."
                        );

                        return;

                    }


                    monthlyIncome = value;

                    saveUserSettings();

                    updateDashboard();

                    updateBudgetPage();

                    generateReport();

                    updateSettingsValues();


                    alert(
                        "Monthly income updated successfully!"
                    );

                }
            );


        /* =================================================
           SAVE BUDGET
        ================================================= */

        document
            .getElementById(
                "save-budget-btn"
            )
            ?.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            "monthly-budget-input"
                        );

                    const value =
                        Number(
                            input.value
                        );


                    if (
                        isNaN(value) ||
                        value < 0
                    ) {

                        alert(
                            "Please enter a valid budget."
                        );

                        return;

                    }


                    monthlyBudget = value;

                    saveUserSettings();

                    updateDashboard();

                    updateBudgetPage();

                    generateReport();

                    updateSettingsValues();


                    alert(
                        "Monthly budget updated successfully!"
                    );

                }
            );


        /* =================================================
           INITIAL DASHBOARD
        ================================================= */

        updateDashboard();

        updateBudgetPage();

        updateSettingsValues();

        loadSettings();

        loadProfileName();

    }
);


/* =========================================================
   OPEN EXPENSE MODAL
========================================================= */

function openExpenseModal() {

    const modal =
        document.getElementById(
            "expense-modal"
        );

    if (!modal) return;

    modal.classList.add(
        "active"
    );

}


/* =========================================================
   CLOSE EXPENSE MODAL
========================================================= */

function closeExpenseModal() {

    const modal =
        document.getElementById(
            "expense-modal"
        );

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

}


/* =========================================================
   RESET EXPENSE FORM
========================================================= */

function resetExpenseForm() {

    const form =
        document.getElementById(
            "expense-form"
        );

    if (form) {

        form.reset();

    }


    const categoryInput =
        document.getElementById(
            "selected-category"
        );

    if (categoryInput) {

        categoryInput.value = "";

    }


    document
        .querySelectorAll(
            ".category-option"
        )
        .forEach(
            btn =>
                btn.classList.remove(
                    "selected"
                )
        );


    const date =
        document.getElementById(
            "expense-date"
        );

    if (date) {

        date.value =
            getTodayString();

    }

}


/* =========================================================
   DATE
========================================================= */

function getTodayString() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) return "";

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(dateString) {

    if (!dateString) return "";

    const date =
        new Date(dateString);

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const totalExpense =
        getTotalExpenses();


    const balance =
        monthlyIncome -
        totalExpense;


    const remaining =
        monthlyBudget -
        totalExpense;


    const totalIncome =
        document.getElementById(
            "total-income"
        );

    const totalExpenses =
        document.getElementById(
            "total-expenses"
        );

    const totalBalance =
        document.getElementById(
            "total-balance"
        );

    const budgetRemaining =
        document.getElementById(
            "budget-remaining"
        );

    const breakdownTotal =
        document.getElementById(
            "breakdown-total"
        );


    if (totalIncome) {

        totalIncome.textContent =
            formatMoney(
                monthlyIncome
            );

    }


    if (totalExpenses) {

        totalExpenses.textContent =
            formatMoney(
                totalExpense
            );

    }


    if (totalBalance) {

        totalBalance.textContent =
            formatMoney(
                balance
            );

        if (balance < 0) {

            totalBalance.style.color =
                "#dc2626";

        } else {

            totalBalance.style.color =
                "";

        }

    }


    if (budgetRemaining) {

        budgetRemaining.textContent =
            formatMoney(
                Math.max(
                    remaining,
                    0
                )
            );

        if (remaining < 0) {

            budgetRemaining.style.color =
                "#dc2626";

        } else if (
            remaining <=
            monthlyBudget * 0.2
        ) {

            budgetRemaining.style.color =
                "#f59e0b";

        } else {

            budgetRemaining.style.color =
                "";

        }

    }


    if (breakdownTotal) {

        breakdownTotal.textContent =
            formatMoney(
                totalExpense
            );

    }


    renderTransactions();

    updateBreakdown();

    updateBudgetWarning();

}


/* =========================================================
   TOTAL EXPENSES
========================================================= */

function getTotalExpenses() {

    return expenses.reduce(
        function (total, expense) {

            return total +
                Number(
                    expense.amount
                );

        },
        0
    );

}


/* =========================================================
   RENDER RECENT TRANSACTIONS
========================================================= */

function renderTransactions() {

    const list =
        document.getElementById(
            "transaction-list"
        );


    if (!list) return;


    if (
        expenses.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-receipt"></i>

                <h3>No Transactions Yet</h3>

                <p>
                    Add your first expense.
                </p>

            </div>

        `;

        return;

    }


    const latest =
        expenses.slice(
            0,
            10
        );


    list.innerHTML =
        latest
            .map(
                expense => {

                    const category =
                        categoryData[
                            expense.category
                        ] ||
                        categoryData.Food;


                    return `

                        <div
                            class="transaction-item"
                        >

                            <div
                                class="transaction-left"
                            >

                                <div
                                    class="transaction-icon"
                                >

                                    <i
                                        class="fa-solid
                                        ${category.icon}"
                                    ></i>

                                </div>


                                <div
                                    class="transaction-info"
                                >

                                    <h4>
                                        ${escapeHTML(
                                            expense.category
                                        )}
                                    </h4>

                                    <p>
                                        ${formatDate(
                                            expense.date
                                        )}
                                        •
                                        ${escapeHTML(
                                            expense.payment
                                        )}
                                    </p>

                                    ${
                                        expense.description
                                        ?
                                        `<p>
                                            ${escapeHTML(
                                                expense.description
                                            )}
                                        </p>`
                                        :
                                        ""
                                    }

                                </div>

                            </div>


                            <div
                                class="transaction-right"
                            >

                                <span
                                    class="transaction-amount"
                                >
                                    -
                                    ${formatMoney(
                                        expense.amount
                                    )}
                                </span>


                                <button
                                    class="delete-expense"
                                    onclick="deleteExpense(${expense.id})"
                                    title="Delete"
                                >

                                    <i
                                        class="fa-solid
                                        fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   DELETE EXPENSE
========================================================= */

function deleteExpense(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) return;


    expenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    saveExpenses();

    updateDashboard();

    renderAllTransactions();

    generateReport();

    updateBudgetPage();

}


/* =========================================================
   EXPENSE BREAKDOWN
========================================================= */

function updateBreakdown() {

    const totals = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Bills: 0

    };


    expenses.forEach(
        expense => {

            if (
                totals[
                    expense.category
                ] !== undefined
            ) {

                totals[
                    expense.category
                ] += Number(
                    expense.amount
                );

            }

        }
    );


    const total =
        Object.values(
            totals
        ).reduce(
            (a, b) =>
                a + b,
            0
        );


    const categories = [
        "Food",
        "Travel",
        "Shopping",
        "Bills"
    ];


    categories.forEach(
        category => {

            const id =
                category.toLowerCase() +
                "-percent";


            const element =
                document.getElementById(
                    id
                );


            if (!element) return;


            const percentage =
                total > 0
                ?
                (
                    totals[category] /
                    total *
                    100
                ).toFixed(1)
                :
                0;


            element.textContent =
                percentage + "%";

        }
    );


    updateDonut(
        totals,
        total
    );

}


/* =========================================================
   UPDATE DONUT
========================================================= */

function updateDonut(
    totals,
    total
) {

    const donut =
        document.getElementById(
            "expense-donut"
        );


    if (!donut) return;


    if (total === 0) {

        donut.style.background =
            "#e5e7eb";

        return;

    }


    const food =
        totals.Food /
        total *
        360;


    const travel =
        totals.Travel /
        total *
        360;


    const shopping =
        totals.Shopping /
        total *
        360;


    const foodEnd =
        food;


    const travelEnd =
        food +
        travel;


    const shoppingEnd =
        food +
        travel +
        shopping;


    donut.style.background =
        `
        conic-gradient(
            #4f46e5
            0deg
            ${foodEnd}deg,

            #22c55e
            ${foodEnd}deg
            ${travelEnd}deg,

            #f59e0b
            ${travelEnd}deg
            ${shoppingEnd}deg,

            #ef4444
            ${shoppingEnd}deg
            360deg
        )
        `;

}


/* =========================================================
   FULL TRANSACTIONS
========================================================= */

function renderAllTransactions() {

    const list =
        document.getElementById(
            "all-transactions-list"
        );


    const count =
        document.getElementById(
            "all-transaction-count"
        );


    const total =
        document.getElementById(
            "all-transaction-total"
        );


    if (!list) return;


    if (count) {

        count.textContent =
            expenses.length;

    }


    if (total) {

        total.textContent =
            formatMoney(
                getTotalExpenses()
            );

    }


    if (
        expenses.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <i
                    class="fa-solid
                    fa-receipt"
                ></i>

                <h3>
                    No Transactions
                </h3>

                <p>
                    Your transactions will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        expenses
            .map(
                expense => {

                    const category =
                        categoryData[
                            expense.category
                        ] ||
                        categoryData.Food;


                    return `

                        <div
                            class="transaction-item"
                        >

                            <div
                                class="transaction-left"
                            >

                                <div
                                    class="transaction-icon"
                                >

                                    <i
                                        class="fa-solid
                                        ${category.icon}"
                                    ></i>

                                </div>


                                <div
                                    class="transaction-info"
                                >

                                    <h4>
                                        ${escapeHTML(
                                            expense.category
                                        )}
                                    </h4>

                                    <p>
                                        ${formatDate(
                                            expense.date
                                        )}

                                        •

                                        ${escapeHTML(
                                            expense.payment
                                        )}
                                    </p>

                                    ${
                                        expense.description
                                        ?
                                        `<p>
                                            ${escapeHTML(
                                                expense.description
                                            )}
                                        </p>`
                                        :
                                        ""
                                    }

                                </div>

                            </div>


                            <div
                                class="transaction-right"
                            >

                                <span
                                    class="transaction-amount"
                                >
                                    -
                                    ${formatMoney(
                                        expense.amount
                                    )}
                                </span>


                                <button
                                    class="delete-expense"
                                    onclick="deleteExpense(${expense.id})"
                                >

                                    <i
                                        class="fa-solid
                                        fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   REPORTS
========================================================= */

function generateReport() {

    const totalExpense =
        getTotalExpenses();


    const balance =
        monthlyIncome -
        totalExpense;


    const reportIncome =
        document.getElementById(
            "report-income"
        );


    const reportExpenses =
        document.getElementById(
            "report-expenses"
        );


    const reportBalance =
        document.getElementById(
            "report-balance"
        );


    const reportBudget =
        document.getElementById(
            "report-budget"
        );


    if (reportIncome) {

        reportIncome.textContent =
            formatMoney(
                monthlyIncome
            );

    }


    if (reportExpenses) {

        reportExpenses.textContent =
            formatMoney(
                totalExpense
            );

    }


    if (reportBalance) {

        reportBalance.textContent =
            formatMoney(
                balance
            );

    }


    if (reportBudget) {

        reportBudget.textContent =
            formatMoney(
                monthlyBudget
            );

    }


    const summaryIncome =
        document.getElementById(
            "summary-income"
        );


    const summaryExpenses =
        document.getElementById(
            "summary-expenses"
        );


    const summaryBalance =
        document.getElementById(
            "summary-balance"
        );


    if (summaryIncome) {

        summaryIncome.textContent =
            formatMoney(
                monthlyIncome
            );

    }


    if (summaryExpenses) {

        summaryExpenses.textContent =
            formatMoney(
                totalExpense
            );

    }


    if (summaryBalance) {

        summaryBalance.textContent =
            formatMoney(
                balance
            );

    }


    generateCategoryReport();

}


/* =========================================================
   CATEGORY REPORT
========================================================= */

function generateCategoryReport() {

    const container =
        document.getElementById(
            "category-report"
        );


    if (!container) return;


    const categories = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Bills: 0

    };


    expenses.forEach(
        expense => {

            if (
                categories[
                    expense.category
                ] !== undefined
            ) {

                categories[
                    expense.category
                ] += Number(
                    expense.amount
                );

            }

        }
    );


    const total =
        getTotalExpenses();


    if (total === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <i
                    class="fa-solid
                    fa-chart-pie"
                ></i>

                <h3>
                    No Report Data
                </h3>

                <p>
                    Add expenses to generate
                    your spending report.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        Object.entries(
            categories
        )
        .map(
            ([category, amount]) => {

                const percentage =
                    (
                        amount /
                        total *
                        100
                    ).toFixed(1);


                return `

                    <div
                        class="category-report-item"
                    >

                        <div
                            class="category-report-header"
                        >

                            <strong>
                                ${category}
                            </strong>

                            <span>
                                ${formatMoney(
                                    amount
                                )}
                                (${percentage}%)
                            </span>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="
                                    width:${percentage}%;
                                "
                            ></div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   BUDGET PAGE
========================================================= */

function updateBudgetPage() {

    const incomeInput =
        document.getElementById(
            "monthly-income-input"
        );


    const budgetInput =
        document.getElementById(
            "monthly-budget-input"
        );


    if (incomeInput) {

        incomeInput.value =
            monthlyIncome;

    }


    if (budgetInput) {

        budgetInput.value =
            monthlyBudget;

    }


    const incomeElement =
        document.getElementById(
            "budget-page-income"
        );


    const budgetElement =
        document.getElementById(
            "budget-page-budget"
        );


    const expenseElement =
        document.getElementById(
            "budget-page-expenses"
        );


    const remainingElement =
        document.getElementById(
            "budget-page-remaining"
        );


    const totalExpense =
        getTotalExpenses();


    const remaining =
        monthlyBudget -
        totalExpense;


    if (incomeElement) {

        incomeElement.textContent =
            formatMoney(
                monthlyIncome
            );

    }


    if (budgetElement) {

        budgetElement.textContent =
            formatMoney(
                monthlyBudget
            );

    }


    if (expenseElement) {

        expenseElement.textContent =
            formatMoney(
                totalExpense
            );

    }


    if (remainingElement) {

        remainingElement.textContent =
            formatMoney(
                Math.max(
                    remaining,
                    0
                )
            );

        if (remaining < 0) {

            remainingElement.style.color =
                "#dc2626";

        } else {

            remainingElement.style.color =
                "";

        }

    }

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    document
        .querySelectorAll(
            ".app-page"
        )
        .forEach(
            page =>
                page.classList.remove(
                    "active"
                )
        );


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }

}


function setActiveMenu(id) {

    document
        .querySelectorAll(
            ".side-option"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    const active =
        document.getElementById(
            id
        );


    if (active) {

        active.classList.add(
            "active"
        );

    }

}


/* =========================================================
   PROFILE
========================================================= */

const profileBtn =
    document.getElementById(
        "profile-btn"
    );


const profileMenu =
    document.getElementById(
        "profile-menu"
    );


profileBtn?.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        profileMenu.classList.toggle(
            "show"
        );

    }
);


document.addEventListener(
    "click",
    function (event) {

        if (
            profileMenu &&
            !profileMenu.contains(event.target) &&
            event.target !== profileBtn
        ) {

            profileMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   PROFILE MODAL
========================================================= */

function openProfileModal() {

    const modal =
        document.getElementById(
            "profile-modal"
        );


    const name =
        document.getElementById(
            "profile-name"
        );


    const email =
        document.getElementById(
            "profile-email"
        );


    if (!modal) return;


    name.value =
        userProfile.name || "";


    email.value =
        userProfile.email ||
        sessionStorage.getItem(
            "userEmail"
        ) ||
        "";


    modal.classList.add(
        "active"
    );

}


document
    .getElementById(
        "my-profile-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            openProfileModal();

            profileMenu.classList.remove(
                "show"
            );

        }
    );


document
    .getElementById(
        "close-profile-modal"
    )
    ?.addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "profile-modal"
                )
                .classList.remove(
                    "active"
                );

        }
    );


document
    .getElementById(
        "save-profile"
    )
    ?.addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "profile-name"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "profile-email"
                    )
                    .value
                    .trim();


            if (!name) {

                alert(
                    "Please enter your name."
                );

                return;

            }


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            userProfile.name =
                name;


            userProfile.email =
                email;


            saveProfile();


            sessionStorage.setItem(
                "userEmail",
                email
            );


            document
                .getElementById(
                    "profile-modal"
                )
                .classList.remove(
                    "active"
                );


            loadProfileName();


            alert(
                "Profile updated successfully!"
            );

        }
    );


/* =========================================================
   WELCOME TEXT
========================================================= */

function loadProfileName() {

    const welcome =
        document.getElementById(
            "welcome-text"
        );


    if (!welcome) return;


    if (userProfile.name) {

        welcome.textContent =
            `Welcome, ${userProfile.name}!`;

    } else {

        welcome.textContent =
            "Welcome to CashFlow";

    }

}


/* =========================================================
   SETTINGS
========================================================= */

const settingsOverlay =
    document.getElementById(
        "settings-overlay"
    );


document
    .getElementById(
        "settings-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            settingsOverlay.classList.add(
                "active"
            );

            profileMenu.classList.remove(
                "show"
            );

        }
    );


document
    .getElementById(
        "close-settings"
    )
    ?.addEventListener(
        "click",
        function () {

            settingsOverlay.classList.remove(
                "active"
            );

        }
    );


/* =========================================================
   SETTINGS PROFILE
========================================================= */

document
    .getElementById(
        "settings-profile-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            settingsOverlay.classList.remove(
                "active"
            );

            openProfileModal();

        }
    );


/* =========================================================
   SETTINGS INCOME
========================================================= */

document
    .getElementById(
        "settings-income-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            const value =
                prompt(
                    "Enter your monthly income:",
                    monthlyIncome
                );


            if (value === null) return;


            const income =
                Number(value);


            if (
                isNaN(income) ||
                income < 0
            ) {

                alert(
                    "Please enter a valid income."
                );

                return;

            }


            monthlyIncome =
                income;


            saveUserSettings();

            updateDashboard();

            updateBudgetPage();

            generateReport();

            updateSettingsValues();

        }
    );


/* =========================================================
   SETTINGS BUDGET
========================================================= */

document
    .getElementById(
        "settings-budget-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            const value =
                prompt(
                    "Enter your monthly budget:",
                    monthlyBudget
                );


            if (value === null) return;


            const budget =
                Number(value);


            if (
                isNaN(budget) ||
                budget < 0
            ) {

                alert(
                    "Please enter a valid budget."
                );

                return;

            }


            monthlyBudget =
                budget;


            saveUserSettings();

            updateDashboard();

            updateBudgetPage();

            generateReport();

            updateSettingsValues();

        }
    );


/* =========================================================
   SETTINGS VALUES
========================================================= */

function updateSettingsValues() {

    const income =
        document.getElementById(
            "settings-income-value"
        );


    const budget =
        document.getElementById(
            "settings-budget-value"
        );


    if (income) {

        income.textContent =
            formatMoney(
                monthlyIncome
            );

    }


    if (budget) {

        budget.textContent =
            formatMoney(
                monthlyBudget
            );

    }

}


/* =========================================================
   DARK MODE
========================================================= */

const darkModeToggle =
    document.getElementById(
        "dark-mode-toggle"
    );


darkModeToggle?.addEventListener(
    "change",
    function () {

        document.body.classList.toggle(
            "dark-mode",
            this.checked
        );


        localStorage.setItem(
            "cashflowDarkMode",
            this.checked
        );

    }
);


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    const darkMode =
        localStorage.getItem(
            "cashflowDarkMode"
        ) === "true";


    if (darkModeToggle) {

        darkModeToggle.checked =
            darkMode;

    }


    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );


    const reminder =
        localStorage.getItem(
            "cashflowReminder"
        ) === "true";


    const alertSetting =
        localStorage.getItem(
            "cashflowBudgetAlert"
        ) === "true";


    const ai =
        localStorage.getItem(
            "cashflowAI"
        ) === "true";


    const reminderToggle =
        document.getElementById(
            "expense-reminder-toggle"
        );


    const alertToggle =
        document.getElementById(
            "budget-alert-toggle"
        );


    const aiToggle =
        document.getElementById(
            "ai-suggestion-toggle"
        );


    if (reminderToggle) {

        reminderToggle.checked =
            reminder;

    }


    if (alertToggle) {

        alertToggle.checked =
            alertSetting;

    }


    if (aiToggle) {

        aiToggle.checked =
            ai;

    }

}


/* =========================================================
   REMINDER SETTING
========================================================= */

document
    .getElementById(
        "expense-reminder-toggle"
    )
    ?.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "cashflowReminder",
                this.checked
            );

        }
    );


/* =========================================================
   BUDGET ALERT SETTING
========================================================= */

document
    .getElementById(
        "budget-alert-toggle"
    )
    ?.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "cashflowBudgetAlert",
                this.checked
            );

            updateBudgetWarning();

        }
    );


/* =========================================================
   AI SETTING
========================================================= */

document
    .getElementById(
        "ai-suggestion-toggle"
    )
    ?.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "cashflowAI",
                this.checked
            );


            if (this.checked) {

                showAISuggestion();

            }

        }
    );


/* =========================================================
   BUDGET WARNING
========================================================= */

function updateBudgetWarning() {

    const enabled =
        localStorage.getItem(
            "cashflowBudgetAlert"
        ) === "true";


    if (!enabled) return;


    if (
        monthlyBudget <= 0
    ) return;


    const totalExpense =
        getTotalExpenses();


    const percentage =
        (
            totalExpense /
            monthlyBudget
        ) * 100;


    if (
        percentage >= 100
    ) {

        console.warn(
            "Budget exceeded!"
        );

    } else if (
        percentage >= 80
    ) {

        console.warn(
            "You have used more than 80% of your budget."
        );

    }

}


/* =========================================================
   AI SUGGESTION
========================================================= */

function showAISuggestion() {

    if (
        expenses.length === 0
    ) {

        alert(
            "AI Suggestion: Start adding your expenses to get spending suggestions."
        );

        return;

    }


    const total =
        getTotalExpenses();


    const percentage =
        monthlyBudget > 0
        ?
        (
            total /
            monthlyBudget *
            100
        ).toFixed(1)
        :
        0;


    let message;


    if (
        percentage >= 100
    ) {

        message =
            "Your expenses have exceeded your monthly budget. Consider reducing non-essential spending.";

    } else if (
        percentage >= 80
    ) {

        message =
            "You have used more than 80% of your monthly budget. Try to control unnecessary expenses.";

    } else {

        message =
            "Your spending is currently within your budget. Keep tracking your expenses regularly.";

    }


    alert(
        "CashFlow Spending Suggestion:\n\n" +
        message
    );

}


/* =========================================================
   EXPORT DATA
========================================================= */

document
    .getElementById(
        "export-data-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            if (
                expenses.length === 0
            ) {

                alert(
                    "There is no expense data to export."
                );

                return;

            }


            const data =
                JSON.stringify(
                    {
                        profile:
                            userProfile,

                        monthlyIncome:
                            monthlyIncome,

                        monthlyBudget:
                            monthlyBudget,

                        expenses:
                            expenses

                    },
                    null,
                    2
                );


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "cashflow-backup.json";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );

        }
    );


/* =========================================================
   FILE BACKUP BUTTON
========================================================= */

document
    .getElementById(
        "file-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            if (
                expenses.length === 0
            ) {

                alert(
                    "There is no expense data to backup."
                );

                return;

            }


            const data =
                JSON.stringify(
                    expenses,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "cashflow-expenses.json";


            link.click();


            URL.revokeObjectURL(
                url
            );

        }
    );


/* =========================================================
   SEARCH
========================================================= */

document
    .getElementById(
        "search-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            const searchTerm =
                prompt(
                    "Search category, description or payment method:"
                );


            if (!searchTerm) return;


            const term =
                searchTerm
                    .toLowerCase()
                    .trim();


            const results =
                expenses.filter(
                    expense => {

                        return (

                            expense.category
                                .toLowerCase()
                                .includes(
                                    term
                                )

                            ||

                            expense.payment
                                .toLowerCase()
                                .includes(
                                    term
                                )

                            ||

                            (
                                expense.description ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    term
                                )

                        );

                    }
                );


            if (
                results.length === 0
            ) {

                alert(
                    "No matching transactions found."
                );

                return;

            }


            showPage(
                "transactions-page"
            );


            setActiveMenu(
                "transactions-nav"
            );


            const list =
                document.getElementById(
                    "all-transactions-list"
                );


            list.innerHTML =
                results
                    .map(
                        expense => {

                            const category =
                                categoryData[
                                    expense.category
                                ] ||
                                categoryData.Food;


                            return `

                                <div
                                    class="transaction-item"
                                >

                                    <div
                                        class="transaction-left"
                                    >

                                        <div
                                            class="transaction-icon"
                                        >

                                            <i
                                                class="fa-solid
                                                ${category.icon}"
                                            ></i>

                                        </div>


                                        <div
                                            class="transaction-info"
                                        >

                                            <h4>
                                                ${escapeHTML(
                                                    expense.category
                                                )}
                                            </h4>

                                            <p>
                                                ${formatDate(
                                                    expense.date
                                                )}
                                                •
                                                ${escapeHTML(
                                                    expense.payment
                                                )}
                                            </p>

                                            <p>
                                                ${
                                                    escapeHTML(
                                                        expense.description ||
                                                        ""
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        class="transaction-right"
                                    >

                                        <span
                                            class="transaction-amount"
                                        >
                                            -
                                            ${formatMoney(
                                                expense.amount
                                            )}
                                        </span>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }
    );


/* =========================================================
   RESET SETTINGS
========================================================= */

document
    .getElementById(
        "reset-settings-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Reset all CashFlow settings to default?"
                );


            if (!confirmReset) return;


            monthlyIncome =
                35000;


            monthlyBudget =
                15000;


            localStorage.setItem(
                "cashflowIncome",
                monthlyIncome
            );


            localStorage.setItem(
                "cashflowBudget",
                monthlyBudget
            );


            localStorage.removeItem(
                "cashflowDarkMode"
            );


            localStorage.removeItem(
                "cashflowReminder"
            );


            localStorage.removeItem(
                "cashflowBudgetAlert"
            );


            localStorage.removeItem(
                "cashflowAI"
            );


            document.body.classList.remove(
                "dark-mode"
            );


            const dark =
                document.getElementById(
                    "dark-mode-toggle"
                );


            const reminder =
                document.getElementById(
                    "expense-reminder-toggle"
                );


            const budgetAlert =
                document.getElementById(
                    "budget-alert-toggle"
                );


            const ai =
                document.getElementById(
                    "ai-suggestion-toggle"
                );


            if (dark) dark.checked = false;

            if (reminder) reminder.checked = false;

            if (budgetAlert) budgetAlert.checked = false;

            if (ai) ai.checked = false;


            updateDashboard();

            updateBudgetPage();

            generateReport();

            updateSettingsValues();


            alert(
                "Settings reset successfully."
            );

        }
    );


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById(
        "logout-btn"
    )
    ?.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) return;


            sessionStorage.removeItem(
                "isLoggedIn"
            );


            sessionStorage.removeItem(
                "userEmail"
            );


            window.location.href =
                "login.html";

        }
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
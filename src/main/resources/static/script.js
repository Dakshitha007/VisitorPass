document.addEventListener("DOMContentLoaded", function () {
    const bootstrapButtonSelector = ".btn";
    const destructiveActions = /delete|revoke|reject/i;
    const optionalFields = ["vehicle-number"];
    const tableStates = new WeakMap();
    const visitorRequestStorageKey = "visitorPassVisitorRequests";
    let generatedOtp = "";

    function getAlertContainer() {
        let container = document.querySelector("[data-ui-alerts]");

        if (!container) {
            container = document.createElement("div");
            container.setAttribute("data-ui-alerts", "true");
            container.className = "position-fixed top-0 end-0 p-3";
            container.style.zIndex = "1080";
            document.body.appendChild(container);
        }

        return container;
    }

    function showAlert(message, type) {
        const alert = document.createElement("div");
        const alertType = type === "error" ? "danger" : type;
        alert.className = "alert alert-" + alertType + " alert-dismissible fade show shadow-sm mb-2";
        alert.setAttribute("role", "alert");
        alert.innerHTML = "<span>" + message + "</span><button type=\"button\" class=\"btn-close\" aria-label=\"Close\"></button>";

        const closeButton = alert.querySelector(".btn-close");
        closeButton.addEventListener("click", function () {
            alert.remove();
        });

        getAlertContainer().appendChild(alert);
        window.setTimeout(function () {
            if (alert.isConnected) {
                alert.remove();
            }
        }, 4500);
    }

    function updateDateTime() {
        let dateTime = document.querySelector("[data-current-date-time]");

        if (!dateTime) {
            const userText = document.querySelector(".navbar .text-white.small");

            if (!userText) {
                return;
            }

            dateTime = document.createElement("span");
            dateTime.setAttribute("data-current-date-time", "true");
            dateTime.className = "text-white-50 small d-none d-md-inline";
            userText.parentElement.insertBefore(dateTime, userText);
        }

        dateTime.textContent = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date());
    }

    function setActiveNavigation() {
        const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
        let activeLinkFound = false;

        document.querySelectorAll("aside .nav-link").forEach(function (link) {
            const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
            const isActive = !activeLinkFound && linkPath === currentPath && link.getAttribute("href").charAt(0) === "/";
            if (isActive) {
                activeLinkFound = true;
            }
            link.classList.toggle("active", isActive);
            link.setAttribute("aria-current", isActive ? "page" : "false");
        });
    }

    function addMobileMenuToggle() {
        const navbar = document.querySelector(".navbar .container-fluid");
        const sidebar = document.querySelector("aside");

        if (!navbar || !sidebar || navbar.querySelector("[data-mobile-menu-toggle]")) {
            return;
        }

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "navbar-toggler d-lg-none mb-2";
        toggle.setAttribute("data-mobile-menu-toggle", "true");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Toggle navigation");
        toggle.textContent = "Menu";
        navbar.insertBefore(toggle, navbar.querySelector(".d-flex"));

        toggle.addEventListener("click", function () {
            const isHidden = sidebar.classList.toggle("d-none");
            toggle.setAttribute("aria-expanded", String(!isHidden));
        });

        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth < 992) {
                    sidebar.classList.add("d-none");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    function clearFieldValidation(field) {
        field.classList.remove("is-invalid", "is-valid");
        const feedback = field.parentElement.querySelector(".invalid-feedback[data-ui-feedback]");

        if (feedback) {
            feedback.remove();
        }
    }

    function addFieldFeedback(field, message) {
        let feedback = field.parentElement.querySelector(".invalid-feedback[data-ui-feedback]");

        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "invalid-feedback";
            feedback.setAttribute("data-ui-feedback", "true");
            field.insertAdjacentElement("afterend", feedback);
        }

        feedback.textContent = message;
    }

    function validateField(field) {
        clearFieldValidation(field);

        if (optionalFields.includes(field.id) && !field.value.trim()) {
            return true;
        }

        const value = field.value.trim();
        const isSelectPlaceholder = field.tagName === "SELECT" && (field.selectedIndex === 0 || !value || /select|all /i.test(value));
        const validity = field.validity;
        const currentDate = new Date();
        const localToday = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, "0") + "-" + String(currentDate.getDate()).padStart(2, "0");
        const isPastDate = field.type === "date" && value && value < localToday;
        const isInvalid = !validity.valid || isSelectPlaceholder || isPastDate;

        if (isInvalid) {
            field.classList.add("is-invalid");
            let message = "This field is invalid.";

            if (validity.valueMissing || !value || isSelectPlaceholder) {
                message = "This field is required.";
            } else if (validity.typeMismatch) {
                message = "Enter a valid email address.";
            } else if (isPastDate) {
                message = "Visit date cannot be in the past.";
            } else if (validity.patternMismatch) {
                message = "Enter a value in the required format.";
            } else if (validity.tooShort) {
                message = "Enter at least " + field.minLength + " characters.";
            } else if (validity.tooLong) {
                message = "Enter no more than " + field.maxLength + " characters.";
            } else if (validity.rangeUnderflow || validity.rangeOverflow) {
                message = "Enter a value between " + field.min + " and " + field.max + ".";
            }

            addFieldFeedback(field, message);
            return false;
        }

        field.classList.add("is-valid");
        return true;
    }

    function validateForm(form) {
        let isValid = true;

        form.querySelectorAll("input, select, textarea").forEach(function (field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showAlert("Please complete the highlighted fields.", "error");
        }

        return isValid;
    }

    function resetForm(form) {
        window.setTimeout(function () {
            form.querySelectorAll("input, select, textarea").forEach(function (field) {
                clearFieldValidation(field);
            });
            showAlert("Form has been reset.", "info");
        }, 0);
    }

    function getTableForControl(control) {
        const section = control.closest("section");
        return section ? section.querySelector("table") : null;
    }

    function applyTableFilters(table) {
        const state = tableStates.get(table) || {};
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(function (row) {
            const cells = Array.from(row.cells).map(function (cell) {
                return cell.textContent.trim().toLowerCase();
            });
            const searchableText = cells.join(" ");
            const matchesSearch = !state.search || searchableText.includes(state.search);
            const matchesBlock = !state.block || cells[3] === state.block;
            const matchesFloor = !state.floor || (row.dataset.floor || "").toLowerCase() === state.floor;
            const matchesDate = !state.date || cells[5] === state.date;
            const matchesStatus = !state.status || cells[7] === state.status;
            const matchesFlat = !state.flat || cells[3] === state.flat;

            row.classList.toggle("d-none", !(matchesSearch && matchesBlock && matchesFloor && matchesDate && matchesStatus && matchesFlat));
        });
    }

    function initializeFilters() {
        document.querySelectorAll("input[type=search], input[type=date], select").forEach(function (control) {
            const table = getTableForControl(control);

            if (!table) {
                return;
            }

            const state = tableStates.get(table) || {};
            const id = control.id;

            control.addEventListener("input", function () {
                const currentState = tableStates.get(table) || {};
                if (id.includes("search")) currentState.search = control.value.trim().toLowerCase();
                if (id.includes("date-filter")) {
                    const selectedDate = control.value ? new Date(control.value + "T00:00:00") : null;
                    currentState.date = selectedDate ? selectedDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "").toLowerCase() : "";
                }
                tableStates.set(table, currentState);
                applyTableFilters(table);
            });

            control.addEventListener("change", function () {
                const currentState = tableStates.get(table) || {};
                const value = control.value.trim().toLowerCase();
                if (id.includes("block-filter")) currentState.block = value === "all blocks" ? "" : value;
                if (id.includes("floor-filter")) currentState.floor = value === "all floors" ? "" : value;
                if (id.includes("status-filter")) currentState.status = value === "all statuses" ? "" : value;
                if (id.includes("flat-filter")) currentState.flat = value === "all flats" ? "" : value;
                tableStates.set(table, currentState);
                applyTableFilters(table);
            });

            tableStates.set(table, state);
        });

        const residentTable = document.querySelector("#resident-list table");
        if (residentTable) {
            residentTable.querySelectorAll("tbody tr").forEach(function (row) {
                const flat = row.cells[2] ? row.cells[2].textContent.trim() : "";
                row.dataset.floor = flat.startsWith("A-") ? "1st floor" : flat.startsWith("B-") ? "2nd floor" : "3rd floor";
            });
        }
    }

    function initializeTableInteractions() {
        document.querySelectorAll("table").forEach(function (table) {
            table.querySelectorAll("thead th").forEach(function (heading, index) {
                if (/action/i.test(heading.textContent)) {
                    return;
                }

                heading.setAttribute("aria-sort", "none");
                heading.classList.add("user-select-none");
                heading.addEventListener("click", function () {
                    const currentDirection = heading.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
                    table.querySelectorAll("thead th").forEach(function (item) {
                        item.setAttribute("aria-sort", "none");
                        item.textContent = item.textContent.replace(/ [▲▼]$/, "");
                    });
                    heading.setAttribute("aria-sort", currentDirection);
                    heading.textContent = heading.textContent.replace(/ [▲▼]$/, "") + (currentDirection === "ascending" ? " ▲" : " ▼");
                });
            });

            table.querySelectorAll("tbody tr").forEach(function (row) {
                row.addEventListener("click", function (event) {
                    if (event.target.closest("button, a, input, select, textarea, label")) {
                        return;
                    }

                    table.querySelectorAll("tbody tr").forEach(function (item) {
                        item.classList.remove("table-active");
                    });
                    row.classList.add("table-active");
                });
            });
        });
    }

    function startButtonLoading(button) {
        if (button.dataset.loading === "true") {
            return;
        }

        button.dataset.loading = "true";
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = "<span class=\"spinner-border spinner-border-sm me-2\" role=\"status\" aria-hidden=\"true\"></span>Processing";

        window.setTimeout(function () {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
            button.dataset.loading = "false";
        }, 1400);
    }

    function updateApprovalStatus(button) {
        const action = button.textContent.trim().toLowerCase();
        const row = button.closest("tr");

        if (!row || !/^(approve|reject|pending|revoke)$/.test(action)) {
            return;
        }

        const approvalStatus = row.cells[7] ? row.cells[7].querySelector(".badge") : null;
        const securityStatus = row.cells[8] ? row.cells[8].querySelector(".badge") : null;
        const statusMap = {
            approve: { approval: "Approved", approvalClass: "text-bg-success", security: "Verified", securityClass: "text-bg-primary" },
            reject: { approval: "Rejected", approvalClass: "text-bg-danger", security: "Invalid", securityClass: "text-bg-danger" },
            pending: { approval: "Pending", approvalClass: "text-bg-warning", security: "Generated", securityClass: "text-bg-secondary" },
            revoke: { approval: "Revoked", approvalClass: "text-bg-secondary", security: "Expired", securityClass: "text-bg-secondary" }
        };
        const nextStatus = statusMap[action];

        if (approvalStatus) {
            approvalStatus.textContent = nextStatus.approval;
            approvalStatus.className = "badge " + nextStatus.approvalClass;
        }

        if (securityStatus) {
            securityStatus.textContent = nextStatus.security;
            securityStatus.className = "badge " + nextStatus.securityClass;
        }

        persistApprovalStatus(row.cells[0] ? row.cells[0].textContent.trim() : "", nextStatus);
    }

    function persistApprovalStatus(approvalId, status) {
        if (!approvalId) {
            return;
        }

        try {
            const requests = JSON.parse(window.localStorage.getItem(visitorRequestStorageKey) || "[]");
            const request = requests.find(function (item) {
                return item.id === approvalId;
            });

            if (request) {
                request.approvalStatus = status.approval;
                request.securityStatus = status.security;
                window.localStorage.setItem(visitorRequestStorageKey, JSON.stringify(requests));
            }
        } catch (error) {
            showAlert("Could not save the status in this browser.", "warning");
        }
    }

    function setOtpStatus(status, badgeClass) {
        const otpInput = document.querySelector("#otp-input");
        const statusCard = otpInput ? otpInput.closest(".card") : null;
        const statusBadge = statusCard ? statusCard.querySelector(".border.rounded .d-flex > .badge") : null;

        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = "badge " + badgeClass;
        }
    }

    function generateOtp() {
        generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        const otpInput = document.querySelector("#otp-input");

        if (otpInput) {
            otpInput.value = generatedOtp;
            otpInput.classList.remove("is-invalid");
            otpInput.classList.add("is-valid");
        }

        setOtpStatus("Generated", "text-bg-success");
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                "\"": "&quot;"
            }[character];
        });
    }

    function formatVisitDate(value) {
        if (!value) {
            return "";
        }

        const date = new Date(value + "T00:00:00");
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getSelectedText(id) {
        const field = document.querySelector("#" + id);

        if (!field) {
            return "";
        }

        return field.tagName === "SELECT" ? field.options[field.selectedIndex].text : field.value.trim();
    }

    function createVisitorRequestRow(request) {
        const row = document.createElement("tr");
        row.innerHTML = "<td class=\"px-4 fw-semibold\">" + escapeHtml(request.id) + "</td>"
            + "<td>" + escapeHtml(request.visitorName) + "</td>"
            + "<td>" + escapeHtml(request.resident) + "</td>"
            + "<td>" + escapeHtml(request.flat) + "</td>"
            + "<td>" + escapeHtml(request.purpose) + "</td>"
            + "<td>" + escapeHtml(formatVisitDate(request.visitDate)) + "</td>"
            + "<td>" + escapeHtml(request.otp) + "</td>"
            + "<td><span class=\"badge " + (request.approvalStatus === "Approved" ? "text-bg-success" : request.approvalStatus === "Rejected" ? "text-bg-danger" : request.approvalStatus === "Revoked" ? "text-bg-secondary" : "text-bg-warning") + "\">" + escapeHtml(request.approvalStatus || "Pending") + "</span></td>"
            + "<td><span class=\"badge " + (request.securityStatus === "Verified" ? "text-bg-primary" : request.securityStatus === "Invalid" ? "text-bg-danger" : "text-bg-secondary") + "\">" + escapeHtml(request.securityStatus || "Generated") + "</span></td>"
            + "<td class=\"text-end px-4 text-nowrap\">"
            + "<button type=\"button\" data-dynamic-action=\"true\" class=\"btn btn-sm btn-outline-primary\">View</button> "
            + "<button type=\"button\" data-dynamic-action=\"true\" class=\"btn btn-sm btn-outline-success\">Approve</button> "
            + "<button type=\"button\" data-dynamic-action=\"true\" class=\"btn btn-sm btn-outline-danger\">Reject</button> "
            + "<button type=\"button\" data-dynamic-action=\"true\" class=\"btn btn-sm btn-outline-warning\">Pending</button> "
            + "<button type=\"button\" data-dynamic-action=\"true\" class=\"btn btn-sm btn-outline-secondary\">Revoke</button>"
            + "</td>";
        return row;
    }

    function loadStoredVisitorRequests() {
        const table = document.querySelector("#visitor-requests table");

        if (!table) {
            return;
        }

        let requests = [];
        try {
            requests = JSON.parse(window.localStorage.getItem(visitorRequestStorageKey) || "[]");
        } catch (error) {
            requests = [];
        }

        const body = table.querySelector("tbody");
        requests.forEach(function (request) {
            body.appendChild(createVisitorRequestRow(request));
        });
    }

    function saveVisitorRequest(form) {
        const request = {
            id: "APP-" + Date.now(),
            visitorName: form.querySelector("#visitor-name").value.trim(),
            resident: getSelectedText("resident-name"),
            flat: getSelectedText("flat-number"),
            purpose: form.querySelector("#visit-purpose").value.trim(),
            visitDate: form.querySelector("#visit-date").value,
            otp: generatedOtp
        };
        let requests = [];

        try {
            requests = JSON.parse(window.localStorage.getItem(visitorRequestStorageKey) || "[]");
        } catch (error) {
            requests = [];
        }

        requests.push(request);
        window.localStorage.setItem(visitorRequestStorageKey, JSON.stringify(requests));
        window.setTimeout(function () {
            window.location.reload();
        }, 1400);
    }

    function loadDashboardVisitorRequests() {
        const table = document.querySelector("#reports table");

        if (!table) {
            return;
        }

        let requests = [];
        try {
            requests = JSON.parse(window.localStorage.getItem(visitorRequestStorageKey) || "[]");
        } catch (error) {
            requests = [];
        }

        const body = table.querySelector("tbody");
        requests.forEach(function (request) {
            const row = document.createElement("tr");
            const approvalStatus = request.approvalStatus || "Pending";
            const statusClass = approvalStatus === "Approved" ? "text-bg-success" : approvalStatus === "Rejected" ? "text-bg-danger" : approvalStatus === "Revoked" ? "text-bg-secondary" : "text-bg-warning";
            row.innerHTML = "<td class=\"px-4 fw-semibold\">" + escapeHtml(request.visitorName) + "</td>"
                + "<td>" + escapeHtml(request.resident) + "</td>"
                + "<td>" + escapeHtml(formatVisitDate(request.visitDate)) + "</td>"
                + "<td>" + escapeHtml(request.purpose) + "</td>"
                + "<td><span class=\"badge " + statusClass + "\">" + escapeHtml(approvalStatus) + "</span></td>"
                + "<td class=\"text-end px-4\"><a href=\"/approval-page\" class=\"btn btn-sm btn-outline-primary\">View</a></td>";
            body.appendChild(row);
        });
    }

    document.querySelectorAll("form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            if (form.dataset.backend === "true") {
                if (!validateForm(form)) {
                    event.preventDefault();
                }
                return;
            }

            event.preventDefault();
            if (validateForm(form)) {
                showAlert("Form is ready for review. No data was submitted.", "info");
            }
        });

        form.addEventListener("reset", function () {
            resetForm(form);
        });

        form.querySelectorAll("input, select, textarea").forEach(function (field) {
            field.addEventListener("blur", function () {
                if (field.value.trim()) {
                    validateField(field);
                }
            });
        });
    });

    document.querySelectorAll(bootstrapButtonSelector).forEach(function (button) {
        button.addEventListener("click", function (event) {
            const buttonText = button.textContent.trim();
            const form = button.closest("form");

            if (button.type === "reset") {
                return;
            }

            if (destructiveActions.test(buttonText) && !window.confirm("Are you sure you want to " + buttonText.toLowerCase() + " this request?")) {
                event.preventDefault();
                return;
            }

            if (form && !validateForm(form)) {
                event.preventDefault();
                return;
            }

            if (form && form.dataset.backend === "true") {
                return;
            }

            if (buttonText.toLowerCase().includes("verify otp")) {
                const otp = document.querySelector("#otp-input");
                if (!otp || !validateField(otp)) {
                    showAlert("Enter a valid OTP before verification.", "error");
                    event.preventDefault();
                    return;
                }

                if (!generatedOtp) {
                    showAlert("Generate an OTP before verifying it.", "warning");
                    event.preventDefault();
                    return;
                }

                if (otp.value !== generatedOtp) {
                    setOtpStatus("Invalid", "text-bg-danger");
                    showAlert("The OTP is invalid.", "error");
                    event.preventDefault();
                    return;
                }

                setOtpStatus("Verified", "text-bg-primary");
                showAlert("OTP verified successfully in the interface.", "success");
            }

            if (buttonText.toLowerCase().includes("generate otp") || buttonText.toLowerCase().includes("resend otp")) {
                generateOtp();

                if (buttonText.toLowerCase().includes("generate otp") && form) {
                    saveVisitorRequest(form);
                }
            }

            if (buttonText.toLowerCase().includes("logout")) {
                showAlert("Logout is available in the connected application.", "info");
                return;
            }

            updateApprovalStatus(button);
            startButtonLoading(button);
            showAlert(buttonText + " is being processed in the interface only.", "success");
        });
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-dynamic-action]");

        if (!button || button.disabled) {
            return;
        }

        const buttonText = button.textContent.trim();
        const action = buttonText.toLowerCase();

        if (action === "view") {
            showAlert("Open the approval page to review this visitor request.", "info");
            return;
        }

        if (destructiveActions.test(buttonText) && !window.confirm("Are you sure you want to " + action + " this request?")) {
            return;
        }

        updateApprovalStatus(button);
        startButtonLoading(button);
        showAlert(buttonText + " is being processed in the interface only.", "success");
    });

    document.querySelectorAll("a[href^='#']").forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    updateDateTime();
    window.setInterval(updateDateTime, 1000);
    const visitDate = document.querySelector("#visit-date");
    if (visitDate) {
        const currentDate = new Date();
        visitDate.min = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, "0") + "-" + String(currentDate.getDate()).padStart(2, "0");
    }
    setActiveNavigation();
    addMobileMenuToggle();
    loadStoredVisitorRequests();
    loadDashboardVisitorRequests();
    initializeFilters();
    initializeTableInteractions();
    showAlert("VisitorPass interface loaded.", "info");
});
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwl_XeoRfHEtJksbBQ04fkZ4HxneLLWhGb_KyFTwOna2u1yPShZSYPBS7bC21cMPvPiGQ/exec"; 

    const formData = { date: "", route: "", trip: "" };
    const form = document.getElementById("transport-form");
    const subHeader = document.getElementById("sub-header");
    const statusMessage = document.getElementById("status-message");

    const stepDate = document.getElementById("step-date");
    const stepRoute = document.getElementById("step-route");
    const stepDetails = document.getElementById("step-details");
    const dateInput = document.getElementById("date");
    const nextRouteButton = document.getElementById("btn-next-route");

    // --- Step 1: Date ---
    dateInput.valueAsDate = new Date();
    nextRouteButton.disabled = false;

    dateInput.addEventListener("input", () => {
        nextRouteButton.disabled = !dateInput.value;
    });

    // Step 1 → Step 2 (Route)
    nextRouteButton.addEventListener("click", () => {
        formData.date = dateInput.value;
        if (!formData.date) {
            alert("Please select a date.");
            return;
        }
        stepDate.classList.add("hidden");
        stepRoute.classList.remove("hidden");
        subHeader.textContent = "Step 2: Select Route";
    });

    // --- Step 2: Route Buttons ---
    const routeGrid = document.querySelector("#step-route .grid-container");
    for (let i = 1; i <= 14; i++) {
        const routeBtn = document.createElement("button");
        routeBtn.type = "button";
        routeBtn.className = "btn-route";
        routeBtn.textContent = `R${i}`;
        routeBtn.dataset.route = `R${i}`;

        // Step 2 → Step 3 (Details)
        routeBtn.addEventListener("click", () => {
            formData.route = routeBtn.dataset.route;
            stepRoute.classList.add("hidden");
            stepDetails.classList.remove("hidden");

            // --- THIS IS THE UPDATE ---
            // Re-format date from YYYY-MM-DD to DD/MM/YYYY for display
            const [year, month, day] = formData.date.split('-');
            const friendlyDate = `${day}/${month}/${year}`;
            
            // Set the new header text to include the route and the date
            subHeader.textContent = `Step 3: Details (${formData.route} - ${friendlyDate})`;
            // --- END OF UPDATE ---
        });

        routeGrid.appendChild(routeBtn);
    }
    
    // --- Step 3: Form Submission ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = document.getElementById("btn-submit");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const finalData = {
            ...formData,
            trip: document.getElementById("trip-select").value,
            studentCount: document.getElementById("student-count").value,
            time: document.getElementById("time").value,
            concerns: document.getElementById("concerns").value
        };

        if (!finalData.trip) {
            alert("Please select a trip (Morning or Evening).");
            submitButton.disabled = false;
            submitButton.textContent = "Submit Log";
            return;
        }

        try {
            await fetch(WEB_APP_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });
            showStatus("Log saved successfully!", "success");
            resetForm();
        } catch (error) {
            console.error("Error:", error);
            showStatus("Error saving log. Please try again.", "error");
        } finally {
            if (!submitButton.disabled) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Log";
            }
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
    }

    function resetForm() {
        form.reset();
        dateInput.valueAsDate = new Date();
        nextRouteButton.disabled = false;
        formData.route = "";
        formData.trip = "";

        stepDetails.classList.add("hidden");
        stepRoute.classList.add("hidden");
        stepDate.classList.remove("hidden");

        subHeader.textContent = "Step 1: Select Date";
        showStatus("Form reset for next entry.", "");
    }

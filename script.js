// --- IMPORTANT ---
// PASTE YOUR GOOGLE APPS SCRIPT URL HERE:
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwl_XeoRfHEtJksbBQ04fkZ4HxneLLWhGb_KyFTwOna2u1yPShZSYPBS7bC21cMPvPiGQ/exec"; 
// -----------------

// Store form data
const formData = {
    date: "",
    route: "",
    trip: "",
};

// Get all the elements we need
const form = document.getElementById("transport-form");
const subHeader = document.getElementById("sub-header");
const statusMessage = document.getElementById("status-message");

const stepDate = document.getElementById("step-date");
const stepRoute = document.getElementById("step-route");
const stepTrip = document.getElementById("step-trip");
const stepDetails = document.getElementById("step-details");

// --- Step 1: Date ---
// Set date to today by default
document.getElementById("date").valueAsDate = new Date();

document.getElementById("btn-next-route").addEventListener("click", () => {
    formData.date = document.getElementById("date").value;
    if (!formData.date) {
        alert("Please select a date.");
        return;
    }
    stepDate.classList.add("hidden");
    stepRoute.classList.remove("hidden");
    subHeader.textContent = "Step 2: Select Route";
});

// --- Step 2: Route Buttons ---
// Auto-generate route buttons R1 to R14
const routeGrid = document.querySelector("#step-route .grid-container");
for (let i = 1; i <= 14; i++) {
    const routeBtn = document.createElement("button");
    routeBtn.type = "button";
    routeBtn.className = "btn-route";
    routeBtn.textContent = `R${i}`;
    routeBtn.dataset.route = `R${i}`;
    
    // THIS IS THE CORRECTED LINE:
    routeBtn.addEventListener("click", () => {
        formData.route = routeBtn.dataset.route;
        stepRoute.classList.add("hidden");
        stepTrip.classList.remove("hidden");
        subHeader.textContent = `Step 3: Trip Type (Route ${formData.route})`;
    });
    
    routeGrid.appendChild(routeBtn);
}

// --- Step 3: Trip Buttons ---
document.querySelectorAll(".btn-trip").forEach(button => {
    button.addEventListener("click", () => {
        formData.trip = button.dataset.trip;
        stepTrip.classList.add("hidden");
        stepDetails.classList.remove("hidden");
        subHeader.textContent = `Step 4: Details (${formData.route} - ${formData.trip})`;
    });
});

// --- Step 4: Form Submission ---
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the form from reloading the page

    const submitButton = document.getElementById("btn-submit");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Add final details to our formData object
    const finalData = {
        ...formData,
        studentCount: document.getElementById("student-count").value,
        time: document.getElementById("time").value,
        concerns: document.getElementById("concerns").value
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors", // Required for this type of Apps Script deployment
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
        });

        // "no-cors" mode means we can't read the response, but we assume success if no error
        showStatus("Log saved successfully!", "success");
        resetForm();

    } catch (error) {
        console.error("Error:", error);
        showStatus("Error saving log. Please try again.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Log";
    }
});

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function resetForm() {
    // Reset form fields
    form.reset();
    document.getElementById("date").valueAsDate = new Date();
    
    // Reset internal data (except date)
    formData.route = "";
    formData.trip = "";

    // Go back to step 1
    stepDetails.classList.add("hidden");
    stepDate.classList.remove("hidden");
    subHeader.textContent = "Step 1: Select Date";
    showStatus("Form reset for next entry.", "");
}

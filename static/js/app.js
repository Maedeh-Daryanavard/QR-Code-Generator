const tabs = document.querySelectorAll(".tab");
const dynamicForm = document.getElementById("dynamicForm");
const qrType = document.getElementById("qr_type");
const qrForm = document.getElementById("qrForm");

const qrPreview = document.getElementById("qrPreview");
const placeholder = document.getElementById("placeholder");
const downloadPng = document.getElementById("downloadPng");
const downloadSvg = document.getElementById("downloadSvg");

const forms = {
    url: `
        <div class="form-group">
            <label>Website URL</label>
            <input type="url" name="url" placeholder="https://example.com" required>
        </div>
    `,

    text: `
        <div class="form-group">
            <label>Text</label>
            <textarea name="text" placeholder="Enter your text..." required></textarea>
        </div>
    `,

    email: `
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required>
        </div>
        <div class="form-group">
            <label>Subject</label>
            <input type="text" name="subject">
        </div>
        <div class="form-group">
            <label>Message</label>
            <textarea name="body"></textarea>
        </div>
    `,

    phone: `
        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="+31612345678" required>
        </div>
    `,

    wifi: `
        <div class="form-group">
            <label>WiFi Name</label>
            <input type="text" name="ssid" required>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="text" name="password">
        </div>
        <div class="form-group">
            <label>Security</label>
            <select name="security">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
            </select>
        </div>
    `,

    maps: `
        <div class="form-group">
            <label>Google Maps Link</label>
            <input type="url" name="maps" placeholder="https://maps.google.com/..." required>
        </div>
    `,

    event: `
        <div class="form-group">
            <label>Event Title</label>
            <input type="text" name="event_title" required>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" name="event_location">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="event_description"></textarea>
        </div>
        <div class="form-group">
            <label>Start Date</label>
            <input type="date" name="start_date" required>
        </div>
        <div class="form-group">
            <label>Start Time</label>
            <input type="time" name="start_time" required>
        </div>
        <div class="form-group">
            <label>End Date</label>
            <input type="date" name="end_date" required>
        </div>
        <div class="form-group">
            <label>End Time</label>
            <input type="time" name="end_time" required>
        </div>
    `,

    vcard: `
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" name="company">
        </div>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" name="job">
        </div>
        <div class="form-group">
            <label>Website</label>
            <input type="url" name="website">
        </div>
    `
};

function loadForm(type) {
    dynamicForm.innerHTML = forms[type];
    qrType.value = type;

    qrPreview.style.display = "none";
    placeholder.style.display = "block";

    downloadPng.classList.add("disabled");
    downloadSvg.classList.add("disabled");
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        loadForm(tab.dataset.type);
    });
});

qrForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(qrForm);

    const response = await fetch("/generate", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    qrPreview.src = data.preview_url + "?t=" + new Date().getTime();
    qrPreview.style.display = "block";
    placeholder.style.display = "none";

    downloadPng.href = data.png_url;
    downloadSvg.href = data.svg_url;

    downloadPng.classList.remove("disabled");
    downloadSvg.classList.remove("disabled");
});

loadForm("url");
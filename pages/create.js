document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form#create-edit');
    const nameInput = document.querySelector('input[name="name"]');
    const urlInput = document.querySelector('input[name="url"]');
    
    async function submitForm(e) {
        e.preventDefault();
        e.target.disabled = true;
        const formData = new FormData(form);
        // Name may only contain alphanumerics or slashes and cannot be empty
        const name = formData.get('name').trim().replace(/[^a-zA-Z0-9/]/g, '');
        if (name.length === 0) {
            alert('Name cannot be empty');
            return;
        }
        const url = formData.get('url');
        // Lightweight validation
        if (!URL.parse(url)) {
            alert('Invalid URL. Protocol required (http:// or https://)');
            return;
        }
        const { golinks } = await chrome.storage.local.get("golinks");
        const newGolinks = { ...golinks, [name]: url };

        await chrome.storage.local.set({ golinks: newGolinks });
        e.target.disabled = false;
        chrome.tabs.update({ url: "/pages/index.html" });
    }

    async function initForm() {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        if (!name) {
            return;
        }
        nameInput.value = name;
        const { golinks } = await chrome.storage.local.get("golinks");
        if (golinks[name]) {
            urlInput.value = golinks[name];
        }
    }

    form.addEventListener('submit', submitForm);
    initForm();
});
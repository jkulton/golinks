document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form#create-edit');
    const nameField = document.querySelector('input[name="name"]');
    const urlInput = document.querySelector('input[name="url"]');
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    
    async function submitForm(e) {
        e.preventDefault();
        e.target.disabled = true;
        const formData = new FormData(form);
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
        const { golinks } = await chrome.storage.local.get("golinks");
        if (!name || !golinks[name]) {
            chrome.tabs.update({ url: "/pages/index.html" });
        }
        nameField.value = name;
        urlInput.value = golinks[name];
    }

    form.addEventListener('submit', submitForm);
    initForm();
});
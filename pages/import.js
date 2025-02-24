document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    async function submitForm(event) {
        event.preventDefault();

        const { golinks: existingGolinks } = await chrome.storage.local.get("golinks");
        const formData = new FormData(form);
        const imports = formData.get('imports');
        const newGolinkEntries = imports.split(/\r?\n/);
        const importGolinks = {};
        for (const entry of newGolinkEntries) {
            const [key, value] = entry.split(',');
            if (!key || !value) {
                continue;
            }
            importGolinks[key] = value;
        }

        const golinks = { ...existingGolinks, ...importGolinks };
        await chrome.storage.local.set({ golinks });

        chrome.tabs.update({ url: "/pages/index.html" });
    }

    form.addEventListener('submit', submitForm);
});
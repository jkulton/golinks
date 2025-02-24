document.addEventListener('DOMContentLoaded', async function () {
    let content = '';
    const { golinks } = await chrome.storage.local.get("golinks");
    for (const [key, value] of Object.entries(golinks)) {
        content += `${key},${value}\n`;
    }
    document.querySelector('pre').textContent = content;
});
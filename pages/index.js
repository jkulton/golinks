document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('.golink-table tbody');
    const siteFooter = document.querySelector('.site-footer');
    
    async function rerenderTable() {
        table.querySelectorAll('.golink-row').forEach(row => row.remove());

        const { golinks } = await chrome.storage.local.get("golinks");

        for (let [key, value] of Object.entries(golinks || {})) {
            const row = table.insertRow();
            row.className = 'golink-row';

            const nameCell = row.insertCell();
            nameCell.textContent = key;

            const urlCell = row.insertCell();
            urlCell.className = 'word-break-all';
            const href = document.createElement('a');
            href.href = value;
            href.className = 'text-black';
            href.textContent = value;
            urlCell.appendChild(href);

            const actionsCell = row.insertCell();
            actionsCell.className = 'nowrap';

            const editLink = document.createElement('a');
            editLink.href = `/pages/edit.html?name=${encodeURI(key)}`;
            editLink.className = 'text-black mr-2';
            editLink.textContent = 'Edit';
            actionsCell.appendChild(editLink);

            const deleteLink = document.createElement('a');
            deleteLink.className = 'text-black mr-2';
            deleteLink.setAttribute('href', '#');
            deleteLink.textContent = 'Delete';
            deleteLink.addEventListener('click', async (event) => {
                event.target.disabled = true;
                if (confirm(`Delete golink '${key}'?`) == true) {
                    const { golinks } = await chrome.storage.local.get("golinks");
                    delete golinks[key];
                    await chrome.storage.local.set({ golinks });
                    rerenderTable();
                }
                event.target.disabled = false;
            });
            actionsCell.appendChild(deleteLink);
        }

        const currentGolinkCount = Object.keys(golinks || {}).length;
        if (currentGolinkCount === 0) {
            return;
        }

        const tableFooter = document.querySelector('.golink-table--footer');
        tableFooter.innerHTML = '';
        const golinkCount = document.createElement('span');
        golinkCount.textContent = `${currentGolinkCount} golinks.`;
        golinkCount.classList = 'mr-1';
        tableFooter.appendChild(golinkCount);

        const deleteAllLink = document.createElement('a');
        deleteAllLink.addEventListener('click', async (event) => {
            event.target.disabled = true;
            const confirmation = `delete ${currentGolinkCount} golinks`;
            const answer = prompt(`Are you sure? Type '${confirmation}' to confirm.`);
            if (answer.toLocaleLowerCase() !== confirmation.toLocaleLowerCase()) {
                return;
            }
            await chrome.storage.local.set({ golinks: {} });
            rerenderTable();
            event.target.disabled = false;
        });
        deleteAllLink.classList = 'text-black';
        deleteAllLink.setAttribute('href', '#');
        deleteAllLink.textContent = 'Delete all.';
        tableFooter.appendChild(deleteAllLink);
    }

    function renderSiteFooter() {
        const { version, homepage_url } = chrome.runtime.getManifest();
        const footerLink = document.createElement('a');
        footerLink.href = homepage_url;
        footerLink.target = '_blank';
        footerLink.textContent = `v${version}`;
        footerLink.className = 'decoration-none text-stone-400 font-12';
        siteFooter.appendChild(footerLink);
    }

    rerenderTable();
    renderSiteFooter();
});
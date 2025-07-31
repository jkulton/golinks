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
            editLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
            editLink.href = `/pages/edit.html?name=${encodeURI(key)}`;
            editLink.className = 'golink-row--action';
            editLink.title = 'Edit golink';
            editLink.ariaLabel = 'Edit golink';
            actionsCell.appendChild(editLink);

            const deleteLink = document.createElement('a');
            deleteLink.className = 'golink-row--action';
            deleteLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
            deleteLink.setAttribute('href', '#');
            deleteLink.title = 'Delete golink';
            deleteLink.ariaLabel = 'Delete golink';
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
        golinkCount.textContent = `${currentGolinkCount} golink${currentGolinkCount > 1 ? 's' : ''}. `;
        tableFooter.appendChild(golinkCount);

        const deleteAllLink = document.createElement('a');
        deleteAllLink.addEventListener('click', async (event) => {
            event.target.disabled = true;
            const confirmation = `delete ${currentGolinkCount} golink${currentGolinkCount > 1 ? 's' : ''}`;
            const answer = prompt(`Are you sure? Type '${confirmation}' to confirm.`);
            if (answer.toLocaleLowerCase() !== confirmation.toLocaleLowerCase()) {
                return;
            }
            await chrome.storage.local.set({ golinks: {} });
            rerenderTable();
            event.target.disabled = false;
        });
        deleteAllLink.setAttribute('href', '#');
        deleteAllLink.textContent = 'Delete all.';
        tableFooter.appendChild(deleteAllLink);
    }

    function renderSiteFooter() {
        const { version, homepage_url } = chrome.runtime.getManifest();
        const footerRepoLink = document.createElement('a');
        footerRepoLink.href = homepage_url;
        footerRepoLink.target = '_blank';
        footerRepoLink.textContent = `v${version}`;
        siteFooter.appendChild(footerRepoLink);

        const footerHelpText = document.createElement('span');
        footerHelpText.textContent = ' | ';
        siteFooter.appendChild(footerHelpText);

        const footerHelpLink = document.createElement('a');
        footerHelpLink.href = '/pages/help.html';
        footerHelpLink.textContent = 'Help';
        siteFooter.appendChild(footerHelpLink);
    }

    rerenderTable();
    renderSiteFooter();
});
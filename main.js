// This extension heavily leverages the declarativeNetRequest API for golink redirection
// Docs https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
const WELCOME_DOC = "https://github.com/jkulton/golinks/blob/main/WELCOME.md";

const golinkToRule = ([key, value], index) => ({
  id: index + 3,
  priority: 2,
  action: {
    type: "redirect",
    redirect: { url: value },
  },
  condition: {
    urlFilter: `||go/${key}|`,
    resourceTypes: ["main_frame"],
  },
});

const getDefaultRules = () => {
  return [
      {
      id: 1,
      priority: 2,
      action: {
        type: "redirect",
        redirect: { extensionPath: '/pages/index.html' },
      },
      condition: {
        urlFilter: `||go/|`,
        resourceTypes: ["main_frame"],
      },
    },
    {
      id: 2,
      priority: 1,
      condition: {
        regexFilter: "^(http|https)://go/(.*)",
        resourceTypes: ["main_frame"]
      },
      action: {
        type: "redirect",
        redirect: {
          // Prior art: https://stackoverflow.com/a/74020603
          regexSubstitution: `chrome-extension://${chrome.runtime.id}/pages/create.html?name=\\2`
        }
      }
    }
  ];
}

const reloadGolinkRules = async () => {
  const defaultRules = getDefaultRules();
  const { golinks } = await chrome.storage.local.get("golinks");
  const golinkRules = Object.entries(golinks || {}).map(golinkToRule);
  const addRules = [...defaultRules, ...golinkRules];
  const options = { addRules };
  // Chrome docs suggests removing all rules before adding new ones
  const registeredRules = await chrome.declarativeNetRequest.getSessionRules()
  const removeRuleIds = registeredRules.map(rule => rule.id);
  if (registeredRules.length > 0) {
    options.removeRuleIds = removeRuleIds;
  }
  
  chrome.declarativeNetRequest.updateSessionRules(options);
};

const main = async () => await reloadGolinkRules();

chrome.storage.onChanged.addListener(() => reloadGolinkRules());
chrome.runtime.onStartup.addListener(() => reloadGolinkRules());

chrome.runtime.onInstalled.addListener(async () => {
  const { golinks } = await chrome.storage.local.get("golinks");
  if (golinks) {
    return;
  }
  await chrome.storage.local.set({ golinks: { "help": WELCOME_DOC } });
  await chrome.tabs.update({ url: WELCOME_DOC });
});

main().catch(console.error);
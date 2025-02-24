<img src="/images/icon.png" width=100 />

# golinks

golinks in your browser, without the need to modify DNS settings or run a server.

This is an unpacked Chrome extension which leverages Chrome's [`declarativeNetRequest`](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) to function as an all-in-one golinks system for personal use.

## Installation

1. Clone this repo
2. Go to **Manage Extensions** in your Chrome-based browser (`chrome://extensions`)
3. Toggle **Developer mode** on, then click **Load unpacked** and select the cloned repo
4. The extension should install and open a welcome message

## Usage

See [WELCOME.md](./WELCOME.md)

## Note

⚠️ All golink data is stored locally using [`chrome.storage.local`](https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas), but you still probably shouldn't put anything sensitive into a golink name

## "What are golinks?"

See https://golinks.github.io/golinks/
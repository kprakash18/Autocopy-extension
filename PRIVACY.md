# Privacy Policy for Auto Copy

**Last updated:** August 17, 2026

Thank you for using **Auto Copy** ("the Extension"). Your privacy is critically important to us. This Privacy Policy explains how the Extension operates and confirms our strict commitment to data privacy.

---

### 1. Overview & Core Principle
Auto Copy is designed with a **privacy-first, client-only architecture**. The Extension exists solely to automatically copy text you select on web pages and allow you to access your recent clipboard history locally.

**We do not collect, store on external servers, track, transmit, or sell any of your personal data or browsing activity.**

---

### 2. Information Handled by the Extension

#### A. Highlighted / Selected Text
- When you highlight text on a webpage, the Extension detects the selection event locally in your browser to copy the text to your system clipboard.
- This operation runs entirely on your local device. Highlighted text is **never** sent to any external server, API, or third-party service.

#### B. Clipboard History
- If you have the Clipboard History feature enabled, the Extension stores your recent copied snippets in your browser's local storage (`chrome.storage.local`).
- You can clear your clipboard history or delete individual snippets at any time directly within the Extension popup.

#### C. User Settings & Preferences
- Your configuration options (e.g., enable/disable toggle, toast notifications, duplicate prevention, and website whitelist rules) are stored using `chrome.storage.sync`.
- This storage is managed directly by Google Chrome and syncs across your logged-in Chrome browsers via your Google account. We have no access to this data.

---

### 3. Permissions Used and Why

| Permission | Purpose |
| :--- | :--- |
| `clipboardWrite` | Used solely to write your selected text to the system clipboard and allow re-copying from history. |
| `storage` | Used to save user settings and recent clipboard history locally on your device. |
| `tabs` | Used solely by the background service worker to read the current URL's hostname to evaluate website whitelist rules and update the toolbar icon/badge (`ON`/`OFF`). |
| Host Permissions (`<all_urls>`) | Required to inject the content script across web pages so that user text selections can be detected and copied according to your settings. |

---

### 4. Third-Party Services & Analytics
- The Extension **does not** use any third-party analytics (such as Google Analytics, Mixpanel, etc.).
- The Extension **does not** load any remote scripts, external fonts, or remote code.
- The Extension **does not** display advertisements or tracking pixels.

---

### 5. Children’s Privacy
The Extension does not collect any personal information from anyone, including children under the age of 13.

---

### 6. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Any updates will be reflected in this document with a revised "Last updated" date.

---

### 7. Contact & Support
If you have any questions, suggestions, or concerns regarding this Privacy Policy, please open an issue on GitHub:

- **GitHub Issues:** [https://github.com/kprakash18/Autocopy-extension/issues](https://github.com/kprakash18/Autocopy-extension/issues)
- **Project Repository:** [https://github.com/kprakash18/Autocopy-extension](https://github.com/kprakash18/Autocopy-extension)

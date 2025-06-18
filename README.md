# Monad Testnet Visual Explorer

Welcome to the Monad Testnet Visual Explorer, a dynamic and feature-rich dashboard built to provide a comprehensive and visually engaging overview of the Monad Testnet activity. This project was created as a submission for the Monad "Visualizers and Dashboards" mission (June 4 - June 18).

Our goal was to create a tool that is not only functional and accurate but also "left curve," offering a unique and memorable user experience.



![Dashboard Screenshot](https://raw.githubusercontent.com/Eccentrichealerbuilds/Monad-Dashboard-Visualizer/refs/heads/Main/Screenshot_20250616-183846.jpg)


### ✨ Key Features

* **Real-Time Stat Bar:** At-a-glance view of the most critical network stats, including live TPS, latest block number, and blocks per minute.
* **Interactive 3D Visualizer:** A unique, "left curve" visualization of the blockchain. Features live equalizer bars, freely hovering block/transaction text, and "shooting star" animations for recent transactions.
* **Live-Updating Tables & Charts:** See the latest blocks and transactions as they happen with auto-updating tables and charts for historical TPS and block creation rates.
* **Comprehensive On-Chain Search:** The search bars on the Blocks and Transactions pages can find any block by number or transaction receipt by hash, using a backend proxy to query the Alchemy endpoint directly if the data isn't available in the live stream.
* **Deep-Dive Modals:** Click on any block or transaction to open a detailed modal. The block modal includes an expandable transaction list to view all transactions within that block without leaving the page.
* **Rule-Compliant Leaderboards:** The "Top Senders" and "Top Contracts" tables are based purely on transaction counts, respecting the mission rule not to show individual farming efforts.
* **Sleek UI:** Includes a dark/light mode theme toggle and a responsive layout for a great experience on any device.

### 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, Three.js, Tone.js, Recharts
* **Backend:** Node.js, Express, `better-sqlite3`, `node-fetch`

### 🚀 Deployment & Setup

This project is a full-stack application with a separate frontend and backend.

#### Backend (Debian VPS)

1.  **Prerequisites:** Ensure `git` and `nvm` (or a recent version of Node.js) are installed.
2.  **Clone & Install:**
    ```bash
    git clone THIS-REPO-LINK
    npm install
    ```
3.  **Environment:** The backend uses an environment variable for the Alchemy URL. Create a `.env` file in the `THIS-REPO-NAME/backend` directory:
    ```
    ALCHEMY_URL=[https://your-alchemy-url.g.alchemy.com/v2/YOUR_API_KEY](https://your-alchemy-url.g.alchemy.com/v2/YOUR_API_KEY)
    ```
4.  **CORS:** For production, configure the CORS origin in `src/index.ts` to point to your frontend's Vercel URL.
5.  **Run with PM2:**
    ```bash
    npm install -g pm2
    pm2 start src/index.ts --name "monad-backend"
    pm2 save
    ```

#### 🖥️ Frontend (Same Debian VPS as Backend)

1. **Navigate to Frontend Directory:**

    ```bash
    cd Monad-Dashboard-Visualizer/frontend
    ```
2. **Install Dependencies:**
    ```
    npm install
    ```
3.
API_BASE_URL=http://YOUR_VPS_IP_ADDRESS:4000
    ```

4. **Build the Frontend:**

    ```bash
    npm run build
    ```

---

Made with ❤️ by [Eccentric Healer](https://x.com/eccentrichealer)

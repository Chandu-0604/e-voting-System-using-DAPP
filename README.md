🗳️ Blockchain Voting DApp
A decentralized voting application built with Solidity, Web3.js, and Chart.js that allows users to vote on-chain with transparent, tamper-proof results.

🚀 Features

✅ On-chain voting using Ethereum smart contracts

✅ Voting deadline with countdown timer

✅ Prevents double voting

✅ Dynamic candidate rendering

✅ Real-time vote results chart (via Chart.js)

✅ MetaMask integration for account management

📁 Project Structure
.
├── contracts/
│   └── Voting.sol           # Smart contract
├── migrations/
│   └── 2_deploy_contracts.js
├── src/
│   ├── index.html           # Frontend interface
│   ├── app.js               # Web3 & frontend logic
│   └── chart.js             # Chart.js setup
├── test/                    # Optional test scripts
├── truffle-config.js        # Truffle configuration
└── README.md
⚙️ Prerequisites
Node.js

Truffle

Ganache or local Ethereum node

MetaMask

🔧 Installation
Clone the repo


git clone https://github.com/your-username/voting-dapp.git
cd voting-dapp
Install dependencies


npm install
Start Ganache
Open Ganache and copy the RPC server URL and one of the private keys.

Compile and deploy smart contracts

truffle compile
truffle migrate --reset

✅ Make sure Ganache is running and configured correctly in truffle-config.js.

🧠 Smart Contract Summary
solidity
Copy
Edit
constructor(string[] memory candidates, uint durationSeconds)
Accepts an array of candidates and voting duration.

Tracks votes and prevents double voting.

Resets voting with new candidates via resetVoting.

🖥️ Running the Frontend
Open index.html in a browser with MetaMask installed and connected to your local Ganache network.

📊 Chart.js Integration
Vote counts are visualized using Chart.js in real-time as users cast votes.

📦 Deployment on Testnet (Optional)
Configure truffle-config.js with your Infura and MetaMask private key.

Run:

truffle migrate --network <your-network>

🙌 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.


🔗 Connect with Me
💼 LinkedIn

🧑‍💻 GitHub

📧 Email: chandu.62004@gmail.com

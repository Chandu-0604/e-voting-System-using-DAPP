// app.js
let contract;
let userAccount;
let voteChart;

const contractAddress = "0x1597054d16FB95204b6BA8896FFBa679dF8715bb";
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "candidateNames",
        "type": "string[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "votesReceived",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "totalVotesFor",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumCandidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidates",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function initWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      document.getElementById("account").textContent = userAccount;
      contract = new web3.eth.Contract(contractABI, contractAddress);
      renderCandidates();
      renderChart();

      // 👇 Auto-update on account change
      window.ethereum.on("accountsChanged", async (accounts) => {
        userAccount = accounts[0];
        document.getElementById("account").textContent = userAccount;
        showMessage("Account changed.", "blue");
        renderCandidates();
        renderChart();
      });

    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    alert("Please install MetaMask to use this DApp");
  }
}

async function renderCandidates() {
  const candidatesDiv = document.getElementById("candidates");
  candidatesDiv.innerHTML = "";
  const count = await contract.methods.getNumCandidates().call();
  for (let i = 0; i < count; i++) {
    const candidate = await contract.methods.candidates(i).call();
    const voteCount = await contract.methods.totalVotesFor(candidate).call();
    const div = document.createElement("div");
    div.className = "candidate-card";
    div.innerHTML = `
      <p>${candidate} — 🗳️ Votes: ${voteCount}</p>
      <button onclick="vote('${candidate}')">Vote</button>
    `;
    candidatesDiv.appendChild(div);
  }
}

async function vote(candidate) {
  try {
    const hasAlreadyVoted = await contract.methods.hasVoted(userAccount).call();
    if (hasAlreadyVoted) {
      showMessage("You have already voted.", "red");
      return;
    }

    await contract.methods.vote(candidate).send({ from: userAccount });
    showMessage("Vote cast successfully!", "green");
    renderCandidates();
    renderChart();
  } catch (error) {
    console.error(error);
    showMessage("Error casting vote.", "red");
  }
}

function showMessage(msg, color) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = msg;
  messageDiv.style.color = color;
}

async function renderChart() {
  const count = await contract.methods.getNumCandidates().call();
  const labels = [];
  const data = [];

  for (let i = 0; i < count; i++) {
    const candidate = await contract.methods.candidates(i).call();
    const votes = await contract.methods.totalVotesFor(candidate).call();
    labels.push(candidate);
    data.push(Number(votes)); // ✅ convert BigInt to Number here
  }

  if (voteChart) voteChart.destroy();

  const ctx = document.getElementById("voteChart").getContext("2d");
  voteChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Votes",
        data: data,
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}


document.getElementById("refreshAccountBtn").addEventListener("click", async () => {
  const accounts = await web3.eth.getAccounts();
  userAccount = accounts[0];
  document.getElementById("account").textContent = userAccount;
  showMessage("Account updated.", "green");
  renderCandidates();
  renderChart();
});

window.addEventListener("load", initWeb3);

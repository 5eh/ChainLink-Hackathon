const ethers = require("ethers");
require("@chainlink/env-enc").config();

// Your lottery contract address
const consumerAddress = "0x85e6A3046f68D89f3932952DE2F93CbdcF9545Db";

// CONTRACT ABI (same as before)
const contractAbi = [
  {
    inputs: [],
    name: "getParticipants",
    outputs: [{ internalType: "address[50]", name: "", type: "address[50]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "areWinnersSelected",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinners",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_lastRequestId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_lastResponse",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_winners", type: "address[]" },
    ],
    name: "setWinners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_randomNumbers", type: "uint256[]" },
    ],
    name: "setRandomNumbers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// DYNAMIC: Get the latest response from the contract
const getLatestChainlinkResponse = async (contract) => {
  console.log("🔍 === FETCHING LATEST CHAINLINK RESPONSE ===");

  try {
    // Method 1: Try to get the response from contract storage
    console.log("📋 Checking s_lastResponse...");
    const lastResponse = await contract.s_lastResponse();

    if (lastResponse && lastResponse !== "0x") {
      try {
        const responseString = ethers.utils.toUtf8String(lastResponse);
        console.log(`✅ Found response in contract: "${responseString}"`);
        return responseString;
      } catch (e) {
        console.log("⚠️  Response exists but can't decode as string");
      }
    }

    // Method 2: Get from Chainlink Functions logs
    console.log("📋 Searching transaction logs...");
    const requestId = await contract.s_lastRequestId();
    console.log(`🔍 Latest request ID: ${requestId}`);

    if (
      requestId &&
      requestId !==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      // Search for Response events
      const filter = contract.filters.Response(requestId);
      const events = await contract.queryFilter(filter, -10000); // Last 10000 blocks

      if (events.length > 0) {
        const latestEvent = events[events.length - 1];
        console.log(
          `✅ Found Response event in block ${latestEvent.blockNumber}`,
        );

        const responseData = latestEvent.args.response;
        if (responseData && responseData !== "0x") {
          try {
            const responseString = ethers.utils.toUtf8String(responseData);
            console.log(`✅ Decoded response: "${responseString}"`);
            return responseString;
          } catch (e) {
            console.log("⚠️  Can't decode response from event");
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.log(`❌ Error fetching response: ${error.message}`);
    return null;
  }
};

// ALTERNATIVE: Get from Chainlink Functions dashboard URL
const getResponseFromChainlinkDashboard = async () => {
  console.log("🌐 === FETCHING FROM CHAINLINK FUNCTIONS ===");
  console.log("📋 You can also get the response from:");
  console.log("   1. Go to functions.chain.link");
  console.log("   2. Find your latest request");
  console.log("   3. Copy the 'Output' value");
  console.log("   4. Paste it below when prompted");

  // For now, return null to trigger manual input
  return null;
};

// MANUAL INPUT as fallback
const getManualInput = () => {
  console.log("\n⌨️  === MANUAL INPUT REQUIRED ===");
  console.log(
    "📋 Please copy the computation response from Chainlink Functions dashboard",
  );
  console.log("📋 Example: '7,16,41,1,23,15,7,33,28,44'");
  console.log("");
  console.log("🔧 UPDATE THIS LINE IN THE SCRIPT:");
  console.log("   const manualResponse = 'YOUR_RESPONSE_HERE';");

  // MANUAL FALLBACK - UPDATE THIS WITH YOUR LATEST RESPONSE
  const manualResponse = "7,16,41,1,23,15,7,33,28,44"; // ✅ UPDATE THIS

  console.log(`📋 Using manual response: "${manualResponse}"`);
  return manualResponse;
};

const pushDynamicWinners = async () => {
  console.log("🚀 === DYNAMIC LOTTERY WINNERS PUSHER ===");
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  // Initialize ethers
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.ETHEREUM_SEPOLIA_RPC_URL;

  if (!privateKey || !rpcUrl) {
    throw new Error("Missing environment variables");
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  const contract = new ethers.Contract(consumerAddress, contractAbi, signer);

  console.log(`✅ Wallet address: ${signer.address}`);
  console.log(`📍 Contract address: ${consumerAddress}`);

  try {
    // STEP 1: Get the dynamic response
    let computationResponse = await getLatestChainlinkResponse(contract);

    if (!computationResponse) {
      computationResponse = await getResponseFromChainlinkDashboard();
    }

    if (!computationResponse) {
      computationResponse = getManualInput();
    }

    if (!computationResponse) {
      throw new Error(
        "❌ No computation response found! Please update the manual response.",
      );
    }

    console.log(`\n🎲 === USING RESPONSE: "${computationResponse}" ===`);

    // Parse the response
    const randomIndices = computationResponse
      .split(",")
      .map((num) => parseInt(num.trim()));
    console.log(`🎯 Parsed indices: [${randomIndices.join(", ")}]`);

    // Validate indices
    if (randomIndices.length === 0 || randomIndices.some(isNaN)) {
      throw new Error(
        "❌ Invalid response format! Expected comma-separated numbers.",
      );
    }

    // STEP 2: Process winners (same logic as before)
    console.log("\n📋 === PROCESSING PARTICIPANTS ===");
    const participants = await contract.getParticipants();
    console.log(`✅ Loaded ${participants.length} participants`);

    // Select winners (preventing duplicates)
    const winnerAddresses = [];
    const usedAddresses = new Set();
    const finalIndices = [];

    for (
      let i = 0;
      i < randomIndices.length && winnerAddresses.length < 10;
      i++
    ) {
      const index = randomIndices[i] % 50;
      const winnerAddress = participants[index];

      if (!usedAddresses.has(winnerAddress.toLowerCase())) {
        usedAddresses.add(winnerAddress.toLowerCase());
        winnerAddresses.push(winnerAddress);
        finalIndices.push(randomIndices[i]);

        console.log(
          `🏆 Winner ${winnerAddresses.length}: Index ${index} -> ${winnerAddress}`,
        );
      } else {
        console.log(`⚠️  Duplicate skipped: Index ${index}`);
      }
    }

    console.log(`\n🎯 Selected ${winnerAddresses.length} unique winners`);

    // STEP 3: Push to contract (same as before)
    console.log("\n📤 === PUSHING TO CONTRACT ===");

    try {
      // Set random numbers
      const setRandomTx = await contract.setRandomNumbers(finalIndices);
      console.log(`✅ Random numbers tx: ${setRandomTx.hash}`);
      await setRandomTx.wait();

      // Set winners
      const setWinnersTx = await contract.setWinners(winnerAddresses);
      console.log(`✅ Winners tx: ${setWinnersTx.hash}`);
      await setWinnersTx.wait();

      console.log("\n🎉 === SUCCESS! ===");
      console.log("🎉 Dynamic winners successfully pushed to contract!");
      console.log("💰 Ready for payout with payWinners()!");
    } catch (error) {
      if (
        error.message.includes("setWinners") ||
        error.message.includes("setRandomNumbers")
      ) {
        console.log("\n❌ Missing contract functions!");
        console.log("🔧 Add these functions to your contract:");
        console.log(`
function setWinners(address[] memory _winners) external onlyOwner {
    delete winners;
    for (uint256 i = 0; i < _winners.length; i++) {
        winners.push(_winners[i]);
    }
    winnersSelected = true;
    emit WinnersSelected(winners);
}

function setRandomNumbers(uint256[] memory _randomNumbers) external onlyOwner {
    delete s_randomNumbers;
    for (uint256 i = 0; i < _randomNumbers.length; i++) {
        s_randomNumbers.push(_randomNumbers[i]);
    }
    emit RandomNumbersReceived(s_randomNumbers);
}
        `);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

console.log("🔧 === DYNAMIC CONFIGURATION ===");
console.log(`📋 Contract: ${consumerAddress}`);
console.log(
  `🔄 Response: Will be fetched dynamically from latest Chainlink request`,
);
console.log(
  `📝 Fallback: Update 'manualResponse' variable if auto-fetch fails`,
);
console.log("");

pushDynamicWinners().catch((e) => {
  console.error("💥 Fatal error:", e);
  process.exit(1);
});

const ethers = require("ethers");
require("@chainlink/env-enc").config();

// Your lottery contract address
const consumerAddress = "0x3C74129E99d262A25Fd3D2Bf8FB4d828292209D0";

// Simplified ABI - just for reading participants
const contractAbi = [
  {
    inputs: [],
    name: "getParticipants",
    outputs: [
      {
        internalType: "address[50]",
        name: "",
        type: "address[50]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "participants",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// THE COMPUTATION RESPONSE FROM CHAINLINK
const computationResponse = "7,16,41,1,23,15,7,33,28,44";

const showWinners = async () => {
  console.log("🎯 === LOTTERY WINNERS CALCULATOR ===");
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  // Parse the computation response
  const randomIndices = computationResponse
    .split(",")
    .map((num) => parseInt(num.trim()));
  console.log(
    `🎲 Random indices from Chainlink: [${randomIndices.join(", ")}]`,
  );

  // Connect to contract to get participants
  const rpcUrl = process.env.ETHEREUM_SEPOLIA_RPC_URL;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(consumerAddress, contractAbi, provider);

  try {
    console.log("\n📋 === GETTING PARTICIPANTS ===");
    const participants = await contract.getParticipants();
    console.log(`✅ Loaded ${participants.length} participants`);

    console.log("\n🏆 === SELECTED WINNERS ===");

    // Process indices and select winners (preventing duplicates)
    const winners = [];
    const usedAddresses = new Set();

    for (let i = 0; i < randomIndices.length && winners.length < 10; i++) {
      const index = randomIndices[i] % 50; // Ensure within bounds
      const winnerAddress = participants[index];

      // Check for duplicates
      if (!usedAddresses.has(winnerAddress.toLowerCase())) {
        usedAddresses.add(winnerAddress.toLowerCase());
        winners.push({
          position: winners.length + 1,
          index: index,
          address: winnerAddress,
          originalRandomNumber: randomIndices[i],
        });
      } else {
        console.log(
          `⚠️  Duplicate found: Index ${index} (${winnerAddress}) - skipped`,
        );
      }
    }

    console.log(`🎉 Total Winners Selected: ${winners.length}`);
    console.log(`💰 Prize per Winner: 0.01 ETH`);
    console.log(`💸 Total Payout: ${winners.length * 0.01} ETH`);

    console.log("\n🎯 === WINNER DETAILS ===");
    winners.forEach((winner) => {
      console.log(`🏆 Winner ${winner.position}:`);
      console.log(`   📍 Participant Index: ${winner.index}`);
      console.log(`   🎲 Random Number: ${winner.originalRandomNumber}`);
      console.log(`   💼 Address: ${winner.address}`);
      console.log(`   💰 Prize: 0.01 ETH`);
      console.log("");
    });

    // Show participants for reference
    console.log("\n👥 === PARTICIPANTS REFERENCE ===");
    console.log("First 10 participants:");
    for (let i = 0; i < 10; i++) {
      const isWinner = winners.some((w) => w.index === i);
      const winnerMarker = isWinner ? " 🏆 WINNER!" : "";
      console.log(`   ${i}: ${participants[i]}${winnerMarker}`);
    }
    console.log("   ... and 40 more participants");

    // Summary
    console.log("\n📊 === SUMMARY ===");
    console.log(`🎲 Random indices: [${randomIndices.join(", ")}]`);
    console.log(
      `🏆 Winner indices: [${winners.map((w) => w.index).join(", ")}]`,
    );
    console.log(`💼 Winner addresses:`);
    winners.forEach((winner) => {
      console.log(`   ${winner.address}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

// You can easily update the computation response here
console.log("🎯 === CONFIGURATION ===");
console.log(`📋 Contract: ${consumerAddress}`);
console.log(`🎲 Computation Response: "${computationResponse}"`);
console.log(
  `📝 To update results, change the 'computationResponse' variable above`,
);
console.log("");

showWinners().catch((e) => {
  console.error("💥 Fatal error:", e);
  process.exit(1);
});

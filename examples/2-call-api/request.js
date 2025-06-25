const ethers = require("ethers");
require("@chainlink/env-enc").config();

const consumerAddress = "0x85e6A3046f68D89f3932952DE2F93CbdcF9545Db";
const subscriptionId = 5151;

// Complete Lottery ABI
const contractAbi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptySource",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "LotteryNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "NoInlineSecrets",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyRouterCanFulfill",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    name: "UnexpectedRequestID",
    type: "error",
  },
  {
    inputs: [],
    name: "WinnersNotSelected",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "LotteryReset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "winners",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PrizesPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "numbers",
        type: "uint256[]",
      },
    ],
    name: "RandomNumbersReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "RequestFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "RequestSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "Response",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "winners",
        type: "address[]",
      },
    ],
    name: "WinnersSelected",
    type: "event",
  },
  {
    inputs: [],
    name: "PRIZE_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WINNER_COUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "areWinnersSelected",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
    inputs: [],
    name: "getRandomNumbers",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isLotteryActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lotteryActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [],
    name: "payWinners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resetLottery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "s_lastError",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_lastRequestId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_lastResponse",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
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
    name: "s_randomNumbers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
    ],
    name: "selectWinners",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "newParticipant",
        type: "address",
      },
    ],
    name: "updateParticipant",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "winners",
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
  {
    inputs: [],
    name: "winnersSelected",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const runLottery = async () => {
  console.log("🎲 === STARTING LOTTERY SYSTEM ===");
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
  console.log(`🔖 Subscription ID: ${subscriptionId}`);

  try {
    // Step 1: Check lottery status
    console.log("\n🔍 === CHECKING LOTTERY STATUS ===");
    const isActive = await contract.isLotteryActive();
    const winnersSelected = await contract.areWinnersSelected();
    const balance = await contract.getContractBalance();
    const prizeAmount = await contract.PRIZE_AMOUNT();
    const winnerCount = await contract.WINNER_COUNT();

    console.log(`🎲 Lottery Active: ${isActive}`);
    console.log(`🏆 Winners Selected: ${winnersSelected}`);
    console.log(
      `💰 Contract Balance: ${ethers.utils.formatEther(balance)} ETH`,
    );
    console.log(
      `💎 Prize per Winner: ${ethers.utils.formatEther(prizeAmount)} ETH`,
    );
    console.log(`🎯 Number of Winners: ${winnerCount}`);

    // Step 2: Show participants
    console.log("\n👥 === PARTICIPANTS ===");
    const participants = await contract.getParticipants();
    console.log(`📋 Total Participants: ${participants.length}`);
    console.log(`👤 First 5 participants:`);
    for (let i = 0; i < 5; i++) {
      console.log(`   ${i}: ${participants[i]}`);
    }
    console.log(`   ... and ${participants.length - 5} more`);

    if (!winnersSelected) {
      // Step 3: Select winners
      console.log("\n🎲 === SELECTING WINNERS ===");
      console.log("📤 Calling selectWinners...");

      const selectTx = await contract.selectWinners(subscriptionId);
      console.log(`✅ Transaction sent: ${selectTx.hash}`);

      const receipt = await selectTx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      // Step 4: Wait for Chainlink response
      console.log("\n⏳ === WAITING FOR RANDOM SELECTION ===");
      console.log("Waiting for Chainlink to select winners...");

      let attempts = 0;
      const maxAttempts = 12;

      const pollForWinners = async () => {
        attempts++;
        console.log(
          `🔍 Attempt ${attempts}/${maxAttempts} - Checking for winners...`,
        );

        try {
          const currentWinnersSelected = await contract.areWinnersSelected();

          if (currentWinnersSelected) {
            console.log("\n🎉 === WINNERS SELECTED! ===");

            const winners = await contract.getWinners();
            const randomNumbers = await contract.getRandomNumbers();

            console.log(
              `🎲 Random indices used: [${randomNumbers.join(", ")}]`,
            );
            console.log(`🏆 Winners (${winners.length}):`);
            winners.forEach((winner, index) => {
              console.log(`   🎯 Winner ${index + 1}: ${winner}`);
            });

            // Step 5: Pay winners
            console.log("\n💰 === PAYING WINNERS ===");
            console.log("📤 Calling payWinners...");

            const payTx = await contract.payWinners();
            console.log(`✅ Payment transaction sent: ${payTx.hash}`);

            const payReceipt = await payTx.wait();
            console.log(
              `✅ Payment confirmed in block ${payReceipt.blockNumber}`,
            );

            console.log("🎉 ALL WINNERS PAID SUCCESSFULLY!");
            console.log(
              `💸 Total paid out: ${ethers.utils.formatEther(prizeAmount.mul(winners.length))} ETH`,
            );

            return true;
          }

          // Check for errors
          const lastError = await contract.s_lastError();
          if (lastError && lastError !== "0x") {
            console.log("❌ Error detected in Chainlink response:");
            try {
              const errorString = ethers.utils.toUtf8String(lastError);
              console.log(`❌ Error: ${errorString}`);
            } catch (e) {
              console.log(`❌ Raw error: ${lastError}`);
            }
            return true;
          }

          if (attempts < maxAttempts) {
            console.log("⏳ No winners yet, waiting 10 more seconds...\n");
            setTimeout(pollForWinners, 10000);
          } else {
            console.log(
              "⏰ Timeout reached. Check Chainlink Functions status.",
            );
          }
        } catch (error) {
          console.error(`❌ Error during attempt ${attempts}:`, error.message);
        }
      };

      setTimeout(pollForWinners, 10000);
    } else {
      // Winners already selected, show them
      console.log("\n🏆 === CURRENT WINNERS ===");
      const winners = await contract.getWinners();
      const randomNumbers = await contract.getRandomNumbers();

      console.log(`🎲 Random indices used: [${randomNumbers.join(", ")}]`);
      console.log(`🏆 Current Winners (${winners.length}):`);
      winners.forEach((winner, index) => {
        console.log(`   🎯 Winner ${index + 1}: ${winner}`);
      });

      console.log("\n💰 === PAY WINNERS? ===");
      console.log(
        "Winners already selected. Call payWinners() to pay them out.",
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

runLottery().catch((e) => {
  console.error("💥 Fatal error:", e);
  process.exit(1);
});

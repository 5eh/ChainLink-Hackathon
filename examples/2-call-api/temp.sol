// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract RandomLottery is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions variables
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint256[] public s_randomNumbers;

    // Lottery variables
    address[50] public participants;
    address[] public winners;
    uint256 public constant WINNER_COUNT = 10;
    uint256 public constant PRIZE_AMOUNT = 0.01 ether; // 0.01 ETH per winner
    bool public lotteryActive;
    bool public winnersSelected;

    // Events
    event Response(bytes32 indexed requestId, bytes response, bytes err);
    event RandomNumbersReceived(uint256[] numbers);
    event WinnersSelected(address[] winners);
    event PrizesPaid(address[] winners, uint256 amount);
    event LotteryReset();

    // Errors
    error UnexpectedRequestID(bytes32 requestId);
    error LotteryNotActive();
    error WinnersNotSelected();
    error InsufficientBalance();
    error TransferFailed();

    // Chainlink Functions configuration
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    uint32 gasLimit = 300000;
    bytes32 donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // JavaScript for getting 10 random numbers (for winner selection)
    string source =
        "const min = 0;"
        "const max = 49;" // Array indices 0-49 for 50 participants
        "const count = 10;" // We need 10 winners
        "const apiResponse = await Functions.makeHttpRequest({"
        "  url: `http://www.randomnumberapi.com/api/v1.0/random?min=${min}&max=${max}&count=${count}`"
        "});"
        "if (apiResponse.error) {"
        "  throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "console.log('API response data:', JSON.stringify(data, null, 2));"
        "return Functions.encodeString(data.join(','));";

    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) payable {
        // Initialize with 50 sample wallet addresses
        _initializeSampleWallets();
        lotteryActive = true;
        winnersSelected = false;
    }

    // Initialize with 50 sample wallet addresses
    function _initializeSampleWallets() private {
        participants[0] = 0x1111111111111111111111111111111111111111;
        participants[1] = 0x2222222222222222222222222222222222222222;
        participants[2] = 0x3333333333333333333333333333333333333333;
        participants[3] = 0x4444444444444444444444444444444444444444;
        participants[4] = 0x5555555555555555555555555555555555555555;
        participants[5] = 0x6666666666666666666666666666666666666666;
        participants[6] = 0x7777777777777777777777777777777777777777;
        participants[7] = 0x8888888888888888888888888888888888888888;
        participants[8] = 0x9999999999999999999999999999999999999999;
        participants[9] = 0x6Ebf145B230808057F3f40e97BB837Fc46fF9C04;
        participants[10] = 0x3Daea08d5D97052494F0226f65ef96043a2108D8;
        participants[11] = 0x0f8795e442845756d9824Ef7D6C1a400D1867d27;
        participants[12] = 0x7Ca824fE52e3fF4Dc24228A92254935a8485e711;
        participants[13] = 0xd1F5d7A9E030449778555DCD07CdEccEe2C0e96B;
        participants[14] = 0x336cC7C0E44814DB1e1B67E278bd33a3C9b610c3;
        participants[15] = 0x1000000000000000000000000000000000000001;
        participants[16] = 0x2000000000000000000000000000000000000002;
        participants[17] = 0x3000000000000000000000000000000000000003;
        participants[18] = 0x4000000000000000000000000000000000000004;
        participants[19] = 0x5000000000000000000000000000000000000005;
        participants[20] = 0x6000000000000000000000000000000000000006;
        participants[21] = 0x7000000000000000000000000000000000000007;
        participants[22] = 0x8000000000000000000000000000000000000008;
        participants[23] = 0x9000000000000000000000000000000000000009;
        participants[24] = 0xBB9AAa5Ed6eb913254A6ecc0d20c1153322464CC;
        participants[25] = 0xb000000000000000000000000000000000000002;
        participants[26] = 0x29FA04611C4862f60318dEf4EEF9799abffD71B8;
        participants[27] = 0xd000000000000000000000000000000000000004;
        participants[28] = 0x9b5cbf7aB764dCECF4769B591A8E8dC5F59914F7;
        participants[29] = 0xf000000000000000000000000000000000000006;
        participants[30] = 0x1100000000000000000000000000000000000007;
        participants[31] = 0x2200000000000000000000000000000000000008;
        participants[32] = 0x3300000000000000000000000000000000000009;
        participants[33] = 0x4400000000000000000000000000000000000001;
        participants[34] = 0x5500000000000000000000000000000000000002;
        participants[35] = 0x6600000000000000000000000000000000000003;
        participants[36] = 0x7700000000000000000000000000000000000004;
        participants[37] = 0x8800000000000000000000000000000000000005;
        participants[38] = 0x9900000000000000000000000000000000000006;
        participants[39] = 0xaa00000000000000000000000000000000000007;
        participants[40] = 0x97f1A7441553811BD82327297bFE98c5315e6E11;
        participants[41] = 0xC1D8dDFc635557CD559f4A88E518E49bc7fd41df;
        participants[42] = 0xca35a84D526049Ba774a33619FA5F2065071C8Ed;
        participants[43] = 0x5b949b2FC1cc0327a29543D927591e87983c0FAA;
        participants[44] = 0xCd52151D3582a1feC0EeeEa14A09a20a2FaC822d;
        participants[45] = 0x1010101010101010101010101010101010101010;
        participants[46] = 0x2020202020202020202020202020202020202020;
        participants[47] = 0x3030303030303030303030303030303030303030;
        participants[48] = 0x4040404040404040404040404040404040404040;
        participants[49] = 0x5050505050505050505050505050505050505050;
    }

    // Step 1: Request random numbers for winner selection
    function selectWinners(uint64 subscriptionId) external onlyOwner returns (bytes32 requestId) {
        if (!lotteryActive) revert LotteryNotActive();

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    // Chainlink Functions callback
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        s_lastResponse = response;
        s_lastError = err;

        if (response.length > 0) {
            string memory responseString = string(response);
            s_randomNumbers = parseCommaSeparatedNumbers(responseString);

            // Select winners based on random indices
            _selectWinnersFromIndices(s_randomNumbers);

            emit RandomNumbersReceived(s_randomNumbers);
        }

        emit Response(requestId, s_lastResponse, s_lastError);
    }

    // Step 2: Select winners based on random indices
    function _selectWinnersFromIndices(uint256[] memory randomIndices) private {
        delete winners; // Clear previous winners

        for (uint256 i = 0; i < randomIndices.length && winners.length < WINNER_COUNT; i++) {
            uint256 index = randomIndices[i] % 50; // Ensure index is within bounds

            // Check if we already have this winner (prevent duplicates)
            bool alreadySelected = false;
            for (uint256 j = 0; j < winners.length; j++) {
                if (winners[j] == participants[index]) {
                    alreadySelected = true;
                    break;
                }
            }

            // If not already selected, add to winners
            if (!alreadySelected) {
                winners.push(participants[index]);
            }
        }

        winnersSelected = true;
        emit WinnersSelected(winners);
    }

    // Step 3: Pay out winners
    function payWinners() external onlyOwner {
        if (!winnersSelected) revert WinnersNotSelected();

        uint256 totalPayout = winners.length * PRIZE_AMOUNT;
        if (address(this).balance < totalPayout) revert InsufficientBalance();

        for (uint256 i = 0; i < winners.length; i++) {
            (bool success, ) = winners[i].call{value: PRIZE_AMOUNT}("");
            if (!success) revert TransferFailed();
        }

        emit PrizesPaid(winners, PRIZE_AMOUNT);

        // Reset lottery for next round
        _resetLottery();
    }

    // Reset lottery for next round
    function _resetLottery() private {
        delete winners;
        delete s_randomNumbers;
        winnersSelected = false;
        emit LotteryReset();
    }

    // Manual reset (if needed)
    function resetLottery() external onlyOwner {
        _resetLottery();
    }

    // Parse comma-separated numbers
    function parseCommaSeparatedNumbers(string memory numbersStr) internal pure returns (uint256[] memory) {
        bytes memory strBytes = bytes(numbersStr);
        uint256 numberCount = 1;

        for (uint i = 0; i < strBytes.length; i++) {
            if (strBytes[i] == 0x2C) {
                numberCount++;
            }
        }

        uint256[] memory numbers = new uint256[](numberCount);
        uint256 currentIndex = 0;
        uint256 currentNumber = 0;

        for (uint i = 0; i < strBytes.length; i++) {
            if (strBytes[i] >= 0x30 && strBytes[i] <= 0x39) {
                currentNumber = currentNumber * 10 + (uint256(uint8(strBytes[i])) - 48);
            } else if (strBytes[i] == 0x2C) {
                numbers[currentIndex] = currentNumber;
                currentIndex++;
                currentNumber = 0;
            }
        }

        if (currentIndex < numberCount) {
            numbers[currentIndex] = currentNumber;
        }

        return numbers;
    }

    // View functions
    function getParticipants() external view returns (address[50] memory) {
        return participants;
    }

    function getWinners() external view returns (address[] memory) {
        return winners;
    }

    function getRandomNumbers() external view returns (uint256[] memory) {
        return s_randomNumbers;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isLotteryActive() external view returns (bool) {
        return lotteryActive;
    }

    function areWinnersSelected() external view returns (bool) {
        return winnersSelected;
    }

    // Allow contract to receive ETH for prizes
    receive() external payable {}

    // Withdraw remaining funds (owner only)
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        if (!success) revert TransferFailed();
    }

    // Update participant (for testing)
    function updateParticipant(uint256 index, address newParticipant) external onlyOwner {
        require(index < 50, "Index out of bounds");
        participants[index] = newParticipant;
    }
}

# IMPORTANT

---

Read `https://docs.chain.link/chainlink-functions` - Create an Alchemy API URL for data retrieval on chain, and set up an env.enc, BEFORE STARTING AND DEPLOYING THIS.

ALL WORK IS INSIDE OF EXAMPLES/MAIN

---

Notes for Trevor
* Turn this into an Upgradable contract (So that you can map out the new winners based on the random API
* Make a new function inside of the Upgradable contract that lets any of the winners withdraw their % winnings (or add the modulus functionality)
* Verify the code optionally
* For the hackathon, try and push this into the Scaffold Eth Environment
* Convert the Node JS files into dedicated API routes inside of the frontend
* Add rectanges and shit

---

1. Deploy Contract (`temp.sol`) on Remix
2. Inside of ChainLink Functions `https://functions.chain.link/sepolia/ID`, retrieve contract address
3. Inside of Remix, under `SELECTWINNERS`, set Consumer ID
4. `node examples/2-call-api/request.js` - Request from the Chainlink oracle the random numbers
5. `node examples/2-call-api/source.js` - Retrieves the source
6. `node examples/2-call-api/push.js` - Push the lottery numbers to the contract (WIP)

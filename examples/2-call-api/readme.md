# IMPORTANT

---

Read `https://docs.chain.link/chainlink-functions` - Create an Alchemy API URL for data retrieval on chain, and set up an env.enc, BEFORE STARTING AND DEPLOYING THIS.

---

1. Deploy Contract (`temp.sol`) on Remix
2. Inside of ChainLink Functions `https://functions.chain.link/sepolia/ID`, retrieve contract address
3. Inside of Remix, under `SELECTWINNERS`, set Consumer ID
4. `node examples/2-call-api/request.js` - Request from the Chainlink oracle the random numbers
5. `node examples/2-call-api/source.js` - Retrieves the source
6. `node examples/2-call-api/push.js` - Push the lottery numbers to the contract (WIP)

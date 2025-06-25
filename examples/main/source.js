// Lottery source.js - Gets 10 random indices for winner selection
const min = 0;
const max = 49;
const count = 10;

const apiResponse = await Functions.makeHttpRequest({
  url: `http://www.randomnumberapi.com/api/v1.0/random?min=${min}&max=${max}&count=${count}`,
});

if (apiResponse.error) {
  throw Error("Request failed");
}

const { data } = apiResponse;
console.log("API response data:", JSON.stringify(data, null, 2));

// Return comma-separated indices for participant selection
return Functions.encodeString(data.join(","));

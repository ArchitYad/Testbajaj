const express = require("express");
const app = express();
app.use(express.json());

const FULL_NAME = "archit_yadav";
const DOB = "11032003";
const EMAIL = "amky40011@gmail.com";
const ROLL_NUMBER = "22BCE2146";

function processData(data) {
  let odd_numbers = [];
  let even_numbers = [];
  let alphabets = [];
  let special_characters = [];
  let sum = 0;

  for (let item of data) {
    // ✅ Reject anything that is not a string
    if (typeof item !== "string") {
      throw new Error(`Invalid input: ${JSON.stringify(item)} (not a string)`);
    }

    if (/^-?\d+$/.test(item)) {
      // Integer (positive/negative)
      const num = parseInt(item, 10);
      sum += num;
      if (num % 2 === 0) even_numbers.push(item);
      else odd_numbers.push(item);

    } else if (/^[a-zA-Z]+$/.test(item)) {
      // Alphabet-only string
      alphabets.push(item.toUpperCase());

    } else if (/^[^a-zA-Z0-9]+$/.test(item)) {
      // Pure special characters (not alphanumeric, no decimals, no mix)
      special_characters.push(item);

    } else {
      // If it’s a mix (like "abc123" or "3.14") → invalid
      throw new Error(`Invalid input: ${item}`);
    }
  }

  // Build concat string (reverse + alternating case)
  const concat_string = alphabets
    .join("")
    .split("")
    .reverse()
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");

  return {
    is_success: true,
    user_id: `${FULL_NAME}_${DOB}`,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: sum.toString(),
    concat_string,
  };
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    // ✅ Check if request has "data" and is an array
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid request: 'data' must be an array of strings",
      });
    }

    const result = processData(data);
    res.status(200).json(result);

  } catch (err) {
    // ✅ Central error handler
    res.status(400).json({
      is_success: false,
      message: err.message || "Unexpected error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
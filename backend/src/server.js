import 'dotenv/config';

import app from "./app.js";

const PORT = process.env.PORT || 5000;

console.log("GEMINI KEY LOADED:", !!process.env.GEMINI_API_KEY);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

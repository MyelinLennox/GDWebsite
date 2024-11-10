// VisitCount.js

let visitCount = 0; // In-memory counter (resets if server restarts)

export default function handler(req, res) {
   visitCount++; // Increment the counter on each visit
   res.status(200).json({ visitCount }); // Return the current count
}

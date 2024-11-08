const button = document.querySelector("button");

// Fetch the initial count from the server
async function fetchCount() {
    try {
        const response = await fetch("/api/visitCounter");
        const data = await response.json();
        count = data.visitCount;
        button.textContent = count;
        console.log(`Initial count from server: ${count}`);
    } catch (error) {
        console.error("Failed to fetch count:", error);
    }
}

// Increment the count both on the client and server
button.addEventListener("click", async () => {
    count++;
    button.textContent = count;
    console.log(`Button clicked ${count} times`);

    // Update the count on the server
    try {
        await fetch("/api/visitCounter", { method: "POST" });
    } catch (error) {
        console.error("Failed to update server count:", error);
    }
});

// Load the initial count when the page loads
fetchCount();

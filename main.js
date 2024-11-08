async function fetchCount() {
    try {
        const response = await fetch("https://gd-website-lyart.vercel.app/visitCounter");
        const data = await response.json();
        count = data.visitCount;
        button.textContent = count;
        console.log(`Initial count from server: ${count}`);
    } catch (error) {
        console.error("Failed to fetch count:", error);
    }
}

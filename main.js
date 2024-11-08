const button = document.querySelector("button");
let count = 0;

button.addEventListener("click", () => {
	count++;
	button.textContent = count;
	console.log(`Button clicked ${count} times`);
});

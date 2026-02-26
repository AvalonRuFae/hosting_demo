document.getElementById("previewBtn").addEventListener("click", function () {
	// open a new tab to the index.html in the repo root (works when served)
	window.open(window.location.href, "_blank");
});

document
	.getElementById("instructionsBtn")
	.addEventListener("click", function () {
		const msg = `Publish to GitHub Pages:\n\n1) Push this repo to GitHub.\n2) In repository Settings → Pages, select branch (main or gh-pages).\n3) Save — site will be live at https://<your-username>.github.io/<repo>\n\nLocal preview: python -m http.server 8000`;
		alert(msg);
	});

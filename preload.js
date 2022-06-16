document.addEventListener("keydown", event => {
	switch (event.key) {
		case "Escape":
			document.exitPointerLock();
			break;
	}
});
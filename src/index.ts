// Modules to control application life and create native browser window
const { dialog, app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let mazeanServer = "https://mazean.com";
let mazeanIcon = new URL(mazeanServer).host == "mazean.com" ? path.join(__dirname, "../assets/mazean.png") : (new URL(mazeanServer).host == "beta.mazean.com" ? path.join(__dirname, "../assets/mazean_beta.png") : path.join(__dirname, "../assets/mazean_custom.png"))

function createWindow() {
	// Create the browser window.

	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, "../preload.js")
		},
		title: "Mazean",
		icon: mazeanIcon
	});

	// Load Mazean, but show an error message if it's not reachable.
	
	mainWindow.loadURL(mazeanServer);

	mainWindow.setMenu(null);
	
	let tray = new Tray(nativeImage.createFromPath(mazeanIcon));

	function setVisibility(visible: boolean) {
		if (visible && !mainWindow.isVisible()) {
			mainWindow.show();
			mainWindow.webContents.setAudioMuted(false);
		}
		else if (!visible && mainWindow.isVisible()) {
			mainWindow.webContents.setAudioMuted(true);
			mainWindow.hide();
		}
	}

	const contextMenu = Menu.buildFromTemplate([
		{label: "Mazean", enabled: false},
		{type: "separator"},
		{label: "Show / Hide", click: () => {setVisibility(!mainWindow.isVisible());}},
		{role: "quit"}
	]);

	tray.setContextMenu(contextMenu);
	tray.setToolTip("Mazean");
	tray.setTitle("Mazean");

	// Open DevTools if it's enabled.

	//mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.

		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

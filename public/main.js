import { BrowserWindow, app } from "electron";
import { fileURLToPath } from "url";
import { ipcMain } from "electron";
import path from "path";
import "./connector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 500,
		minHeight: 800,
		title: "Gym Management Tool",
		frame: false,
		titleBarStyle: "hidden",
		webPreferences: {
			devTools: true,
			// devTools: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
	});

	// mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

	mainWindow.loadURL("http://localhost:5173/");

	mainWindow.setMenuBarVisibility(false);
	mainWindow.maximize();

	mainWindow.webContents.on("before-input-event", (event, input) => {
		if ((input.control || input.meta) && input.key.toLowerCase() === "r") {
			event.preventDefault();
		}

		if (
			(input.control || input.meta) &&
			input.shift &&
			input.key.toLowerCase() === "r"
		) {
			event.preventDefault();
		}

		if (input.key === "F5") {
			event.preventDefault();
		}
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	mainWindow.webContents.on("crashed", () => {
		app.relaunch();
		app.quit();
	});
}

// app.on("ready", createWindow);

app.whenReady().then(() => {
	createWindow();

	ipcMain.on("reload-main-window", () => {
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.webContents.reloadIgnoringCache();
		}
	});
	ipcMain.on("window:minimize", () => mainWindow.minimize());
	ipcMain.on("window:maximize", () => {
		if (mainWindow.isMaximized()) mainWindow.unmaximize();
		else mainWindow.maximize();
	});
	ipcMain.on("window:close", () => mainWindow.close());
});

app.on("window-all-closed", () => {
	app.quit();
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

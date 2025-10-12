const { ipcRenderer } = window.require("electron");

export default function rawQuery(message) {
	return new Promise((resolve) => {
		ipcRenderer.once("asynchronous-reply", (_, arg) => {
			resolve(arg);
		});
		ipcRenderer.send("asynchronous-message", message);
	});
}

export function safeReload() {
	ipcRenderer.send("reload-main-window");
}

export function handleMinimize() {
	ipcRenderer.send("window:minimize");
}
export function handleMaximize() {
	ipcRenderer.send("window:maximize");
}
export function handleClose() {
	ipcRenderer.send("window:close");
}

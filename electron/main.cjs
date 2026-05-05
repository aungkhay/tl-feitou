const { app, BrowserWindow, globalShortcut, protocol } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: true,
        center: true,
        icon: path.join(__dirname, "../build/icon.ico"),
        webPreferences: {
            // keep this secure; enable preload later if you need IPC
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false, // CORS
            devTools: true, // block inspect element
            partition: 'persist:main'
        },
    });

    if (isDev) {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        // win.webContents.openDevTools(); // TEMP: always open in production
        win.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
        globalShortcut.register('Control+Shift+I', () => {
            return false;
        });
    }
    win.setMenuBarVisibility(false);
    // win.maximize();
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
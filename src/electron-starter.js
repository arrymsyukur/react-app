const { app, BrowserWindow, Menu, remote } = require('electron')
let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({ width: 1080, height: 768 })
    mainWindow.loadURL('http://localhost:3000');
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Open Dev Tools',
                    click() {
                        mainWindow.webContents.openDevTools();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    click() {
                        app.quit();
                    }
                }
            ]

        }
    ]);
    Menu.setApplicationMenu(menu);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})


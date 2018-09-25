const { app, BrowserWindow, Menu, remote } = require('electron')
let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 864,
        webPreferences: {
            webSecurity: false
        }
    })
    mainWindow.loadURL('http://192.168.1.59:5000');
    // mainWindow.loadURL('http://localhost:3000');

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Create New Rest',
                    click() {
                        let win = new BrowserWindow({ width: 1280, height: 864, webPreferences: { webSecurity: false } })
                        win.on('close', function () { win = null })
                        win.loadURL('http://192.168.1.59:5000');
                        // win.loadURL('http://localhost:3000')
                        win.show()
                    }
                },
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click() { require('electron').shell.openExternal('https://electronjs.org') }
                }
            ]
        }
    ]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        })

        // Edit menu
        template[1].submenu.push(
            { type: 'separator' },
            {
                label: 'Speech',
                submenu: [
                    { role: 'startspeaking' },
                    { role: 'stopspeaking' }
                ]
            }
        )

        // Window menu
        template[3].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ]
    }

    const menu = Menu.buildFromTemplate(template)
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


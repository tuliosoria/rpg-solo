const { contextBridge, ipcRenderer } = require('electron');

function createSubscription(channel, callback) {
  if (typeof callback !== 'function') {
    return () => {};
  }

  const listener = (_event, value) => {
    callback(value);
  };

  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('splashAPI', {
  onStatus: callback => createSubscription('splash:status', callback),
  onProgress: callback => createSubscription('splash:progress', callback),
  onOffline: callback => createSubscription('splash:offline', callback),
});

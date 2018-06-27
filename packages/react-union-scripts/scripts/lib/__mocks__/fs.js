const fs = jest.genMockFromModule('../fs');

let mockDirs = null;
let mockWsPattern = null;
let mockWsApps = null;
let mockAppPath = null;

fs.readDirs = () => mockDirs;

fs.getWorkspacesPatterns = () => mockWsPattern;

fs.readAllAppsFromWorkspaces = () => mockWsApps;

fs.getAppPath = () => mockAppPath;

fs.__setMockDirs = newMockdirs => {
	mockDirs = newMockdirs;
};

fs.__setWsPattern = newWsPattern => {
	mockWsPattern = newWsPattern;
};

fs.__setWsApps = newWsApps => {
	mockWsApps = newWsApps;
};

fs.__setAppPath = newAppPath => {
	mockAppPath = newAppPath;
};

module.exports = fs;

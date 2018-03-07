const fs = jest.genMockFromModule('../fs');

let mockDirs = null;

fs.readDirs = () => mockDirs;

fs.__setMockDirs = newMockdirs => {
	mockDirs = newMockdirs;
};

module.exports = fs;

module.exports = {
  packagerConfig: {
    icon: './public/favicon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: '/path/to/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: '/path/to/icon.png'
        }
      },
    },
  ],
};

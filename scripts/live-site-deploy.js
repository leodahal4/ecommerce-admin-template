const execa = require('execa')
const fs = require('fs');

(async () => {
  try {
    await execa('git', ['checkout', '--orphan', 'live-site'])
    console.log('Building...')
    await execa('yarn', ['build'])
    // Understand if it's dist or build folder
    const folderName = fs.existsSync('dist') ? 'dist' : 'build'
    await execa('git', ['--work-tree', folderName, 'add', '--all'])
    await execa('git', ['--work-tree', folderName, 'commit', '-m', 'live-site'])
    console.log('Pushing to live-site...')
    await execa('git', ['push', 'origin', 'HEAD:live-site', '--force'])
    await execa('rm', ['-r', folderName])
    await execa('git', ['checkout', '-f', 'main'])
    await execa('git', ['branch', '-D', 'live-site'])
    console.log('Successfully deployed')
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
})()

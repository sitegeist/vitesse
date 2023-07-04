export async function build(options: Object) {
  console.log('build function fire')
  try {
    // console.log(options)
    const { getSettings } = await import('./utils')
    console.log('config:', await getSettings(options))
    return console.log('we did the build')
  } catch (e) {
    throw new Error(e)
  }
}

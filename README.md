# 🆅🅸🆃🅴🆂🆂🅴
**Frontend building for sitegeist TYPO3 projects based on vite**

## Contents
1. [Setup](#setup)
2. [Settings](#settings)
3. [Usage](#usage)
4. [Example Settings file](#example-settings-file)

## Setup
### Step 1
```console
yarn add @sitegeist/vitesse
```
or
```console
npm install @sitegeist/vitesse --save-dev
```

### Step 2
If you are **not** using typed imports (e.g. `import { value, type Type } from 'somewhere'` instead of `import { value, Type } from 'somewhere'`), add this option to your `tsconfig.json` file:
```json
{
    "compilerOptions": {
      "verbatimModuleSyntax": true,
    }
}
```
If the file doesn't exist yet, create it.

### Step 3
Create a `vitesse.config.json` file and add your build [settings](#settings)

## Settings
| Setting                  | Type          | Default                                       |
|--------------------------|---------------|-----------------------------------------------|
| extensionPath            | String        | /typo3conf/ext/sitepackage/                   |
| build.inputFiles         | Array<string> | - (mandatory)                                 |
| build.outputPath         | String        | ./Resources/Public/Build/                     |
| build.outputFilePattern  | String        | [name].min.js                                 |
| build.tailwindConfigFile | String        | ./tailwind.config.js                          |
| build.svelteConfigFile   | String        | ./svelte.config.js                            |
| spritemap.prefix         | String        |                                               |
| spritemap.inputFiles     | String        | ./Resources/Private/Images/SVG-Icons/**/*.svg |
| spritemap.outputPath     | String        | ./Resources/Public/Images/                    |
| spritemap.outputFileName | String        | svg-icons.svg                                 |
| emptyOutDir              | Boolean       | false                                         |
| excludeTailwind          | Boolean       | false                                         |
| includeSvelte            | Boolean       | false                                         |
| modulePreload            | Boolean       | true                                          |


## Usage
Run the commands `vitesse` for build or `vitesse --watch` for watcher or add this to your `package.json` file:
```json
{
    "scripts": {
        "build": "vitesse",
        "watch": "vitesse --watch"
    }
}
```

## Example Settings file
```json
{
	"extensionPath": "/vendor/sitegeist/sitepackage/",
	"build": {
		"inputFiles": [
			"./Resources/Private/Styles/Main.scss",
			"./Resources/Private/Components/**/*.ts"
		],
		"outputPath": "./Resources/Public/Build/",
		"outputFilePattern": "[name].min.js"
	},
	"spritemap": {
		"prefix": "abc-",
		"inputFiles": "./Resources/Public/Icons/SVG-Sprite/**/*.svg",
		"outputPath": "./Resources/Public/Build/Images/",
		"outputFileName": "svg-icons.svg"
	},
	"emptyOutDir": false,
	"excludeTailwind": false,
	"includeSvelte": true,
	"modulePreload": false
}

```
…

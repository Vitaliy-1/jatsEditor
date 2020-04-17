# JATS Editor based on ProseMirror
This is an example of bundled ProseMirror core modules with modified schema for JATS XML.
## Installation
1. `git clone https://github.com/Vitaliy-1/jatsEditor.git`
2. `cd jatsEditor`
3. `npm intall`
4. `npm run dev` -> compiles the code and starts server available at `localhost:1234`.
## Documentation
All core and non-core modules are tied together in `src/index.js`, which starts the editor. In this example [Parcel](https://parceljs.org/) is used a a bundler. 
### Schema
For a minimalistic editor to work what is needed is only schema (`src/schema/index.js`), which parses given XML and produces HTML elements. JATS XML input is child of a `div#content` [element](https://github.com/Vitaliy-1/jatsEditor/blob/e6f35ecc4d5c292f81a867af3f3a5505f4518281/index.html#L14) (that is against HTML5 validation rules).
Adding elements into a schema is as simple as:
```
body: {
		group: "block",
		content: "(sec | uList | oList | par | dispQuote)+",
		parseDOM: [{tag: "body"}],
		toDOM() {return ["div", 0]}
	}
```   
Where `body` is an optional name for an element. In this case it represents JATS `body` tag. Group `block` indicates that it's en element that is a sibling if only other non-text nodes. `Content` represents nodes that can be direct children of a current node, listed by their optional names (not tag names). `parseDOM` property contains a real tag name of the element and `toDOM` - how it should be present in the editor, obviously it should be a valid HTML element.
Reverse transformation of edited content, in this case HTMl to JATS, isn't cover by ProseMirror library, thus external converter should be used. Schema parser is exported from `prosemirror-model` core module.
### Commands
There is a list of a default commands that can be used to add functionality to the editor, they are exported from the `prosemirror-command` core module and are listed here: https://prosemirror.net/docs/ref/#commands. The example on how to add custom commands can be found in `src/newCommands/index.js`.  
### Menu
Menu isn't a part of the ProseMirror core package but it can be added as a simple plugin. In general, it can be simplified as 1) create DOM element that represents a menu bar, [example](https://github.com/Vitaliy-1/jatsEditor/blob/e6f35ecc4d5c292f81a867af3f3a5505f4518281/src/menu/index.js#L6-L44); 2) create a DOM element that represents a menu button, [example](https://github.com/Vitaliy-1/jatsEditor/blob/e6f35ecc4d5c292f81a867af3f3a5505f4518281/src/menu/index.js#L46-L62); 3) bind a command to the button, [example](https://github.com/Vitaliy-1/jatsEditor/blob/e6f35ecc4d5c292f81a867af3f3a5505f4518281/src/menu/index.js#L65-L72).
The full example can be found in `src/menu/index.js`. [Example](https://github.com/Vitaliy-1/jatsEditor/blob/e6f35ecc4d5c292f81a867af3f3a5505f4518281/src/index.js#L15) of how plugin can be hooked into the main code. 
### Keymap
Creating a keymap is as simple as binding a command to a specific key. There is a default mapping in `prosemirror-keymap` package. Example of keymap creation is in `src/extKeymap/index.js`, then it should be added a simple plugin.

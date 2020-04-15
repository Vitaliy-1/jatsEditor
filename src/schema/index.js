import {Schema} from "prosemirror-model"

const nodes = {
	doc: {
		content: "body"
	},
	
	body: {
		group: "block",
		content: "(sec | par | ulist)+",
		parseDOM: [{tag: "body"}],
		toDOM() {return ["div", 0]}
	},
	
	sec: {
		group: "block",
		content: "(sec | par | title | ulist)+",
		parseDOM: [{tag: "sec"}],
		toDOM() {return ["section", 0]}
	},
	
	par: {
		group: "block",
		content: "inline*",
		parseDOM: [{ tag: "p" }],
		toDOM() {return ["p", 0]}
	},
	
	title: {
		group: "block",
		content: "inline*",
		parseDOM: [{tag: "title"}],
		toDOM() {return ["h2", 0]}
	},
	
	ulist: {
		group: "block",
		content: "listItem+",
		parseDOM: [{tag: "list"}],
		toDOM() { return ["ul", 0]}
	},
	
	listItem: {
		group: "block",
		content: "inline*",
		parseDOM: [{ tag: "list-item"}],
		toDOM() { return ["li", 0]}
		
	},
	
	text: {
		group: "inline"
	}
};

const marks = {
	italic: {
		parseDOM: [{tag: "italic"}],
		toDOM() {return ["em", 0]}
	},
	
	bold: {
		parseDOM: [{tag: "bold"}],
		toDOM() {return ["strong", 0]}
	}
};

export const schema = new Schema({nodes, marks});

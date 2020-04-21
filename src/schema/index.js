import {Schema} from "prosemirror-model";
import {tableNodes} from "prosemirror-tables";

let nodes = {
	doc: {
		content: "body"
	},
	
	body: {
		group: "block",
		content: "(sec | uList | oList | par | dispQuote | table)+",
		parseDOM: [{tag: "body"}],
		toDOM() {return ["div", 0]}
	},
	
	sec: {
		group: "block",
		content: "(sec | uList | oList | par | title | dispQuote | table)+",
		parseDOM: [{tag: "sec"}],
		toDOM() {return ["section", 0]}
	},
	
	uList: {
		group: "block",
		content: "listItem+",
		parseDOM: [{tag: "list[list-type=unordered]"}],
		toDOM() { return ["ul", 0]}
	},
	
	oList: {
		group: "block",
		content: "listItem+",
		parseDOM: [{tag: "list[list-type=ordered]"}],
		toDOM() {return ["ol", 0]}
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
	
	listItem: {
		group: "block",
		content: "par",
		parseDOM: [{ tag: "list-item"}],
		toDOM() { return ["li", 0]}
		
	},
	
	dispQuote: {
		group: "block",
		content: "par+",
		parseDOM: [{tag: "disp-quote"}],
		toDOM() {return ["blockquote", 0]}
	},
	
	text: {
		group: "inline"
	}
};

// Integrating tables
let options = {
	tableGroup: "block",
	cellContent: "block+",
	cellAttributes: {
		background: {
			default: null,
			getFromDOM(dom) { return dom.style.backgroundColor || null },
			setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` }
		}
	}
};

nodes = Object.assign({}, nodes, tableNodes(options)); // add new nodes to schema

let marks = {
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

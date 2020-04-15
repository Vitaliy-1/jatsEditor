import {Plugin} from "prosemirror-state";
import {toggleMark, setBlockType, wrapIn} from "prosemirror-commands";
import {schema} from "../schema";

class MenuView {
	constructor(items, editorView) {
		this.items = items;
		this.editorView = editorView;
		
		this.dom = document.createElement("div");
		this.dom.className = "menubar";
		items.forEach(({dom}) => this.dom.appendChild(dom));
		this.update();
		
		this.dom.addEventListener("mousedown", e => {
			e.preventDefault();
			editorView.focus();
			items.forEach(({command, dom}) => {
				if (dom.contains(e.target))
					command(editorView.state, editorView.dispatch, editorView)
			})
		})
	}
	
	update() {
		this.items.forEach(({command, dom}) => {
			let active = command(this.editorView.state, null, this.editorView);
			dom.style.display = active ? "" : "none"
		})
	}
	
	destroy() { this.dom.remove() }
}

function menuPlugin(items) {
	return new Plugin({
		view(editorView) {
			let menuView = new MenuView(items, editorView);
			editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
			return menuView
		}
	})
}

function textLabel(text, name) {
	let span = document.createElement("span");
	span.className = "menuicon " + name;
	span.title = name;
	span.textContent = text;
	return span
}

function fontawesomewLabel(iconClass, name) {
	let span = document.createElement("span");
	span.className = "menuicon";
	let icon = document.createElement("i");
	icon.className = iconClass;
	icon.title = name;
	span.appendChild(icon);
	return span;
}

export let menu = menuPlugin([
	{command: toggleMark(schema.marks.italic), dom: fontawesomewLabel("fas fa-italic", "italic")},
	{command: toggleMark(schema.marks.bold), dom: fontawesomewLabel("fas fa-bold", "bold")},
	{command: wrapIn(schema.nodes.sec), dom: textLabel("sec", "wrap content into section")},
	{command: setBlockType(schema.nodes.title), dom: textLabel("title", "title")},
	{command: setBlockType(schema.nodes.par), dom: fontawesomewLabel("fas fa-paragraph", "paragraph")},
]);

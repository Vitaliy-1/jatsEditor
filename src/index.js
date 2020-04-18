import {DOMParser as DOMParserPM} from "prosemirror-model";
import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {schema} from "./schema";
import {menu} from "./menu";
import {keymap} from "prosemirror-keymap";
import {buildKeymap} from "./extKeymap";
import {baseKeymap} from "prosemirror-commands";

// Getting JATS XML into string
let contentEl = document.getElementById("content");
let xmlParser = new DOMParser();
let xmlDOM = xmlParser.parseFromString(contentEl.innerHTML, "application/xml");

// Initialize ProseMirror modules
let editorEl = document.getElementById("editor");
//let contentEl = document.getElementById("content");

let doc = DOMParserPM.fromSchema(schema).parse(xmlDOM);

let plugins = [menu, keymap(buildKeymap(schema)), keymap(baseKeymap)]; // include plugins here

let state = EditorState.create({doc, plugins});

let view = new EditorView(editorEl, {state});

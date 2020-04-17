import {DOMParser} from "prosemirror-model";
import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {schema} from "./schema";
import {menu} from "./menu";
import {keymap} from "prosemirror-keymap";
import {buildKeymap} from "./extKeymap";
import {baseKeymap} from "prosemirror-commands"

const editorEl = document.getElementById("editor");
const contentEl = document.getElementById("content");

const doc = DOMParser.fromSchema(schema).parse(contentEl);

const plugins = [menu, keymap(buildKeymap(schema)), keymap(baseKeymap)]; // include plugins here

const state = EditorState.create({doc, plugins});

const view = new EditorView(editorEl, {state});

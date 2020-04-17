import {splitListItem} from "../newCommands";

export function buildKeymap(schema) {
	let type;
	let keys = {};
	
	function bind(key, cmd) {
		keys[key] = cmd
	}
	
	if (type = schema.nodes.listItem) {
		bind("Enter", splitListItem(type))
	}
	
	return keys;
}

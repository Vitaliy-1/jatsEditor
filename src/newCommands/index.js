// new command for lists from example (see prosemirror-schema-list)
import {Fragment, NodeRange, Slice} from "prosemirror-model";
import {canSplit, findWrapping, ReplaceAroundStep} from "prosemirror-transform";

// Add list item and wrap it into the list of correspondent type
export function wrapInList(listType) {
	return function(state, dispatch) {
		let {$from, $to} = state.selection;
		let range = $from.blockRange($to), doJoin = false, outerRange = range;
		if (!range) return false;
		// This is at the top of an existing list item
		if (range.depth >= 2 && $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
			// Don't do anything if this is the top of the list
			if ($from.index(range.depth - 1) == 0) return false;
			let $insert = state.doc.resolve(range.start - 2);
			outerRange = new NodeRange($insert, $insert, range.depth);
			if (range.endIndex < range.parent.childCount)
				range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
			doJoin = true
		}
		let wrap = findWrapping(outerRange, listType, null, range);
		if (!wrap) return false;
		if (dispatch) dispatch(doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView());
		return true
	}
}

function doWrapInList(tr, range, wrappers, joinBefore, listType) {
	let content = Fragment.empty;
	for (let i = wrappers.length - 1; i >= 0; i--)
		content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
	
	tr.step(new ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end,
		new Slice(content, 0, 0), wrappers.length, true));
	
	let found = 0;
	for (let i = 0; i < wrappers.length; i++) if (wrappers[i].type == listType) found = i + 1;
	let splitDepth = wrappers.length - found;
	
	let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
	for (let i = range.startIndex, e = range.endIndex, first = true; i < e; i++, first = false) {
		if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
			tr.split(splitPos, splitDepth);
			splitPos += 2 * splitDepth
		}
		splitPos += parent.child(i).nodeSize
	}
	return tr
}

// Splits list item to create a new one -> bind to Enter

export function splitListItem(itemType) {
	return function(state, dispatch) {
		let {$from, $to, node} = state.selection;
		if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) return false;
		let grandParent = $from.node(-1);
		if (grandParent.type != itemType) return false;
		if ($from.parent.content.size == 0) {
			// In an empty block. If this is a nested list, the wrapping
			// list item should be split. Otherwise, bail out and let next
			// command handle lifting.
			if ($from.depth == 2 || $from.node(-3).type != itemType ||
				$from.index(-2) != $from.node(-2).childCount - 1) return false;
			if (dispatch) {
				let wrap = Fragment.empty, keepItem = $from.index(-1) > 0;
				// Build a fragment containing empty versions of the structure
				// from the outer list item to the parent node of the cursor
				for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--)
					wrap = Fragment.from($from.node(d).copy(wrap));
				// Add a second list item with an empty default start node
				wrap = wrap.append(Fragment.from(itemType.createAndFill()));
				let tr = state.tr.replace($from.before(keepItem ? null : -1), $from.after(-3), new Slice(wrap, keepItem ? 3 : 2, 2));
				tr.setSelection(state.selection.constructor.near(tr.doc.resolve($from.pos + (keepItem ? 3 : 2))));
				dispatch(tr.scrollIntoView())
			}
			return true
		}
		let nextType = $to.pos == $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
		let tr = state.tr.delete($from.pos, $to.pos);
		let types = nextType && [null, {type: nextType}];
		if (!canSplit(tr.doc, $from.pos, 2, types)) return false;
		if (dispatch) dispatch(tr.split($from.pos, 2, types).scrollIntoView());
		return true
	}
}

export function addNewElement(itemType) {
	return function(state, dispatch) {
		// TODO write a function to add a new element (table) starting from a new line
	}
}

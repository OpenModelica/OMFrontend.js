/*
 * OMFrontend.js
 * Copyright (C) 2022 Perpetual Labs, Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

 export type Edit = {
    startIndex: number;
    oldEndIndex: number;
    newEndIndex: number;
    startPosition: Point;
    oldEndPosition: Point;
    newEndPosition: Point;
};

export type InputReader = (index: any, position?: Point) => string;

export interface Parser {
    parse(input: string | InputReader, previousTree?: Tree): Tree;
}

export type Point = {
    row: number;
    column: number;
};

export type Range = {
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
};

export interface SyntaxNode {

    childCount: number;
    children: Array<SyntaxNode>;
    endIndex: number;
    endPosition: Point;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    namedChildCount: number;
    namedChildren: Array<SyntaxNode>;
    nextNamedSibling: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    parent: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    startIndex: number;
    startPosition: Point;
    text: string;
    tree: Tree;
    type: string;
    hasChanges: boolean;
    hasError: boolean;
    isMissing: boolean;

    toString(): string;
    walk(): TreeCursor;

}

export interface Tree {

    readonly rootNode: SyntaxNode;

    edit(delta: Edit): Tree;
    getChangedRanges(other: Tree): Range[];
    getEditedRange(other: Tree): Range;

}

export interface TreeCursor {

    nodeType: string;
    nodeText: string;
    nodeIsNamed: boolean;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;

    reset(node: SyntaxNode): void
    gotoParent(): boolean;
    gotoFirstChild(): boolean;
    gotoFirstChildForIndex(index: number): boolean;
    gotoNextSibling(): boolean;

}

export function currentFieldName(cursor: TreeCursor): string {

    let currentFieldName = (<any>cursor).currentFieldName;

    if (typeof currentFieldName === "function")
        return currentFieldName.bind(cursor)();

    else
        return currentFieldName;

}

export function currentNode(cursor: TreeCursor): SyntaxNode {

    let currentNode = (<any>cursor).currentNode;

    if (typeof currentNode === "function")
        return currentNode.bind(cursor)();

    else
        return currentNode;

}


export function childForFieldName(syntaxNode: SyntaxNode | null | undefined, ...fieldNames: string[]): SyntaxNode | undefined {

    if (syntaxNode == null)
        return;

    for (let child of childrenForFieldName(syntaxNode, ...fieldNames))
        return child;

}

export function* childrenForFieldName(syntaxNode: SyntaxNode | null | undefined, ...fieldNames: string[]): IterableIterator<SyntaxNode> {

    let cursor = syntaxNode?.walk();

    if (cursor == null || !cursor.gotoFirstChild())
        return;

    do {

        if (!fieldNames.includes(currentFieldName(cursor)))
            continue;

        yield currentNode(cursor);

    } while (cursor.gotoNextSibling());

}

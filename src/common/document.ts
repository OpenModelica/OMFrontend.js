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

 import { Position, Range, TextDocument, TextDocumentContentChangeEvent, TextEdit } from "vscode-languageserver-textdocument";

 import { ModelicaContext } from "./context.js";
 import { Point, SyntaxNode, Tree } from "./parser.js";
 import { ModelicaScope } from "./scope.js";
 import { ModelicaClassSymbol, ModelicaNamedElementSymbol } from "./symbols.js";
 import { ModelicaComponentReferenceExpressionSyntax, ModelicaIdentifierSyntax, ModelicaNameSyntax, ModelicaStoredDefinitionSyntax, ModelicaTypeSpecifierSyntax } from "./syntax.js";
 
 export class ModelicaDocument implements ModelicaScope, TextDocument {
 
     #context: ModelicaContext;
     #document: TextDocument;
     #tree: Tree;
     #symbols: ModelicaClassSymbol[];
     #syntax: ModelicaStoredDefinitionSyntax;
 
     constructor(context: ModelicaContext, uri: string, version: number, content: string) {
         this.#context = context;
         this.#document = TextDocument.create(uri, "modelica", version, content);
         this.#tree = this.#context.parse(content);
         this.#syntax = new ModelicaStoredDefinitionSyntax(this.#tree.rootNode);
         this.#symbols = [];
     }
 
     private asPoint(position: Position): Point {
         return {
             column: position.character,
             row: position.line
         };
     }
 
     get context(): ModelicaContext {
         return this.#context;
     }
 
     getText(range?: Range): string {
         return this.#document.getText(range);
     }
 
     get languageId(): string {
         return this.#document.languageId;
     }
 
     get lineCount(): number {
         return this.#document.lineCount;
     }
 
     offsetAt(position: Position): number {
         return this.#document.offsetAt(position);
     }
 
     positionAt(offset: number): Position {
         return this.#document.positionAt(offset);
     }
 
     async resolve(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null> {
         throw new Error("Method not implemented.");
     }
 
     async resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null> {
         return null;
     }
 
     get syntax(): ModelicaStoredDefinitionSyntax {
         return this.#syntax;
     }
 
     * syntaxErrors(node?: SyntaxNode): IterableIterator<SyntaxNode> {
 
         if (node == null)
             node = this.tree.rootNode;
 
         if (!node.hasError())
             return;
 
         if (node.type === "ERROR" || node.isMissing())
             yield node;
 
         for (let child of node.children)
             yield* this.syntaxErrors(child);
 
     }
 
     get tree(): Tree {
         return this.#tree;
     }
 
     update(text: string, range?: Range): void {
 
         if (range == null) {
 
             TextDocument.update(this.#document, [{ text: text }], this.#document.version + 1);
             this.#tree = this.#context.parse(this.#document.getText());
 
         } else {
 
             let startIndex = this.offsetAt(range.start);
             let oldEndIndex = this.offsetAt(range.end);
             let startPosition = this.asPoint(this.positionAt(startIndex));
             let oldEndPosition = this.asPoint(this.positionAt(oldEndIndex));
             let newEndIndex = startIndex + text.length;
 
             TextDocument.update(this.#document, [{ range: range, text: text }], this.#document.version + 1);
             let newEndPosition = this.asPoint(this.positionAt(newEndIndex));
 
             this.#tree.edit({
                 newEndIndex: newEndIndex,
                 newEndPosition: newEndPosition,
                 oldEndIndex: oldEndIndex,
                 oldEndPosition: oldEndPosition,
                 startIndex: startIndex,
                 startPosition: startPosition
             });
 
             this.#tree = this.#context.parse((index: number, position?: Point) => {
 
                 if (position != null) {
                     return this.getText({
                         end: {
                             character: position.column + 1,
                             line: position.row,
                         },
                         start: {
                             character: position.column,
                             line: position.row,
                         }
                     });
                 }
 
                 return this.getText({
                     end: this.positionAt(index + 1),
                     start: this.positionAt(index)
                 });
 
             }, this.#tree);
 
         }
 
         this.#syntax = new ModelicaStoredDefinitionSyntax(this.#tree.rootNode);
 
     }
 
     get uri(): string {
         return this.#document.uri;
     }
 
     get version(): number {
         return this.#document.version;
     }
 
 }
 
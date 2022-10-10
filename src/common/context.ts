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

 import * as JSZip from "jszip";

 import { ModelicaDocument } from "./document.js";
 import { ModelicaLibrary, ModelicaZipLibrary } from "./library.js";
 import { InputReader, Tree } from "./parser.js";
 import { MODELICA_PREDEFINED } from "./predefined.js";
 import { ModelicaScope } from "./scope.js";
 import { ModelicaArrayClassSymbol, ModelicaBooleanClassSymbol, ModelicaClassSymbol, ModelicaIntegerClassSymbol, ModelicaNamedElementSymbol, ModelicaNumberObjectSymbol, ModelicaRealClassSymbol, ModelicaStringClassSymbol } from "./symbols.js";
 import { ModelicaComponentReferenceExpressionSyntax, ModelicaIdentifierSyntax, ModelicaNameSyntax, ModelicaStoredDefinitionSyntax, ModelicaTypeSpecifierSyntax } from "./syntax.js";
 
 export abstract class ModelicaContext implements ModelicaScope {
 
     static #annotations?: ModelicaClassSymbol;
     #builtins: Map<string, ModelicaClassSymbol> = new Map<string, ModelicaClassSymbol>();
     #documents: Map<string, ModelicaDocument> = new Map<string, ModelicaDocument>();
     #libraries: ModelicaLibrary[];
     #workspace?: ModelicaLibrary;
 
     constructor(workspace?: ModelicaLibrary, libraries?: ModelicaLibrary[]) {
         this.#workspace = workspace;
         this.#libraries = libraries ?? [];
         this.#builtins = new Map<string, ModelicaClassSymbol>();
         this.#builtins.set("Boolean", new ModelicaBooleanClassSymbol(this));
         this.#builtins.set("Integer", new ModelicaIntegerClassSymbol(this));
         this.#builtins.set("Real", new ModelicaRealClassSymbol(this));
         this.#builtins.set("String", new ModelicaStringClassSymbol(this));
     }
 
     abstract addLibrary(path: string): ModelicaLibrary;
 
     addZipLibrary(zip: JSZip, rootPath?: string | string[]): ModelicaZipLibrary {
         let library = new ModelicaZipLibrary(this, zip, rootPath);
         this.libraries.push(library);
         return library;
     }
 
     get annotations(): Promise<ModelicaClassSymbol> {
 
         let context = this;
 
         return async function () {
 
             if (ModelicaContext.#annotations != null)
                 return ModelicaContext.#annotations;
 
             let tree = context.parse(MODELICA_PREDEFINED);
 
             let node = ModelicaStoredDefinitionSyntax.new(tree.rootNode);
 
             ModelicaContext.#annotations = (await node?.instantiate(context))?.[0] ?? new ModelicaClassSymbol(context);
 
             return ModelicaContext.#annotations;
 
         }();
 
     }
 
     get builtins(): Map<string, ModelicaClassSymbol> {
         return this.#builtins;
     }
 
     get roots(): AsyncIterableIterator<ModelicaClassSymbol> {
 
         let context = this;
 
         return async function* () {
 
             for (let library of context.libraries) {
 
                 let root = await library.resolve("Modelica");
 
                 if (root instanceof ModelicaClassSymbol)
                     yield root;
 
                 root = await library.resolve("PL_Lib");
 
                 if (root instanceof ModelicaClassSymbol)
                     yield root;
 
                 root = await library.resolve("ThermoPower");
 
                 if (root instanceof ModelicaClassSymbol)
                     yield root;
 
                 root = await library.resolve("FirstBookExamples");
 
                 if (root instanceof ModelicaClassSymbol)
                     yield root;
 
             }
 
         }();
 
     }
 
     get context(): ModelicaContext {
         return this;
     }
 
     get documents(): Map<string, ModelicaDocument> {
         return this.#documents;
     }
 
     get libraries(): ModelicaLibrary[] {
         return this.#libraries;
     }
 
     async resolve(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null> {
 
         if (reference == null)
             return null;
 
         for (let document of this.documents.values()) {
 
             let symbol = await document.resolve(reference, global);
 
             if (symbol != null)
                 return symbol;
 
         }
 
         let symbol = await this.workspace?.resolve(reference, global);
 
         if (symbol != null)
             return symbol;
 
         for (let library of this.libraries) {
 
             let symbol = await library.resolve(reference, global);
 
             if (symbol != null)
                 return symbol;
 
         }
 
         let name: string | null | undefined = null;
 
         if (reference instanceof ModelicaIdentifierSyntax)
             name = reference.toString();
 
         else if (reference instanceof ModelicaNameSyntax)
             name = reference.toString();
 
         else if (reference instanceof ModelicaTypeSpecifierSyntax)
             name = reference.name?.toString();
 
         else if (Array.isArray(reference))
             name = reference.join(".");
 
         else
             name = reference;
 
         if (name != null) {
 
             symbol = (await (await this.annotations).getNamedElement(name)) ?? this.builtins.get(name) ?? null;
 
             if (reference instanceof ModelicaTypeSpecifierSyntax && reference.subscripts != null && reference.subscripts.length > 0) {
 
                 if (symbol instanceof ModelicaClassSymbol) {
 
                     let shape = [];
 
                     for (let subscript of reference.subscripts) {
 
                         let value = await subscript.expression?.evaluate(this);
 
                         if (value instanceof ModelicaNumberObjectSymbol)
                             shape.push(value.value);
 
                         else
                             shape.push(undefined);
 
                     }
 
                     return new ModelicaArrayClassSymbol(symbol.parent, undefined, undefined, symbol, shape);
 
                 }
 
                 return null;
 
             }
 
             return symbol;
 
         }
 
         return null;
 
     }
 
     async resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null> {
 
         if (reference == null)
             return null;
 
         for (let document of this.documents.values()) {
 
             let symbol = await document.resolveFunction(reference, global);
 
             if (symbol != null)
                 return symbol;
 
         }
 
         let symbol = await this.workspace?.resolveFunction(reference, global);
 
         if (symbol != null)
             return symbol;
 
         for (let library of this.libraries) {
 
             let symbol = await library.resolveFunction(reference, global);
 
             if (symbol != null)
                 return symbol;
 
         }
 
         return null;
 
     }
 
 
     abstract parse(input: string | InputReader, previousTree?: Tree): Tree;
 
     get workspace(): ModelicaLibrary | undefined {
         return this.#workspace;
     }
 
 }
 
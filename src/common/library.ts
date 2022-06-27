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

 import { ModelicaContext } from "./context";
 import { ModelicaScope } from "./scope";
 import { ModelicaClassSymbol, ModelicaNamedElementSymbol } from "./symbols";
 import { ModelicaComponentReferenceExpressionSyntax, ModelicaIdentifierSyntax, ModelicaNameSyntax, ModelicaStoredDefinitionSyntax, ModelicaTypeSpecifierSyntax } from "./syntax";
 import { getIdentifiers } from "./util";
 
 export abstract class ModelicaLibrary implements ModelicaScope {
 
     #context: ModelicaContext;
     #symbols: Map<string, ModelicaClassSymbol[] | null> = new Map();
 
     constructor(context: ModelicaContext) {
         this.#context = context;
     }
 
     get context(): ModelicaContext {
         return this.#context;
     }
     
     abstract list(...filePath: string[]): AsyncIterableIterator<string>;
 
     async load(...filePath: string[]): Promise<ModelicaStoredDefinitionSyntax | null> {
 
         // TODO: implement caching...
 
         if (filePath == null || filePath.length == 0)
             return null;
 
         let text = null;
         let fileName = filePath[filePath.length - 1];
 
         if (fileName.endsWith(".mo"))
             text = await this.read(...filePath);
 
         else
             text = await this.read(...filePath, "package.mo");
 
         if (text == null)
             return null;
 
         let tree = this.#context.parse(text);
 
         if (fileName.endsWith(".mo"))
             return ModelicaStoredDefinitionSyntax.new(tree.rootNode) ?? null;
 
         return ModelicaStoredDefinitionSyntax.new(tree.rootNode, this, filePath) ?? null;
 
     }
 
     async resolve(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null> {
 
         // TODO: structured entity should not have more than one class definition
 
         let identifiers = getIdentifiers(reference);
         let identifier = identifiers[0];
 
         if (identifier == null)
             return null;
 
         let classSymbols = null;
 
         if (this.#symbols.get(identifier) !== undefined) {
 
             classSymbols = this.#symbols.get(identifier);
 
         } else {
 
             let text = await this.read(identifier + ".mo");
 
             if (text != null) {
 
                 let tree = this.#context.parse(text);
                 let node = ModelicaStoredDefinitionSyntax.new(tree.rootNode);
                 classSymbols = await node?.instantiate(this.#context);
 
             } else {
 
                 text = await this.read(identifier, "package.mo");
 
                 if (text != null) {
                     let tree = this.#context.parse(text);
                     let node = ModelicaStoredDefinitionSyntax.new(tree.rootNode, this, [identifier]);
                     classSymbols = await node?.instantiate(this.#context);
                 }
 
             }
 
             this.#symbols.set(identifier, classSymbols ?? null);
 
         }
 
         if (classSymbols != null) {
 
             identifiers = identifiers.slice(1);
 
             if (identifiers.length > 0)
                 return classSymbols[0]?.resolve(identifiers) ?? null;
 
             return classSymbols[0] ?? null;
 
         }
 
         return null;
 
     }
 
     async resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null> {
         return null;
     }
 
     abstract read(...filePath: string[]): Promise<string | null>;
 
 }
 
 export abstract class ModelicaFileSystemLibrary extends ModelicaLibrary {
 
     constructor(context: ModelicaContext) {
         super(context);
     }
 
 }
 
 export class ModelicaWebLibrary extends ModelicaLibrary {
 
     constructor(context: ModelicaContext) {
         super(context);
     }
 
     override list(...filePath: string[]): AsyncIterableIterator<string> {
         throw new Error("Method not implemented.");
     }
 
     override read(...filePath: string[]): Promise<string | null> {
         throw new Error("Method not implemented.");
     }
 
 }
 
 export class ModelicaZipLibrary extends ModelicaLibrary {
 
     #rootPath?: string;
     #zip: JSZip;
 
     constructor(context: ModelicaContext, zip: JSZip, rootPath?: string | string[]) {
         super(context);
         this.#zip = zip;
         this.#rootPath = Array.isArray(rootPath) ? rootPath.join("/") : rootPath;
     }
 
     override async *list(...filePath: string[]): AsyncIterableIterator<string> {
 
         if (filePath.length > 0) {
 
             let firstName = filePath[0];
 
             for await (let name of this.list()) {
 
                 if (name == firstName || name.startsWith(firstName + " ")) {
                     filePath[0] = name;
                     break;
                 }
 
             }
 
         }
 
         let name = null;
 
         if (this.#rootPath == null)
             name = filePath.join("/");
 
         else
             name = this.#rootPath + "/" + filePath.join("/");
 
         let list: string[] = [];
 
         this.#zip.folder(name)?.forEach((relativePath: string, file: JSZip.JSZipObject) => {
 
             if (file.name.endsWith("/package.mo"))
                 return;
 
             let relativePathParts = relativePath.split("/");
 
             if (file.dir == true && relativePathParts.length == 2)
                 list.push(relativePathParts[0]);
 
             else if (file.name.endsWith(".mo") && relativePathParts.length == 1)
                 list.push(relativePathParts[0]);
 
         });
 
         yield* list;
 
     }
 
     override async read(...filePath: string[]): Promise<string | null> {
 
         if (filePath.length == 0)
             return null;
 
         let firstName = filePath[0];
 
         for await (let name of this.list()) {
 
             if (name == firstName || name.startsWith(firstName + " ")) {
                 filePath[0] = name;
                 break;
             }
 
         }
 
         let name = null;
 
         if (this.#rootPath == null)
             name = filePath.join("/");
 
         else
             name = this.#rootPath + "/" + filePath.join("/");
 
         //console.log("READ ZIP FILE: " + name);
 
         return this.#zip.file(name)?.async("string") ?? null;
 
     }
 
 }
 
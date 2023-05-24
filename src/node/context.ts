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

import Parser from "tree-sitter";

// @ts-ignore
import Modelica from "tree-sitter-modelica";

import { ModelicaContext } from "../common/context.js";
import { ModelicaLibrary } from "../common/library.js";
import { InputReader, Tree } from "../common/parser.js";
import { ModelicaNodeFileSystemLibrary } from "./library.js";


export class ModelicaNodeContext extends ModelicaContext {

    static #parser: Parser;

    constructor(workspace?: ModelicaLibrary, libraries?: ModelicaLibrary[]) {

        super(workspace, libraries);

        ModelicaNodeContext.initialize();

        if (ModelicaNodeContext.#parser == null)
            throw new Error("ModelicaNodeContext is not initialized.");

    }

    addLibrary(rootPath: string): ModelicaLibrary {
        let library = new ModelicaNodeFileSystemLibrary(this, rootPath);
        this.libraries.push(library);
        return library;
    }

    static initialize(): void {

        if (ModelicaNodeContext.#parser != null)
            return;

        let parser = new Parser();
        parser.setLanguage(Modelica);
        ModelicaNodeContext.#parser = parser;

    }

    override parse(input: string | InputReader, previousTree?: Tree): Tree {
        return ModelicaNodeContext.#parser.parse(input, previousTree as Parser.Tree | undefined);
    }

}

export class ModelicaScriptContext extends ModelicaContext {

    static #parser: Parser;

    constructor(workspace?: ModelicaLibrary, libraries?: ModelicaLibrary[]) {

        super(workspace, libraries);

        ModelicaScriptContext.initialize();

        if (ModelicaScriptContext.#parser == null)
            throw new Error("ModelicaScriptContext is not initialized.");

    }

    addLibrary(rootPath: string): ModelicaLibrary {
        let library = new ModelicaNodeFileSystemLibrary(this, rootPath);
        this.libraries.push(library);
        return library;
    }

    static initialize(): void {

        if (ModelicaScriptContext.#parser != null)
            return;

        let parser = new Parser();
        parser.setLanguage(Modelica/*Script*/);
        ModelicaScriptContext.#parser = parser;

    }

    override parse(input: string | InputReader, previousTree?: Tree): Tree {
        return ModelicaScriptContext.#parser.parse(input, previousTree as Parser.Tree | undefined);
    }

}

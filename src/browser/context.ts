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

import * as Parser from 'web-tree-sitter';

import { ModelicaContext } from "../common/context";
import { ModelicaLibrary } from "../common/library";
import { InputReader, Tree } from "../common/parser";
import { ModelicaBrowserFileSystemLibrary } from "./library";

export class ModelicaBrowserContext extends ModelicaContext {

    static #parser: Parser;

    constructor(workspace?: ModelicaLibrary, libraries?: ModelicaLibrary[]) {

        super(workspace, libraries);

        if (ModelicaBrowserContext.#parser == null)
            throw new Error("ModelicaBrowserContext is not initialized.");

    }

    addLibrary(rootPath: string): ModelicaLibrary {
        let library = new ModelicaBrowserFileSystemLibrary(this, rootPath);
        this.libraries.push(library);
        return library;
    }

    static async initialize(parser?: Parser): Promise<void> {

        if (ModelicaBrowserContext.#parser != null)
            return;

        if (parser != null) {
            ModelicaBrowserContext.#parser = parser;
            return;
        }

        await Parser.default.init();
        parser = new Parser.default();
        parser.setLanguage(await Parser.Language.load("tree-sitter-modelica.wasm"));

        ModelicaBrowserContext.#parser = parser;

    }

    override parse(input: string | InputReader, previousTree?: Tree): Tree {
        return ModelicaBrowserContext.#parser.parse(input, <Parser.Tree | undefined>previousTree);
    }

}

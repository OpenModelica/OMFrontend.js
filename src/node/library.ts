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

import { ModelicaContext } from "../common/context.js";
import { ModelicaLibrary } from "../common/library.js";
import fs from "fs";
import path from "path";

export class ModelicaNodeFileSystemLibrary extends ModelicaLibrary {

    #rootPath: string;

    constructor(context: ModelicaContext, rootPath: string) {
        super(context);
        this.#rootPath = path.resolve(rootPath);
    }

    override async *list(...filePath: string[]): AsyncIterableIterator<string> {

        try {

            for (let fileName of await fs.promises.readdir(path.join(this.#rootPath, ...filePath))) {

                try {

                    let absoluteFilePath = path.join(this.#rootPath, ...filePath, fileName);

                    if (absoluteFilePath.endsWith("/package.mo"))
                        continue;

                    let stats = await fs.promises.stat(absoluteFilePath);

                    if (stats.isDirectory() == true)
                        yield fileName;

                    else if (stats.isFile() && fileName.endsWith(".mo"))
                        yield fileName;

                } catch (e) {
                }

            }

        } catch (e) {
        }

    }

    override async read(...filePath: string[]): Promise<string | null> {

        try {

            let absoluteFilePath = path.join(this.#rootPath, ...filePath);
            return await fs.promises.readFile(absoluteFilePath, "utf-8");

        } catch (e) {
            return null;
        }

    }

}

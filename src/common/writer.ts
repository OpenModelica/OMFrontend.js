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

export interface Writer {
    write(message: string): void;
}

export abstract class PrintWriter implements Writer {

    print(message: string, indent?: number): void {

        if (indent != null)
            this.write("    ".repeat(indent));

        this.write(message);

    }

    println(message?: string, indent?: number): void {

        if (message != null) {

            if (indent != null)
                this.write("    ".repeat(indent));

            this.write(message);

        }

        this.write("\n");

    }

    abstract write(message: string): void;

}

export class BufferedPrintWriter extends PrintWriter {

    #buffer: string[] = [];

    override toString(): string {
        return this.#buffer.join("");
    }

    override write(message: string): void {
        this.#buffer.push(message);
    }

}
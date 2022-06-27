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

import { ModelicaIdentifierSyntax, ModelicaNameSyntax, ModelicaTypeSpecifierSyntax } from "./syntax";

export function getIdentifiers(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string | string[] | null | undefined): string[] {

    if (reference == null)
        return [];

    if (reference instanceof ModelicaIdentifierSyntax) {

        if (reference.value != null)
            return [reference.value];

        return [];

    }

    if (reference instanceof ModelicaNameSyntax)
        return reference.identifiers ?? [];

    if (reference instanceof ModelicaTypeSpecifierSyntax)
        return reference.identifiers ?? [];

    if (Array.isArray(reference))
        return reference;

    return reference.split(".").map(item => item.trim());

}

export function toArray<T>(iterator: IterableIterator<T> | null | undefined): T[] {

    let values: T[] = [];

    for (let value of iterator ?? [])
        values.push(value);

    return values;

}

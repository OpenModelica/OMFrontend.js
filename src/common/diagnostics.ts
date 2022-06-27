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

import { Range } from "./parser.js";

export enum ModelicaDiagnosticSeverity {
    ERROR = 0,
    HINT = 3,
    INFORMATION = 2,
    WARNING = 1,
}

export class ModelicaDiagnostic {

    code: number;
    message: string;
    range?: Range;
    severity: ModelicaDiagnosticSeverity;
    source?: string;

    constructor(code: number, message: string, severity: ModelicaDiagnosticSeverity, range?: Range | null) {
        this.code = code;
        this.message = message;
        this.severity = severity;
        this.range = range ?? undefined;
    }

}

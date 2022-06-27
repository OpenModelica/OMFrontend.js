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

 import { ModelicaContext } from "./context";
 import { ModelicaClassSymbol, ModelicaNamedElementSymbol } from "./symbols";
 import { ModelicaComponentReferenceExpressionSyntax, ModelicaIdentifierSyntax, ModelicaNameSyntax, ModelicaTypeSpecifierSyntax } from "./syntax";
 
 export interface ModelicaScope {
 
     get context(): ModelicaContext;
 
     resolve(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null>;
 
     resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null>;
 
 }
 
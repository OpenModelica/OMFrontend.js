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

import { ModelicaScope } from "./scope.js";
import { ModelicaAlgorithmSectionSyntax, ModelicaClassDefinitionSyntax, ModelicaClassRedeclarationSyntax, ModelicaClassRestriction, ModelicaComponentDeclarationSyntax, ModelicaComponentReferenceExpressionSyntax, ModelicaConnectClauseSyntax, ModelicaDescriptionStringSyntax, ModelicaElementModificationSyntax, ModelicaElementSyntax, ModelicaEnumerationLiteralSyntax, ModelicaEquationSectionSyntax, ModelicaExpressionSyntax, ModelicaExtendsClauseSyntax, ModelicaIdentifierSyntax, ModelicaImportClauseSyntax, ModelicaModificationEnvironment, ModelicaNamedArgumentSyntax, ModelicaNamedElementSyntax, ModelicaNameSyntax, ModelicaTypeSpecifierSyntax, ModelicaVisibility } from "./syntax.js";
import { BufferedPrintWriter, PrintWriter } from "./writer.js";
import { getIdentifiers, toArray } from "./util.js";
import { ModelicaContext } from "./context.js";
import { renderDiagram, renderIcon, renderSimpleIcon } from "./graphics.js";
import { XmlElement } from "./dom.js";


export abstract class ModelicaSymbol {

    constructor() {
    }

    abstract accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any>;

    abstract print(printWriter: PrintWriter, indent?: number): Promise<void>;

}

export class ModelicaObjectSymbol extends ModelicaSymbol {

    #properties: Map<string, ModelicaObjectSymbol | null> = new Map();
    #type: ModelicaClassSymbol;
    #value?: Array<ModelicaObjectSymbol | undefined> | boolean | number | string;

    constructor(type: ModelicaClassSymbol, value?: Array<ModelicaObjectSymbol | undefined> | boolean | number | string) {
        super();
        this.#type = type;
        this.#value = value;
    }

    override accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any> {
        return visitor.visitObject(this, ...args);
    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        printWriter.println("<" + this.type.name + "> {");

        if (this.value != null) {

            if (this instanceof ModelicaArrayObjectSymbol) {

                printWriter.println("value: <ArrayType> [", (indent ?? 0) + 1);

                for (let item of this.value) {

                    if (item != null) {

                        printWriter.print("", (indent ?? 0) + 2);
                        await item.print(printWriter, (indent ?? 0) + 2);

                    } else {
                        printWriter.println("null", (indent ?? 0) + 2);
                    }

                }

                printWriter.println("]", (indent ?? 0) + 1);

            } else if (this instanceof ModelicaEnumerationObjectSymbol) {

                printWriter.println("value: <EnumerationType> " + this.value, (indent ?? 0) + 1);

            } else {

                switch (this.type.name) {

                    case "Boolean":
                        printWriter.println("value: <BooleanType> " + this.value, (indent ?? 0) + 1);
                        break;

                    case "Integer":
                        printWriter.println("value: <IntegerType> " + this.value, (indent ?? 0) + 1);
                        break;

                    case "Real":
                        printWriter.println("value: <RealType> " + this.value, (indent ?? 0) + 1);
                        break;

                    case "String":
                        printWriter.println("value: <StringType> \"" + this.value + "\"", (indent ?? 0) + 1);
                        break;

                }

            }

        }

        for (let entry of this.#properties.entries()) {

            printWriter.print(entry[0] + ": ", (indent ?? 0) + 1);

            if (entry[1] != null)
                await entry[1].print(printWriter, (indent ?? 0) + 1);

            else
                printWriter.println("null");

        }

        printWriter.println("}", indent);

    }

    get properties(): Map<string, ModelicaObjectSymbol | null> {
        return this.#properties;
    }

    toJSON(): any {

        let value: any;

        if (this.type instanceof ModelicaBuiltinClassSymbol) {

            if (Array.isArray(this.value)) {

                value = [];

                for (let element of this.value)
                    value.push(element?.toJSON());

            } else {

                value = this.value ?? null;

            }

        } else {

            value = {};
            value["@type"] = this.type.toString();

            for (let key of this.properties.keys())
                value[key] = this.properties.get(key)?.toJSON();

        }

        return value;

    }

    get type(): ModelicaClassSymbol {
        return this.#type;
    }

    get value(): Array<ModelicaObjectSymbol | undefined> | boolean | number | string | undefined {
        return this.#value;
    }

    set value(value: Array<ModelicaObjectSymbol | undefined> | boolean | number | string | undefined) {
        this.#value = value;
    }

}

export class ModelicaArrayObjectSymbol extends ModelicaObjectSymbol {

    constructor(type: ModelicaArrayClassSymbol, value?: Array<ModelicaObjectSymbol | undefined>) {
        super(type, value ?? []);
    }

    override get type(): ModelicaArrayClassSymbol {
        return <ModelicaArrayClassSymbol>super.type;
    }

    override get value(): Array<ModelicaObjectSymbol> {
        return <Array<ModelicaObjectSymbol>>super.value ?? [];
    }

    override set value(value: Array<ModelicaObjectSymbol>) {
        super.value = value;
    }

}

export class ModelicaBooleanObjectSymbol extends ModelicaObjectSymbol {

    constructor(type: ModelicaBooleanClassSymbol, value: boolean) {
        super(type, value);
    }

    override get type(): ModelicaBooleanClassSymbol {
        return <ModelicaBooleanClassSymbol>super.type;
    }

    override get value(): boolean {
        return super.value === true;
    }

    override set value(value: boolean) {
        super.value = value;
    }

}

export class ModelicaEnumerationObjectSymbol extends ModelicaObjectSymbol {

    constructor(type: ModelicaClassSymbol, value: number) {
        super(type, value);
    }

    override get value(): number {
        return Number(super.value);
    }

    override set value(value: number) {
        super.value = value;
    }

}

export abstract class ModelicaNumberObjectSymbol extends ModelicaObjectSymbol {

    constructor(type: ModelicaNumberClassSymbol, value: number) {
        super(type, value);
    }

    override get type(): ModelicaNumberClassSymbol {
        return <ModelicaNumberClassSymbol>super.type;
    }

    override get value(): number {
        return Number(super.value);
    }

    override set value(value: number) {
        super.value = value;
    }

}

export class ModelicaIntegerObjectSymbol extends ModelicaNumberObjectSymbol {

    constructor(type: ModelicaIntegerClassSymbol, value: number) {
        super(type, value | 0);
    }

    override get type(): ModelicaIntegerClassSymbol {
        return <ModelicaIntegerClassSymbol>super.type;
    }

    override get value(): number {
        return super.value | 0;
    }

    override set value(value: number) {
        super.value = value;
    }

}

export class ModelicaRealObjectSymbol extends ModelicaNumberObjectSymbol {

    constructor(type: ModelicaRealClassSymbol, value: number) {
        super(type, value);
    }

    override get type(): ModelicaRealClassSymbol {
        return <ModelicaRealClassSymbol>super.type;
    }

    override get value(): number {
        return super.value;
    }

    override set value(value: number) {
        super.value = value;
    }

}

export class ModelicaStringObjectSymbol extends ModelicaObjectSymbol {

    constructor(type: ModelicaStringClassSymbol, value: string) {
        super(type, value);
    }

    override get type(): ModelicaStringClassSymbol {
        return <ModelicaStringClassSymbol>super.type;
    }

    override get value(): string {
        return String(super.value);
    }

    override set value(value: string) {
        super.value = value;
    }

}

export abstract class ModelicaElementSymbol extends ModelicaSymbol {

    #parent: ModelicaScope;

    constructor(parent: ModelicaScope) {
        super();
        this.#parent = parent;
    }

    abstract get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined>;

    get parent() {
        return this.#parent;
    }

    abstract get syntax(): ModelicaElementSyntax | undefined;

    get visibility(): ModelicaVisibility | undefined {
        return this.syntax?.visibility;
    }

}

export class ModelicaAlgorithmSectionSymbol extends ModelicaElementSymbol {

    #syntax?: ModelicaAlgorithmSectionSyntax;

    constructor(parent: ModelicaScope, syntax?: ModelicaAlgorithmSectionSyntax) {
        super(parent);
        this.#syntax = syntax;
    }

    override async accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any> {
        return await visitor.visitAlgorithmSection(this, ...args);
    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        return async function () {
            return undefined;
        }();

    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {
        printWriter.println("algorithm;", indent);
    }

    override get syntax(): ModelicaAlgorithmSectionSyntax | undefined {
        return this.#syntax;
    }

}

export class ModelicaEquationSectionSymbol extends ModelicaElementSymbol {

    #syntax?: ModelicaEquationSectionSyntax;

    constructor(parent: ModelicaScope, syntax?: ModelicaEquationSectionSyntax) {
        super(parent);
        this.#syntax = syntax;
    }

    override async accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any> {
        return await visitor.visitEquationSection(this, ...args);
    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        return async function () {
            return undefined;
        }();

    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {
        printWriter.println("equation;", indent);
    }

    override get syntax(): ModelicaEquationSectionSyntax | undefined {
        return this.#syntax;
    }

}

export class ModelicaExtendsSymbol extends ModelicaElementSymbol {

    #annotation?: ModelicaAnnotationClassSymbol;
    #classSymbol?: ModelicaClassSymbol;
    #instantiated?: boolean;
    #instantiating?: boolean;
    #modificationEnvironment: ModelicaModificationEnvironment;
    #syntax?: ModelicaExtendsClauseSyntax;

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, syntax?: ModelicaExtendsClauseSyntax) {
        super(parent);
        this.#modificationEnvironment = modificationEnvironment ?? new ModelicaModificationEnvironment();
        this.#syntax = syntax;
    }

    override async accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any> {
        return await visitor.visitExtends(this, ...args);
    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        let node = this;

        return async function () {

            if (node.#annotation == null)
                node.#annotation = await node.syntax?.annotationClause?.instantiate(node.parent);

            return node.#annotation;

        }();

    }

    get classSymbol(): Promise<ModelicaClassSymbol | undefined> {

        let node = this;

        return async function () {

            await node.instantiate();
            return node.#classSymbol;

        }();

    }

    async instantiate(): Promise<void> {

        if (this.#instantiated == true)
            return;

        if (this.#instantiating == true) {
            this.#instantiated = true;
            return;
            //throw new Error("Inconsistency detected when instantiating extends: " + this.syntax?.source?.text);
        }

        //console.log("Start instantiate extends", this.syntax?.source?.text);

        this.#instantiating = true;

        //console.log("GOOD1");
        let classSymbol = await this.parent?.resolve(this.syntax?.typeSpecifier);
        //console.log("GOOD2");

        if (classSymbol != null && classSymbol instanceof ModelicaClassSymbol) {
            //console.log("GOOD3");
            this.#classSymbol = await classSymbol.instantiate(classSymbol.parent, this.modificationEnvironment.merge(this.syntax?.classModification));

            // FIND BETTER WAY TO RECURSIVLEY INSTANTIATE BASE CLASSES
            for await (let baseClass of this.#classSymbol.baseClasses)
                ;
            //console.log("GOOD4");
        }


        //console.log("End instantiate extends", this.syntax?.source?.text);

        this.#instantiated = true;
        this.#instantiating = undefined;

    }

    get modificationEnvironment(): ModelicaModificationEnvironment {
        return this.#modificationEnvironment;
    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        printWriter.print("extends ", indent);

        let typeSpecifier = this.syntax?.typeSpecifier?.toString();

        if (typeSpecifier != null)
            printWriter.print(typeSpecifier);

        printWriter.println(";");

    }

    override get syntax(): ModelicaExtendsClauseSyntax | undefined {
        return this.#syntax;
    }

}

export class ModelicaImportSymbol extends ModelicaElementSymbol {

    #syntax?: ModelicaImportClauseSyntax;

    constructor(parent: ModelicaScope, syntax?: ModelicaImportClauseSyntax) {
        super(parent);
        this.#syntax = syntax;
    }

    override accept(visitor: ModelicaSymbolVisitor, ...args: any[]): any {
        return visitor.visitImport(this, ...args);
    }

    get alias(): ModelicaIdentifierSyntax | undefined {
        return this.syntax?.alias;
    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        return async function () {
            return undefined;
        }();

    }

    get elements(): AsyncIterableIterator<ModelicaNamedElementSymbol> {

        let node = this;

        return async function* () {

            let element = await node.parent.resolve(node.name, true);

            if (element == null)
                return;

            if (node.wildcard) {

                if (element instanceof ModelicaClassSymbol)
                    yield* element.namedElements;

            } else if (node.imports != null && node.imports.length > 0) {

                if (element instanceof ModelicaClassSymbol) {

                    for (let importName of node.imports) {

                        let importElement = await element.getNamedElement(importName);

                        if (importElement != null)
                            yield importElement;

                    }

                }

            } else {
                yield element;
            }

        }();

    }

    get imports(): ModelicaIdentifierSyntax[] | undefined {
        return this.syntax?.imports;
    }

    get name(): ModelicaNameSyntax | undefined {
        return this.syntax?.name;
    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        printWriter.print("import ", indent);

        let alias = this.alias?.toString();

        if (alias != null)
            printWriter.print(alias + " = ");

        let name = this.name?.toString();

        if (name != null)
            printWriter.print(name);

        if (this.imports != null && this.imports.length > 0) {

            printWriter.print(".{");

            for (let i = 0; i < this.imports.length; i++) {

                let importName = this.imports[i].toString();

                if (importName != null)
                    printWriter.print(importName);

                if (i < this.imports.length - 1)
                    printWriter.print(", ");

            }

            printWriter.print("}");

        } else if (this.wildcard == true) {
            printWriter.print(".*");
        }

        printWriter.println(";");

    }

    override get syntax(): ModelicaImportClauseSyntax | undefined {
        return this.#syntax;
    }

    get wildcard(): boolean | undefined {
        return this.syntax?.wildcard;
    }

}

export abstract class ModelicaNamedElementSymbol extends ModelicaElementSymbol {

    #modificationEnvironment: ModelicaModificationEnvironment;

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment) {
        super(parent);
        this.#modificationEnvironment = modificationEnvironment ?? new ModelicaModificationEnvironment();
    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        return this.syntax?.descriptionString;
    }

    abstract get diagram(): Promise<string | undefined>;

    abstract get icon(): Promise<string | undefined>;

    abstract get simpleIcon(): Promise<string | undefined>;

    get identifier(): ModelicaIdentifierSyntax | undefined {
        return this.syntax?.identifier;
    }

    get modificationEnvironment(): ModelicaModificationEnvironment {
        return this.#modificationEnvironment;
    }

    get name(): string | undefined {

        if (this.identifier == null || this.identifier.value == null)
            return undefined;

        if (this.parent instanceof ModelicaClassSymbol) {

            let parentName = this.parent.name;

            if (parentName == null)
                return undefined;

            return parentName + "." + this.identifier.value;

        }

        return this.identifier.value;

    }

    abstract get syntax(): ModelicaNamedElementSyntax | undefined;

    override toString(): string | undefined {
        return this.name;
    }

}

export class ModelicaClassSymbol extends ModelicaNamedElementSymbol implements ModelicaScope {

    #annotation?: ModelicaAnnotationClassSymbol;
    #diagram?: string;
    #elements?: ModelicaElementSymbol[];
    #icon?: string;
    #inconsistent?: boolean;
    #instantiated?: boolean;
    #instantiatedBaseClasses?: boolean;
    #instantiatedComponents?: boolean;
    #instantiating?: boolean;
    #instantiatingBaseClasses?: boolean;
    #instantiatingComponents?: boolean;
    #syntax?: ModelicaClassDefinitionSyntax;

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, syntax?: ModelicaClassDefinitionSyntax) {
        super(parent, modificationEnvironment);
        this.#syntax = syntax;
    }

    override accept(visitor: ModelicaSymbolVisitor, ...args: any[]): any {
        return visitor.visitClass(this, ...args);
    }

    get algorithmSections(): AsyncIterableIterator<ModelicaAlgorithmSectionSymbol> {

        let node = this;

        return async function* () {

            await node.#instantiateBaseClasses();

            for await (let element of node.elements) {

                if (element instanceof ModelicaAlgorithmSectionSymbol)
                    yield element;

                else if (node.#instantiatedBaseClasses && element instanceof ModelicaExtendsSymbol) {

                    let classSymbol = await element.classSymbol;

                    if (classSymbol != null)
                        yield* classSymbol.algorithmSections;

                }

            }

        }();

    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        let node = this;

        return async function () {

            if (node.#annotation == null)
                node.#annotation = await node.syntax?.classSpecifier?.annotationClause?.instantiate(node);

            return node.#annotation;

        }();

    }

    get baseClasses(): AsyncIterableIterator<ModelicaClassSymbol> {

        let node = this;

        return async function* () {

            await node.#instantiateBaseClasses();

            for await (let element of node.elements ?? []) {

                if (element instanceof ModelicaExtendsSymbol) {

                    let classSymbol = await element.classSymbol;

                    if (classSymbol != null) {
                        yield classSymbol;
                        yield* classSymbol.baseClasses;
                    }

                }
            }

        }();

    }

    get classes(): AsyncIterableIterator<ModelicaClassSymbol> {

        let node = this;

        return async function* () {

            for await (let element of node.namedElements) {

                if (element instanceof ModelicaClassSymbol)
                    yield element;

            }

        }();

    }

    get classRestriction(): ModelicaClassRestriction | undefined {
        return this.syntax?.classRestriction;
    }

    get components(): AsyncIterableIterator<ModelicaComponentSymbol> {

        let node = this;

        return async function* () {

            await node.#instantiateComponents();

            for await (let element of node.namedElements) {

                if (element instanceof ModelicaComponentSymbol)
                    yield element;

            }

        }();

    }

    get connections(): AsyncIterableIterator<ModelicaConnectClauseSyntax> {

        let node = this;

        return async function* () {

            for await (let element of node.equationSections) {

                for (let equation of element.syntax?.equations ?? []) {

                    if (equation instanceof ModelicaConnectClauseSyntax)
                        yield equation;

                }

            }

        }();

    }

    async construct(positionalArguments?: ModelicaExpressionSyntax[], namedArguments?: ModelicaNamedArgumentSyntax[]): Promise<ModelicaObjectSymbol | undefined> {

        let object = new ModelicaObjectSymbol(this);

        let position = 0;

        for await (let component of this.components) {

            if (component instanceof ModelicaEnumerationLiteralComponentSymbol)
                continue;

            let key = component.identifier?.toString();
            let value = null;

            for (let namedArgument of namedArguments ?? []) {

                if (namedArgument.identifier?.value == key) {
                    value = await namedArgument.expression?.evaluate(this);
                    break;
                }

            }

            if (value == null && positionalArguments?.[position] != null)
                value = await positionalArguments?.[position]?.evaluate(this);

            if (value == null)
                value = await component.value;

            if (value == null)
                value = await (await component.classSymbol)?.construct();

            if (key != null)
                object.properties.set(key, value ?? null);

            position++;

        }

        return object;

    }

    get context(): ModelicaContext {
        return this.parent.context;
    }

    override get diagram(): Promise<string | undefined> {

        let node = this;

        return async function () {

            if (node.#diagram != null)
                return node.#diagram;

            let svg = new XmlElement("svg");
            svg.attributes.set("xmlns", "http://www.w3.org/2000/svg");
            await renderDiagram(svg, node);
            node.#diagram = svg.toString();

            return node.#diagram;

        }();

    }

    get elements(): AsyncIterableIterator<ModelicaElementSymbol> {

        let node = this;

        return async function* () {

            await node.#instantiate();

            for (let element of node.#elements ?? [])
                yield element;

        }();

    }

    get equationSections(): AsyncIterableIterator<ModelicaEquationSectionSymbol> {

        let node = this;

        return async function* () {

            await node.#instantiateBaseClasses();

            for await (let element of node.elements) {

                if (element instanceof ModelicaEquationSectionSymbol)
                    yield element;

                else if (node.#instantiatedBaseClasses && element instanceof ModelicaExtendsSymbol) {

                    let classSymbol = await element.classSymbol;

                    if (classSymbol != null)
                        yield* classSymbol.equationSections;

                }

            }

        }();

    }


    async getNamedElement(identifier: string | ModelicaIdentifierSyntax | null | undefined): Promise<ModelicaNamedElementSymbol | null> {

        identifier = identifier?.toString();

        if (identifier == null)
            return null;

        for await (let namedElement of this.namedElements) {

            if (namedElement.identifier?.toString() == identifier)
                return namedElement;

        }

        return null;

    }

    override get simpleIcon(): Promise<string | undefined> {

        let node = this;

        return async function () {

            if (node.#icon != null)
                return node.#icon;

            let svg = new XmlElement("svg");
            svg.attributes.set("xmlns", "http://www.w3.org/2000/svg");
            await renderSimpleIcon(svg, node);
            node.#icon = svg.toString();

            return node.#icon;

        }();

    }

    override get icon(): Promise<string | undefined> {

        let node = this;

        return async function () {

            if (node.#icon != null)
                return node.#icon;

            let svg = new XmlElement("svg");
            svg.attributes.set("xmlns", "http://www.w3.org/2000/svg");
            await renderIcon(svg, node);
            node.#icon = svg.toString();

            return node.#icon;

        }();

    }

    get imports(): AsyncIterableIterator<ModelicaImportSymbol> {

        let node = this;

        return async function* () {

            for await (let element of node.elements ?? []) {

                if (element instanceof ModelicaImportSymbol)
                    yield element;

            }

        }();

    }

    async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaClassSymbol> {

        if (modificationEnvironment == null || modificationEnvironment.arguments == null || modificationEnvironment.arguments.length == 0)
            //modificationEnvironment = this.modificationEnvironment;
            return this;


        modificationEnvironment = modificationEnvironment.merge(this.modificationEnvironment);
        return new ModelicaClassSymbol(parent, modificationEnvironment, this.syntax);

    }

    async #instantiate(): Promise<void> {

        if (this.#instantiated == true)
            return;

        if (this.#instantiating == true) {
            this.#instantiated = true;
            return;
            //throw new Error("Inconsistency detected when instantiating class: " + this.name);
        }

        //console.log("Start Instantiate:", this.name);

        this.#instantiating = true;

        this.#elements = [];

        let enumerationValue = 0;

        for (let element of this.syntax?.elements ?? []) {

            if (element instanceof ModelicaEnumerationLiteralSyntax)
                this.#elements.push(await element.instantiate(this, this.modificationEnvironment.getModificationEnvironment(element.identifier?.value), enumerationValue++));

            else if (element instanceof ModelicaNamedElementSyntax)
                this.#elements.push(await element.instantiate(this, this.modificationEnvironment.getModificationEnvironment(element.identifier?.value)));

            else
                this.#elements.push(await element.instantiate(this, this.modificationEnvironment));

        }

        if (this.syntax?.library != null && this.syntax?.filePath != null) {

            for await (let fileName of this.syntax.library.list(...this.syntax.filePath)) {

                let storedDefinition = await this.syntax.library.load(...this.syntax.filePath, fileName);

                if (storedDefinition != null) {

                    let classSymbols = await storedDefinition.instantiate(this, this.modificationEnvironment);

                    if (classSymbols.length > 0)
                        this.#elements.push(classSymbols[0]);

                }

            }

        }

        //console.log("End Instantiate:", this.name);

        this.#instantiated = true;
        this.#instantiating = undefined;

    }

    async #instantiateBaseClasses(): Promise<void> {

        if (this.#instantiatedBaseClasses == true)
            return;

        if (this.#instantiatingBaseClasses == true) {
            this.#instantiatedBaseClasses = true;
            return;
            //throw new Error("Inconsistency detected when instantiating base classes for class: " + this.name);
        }

        //console.log("Start Base Instantiate1:", this.name);

        await this.#instantiate();

        //console.log("Start Base Instantiate2:", this.name);

        this.#instantiatingBaseClasses = true;

        for (let element of this.#elements ?? []) {

            if (element instanceof ModelicaExtendsSymbol)
                await element.instantiate();

        }

        //console.log("End Base Instantiate:", this.name);

        this.#instantiatedBaseClasses = true;
        this.#instantiatingBaseClasses = undefined;

    }

    async #instantiateComponents(): Promise<void> {

        if (this.#instantiatedComponents == true)
            return;

        if (this.#instantiatingComponents == true) {
            this.#instantiatedComponents = true;
            return;
            //throw new Error("Inconsistency detected when instantiating components for class: " + this.name);
        }

        await this.#instantiateBaseClasses();

        this.#instantiatingComponents = true;

        for await (let element of this.#elements ?? []) {

            if (element instanceof ModelicaComponentSymbol)
                await element.instantiate();

        }

        this.#instantiatedComponents = true;
        this.#instantiatingComponents = undefined;

    }

    get namedElements(): AsyncIterableIterator<ModelicaNamedElementSymbol> {

        let node = this;

        return async function* () {

            for await (let element of node.elements) {

                if (element instanceof ModelicaNamedElementSymbol)
                    yield element;

                else if (node.#instantiatedBaseClasses && element instanceof ModelicaExtendsSymbol) {

                    let classSymbol = await element.classSymbol;

                    if (classSymbol != null)
                        yield* classSymbol.namedElements;

                }

            }

        }();

    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        await this.#instantiateBaseClasses();
        await this.#instantiateComponents();

        printWriter.println(this.classRestriction + " " + this.identifier, indent);

        for await (let element of this.namedElements)
            await element.print(printWriter, (indent ?? 0) + 1);

        let annotation = await (await this.annotation)?.evaluate();

        if (annotation != null) {

            printWriter.println("annotation(", (indent ?? 0) + 1);

            for (let element of annotation.value) {

                printWriter.print(element.type.name + ": ", (indent ?? 0) + 2);
                await element.print(printWriter, (indent ?? 0) + 2);
            }

            printWriter.println(");", (indent ?? 0) + 1);

        }

        printWriter.println("end " + this.identifier + ";", indent);

    }

    async rdf(printWriter: PrintWriter, indent?: number): Promise<void> {

        printWriter.println(":" + this.name + " rdf:type owl:Class .", indent);

        for await (let baseClass of this.baseClasses)
            printWriter.println(":" + this.name + " rdfs:subClassOf " + ":" + baseClass.name);

        for await (let clazz of this.classes) {
            await clazz.rdf(printWriter, indent);
        }

    }

    async resolve(reference: ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null> {

        //console.log("RESOLVE: ", reference?.toString(), " in scope ", this.name);

        if (reference == null)
            return null;

        global = global ?? false;

        if (reference instanceof ModelicaTypeSpecifierSyntax)
            global = reference.global;

        let namedElementSymbol = null;

        if (this.parent == null || global != true) {

            let identifiers = getIdentifiers(reference);

            //console.log("RGOOD1", this.#instantiated, this.#instantiating, identifiers?.[0]);
            namedElementSymbol = await this.getNamedElement(identifiers?.[0]);
            //console.log("RGOOD2", namedElementSymbol);

            if (namedElementSymbol != null) {

                for (let part of identifiers?.slice(1) ?? []) {

                    if (namedElementSymbol instanceof ModelicaClassSymbol)
                        namedElementSymbol = await namedElementSymbol.getNamedElement(part);

                    else
                        namedElementSymbol = null;

                    if (namedElementSymbol == null)
                        break;

                }

            }

        }

        if (namedElementSymbol == null) {

            namedElementSymbol = await this.parent?.resolve(reference, global);

        } else if (reference instanceof ModelicaTypeSpecifierSyntax && reference.subscripts != null && reference.subscripts.length > 0) {

            if (namedElementSymbol instanceof ModelicaClassSymbol) {

                let shape = [];

                for (let subscript of reference.subscripts) {

                    let value = await subscript.expression?.evaluate(this);

                    if (value instanceof ModelicaNumberObjectSymbol)
                        shape.push(value.value);

                    else
                        shape.push(undefined);

                }

                return new ModelicaArrayClassSymbol(namedElementSymbol.parent, undefined, undefined, namedElementSymbol, shape);

            }

            return null;

        }

        return namedElementSymbol;

    }

    async resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null> {

        if (reference == null)
            return null;

        if (!(reference instanceof ModelicaComponentReferenceExpressionSyntax))
            return null;

        let components = toArray(reference.components);

        if (components.length == 0)
            return null;

        let symbol: ModelicaNamedElementSymbol | null = await this.resolve(components[0].identifier, components[0].global);

        for (let component of components.slice(1)) {

            if (symbol instanceof ModelicaClassSymbol)
                symbol = await symbol.getNamedElement(component.identifier);

            else if (symbol instanceof ModelicaComponentSymbol)
                symbol = await (await symbol.classSymbol)?.getNamedElement(component.identifier) ?? null;

            else
                symbol = null;

            if (symbol == null)
                break;

        }

        if (symbol instanceof ModelicaClassSymbol && (symbol.classRestriction == ModelicaClassRestriction.FUNCTION || symbol.classRestriction == ModelicaClassRestriction.RECORD))
            return symbol;

        return null;

    }

    override get syntax(): ModelicaClassDefinitionSyntax | undefined {
        return this.#syntax;
    }

    override toString(): string | undefined {
        return this.identifier?.toString();
    }

}

export abstract class ModelicaBuiltinClassSymbol extends ModelicaClassSymbol {

    #identifier?: ModelicaIdentifierSyntax;

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string) {

        super(parent, modificationEnvironment);

        if (identifier != null)
            this.#identifier = new ModelicaIdentifierSyntax(null, identifier);

    }

    abstract override get classRestriction(): ModelicaClassRestriction | undefined;

    override get identifier(): ModelicaIdentifierSyntax | undefined {
        return this.#identifier;
    }

    override get name(): string | undefined {

        if (this.identifier == null || this.identifier.value == null)
            return undefined;

        return this.identifier.value;

    }

    abstract override instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaClassSymbol>;

}

export class ModelicaArrayClassSymbol extends ModelicaBuiltinClassSymbol {

    #dtype?: ModelicaClassSymbol;
    #shape?: (number | undefined)[];

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string, dtype?: ModelicaClassSymbol, shape?: (number | undefined)[]) {
        super(parent, modificationEnvironment, (identifier ?? "Array<" + (dtype?.name ?? "object") + ">") + "[" + (shape?.join(",") ?? ":") + "]");
        this.#dtype = dtype;
        this.#shape = shape;
    }

    override get classRestriction(): ModelicaClassRestriction {
        return ModelicaClassRestriction.TYPE;
    }

    get dtype(): ModelicaClassSymbol | undefined {
        return this.#dtype;
    }

    set dtype(dtype: ModelicaClassSymbol | undefined) {
        this.#dtype = dtype;
    }

    override async construct(): Promise<ModelicaArrayObjectSymbol | undefined> {

        let object = new ModelicaArrayObjectSymbol(this);

        for await (let component of this.components) {

            let key = component.identifier?.toString();
            let value = await component.value;

            if (value == null)
                value = await (await component.classSymbol)?.construct();

            if (key != null)
                object.properties.set(key, value ?? null);

        }

        return object;

    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaArrayClassSymbol> {
        return new ModelicaArrayClassSymbol(parent, modificationEnvironment);
    }

    get shape(): (number | undefined)[] | undefined {
        return this.#shape;
    }

    set shape(shape: (number | undefined)[] | undefined) {
        this.#shape = shape;
    }

}

export class ModelicaBooleanClassSymbol extends ModelicaBuiltinClassSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string) {
        super(parent, modificationEnvironment, identifier ?? "Boolean");
    }

    override get classRestriction(): ModelicaClassRestriction {
        return ModelicaClassRestriction.TYPE;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaBooleanClassSymbol> {
        return new ModelicaBooleanClassSymbol(parent, modificationEnvironment);
    }

}

export abstract class ModelicaNumberClassSymbol extends ModelicaBuiltinClassSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string) {
        super(parent, modificationEnvironment, identifier);
    }

    override get classRestriction(): ModelicaClassRestriction {
        return ModelicaClassRestriction.TYPE;
    }

    abstract override instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaNumberClassSymbol>;

}

export class ModelicaIntegerClassSymbol extends ModelicaNumberClassSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string) {
        super(parent, modificationEnvironment, identifier ?? "Integer");
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaIntegerClassSymbol> {
        return new ModelicaIntegerClassSymbol(parent, modificationEnvironment);
    }

}

export class ModelicaRealClassSymbol extends ModelicaNumberClassSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifier?: string) {
        super(parent, modificationEnvironment, identifier ?? "Real");
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaRealClassSymbol> {
        return new ModelicaRealClassSymbol(parent, modificationEnvironment);
    }

}

export class ModelicaStringClassSymbol extends ModelicaBuiltinClassSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, identifer?: string) {
        super(parent, modificationEnvironment, identifer ?? "String");
    }

    override get classRestriction(): ModelicaClassRestriction {
        return ModelicaClassRestriction.TYPE;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaStringClassSymbol> {
        return new ModelicaStringClassSymbol(parent, modificationEnvironment);
    }

}

export class ModelicaAnnotationClassSymbol extends ModelicaClassSymbol {

    #elements?: ModelicaElementSymbol[];

    constructor(parent: ModelicaScope, elements?: ModelicaElementSymbol[]) {
        super(parent);
        this.#elements = elements;
    }

    override get classRestriction(): undefined {
        return undefined;
    }

    override get elements(): AsyncIterableIterator<ModelicaElementSymbol> {

        let node = this;

        return async function* () {

            if (node.#elements != null)
                yield* node.#elements;

        }();

    }

    async evaluate(): Promise<ModelicaArrayObjectSymbol | undefined> {

        let values = [];

        for await (let annotation of this.classes) {

            let value = await annotation.construct();

            if (value != null)
                values.push(value);

        }

        return new ModelicaArrayObjectSymbol(new ModelicaArrayClassSymbol(this), values);

    }

    override get identifier(): undefined {
        return undefined;
    }

    override async instantiate(parent: ModelicaScope): Promise<ModelicaAnnotationClassSymbol> {

        let elements: ModelicaElementSymbol[] = [];

        for await (let element of this.elements)
            elements.push(element);

        return new ModelicaAnnotationClassSymbol(parent, elements);

    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        for await (let element of this.elements) {
            await element.print(printWriter, indent);
        }

    }

}

export class ModelicaComponentSymbol extends ModelicaNamedElementSymbol {

    #annotation?: ModelicaAnnotationClassSymbol;
    #classSymbol?: ModelicaClassSymbol;
    #instantiated?: boolean;
    #instantiating?: boolean;
    #syntax?: ModelicaComponentDeclarationSyntax;
    #value?: ModelicaObjectSymbol;

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, syntax?: ModelicaComponentDeclarationSyntax, classSymbol?: ModelicaClassSymbol, value?: ModelicaObjectSymbol) {
        super(parent, modificationEnvironment);
        this.#syntax = syntax;
        this.#classSymbol = classSymbol;
        this.#value = value;
    }

    override accept(visitor: ModelicaSymbolVisitor, ...args: any[]): any {
        return visitor.visitComponent(this, ...args);
    }

    override get annotation(): Promise<ModelicaAnnotationClassSymbol | undefined> {

        let node = this;

        return async function () {

            if (node.#annotation == null)
                node.#annotation = await node.syntax?.annotationClause?.instantiate(node.parent);

            return node.#annotation;

        }();

    }

    get classSymbol(): Promise<ModelicaClassSymbol | undefined> {

        let node = this;

        return async function () {

            await node.instantiate();
            return node.#classSymbol;

        }();

    }

    override get diagram(): Promise<string | undefined> {

        let node = this;

        return async function () {
            return await (await node.classSymbol)?.diagram;
        }();

    }

    override get simpleIcon(): Promise<string | undefined> {

        let node = this;

        return async function () {
            return await (await node.classSymbol)?.simpleIcon;
        }();

    }

    override get icon(): Promise<string | undefined> {

        let node = this;

        return async function () {
            return await (await node.classSymbol)?.icon;
        }();

    }

    async instantiate(): Promise<void> {

        if (this.#instantiated == true)
            return;

        if (this.#instantiating == true) {
            this.#instantiated = true;
            return;
            //throw new Error("Inconsistency detected");
        }

        //console.log("START INSTANTIATE COMPONENT", this.name)

        this.#instantiating = true;

        let elementModification = this.modificationEnvironment.getElementModification(this.identifier?.value);

        if (this.#value == null) {

            if (elementModification?.modification?.expression != null)
                this.#value = await elementModification?.modification?.expression?.evaluate(this.parent);

            else
                this.#value = await this.syntax?.modification?.expression?.evaluate(this.parent);

        }

        if (this.#classSymbol == null) {

            let classSymbol = await this.parent?.resolve(this.syntax?.typeSpecifier);

            if (classSymbol != null && classSymbol instanceof ModelicaClassSymbol) {
                let modificationEnvironment = new ModelicaModificationEnvironment(...(elementModification?.modification?.classModification?.arguments ?? []));
                this.#classSymbol = await classSymbol.instantiate(classSymbol.parent, modificationEnvironment.merge(this.syntax?.modification?.classModification));
            }

            if (this.#classSymbol != null && this.#value == null && this.syntax?.modification?.expression == null)
                this.#value = await this.#classSymbol.construct();

        }

        //console.log("END INSTANTIATE COMPONENT", this.name)

        this.#instantiated = true;
        this.#instantiating = undefined;

    }

    override async print(printWriter: PrintWriter, indent?: number): Promise<void> {

        printWriter.print("", indent);

        let classSymbol = await this.classSymbol;

        let classSymbolIdentifier = classSymbol?.identifier?.toString();

        if (classSymbolIdentifier != null)
            printWriter.print(classSymbolIdentifier);

        printWriter.print(" ");

        let identifier = this.identifier?.toString();

        if (identifier != null)
            printWriter.print(identifier);

        if (this.syntax?.modification != null && classSymbol != null) {
            //console.log(this.syntax.modification.expression?.evaluate(classSymbol));
        }

        printWriter.println("");

        //printWriter.println(" {");
        //await classSymbol?.print(printWriter, (indent ?? 0) + 1);

        let annotation = await (await this.annotation)?.evaluate();

        if (annotation != null) {

            printWriter.println("component-annotation(", (indent ?? 0) + 1);

            for (let element of annotation.value) {

                printWriter.print(element.type.name + ": ", (indent ?? 0) + 2);
                await element.print(printWriter, (indent ?? 0) + 2);
            }

            printWriter.println(")", (indent ?? 0) + 1);

        }

        annotation = await (await (await this.classSymbol)?.annotation)?.evaluate();

        if (annotation != null) {

            printWriter.println("class-annotation(", (indent ?? 0) + 1);

            for (let element of annotation.value) {

                printWriter.print(element.type.name + ": ", (indent ?? 0) + 2);
                await element.print(printWriter, (indent ?? 0) + 2);
            }

            printWriter.println(")", (indent ?? 0) + 1);

        }

    }

    override get syntax(): ModelicaComponentDeclarationSyntax | undefined {
        return this.#syntax;
    }

    get value(): Promise<ModelicaObjectSymbol | undefined> {

        let node = this;

        return async function () {
            await node.instantiate();
            return node.#value;
        }();

    }

}

export class ModelicaEnumerationLiteralComponentSymbol extends ModelicaComponentSymbol {

    constructor(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, syntax?: ModelicaEnumerationLiteralSyntax, classSymbol?: ModelicaClassSymbol, value?: number) {
        super(parent, modificationEnvironment, syntax, classSymbol, value != null ? new ModelicaEnumerationObjectSymbol(new ModelicaIntegerClassSymbol(parent.context, undefined, syntax?.identifier?.value), value) : undefined);
    }

    accept(visitor: ModelicaSymbolVisitor, ...args: any[]): Promise<any> {
        return visitor.visitEnumerationLiteralComponent(this, ...args);
    }

    override toString(): string | undefined {
        return this.identifier?.value;
    }

}

export abstract class ModelicaSymbolVisitor {

    visitAlgorithmSection(node: ModelicaAlgorithmSectionSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitClass(node: ModelicaClassSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitComponent(node: ModelicaComponentSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEnumerationLiteralComponent(node: ModelicaEnumerationLiteralComponentSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEquationSection(node: ModelicaEquationSectionSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitExtends(node: ModelicaExtendsSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitImport(node: ModelicaImportSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitObject(node: ModelicaObjectSymbol, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

}

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

import { ModelicaLibrary } from "./library";
import { childForFieldName, childrenForFieldName, SyntaxNode } from "./parser";
import { ModelicaScope } from "./scope";
import { ModelicaElementSymbol, ModelicaClassSymbol, ModelicaExtendsSymbol, ModelicaImportSymbol, ModelicaComponentSymbol, ModelicaAnnotationClassSymbol, ModelicaEquationSectionSymbol, ModelicaAlgorithmSectionSymbol, ModelicaObjectSymbol, ModelicaIntegerObjectSymbol, ModelicaRealObjectSymbol, ModelicaStringObjectSymbol, ModelicaBooleanObjectSymbol, ModelicaNumberObjectSymbol, ModelicaArrayObjectSymbol, ModelicaArrayClassSymbol, ModelicaBooleanClassSymbol, ModelicaStringClassSymbol, ModelicaIntegerClassSymbol, ModelicaRealClassSymbol, ModelicaEnumerationLiteralComponentSymbol, ModelicaNamedElementSymbol } from "./symbols";

// DONE
export abstract class ModelicaSyntaxNode {

    #parsed: boolean = false;
    #source?: SyntaxNode | null;

    constructor(source?: SyntaxNode | null) {
        this.#source = source;
    }

    abstract accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any;

    get children(): IterableIterator<ModelicaSyntaxNode> {
        this.parse();
        return function* () { }();
    }

    static new(source?: SyntaxNode | null): ModelicaSyntaxNode[] | ModelicaSyntaxNode | undefined {

        switch (source?.type) {

            case "algorithm_section":
                return ModelicaAlgorithmSectionSyntax.new(source);

            case "annotation_clause":
                return ModelicaAnnotationClauseSyntax.new(source);

            case "array_comprehension":
                return ModelicaArrayComprehensionExpressionSyntax.new(source);

            case "array_concatenation":
                return ModelicaArrayConcatenationExpressionSyntax.new(source);

            case "array_constructor":
                return ModelicaArrayConstructorExpressionSyntax.new(source);

            case "assignment_statement":
                return ModelicaAssignmentStatementSyntax.new(source);

            case "binary_expression":
                return ModelicaBinaryExpressionSyntax.new(source);

            case "break_statement":
                return ModelicaBreakStatementSyntax.new(source);

            case "class_definition":
                return ModelicaClassDefinitionSyntax.new(source);

            case "class_modification":
                return ModelicaClassModificationSyntax.new(source);

            case "class_redeclaration":
                return ModelicaClassRedeclarationSyntax.new(source);

            case "component_redeclaration":
                return ModelicaComponentRedeclarationSyntax.new(source);

            case "component_reference":
                return ModelicaComponentReferenceExpressionSyntax.new(source);

            case "connect_clause":
                return ModelicaConnectClauseSyntax.new(source);

            case "constraining_clause":
                return ModelicaConstrainingClauseSyntax.new(source);

            case "derivative_class_specifier":
                return ModelicaDerivativeClassSpecifierSyntax.new(source);

            case "description_string":
                return ModelicaDescriptionStringSyntax.new(source);

            case "element_modification":
                return ModelicaElementModificationSyntax.new(source);

            case "else_if_equation_clause":
                return ModelicaElseIfEquationClauseSyntax.new(source);

            case "else_if_expression_clause":
                return ModelicaElseIfExpressionClauseSyntax.new(source);

            case "else_if_statement_clause":
                return ModelicaElseIfStatementClauseSyntax.new(source);

            case "else_when_equation_clause":
                return ModelicaElseWhenEquationClauseSyntax.new(source);

            case "else_when_statement_clause":
                return ModelicaElseWhenStatementClauseSyntax.new(source);

            case "end_expression":
                return ModelicaEndExpressionSyntax.new(source);

            case "enumeration_class_specifier":
                return ModelicaEnumerationClassSpecifierSyntax.new(source);

            case "enumeration_literal":
                return ModelicaEnumerationLiteralSyntax.new(source);

            case "equation_section":
                return ModelicaEquationSectionSyntax.new(source);

            case "extends_class_specifier":
                return ModelicaExtendsClassSpecifierSyntax.new(source);

            case "extends_clause":
                return ModelicaExtendsClauseSyntax.new(source);

            case "external_clause":
                return ModelicaExternalClauseSyntax.new(source);

            case "external_function":
                return ModelicaExternalFunctionSyntax.new(source);

            case "for_equation":
                return ModelicaForEquationSyntax.new(source);

            case "for_index":
                return ModelicaForIndexSyntax.new(source);

            case "for_statement":
                return ModelicaForStatementSyntax.new(source);

            case "function_application":
                return ModelicaFunctionApplicationExpressionSyntax.new(source);

            case "function_application_equation":
                return ModelicaFunctionApplicationEquationSyntax.new(source);

            case "function_application_statement":
                return ModelicaFunctionApplicationStatementSyntax.new(source);

            case "function_partial_application":
                return ModelicaFunctionPartialApplicationExpressionSyntax.new(source);

            case "IDENT":
                return ModelicaIdentifierSyntax.new(source);

            case "if_equation":
                return ModelicaIfEquationSyntax.new(source);

            case "if_expression":
                return ModelicaIfExpressionSyntax.new(source);

            case "if_statement":
                return ModelicaIfStatementSyntax.new(source);

            case "import_clause":
                return ModelicaImportClauseSyntax.new(source);

            case "language_specification":
                return ModelicaLanguageSpecificationSyntax.new(source);

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "long_class_specifier":
                return ModelicaLongClassSpecifierSyntax.new(source);

            case "modification":
                return ModelicaModificationSyntax.new(source);

            case "multiple_output_function_application_statement":
                return ModelicaMultipleOutputFunctionApplicationStatementSyntax.new(source);

            case "name":
                return ModelicaNameSyntax.new(source);

            case "named_argument":
                return ModelicaNamedArgumentSyntax.new(source);

            case "named_element":
                return ModelicaNamedElementSyntax.new(source);

            case "parenthesized_expression":
                return ModelicaParenthesizedExpressionSyntax.new(source);

            case "range_expression":
                return ModelicaRangeExpressionSyntax.new(source);

            case "return_statement":
                return ModelicaReturnStatementSyntax.new(source);

            case "short_class_definition":
                return ModelicaShortClassDefinitionSyntax.new(source);

            case "short_class_specifier":
                return ModelicaShortClassSpecifierSyntax.new(source);

            case "simple_equation":
                return ModelicaSimpleEquationSyntax.new(source);

            case "stored_definitions":
                return ModelicaStoredDefinitionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "subscript":
                return ModelicaSubscriptSyntax.new(source);

            case "type_specifier":
                return ModelicaTypeSpecifierSyntax.new(source);

            case "unary_expression":
                return ModelicaUnaryExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            case "when_equation":
                return ModelicaWhenEquationSyntax.new(source);

            case "when_statement":
                return ModelicaWhenStatementSyntax.new(source);

            case "while_statement":
                return ModelicaWhileStatementSyntax.new(source);

            default:
                return undefined;

        }

    }

    abstract parse(): void;

    protected get parsed(): boolean {
        return this.#parsed;
    }

    protected set parsed(parsed: boolean) {
        this.#parsed = parsed;
    }

    get source(): SyntaxNode | null | undefined {
        return this.#source;
    }

}

// DONE
export class ModelicaAnnotationClauseSyntax extends ModelicaSyntaxNode {

    #classModification?: ModelicaClassModificationSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAnnotationClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classModification != null)
                yield node.classModification;

        }();

    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    async instantiate(parent: ModelicaScope): Promise<ModelicaAnnotationClassSymbol> {

        let elements: ModelicaClassSymbol[] = [];

        for (let argument of this.classModification?.arguments ?? []) {

            if (argument instanceof ModelicaElementModificationSyntax) {

                let name = argument.name?.toString();

                if (name == null)
                    continue;

                if (argument.modification?.classModification != null) {

                    let classSymbol = await parent.resolve(name, true);

                    if (classSymbol instanceof ModelicaClassSymbol)
                        elements.push(await classSymbol.instantiate(parent.context, new ModelicaModificationEnvironment(...(argument.modification.classModification.arguments ?? []))));

                } else {

                    let classSymbol = await argument.modification?.expression?.evaluate(parent);

                    //console.log("ERROR VALUE MOD");

                }

            }

        }

        return new ModelicaAnnotationClassSymbol(parent, elements);

    }

    static override new(source?: SyntaxNode | null): ModelicaAnnotationClauseSyntax | undefined {

        if (source == null || source.type != "annotation_clause")
            return undefined;

        return new ModelicaAnnotationClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "annotation_clause")
            throw new Error(`Expected annotation_clause, got ${this.source?.type}`);

        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaArgumentSyntax extends ModelicaSyntaxNode {

    #each?: SyntaxNode;
    #final?: SyntaxNode;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    get each(): SyntaxNode | undefined {
        this.parse();
        return this.#each;
    }

    get final(): SyntaxNode | undefined {
        this.parse();
        return this.#final;
    }

    abstract get identifier(): string | undefined;

    static override new(source?: SyntaxNode | null): ModelicaArgumentSyntax | undefined {

        switch (source?.type) {

            case "class_redeclaration":
                return ModelicaClassRedeclarationSyntax.new(source);

            case "component_redeclaration":
                return ModelicaComponentRedeclarationSyntax.new(source);

            case "element_modification":
                return ModelicaElementModificationSyntax.new(source);

        }

    }

    override parse(): void {
        this.#each = childForFieldName(this.source, "each");
        this.#final = childForFieldName(this.source, "final");
    }

}

// DONE
export class ModelicaElementModificationSyntax extends ModelicaArgumentSyntax {

    #descriptionString?: ModelicaDescriptionStringSyntax;
    #modification?: ModelicaModificationSyntax;
    #name?: ModelicaNameSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElementModification(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.descriptionString != null)
                yield node.descriptionString;

            if (node.modification != null)
                yield node.modification;

            if (node.name != null)
                yield node.name;

        }();

    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    override get identifier(): string | undefined {
        return this.name?.identifiers?.[0];
    }

    get modification(): ModelicaModificationSyntax | undefined {
        this.parse();
        return this.#modification;
    }

    get name(): ModelicaNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(source?: SyntaxNode | null, each?: SyntaxNode, final?: SyntaxNode): ModelicaElementModificationSyntax | undefined {

        if (source == null || source.type != "element_modification")
            return undefined;

        return new ModelicaElementModificationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "element_modification")
            throw new Error(`Expected element_modification, got ${this.source?.type}`);

        super.parse();

        this.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(this.source, "descriptionString"));
        this.#modification = ModelicaModificationSyntax.new(childForFieldName(this.source, "modification"));
        this.#name = ModelicaNameSyntax.new(childForFieldName(this.source, "name"));

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaElementRedeclarationSyntax extends ModelicaArgumentSyntax {

    #constrainingClause?: ModelicaConstrainingClauseSyntax;
    #redeclare?: SyntaxNode;
    #replaceable?: SyntaxNode;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.constrainingClause != null)
                yield node.constrainingClause;

        }();

    }

    get constrainingClause(): ModelicaConstrainingClauseSyntax | undefined {
        this.parse();
        return this.#constrainingClause;
    }

    static override new(source?: SyntaxNode | null): ModelicaArgumentSyntax | undefined {

        switch (source?.type) {

            case "class_redeclaration":
                return ModelicaClassRedeclarationSyntax.new(source);

            case "component_redeclaration":
                return ModelicaComponentRedeclarationSyntax.new(source);

        }

    }

    override parse(): void {
        this.#constrainingClause = ModelicaConstrainingClauseSyntax.new(childForFieldName(this.source, "constrainingClause"));
        this.#redeclare = childForFieldName(this.source, "redeclare");
        this.#replaceable = childForFieldName(this.source, "replaceable");
    }

    get redeclare(): SyntaxNode | undefined {
        this.parse();
        return this.#redeclare;
    }

    get replaceable(): SyntaxNode | undefined {
        this.parse();
        return this.#replaceable;
    }

}

// DONE
export class ModelicaClassRedeclarationSyntax extends ModelicaElementRedeclarationSyntax {

    #classDefinition?: ModelicaClassDefinitionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitClassRedeclaration(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classDefinition != null)
                yield node.classDefinition;

        }();

    }

    get classDefinition(): ModelicaClassDefinitionSyntax | undefined {
        this.parse();
        return this.#classDefinition;
    }

    override get identifier(): string | undefined {
        return this.classDefinition?.identifier?.value;
    }

    static override new(source?: SyntaxNode | null, each?: SyntaxNode, final?: SyntaxNode): ModelicaClassRedeclarationSyntax | undefined {

        if (source == null || source.type != "class_redeclaration")
            return undefined;

        return new ModelicaClassRedeclarationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "class_redeclaration")
            throw new Error(`Expected class_redeclaration, got ${this.source?.type}`);

        super.parse();

        this.#classDefinition = ModelicaClassDefinitionSyntax.new(childForFieldName(this.source, "classDefinition"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaComponentRedeclarationSyntax extends ModelicaElementRedeclarationSyntax {

    #componentDeclaration?: ModelicaComponentDeclarationSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitComponentRedeclaration(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.componentDeclaration != null)
                yield node.componentDeclaration;

        }();

    }

    get componentDeclaration(): ModelicaComponentDeclarationSyntax | undefined {
        this.parse();
        return this.#componentDeclaration;
    }

    override get identifier(): string | undefined {
        return this.componentDeclaration?.identifier?.value;
    }

    static override new(source?: SyntaxNode | null, each?: SyntaxNode, final?: SyntaxNode): ModelicaComponentRedeclarationSyntax | undefined {

        if (source == null || source.type != "component_redeclaration")
            return undefined;

        return new ModelicaComponentRedeclarationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "component_redeclaration")
            throw new Error(`Expected component_redeclaration, got ${this.source?.type}`);

        super.parse();

        let componentDeclarations = ModelicaComponentDeclarationSyntax.new(childForFieldName(this.source, "componentClause"));

        if (Array.isArray(componentDeclarations) && componentDeclarations.length > 0)
            this.#componentDeclaration = componentDeclarations[0];

        else if (componentDeclarations instanceof ModelicaComponentDeclarationSyntax)
            this.#componentDeclaration = componentDeclarations;

        this.parsed = true;

    }

}

// DONE
export class ModelicaClassModificationSyntax extends ModelicaSyntaxNode {

    #arguments?: ModelicaArgumentSyntax[];

    constructor(source?: SyntaxNode | null, args?: ModelicaArgumentSyntax[]) {
        super(source);
        this.#arguments = args;
        this.parsed = this.#arguments != null;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitClassModification(this, ...args);
    }

    get arguments(): ModelicaArgumentSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

        }();

    }

    static override new(source?: SyntaxNode | null): ModelicaClassModificationSyntax | undefined {

        if (source == null || source.type != "class_modification")
            return undefined;

        return new ModelicaClassModificationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "class_modification")
            throw new Error(`Expected class_modification, got ${this.source?.type}`);

        this.#arguments = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "arguments"), "argument") ?? []) {

            let argument = ModelicaArgumentSyntax.new(child);

            if (argument != null)
                this.#arguments.push(argument);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaModificationEnvironment extends ModelicaClassModificationSyntax {

    constructor(...args: ModelicaArgumentSyntax[]) {
        super(null, args);
    }

    getElementModification(identifier?: string): ModelicaElementModificationSyntax | undefined {

        if (identifier == null)
            return undefined;

        for (let argument of this.arguments ?? []) {

            if (argument instanceof ModelicaElementModificationSyntax && argument.identifier == identifier)
                return argument;

        }

        return undefined;

    }

    getModificationEnvironment(identifier?: string): ModelicaModificationEnvironment {

        if (identifier == null)
            return new ModelicaModificationEnvironment();

        let args = [];

        for (let argument of this.arguments ?? []) {

            if (argument.identifier == identifier)
                args.push(argument);

        }

        return new ModelicaModificationEnvironment(...args);

    }

    merge(classModification?: ModelicaClassModificationSyntax): ModelicaModificationEnvironment {

        if (classModification == null)
            return new ModelicaModificationEnvironment(...this.arguments ?? []);

        return new ModelicaModificationEnvironment(...[...this.arguments ?? [], ...classModification.arguments ?? []]);

    }

}

// DONE
export abstract class ModelicaClassSpecifierSyntax extends ModelicaSyntaxNode {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #descriptionString?: ModelicaDescriptionStringSyntax;
    #identifier?: ModelicaIdentifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.descriptionString != null)
                yield node.descriptionString;

            if (node.identifier != null)
                yield node.identifier;

        }();

    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    abstract get elements(): ModelicaElementSyntax[] | undefined;

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    static override new(source?: SyntaxNode | null): ModelicaClassSpecifierSyntax | undefined {

        switch (source?.type) {

            case "derivative_class_specifier":
                return ModelicaDerivativeClassSpecifierSyntax.new(source);

            case "enumeration_class_specifier":
                return ModelicaEnumerationClassSpecifierSyntax.new(source);

            case "extends_class_specifier":
                return ModelicaExtendsClassSpecifierSyntax.new(source);

            case "long_class_specifier":
                return ModelicaLongClassSpecifierSyntax.new(source);

            case "short_class_specifier":
                return ModelicaShortClassSpecifierSyntax.new(source);

        }

    }

    override parse(): void {
        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(this.source, "descriptionString"));
        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));
    }

}

// DONE
export class ModelicaDerivativeClassSpecifierSyntax extends ModelicaClassSpecifierSyntax {

    #arguments?: ModelicaIdentifierSyntax[];
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDerivativeClassSpecifier(this, ...args);
    }

    get arguments(): ModelicaIdentifierSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    override get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return undefined;
    }

    static override new(source?: SyntaxNode | null): ModelicaDerivativeClassSpecifierSyntax | undefined {

        if (source == null || source.type != "derivative_class_specifier")
            return undefined;

        return new ModelicaDerivativeClassSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "derivative_class_specifier")
            throw new Error(`Expected derivative_class_specifier, got ${this.source?.type}`);

        super.parse();

        this.#arguments = [];

        for (let child of childrenForFieldName(this.source, "argument")) {

            let argument = ModelicaIdentifierSyntax.new(child);

            if (argument != null)
                this.#arguments.push(argument);

        }

        this.#typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(this.source, "typeSpecifier"));

        this.parsed = true;

    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaEnumerationClassSpecifierSyntax extends ModelicaClassSpecifierSyntax {

    #enumerationLiterals?: ModelicaEnumerationLiteralSyntax[];
    #unspecified?: boolean;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEnumerationClassSpecifier(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.enumerationLiterals != null)
                yield* node.enumerationLiterals;

        }();

    }

    override get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return this.#enumerationLiterals;
    }

    get enumerationLiterals(): ModelicaEnumerationLiteralSyntax[] | undefined {
        this.parse();
        return this.#enumerationLiterals;
    }

    static override new(source?: SyntaxNode | null): ModelicaEnumerationClassSpecifierSyntax | undefined {

        if (source == null || source.type != "enumeration_class_specifier")
            return undefined;

        return new ModelicaEnumerationClassSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "enumeration_class_specifier")
            throw new Error(`Expected enumeration_class_specifier, got ${this.source?.type}`);

        super.parse();

        this.#enumerationLiterals = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "enumerationLiterals"), "enumerationLiteral")) {

            let enumerationLiteral = ModelicaEnumerationLiteralSyntax.new(child);

            if (enumerationLiteral != null)
                this.#enumerationLiterals.push(enumerationLiteral);

        }

        this.#unspecified = childForFieldName(this.source, "unspecified") != null;

        this.parsed = true;

    }

    get unspecified(): boolean | undefined {
        this.parse();
        return this.#unspecified;
    }

}

// DONE
export class ModelicaExtendsClassSpecifierSyntax extends ModelicaClassSpecifierSyntax {

    #classModification?: ModelicaClassModificationSyntax;
    #elements?: ModelicaElementSyntax[];
    #endIdentifier?: ModelicaIdentifierSyntax;
    #externalClause?: ModelicaExternalClauseSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitExtendsClassSpecifier(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classModification != null)
                yield node.classModification;

            if (node.elements != null)
                yield* node.elements;

            if (node.endIdentifier != null)
                yield node.endIdentifier;

            if (node.externalClause != null)
                yield node.externalClause;

        }();

    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return this.#elements;
    }

    get endIdentifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#endIdentifier;
    }

    get externalClause(): ModelicaExternalClauseSyntax | undefined {
        this.parse();
        return this.#externalClause;
    }

    static override new(source?: SyntaxNode | null): ModelicaExtendsClassSpecifierSyntax | undefined {

        if (source == null || source.type != "extends_class_specifier")
            return undefined;

        return new ModelicaExtendsClassSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "extends_class_specifier")
            throw new Error(`Expected extends_class_specifier, got ${this.source?.type}`);

        super.parse();

        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));
        this.#endIdentifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "endIdentifier"));

        this.#elements = [];

        for (let child of this.source.children) {

            switch (child.type) {

                case "algorithm_section": {

                    let algorithmSection = ModelicaAlgorithmSectionSyntax.new(child);

                    if (algorithmSection != null)
                        this.#elements.push(algorithmSection);

                    break;

                }

                case "equation_section": {

                    let equationSection = ModelicaEquationSectionSyntax.new(child);

                    if (equationSection != null)
                        this.#elements.push(equationSection);

                    break;

                }

                case "element_list":

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element);

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                case "protected_element_list":

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element, {
                            visibility: ModelicaVisibility.PROTECTED
                        });

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                case "public_element_list":

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element, {
                            visibility: ModelicaVisibility.PUBLIC
                        });

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                case "algorithm_section": {

                    let section = ModelicaAlgorithmSectionSyntax.new(child);

                    if (section == null)
                        continue;

                    this.#elements.push(section);

                    break;

                }

                case "equation_section": {

                    let section = ModelicaEquationSectionSyntax.new(child);

                    if (section == null)
                        continue;

                    this.#elements.push(section);

                    break;

                }

            }

        }

        this.#externalClause = ModelicaExternalClauseSyntax.new(childForFieldName(this.source, "externalClause"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaLongClassSpecifierSyntax extends ModelicaClassSpecifierSyntax {

    #elements?: ModelicaElementSyntax[];
    #endIdentifier?: ModelicaIdentifierSyntax;
    #externalClause?: ModelicaExternalClauseSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitLongClassSpecifier(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.elements != null)
                yield* node.elements;

            if (node.endIdentifier != null)
                yield node.endIdentifier;

            if (node.externalClause != null)
                yield node.externalClause;

        }();

    }

    get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return this.#elements;
    }

    get endIdentifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#endIdentifier;
    }

    get externalClause(): ModelicaExternalClauseSyntax | undefined {
        this.parse();
        return this.#externalClause;
    }

    static override new(source?: SyntaxNode | null): ModelicaLongClassSpecifierSyntax | undefined {

        if (source == null || source.type != "long_class_specifier")
            return undefined;

        return new ModelicaLongClassSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "long_class_specifier")
            throw new Error(`Expected long_class_specifier, got ${this.source?.type}`);

        super.parse();

        this.#endIdentifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "endIdentifier"));

        this.#elements = [];

        for (let child of this.source.children) {

            switch (child.type) {

                case "algorithm_section": {

                    let algorithmSection = ModelicaAlgorithmSectionSyntax.new(child);

                    if (algorithmSection != null)
                        this.#elements.push(algorithmSection);

                    break;

                }

                case "equation_section": {

                    let equationSection = ModelicaEquationSectionSyntax.new(child);

                    if (equationSection != null)
                        this.#elements.push(equationSection);

                    break;

                }

                case "element_list": {

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element);

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                }

                case "protected_element_list": {

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element, {
                            visibility: ModelicaVisibility.PROTECTED
                        });

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                }

                case "public_element_list": {

                    for (let element of childrenForFieldName(child, "element")) {

                        let elements = ModelicaElementSyntax.new(element, {
                            visibility: ModelicaVisibility.PUBLIC
                        });

                        if (elements == null)
                            continue;

                        if (elements instanceof ModelicaElementSyntax)
                            elements = [elements];

                        this.#elements.push(...elements);

                    }

                    break;

                }

            }

        }

        this.#externalClause = ModelicaExternalClauseSyntax.new(childForFieldName(this.source, "externalClause"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaShortClassSpecifierSyntax extends ModelicaClassSpecifierSyntax {

    #basePrefix?: ModelicaBasePrefix;
    #classModification?: ModelicaClassModificationSyntax;
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitShortClassSpecifier(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classModification != null)
                yield node.classModification;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    get basePrefix(): ModelicaBasePrefix | undefined {
        this.parse();
        return this.#basePrefix;
    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return undefined;
    }

    static override new(source?: SyntaxNode | null): ModelicaShortClassSpecifierSyntax | undefined {

        if (source == null || source.type != "short_class_specifier")
            return undefined;

        return new ModelicaShortClassSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "short_class_specifier")
            throw new Error(`Expected short_class_specifier, got ${this.source?.type}`);

        super.parse();

        switch (childForFieldName(this.source, "basePrefix")?.text) {

            case "input":
                this.#basePrefix = ModelicaBasePrefix.INPUT;
                break;

            case "output":
                this.#basePrefix = ModelicaBasePrefix.OUTPUT;
                break;

        }

        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));

        let subscripts: ModelicaSubscriptSyntax[] = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "subscripts"), "subscript")) {

            let subscript = ModelicaSubscriptSyntax.new(child);

            if (subscript != null)
                subscripts.push(subscript);

        }

        this.#typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(this.source, "typeSpecifier"));

        if (this.#typeSpecifier != null && subscripts.length > 0)
            this.#typeSpecifier = this.#typeSpecifier?.array(subscripts);

        this.parsed = true;

    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaConstrainingClauseSyntax extends ModelicaSyntaxNode {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #descriptionString?: ModelicaDescriptionStringSyntax;
    #classModification?: ModelicaClassModificationSyntax;
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        annotationClause: ModelicaAnnotationClauseSyntax,
        descriptionString: ModelicaDescriptionStringSyntax
    }>) {
        super(source);
        this.#annotationClause = properties?.annotationClause;
        this.#descriptionString = properties?.descriptionString;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConstrainingClause(this, ...args);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.descriptionString != null)
                yield node.descriptionString;

            if (node.classModification != null)
                yield node.classModification;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        annotationClause: ModelicaAnnotationClauseSyntax,
        descriptionString: ModelicaDescriptionStringSyntax
    }>): ModelicaConstrainingClauseSyntax | undefined {

        if (source == null || source.type != "constraining_clause")
            return undefined;

        return new ModelicaConstrainingClauseSyntax(source, properties);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "constraining_clause")
            throw new Error(`Expected constraining_clause, got ${this.source?.type}`);

        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));
        this.#typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(this.source, "typeSpecifier"));

        this.parsed = true;

    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaDescriptionStringSyntax extends ModelicaSyntaxNode {

    #value?: string;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionString(this, ...args);
    }

    static override new(source?: SyntaxNode | null): ModelicaDescriptionStringSyntax | undefined {

        if (source == null || source.type != "description_string")
            return undefined;

        return new ModelicaDescriptionStringSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "description_string")
            throw new Error(`Expected description_string, got ${this.source?.type}`);

        this.#value = "";

        for (let value of childrenForFieldName(this.source, "value"))
            this.#value += value.text.slice(1, value.text.length - 1);

        this.parsed = true;

    }

    override toString(): string | undefined {
        return this.value;
    }

    get value(): string | undefined {
        this.parse();
        return this.#value ?? undefined;
    }

}

// TODO??? SHORT/ENUM
export abstract class ModelicaElementSyntax extends ModelicaSyntaxNode {

    #visibility?: ModelicaVisibility;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>) {
        super(source);
        this.#visibility = properties?.visibility;
    }

    abstract instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaElementSymbol>;

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>): ModelicaElementSyntax[] | ModelicaElementSyntax | undefined {

        switch (source?.type) {

            case "extends_clause":
                return ModelicaExtendsClauseSyntax.new(source, properties);

            case "import_clause":
                return ModelicaImportClauseSyntax.new(source, properties);

            case "named_element":
                return ModelicaNamedElementSyntax.new(source, properties);

        }

    }

    get visibility(): ModelicaVisibility {
        this.parse();
        return this.#visibility ?? ModelicaVisibility.PUBLIC;
    }

}

// DONE
export class ModelicaAlgorithmSectionSyntax extends ModelicaElementSyntax {

    #initial?: SyntaxNode;
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAlgorithmSection(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    get initial(): SyntaxNode | undefined {
        this.parse();
        return this.#initial;
    }

    override async instantiate(parent: ModelicaScope): Promise<ModelicaAlgorithmSectionSymbol> {
        return new ModelicaAlgorithmSectionSymbol(parent, this);
    }

    static override new(source?: SyntaxNode | null): ModelicaAlgorithmSectionSyntax | undefined {

        if (source == null || source.type != "algorithm_section")
            return undefined;

        return new ModelicaAlgorithmSectionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "algorithm_section")
            throw new Error(`Expected algorithm_section, got ${this.source?.type}`);

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.#initial = childForFieldName(this.source, "initial");

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// DONE
export class ModelicaEquationSectionSyntax extends ModelicaElementSyntax {

    #equations?: ModelicaEquationSyntax[];
    #initial?: SyntaxNode;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEquationSection(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.equations != null)
                yield* node.equations;

        }();

    }

    get equations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#equations;
    }

    get initial(): SyntaxNode | undefined {
        this.parse();
        return this.#initial;
    }

    override async instantiate(parent: ModelicaScope): Promise<ModelicaEquationSectionSymbol> {
        return new ModelicaEquationSectionSymbol(parent, this);
    }

    static override new(source?: SyntaxNode | null): ModelicaEquationSectionSyntax | undefined {

        if (source == null || source.type != "equation_section")
            return undefined;

        return new ModelicaEquationSectionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "equation_section")
            throw new Error(`Expected equation_section, got ${this.source?.type}`);

        this.#equations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "equations"), "equation")) {

            let equation = ModelicaEquationSyntax.new(child);

            if (equation != null)
                this.#equations.push(equation);

        }

        this.#initial = childForFieldName(this.source, "initial");

        this.parsed = true;

    }

}

// DONE
export class ModelicaExtendsClauseSyntax extends ModelicaElementSyntax {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #classModification?: ModelicaClassModificationSyntax;
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>) {
        super(source, properties);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitExtendsClause(this, ...args);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.classModification != null)
                yield node.classModification;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaExtendsSymbol> {
        return new ModelicaExtendsSymbol(parent, modificationEnvironment, this);
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>): ModelicaExtendsClauseSyntax | undefined {

        if (source == null || source.type != "extends_clause")
            return undefined;

        return new ModelicaExtendsClauseSyntax(source, properties);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "extends_clause")
            throw new Error(`Expected extends_clause, got ${this.source?.type}`);

        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(this.source, "typeSpecifier"));
        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));

        this.parsed = true;

    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaImportClauseSyntax extends ModelicaElementSyntax {

    #alias?: ModelicaIdentifierSyntax;
    #imports?: ModelicaIdentifierSyntax[];
    #name?: ModelicaNameSyntax;
    #wildcard?: boolean;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>) {
        super(source, properties);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitImportClause(this, ...args);
    }

    get alias(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#alias;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.alias != null)
                yield node.alias;

            if (node.imports != null)
                yield* node.imports;

            if (node.name != null)
                yield node.name;

        }();

    }

    get imports(): ModelicaIdentifierSyntax[] | undefined {
        this.parse();
        return this.#imports;
    }

    override async instantiate(parent: ModelicaScope): Promise<ModelicaImportSymbol> {
        return new ModelicaImportSymbol(parent, this);
    }

    get name(): ModelicaNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        visibility: ModelicaVisibility
    }>): ModelicaImportClauseSyntax | undefined {

        if (source == null || source.type != "import_clause")
            return undefined;

        return new ModelicaImportClauseSyntax(source, properties);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "import_clause")
            throw new Error(`Expected import_clause, got ${this.source?.type}`);

        this.#alias = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "alias"));

        this.#imports = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "imports"), "import")) {

            let identifier = ModelicaIdentifierSyntax.new(child);

            if (identifier != null)
                this.#imports.push(identifier);

        }

        this.#name = ModelicaNameSyntax.new(childForFieldName(this.source, "name"));
        this.#wildcard = childForFieldName(this.source, "wildcard") != null;

        this.parsed = true;

    }

    get wildcard(): boolean | undefined {
        this.parse();
        return this.#wildcard;
    }

}

// TODO??? SHORT/ENUM
export abstract class ModelicaNamedElementSyntax extends ModelicaElementSyntax {

    #constrainingClause?: ModelicaConstrainingClauseSyntax;
    #final?: SyntaxNode;
    #inner?: SyntaxNode;
    #outer?: SyntaxNode;
    #redeclare?: SyntaxNode;
    #replaceable?: SyntaxNode;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>) {
        super(source, properties);
        this.#constrainingClause = properties?.constrainingClause,
            this.#final = properties?.final;
        this.#inner = properties?.inner;
        this.#outer = properties?.outer;
        this.#redeclare = properties?.redeclare;
        this.#replaceable = properties?.replaceable;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.constrainingClause != null)
                yield node.constrainingClause;

        }();

    }

    get constrainingClause(): ModelicaConstrainingClauseSyntax | undefined {
        this.parse();
        return this.#constrainingClause;
    }

    abstract get descriptionString(): ModelicaDescriptionStringSyntax | undefined;

    get final(): SyntaxNode | undefined {
        this.parse();
        return this.#final;
    }

    abstract get identifier(): ModelicaIdentifierSyntax | undefined;

    get inner(): SyntaxNode | undefined {
        this.parse();
        return this.#inner;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>): ModelicaNamedElementSyntax[] | ModelicaNamedElementSyntax | undefined {

        if (source == null || source.type != "named_element")
            return undefined;

        let nodes: ModelicaNamedElementSyntax[] | ModelicaNamedElementSyntax | undefined;

        let annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(source, "annotationClause"));
        let descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(source, "descriptionString"));
        let constrainingClause = properties?.constrainingClause ?? ModelicaConstrainingClauseSyntax.new(childForFieldName(source, "constrainingClause"), {
            annotationClause, descriptionString
        });
        let final = properties?.final ?? childForFieldName(source, "final");
        let inner = properties?.inner ?? childForFieldName(source, "inner");
        let outer = properties?.outer ?? childForFieldName(source, "outer");
        let redeclare = properties?.redeclare ?? childForFieldName(source, "redeclare");
        let replaceable = properties?.replaceable ?? childForFieldName(source, "replaceable");
        let visibility = properties?.visibility;

        nodes = ModelicaClassDefinitionSyntax.new(childForFieldName(source, "classDefinition"), {
            constrainingClause, final, inner, outer, redeclare, replaceable, visibility
        });

        if (nodes == null)
            nodes = ModelicaComponentDeclarationSyntax.new(childForFieldName(source, "componentClause"), {
                constrainingClause, final, inner, outer, redeclare, replaceable, visibility
            });

        if (nodes == null)
            return undefined;

        if (nodes instanceof ModelicaNamedElementSyntax)
            nodes = [nodes];

        if (nodes.length == 1)
            return nodes[0];

        return nodes;

    }

    get outer(): SyntaxNode | undefined {
        this.parse();
        return this.#outer;
    }

    get redeclare(): SyntaxNode | undefined {
        this.parse();
        return this.#redeclare;
    }

    get replaceable(): SyntaxNode | undefined {
        this.parse();
        return this.#replaceable;
    }

}

// DONE
export class ModelicaClassDefinitionSyntax extends ModelicaNamedElementSyntax {

    #classRestriction?: ModelicaClassRestriction;
    #classSpecifier?: ModelicaClassSpecifierSyntax;
    #encapsulated?: SyntaxNode;
    #expandable?: SyntaxNode;
    #impure?: SyntaxNode;
    #library?: ModelicaLibrary;
    #operator?: SyntaxNode;
    #partial?: SyntaxNode;
    #filePath?: string[];
    #pure?: SyntaxNode;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>, library?: ModelicaLibrary, filePath?: string[]) {
        super(source, properties);
        this.#library = library;
        this.#filePath = filePath;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitClassDefinition(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classSpecifier != null)
                yield node.classSpecifier;

        }();

    }

    get classDefinitions(): IterableIterator<ModelicaClassDefinitionSyntax> {

        let node = this;

        return function* () {

            for (let element of node.elements ?? [])
                if (element instanceof ModelicaClassDefinitionSyntax)
                    yield element;

        }();

    }

    get classRestriction(): ModelicaClassRestriction | undefined {
        this.parse();
        return this.#classRestriction;
    }

    get classSpecifier(): ModelicaClassSpecifierSyntax | undefined {
        this.parse();
        return this.#classSpecifier;
    }

    override get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        return this.classSpecifier?.descriptionString;
    }

    get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return this.#classSpecifier?.elements;
    }

    get encapsulated(): SyntaxNode | undefined {
        this.parse();
        return this.#encapsulated;
    }

    get expandable(): SyntaxNode | undefined {
        this.parse();
        return this.#expandable;
    }

    get filePath(): string[] | undefined {
        return this.#filePath;
    }

    get flattenedClassDefinitions(): IterableIterator<ModelicaClassDefinitionSyntax> {

        let node = this;

        return function* () {

            for (let classDefinition of node.classDefinitions) {
                yield classDefinition;
                yield* classDefinition.flattenedClassDefinitions;
            }

        }();

    }

    override get identifier(): ModelicaIdentifierSyntax | undefined {
        return this.classSpecifier?.identifier;
    }

    get impure(): SyntaxNode | undefined {
        this.parse();
        return this.#impure;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaClassSymbol> {
        return new ModelicaClassSymbol(parent, modificationEnvironment, this);
    }

    get library(): ModelicaLibrary | undefined {
        return this.#library;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>, library?: ModelicaLibrary, filePath?: string[]): ModelicaClassDefinitionSyntax | undefined {

        if (source == null || source.type != "class_definition")
            return undefined;

        return new ModelicaClassDefinitionSyntax(source, properties, library, filePath);

    }

    get operator(): SyntaxNode | undefined {
        this.parse();
        return this.#operator;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "class_definition")
            throw new Error(`Expected class_definition, got ${this.source?.type}`);

        this.#classSpecifier = ModelicaClassSpecifierSyntax.new(childForFieldName(this.source, "classSpecifier"));
        this.#encapsulated = childForFieldName(this.source, "encapsulated");

        let classPrefixes = childForFieldName(this.source, "classPrefixes");
        this.#impure = childForFieldName(classPrefixes, "impure");
        this.#partial = childForFieldName(classPrefixes, "partial");
        this.#pure = childForFieldName(classPrefixes, "pure");

        if (childForFieldName(classPrefixes, "block") != null) {
            this.#classRestriction = ModelicaClassRestriction.BLOCK;
        } else if (childForFieldName(classPrefixes, "class") != null) {
            this.#classRestriction = ModelicaClassRestriction.CLASS;
        } else if (childForFieldName(classPrefixes, "connector") != null) {
            this.#classRestriction = ModelicaClassRestriction.CONNECTOR;
            this.#expandable = childForFieldName(classPrefixes, "expandable");
        } else if (childForFieldName(classPrefixes, "function") != null) {
            this.#classRestriction = ModelicaClassRestriction.FUNCTION;
            this.#operator = childForFieldName(classPrefixes, "operator");
        } else if (childForFieldName(classPrefixes, "model") != null) {
            this.#classRestriction = ModelicaClassRestriction.MODEL;
        } else if (childForFieldName(classPrefixes, "package") != null) {
            this.#classRestriction = ModelicaClassRestriction.PACKAGE;
        } else if (childForFieldName(classPrefixes, "record") != null) {
            this.#classRestriction = ModelicaClassRestriction.RECORD;
            this.#operator = childForFieldName(classPrefixes, "operator");
        } else if (childForFieldName(classPrefixes, "type") != null) {
            this.#classRestriction = ModelicaClassRestriction.TYPE;
        } else if (childForFieldName(classPrefixes, "operator") != null) {
            this.#classRestriction = ModelicaClassRestriction.OPERATOR;
        } else {
            this.#classRestriction = ModelicaClassRestriction.CLASS;
        }

        this.parsed = true;

    }

    get partial(): SyntaxNode | undefined {
        this.parse();
        return this.#partial;
    }

    get pure(): SyntaxNode | undefined {
        this.parse();
        return this.#pure;
    }

}

// DONE
export class ModelicaComponentDeclarationSyntax extends ModelicaNamedElementSyntax {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #condition?: ModelicaExpressionSyntax;
    #constant?: SyntaxNode;
    #descriptionString?: ModelicaDescriptionStringSyntax;
    #discrete?: SyntaxNode;
    #flow?: SyntaxNode;
    #identifier?: ModelicaIdentifierSyntax;
    #input?: SyntaxNode;
    #modification?: ModelicaModificationSyntax;
    #output?: SyntaxNode;
    #parameter?: SyntaxNode;
    #stream?: SyntaxNode;
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>) {
        super(source, properties);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitComponentDeclaration(this, ...args);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.condition != null)
                yield node.condition;

            if (node.descriptionString != null)
                yield node.descriptionString;

            if (node.modification != null)
                yield node.modification;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get constant(): SyntaxNode | undefined {
        this.parse();
        return this.#constant;
    }

    override get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    get discrete(): SyntaxNode | undefined {
        this.parse();
        return this.#discrete;
    }

    get flow(): SyntaxNode | undefined {
        this.parse();
        return this.#flow;
    }

    override get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    get input(): SyntaxNode | undefined {
        this.parse();
        return this.#input;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaComponentSymbol> {
        return new ModelicaComponentSymbol(parent, modificationEnvironment, this);
    }

    get modification(): ModelicaModificationSyntax | undefined {
        this.parse();
        return this.#modification;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>): ModelicaComponentDeclarationSyntax[] | ModelicaComponentDeclarationSyntax | undefined {

        if (source == null || source.type != "component_clause")
            return undefined;

        let nodes: ModelicaComponentDeclarationSyntax[] = [];

        let constant = childForFieldName(source, "constant") ?? undefined;
        let discrete = childForFieldName(source, "discrete") ?? undefined;
        let flow = childForFieldName(source, "flow") ?? undefined;
        let input = childForFieldName(source, "input") ?? undefined;
        let output = childForFieldName(source, "output") ?? undefined;
        let parameter = childForFieldName(source, "parameter") ?? undefined;
        let stream = childForFieldName(source, "stream") ?? undefined;
        let subscripts: ModelicaSubscriptSyntax[] = [];

        for (let child of childrenForFieldName(childForFieldName(source, "subscripts"), "subscript")) {

            let subscript = ModelicaSubscriptSyntax.new(child);

            if (subscript != null)
                subscripts.push(subscript);

        }

        let typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(source, "typeSpecifier"))?.array(subscripts);

        for (let component of childrenForFieldName(childForFieldName(source, "componentDeclarations"), "componentDeclaration")) {

            let declaration = childForFieldName(component, "declaration");
            let node = new ModelicaComponentDeclarationSyntax(component, properties);
            node.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(component, "annotationClause"));
            node.#condition = ModelicaExpressionSyntax.new(childForFieldName(component, "condition"));
            node.#constant = constant;
            node.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(component, "descriptionString"));
            node.#discrete = discrete;
            node.#flow = flow;
            node.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(declaration, "identifier"));
            node.#input = input;
            node.#modification = ModelicaModificationSyntax.new(childForFieldName(declaration, "modification"));
            node.#output = output;
            node.#parameter = parameter;
            node.#stream = stream;

            let subscripts: ModelicaSubscriptSyntax[] = [];

            for (let child of childrenForFieldName(childForFieldName(declaration, "subscripts"), "subscript")) {

                let subscript = ModelicaSubscriptSyntax.new(child);

                if (subscript != null)
                    subscripts.push(subscript);

            }

            node.#typeSpecifier = typeSpecifier?.array(subscripts);
            nodes.push(node);

        }

        return nodes;

    }

    get output(): SyntaxNode | undefined {
        this.parse();
        return this.#output;
    }

    get parameter(): SyntaxNode | undefined {
        this.parse();
        return this.#parameter;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "component_declaration")
            throw new Error(`Expected component_declaration, got ${this.source?.type}`);

        this.parsed = true;

    }

    get stream(): SyntaxNode | undefined {
        this.parse();
        return this.#stream;
    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaShortClassDefinitionSyntax extends ModelicaNamedElementSyntax {

    #classRestriction?: ModelicaClassRestriction;
    #classSpecifier?: ModelicaClassSpecifierSyntax;
    #encapsulated?: SyntaxNode;
    #expandable?: SyntaxNode;
    #filePath?: string[];
    #impure?: SyntaxNode;
    #library?: ModelicaLibrary;
    #operator?: SyntaxNode;
    #partial?: SyntaxNode;
    #pure?: SyntaxNode;

    constructor(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>, library?: ModelicaLibrary, filePath?: string[]) {
        super(source, properties);
        this.#library = library;
        this.#filePath = filePath;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitShortClassDefinition(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classSpecifier != null)
                yield node.classSpecifier;

        }();

    }


    get classDefinitions(): IterableIterator<ModelicaClassDefinitionSyntax> {

        let node = this;

        return function* () {

            for (let element of node.elements ?? [])
                if (element instanceof ModelicaClassDefinitionSyntax)
                    yield element;

        }();

    }

    get classRestriction(): ModelicaClassRestriction | undefined {
        this.parse();
        return this.#classRestriction;
    }

    get classSpecifier(): ModelicaClassSpecifierSyntax | undefined {
        this.parse();
        return this.#classSpecifier;
    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        return this.classSpecifier?.descriptionString;
    }

    get elements(): ModelicaElementSyntax[] | undefined {
        this.parse();
        return this.#classSpecifier?.elements;
    }

    get encapsulated(): SyntaxNode | undefined {
        this.parse();
        return this.#encapsulated;
    }

    get expandable(): SyntaxNode | undefined {
        this.parse();
        return this.#expandable;
    }

    get filePath(): string[] | undefined {
        return this.#filePath;
    }

    get flattenedClassDefinitions(): IterableIterator<ModelicaClassDefinitionSyntax> {

        let node = this;

        return function* () {

            for (let classDefinition of node.classDefinitions) {
                yield classDefinition;
                yield* classDefinition.flattenedClassDefinitions;
            }

        }();

    }

    override get identifier(): ModelicaIdentifierSyntax | undefined {
        return this.classSpecifier?.identifier;
    }

    get impure(): SyntaxNode | undefined {
        this.parse();
        return this.#impure;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaClassSymbol> {
        return new ModelicaClassSymbol(parent, modificationEnvironment, this);
    }

    get library(): ModelicaLibrary | undefined {
        return this.#library;
    }

    static override new(source?: SyntaxNode | null, properties?: Partial<{
        constrainingClause: ModelicaConstrainingClauseSyntax,
        final: SyntaxNode,
        inner: SyntaxNode,
        outer: SyntaxNode,
        redeclare: SyntaxNode,
        replaceable: SyntaxNode,
        visibility: ModelicaVisibility
    }>, library?: ModelicaLibrary, filePath?: string[]): ModelicaShortClassDefinitionSyntax | undefined {

        if (source == null || source.type != "short_class_definition")
            return undefined;

        return new ModelicaShortClassDefinitionSyntax(source, properties, library, filePath);

    }

    get operator(): SyntaxNode | undefined {
        this.parse();
        return this.#operator;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "short_class_definition")
            throw new Error(`Expected short_class_definition, got ${this.source?.type}`);

        this.#classSpecifier = ModelicaClassSpecifierSyntax.new(childForFieldName(this.source, "classSpecifier"));
        this.#encapsulated = childForFieldName(this.source, "encapsulated");

        let classPrefixes = childForFieldName(this.source, "classPrefixes");
        this.#impure = childForFieldName(classPrefixes, "impure");
        this.#partial = childForFieldName(classPrefixes, "partial");
        this.#pure = childForFieldName(classPrefixes, "pure");

        if (childForFieldName(classPrefixes, "block") != null) {
            this.#classRestriction = ModelicaClassRestriction.BLOCK;
        } else if (childForFieldName(classPrefixes, "class") != null) {
            this.#classRestriction = ModelicaClassRestriction.CLASS;
        } else if (childForFieldName(classPrefixes, "connector") != null) {
            this.#classRestriction = ModelicaClassRestriction.CONNECTOR;
            this.#expandable = childForFieldName(classPrefixes, "expandable");
        } else if (childForFieldName(classPrefixes, "function") != null) {
            this.#classRestriction = ModelicaClassRestriction.FUNCTION;
            this.#operator = childForFieldName(classPrefixes, "operator");
        } else if (childForFieldName(classPrefixes, "model") != null) {
            this.#classRestriction = ModelicaClassRestriction.MODEL;
        } else if (childForFieldName(classPrefixes, "package") != null) {
            this.#classRestriction = ModelicaClassRestriction.PACKAGE;
        } else if (childForFieldName(classPrefixes, "record") != null) {
            this.#classRestriction = ModelicaClassRestriction.RECORD;
            this.#operator = childForFieldName(classPrefixes, "operator");
        } else if (childForFieldName(classPrefixes, "type") != null) {
            this.#classRestriction = ModelicaClassRestriction.TYPE;
        } else if (childForFieldName(classPrefixes, "operator") != null) {
            this.#classRestriction = ModelicaClassRestriction.OPERATOR;
        } else {
            this.#classRestriction = ModelicaClassRestriction.CLASS;
        }

        this.parsed = true;

    }

    get partial(): SyntaxNode | undefined {
        this.parse();
        return this.#partial;
    }

    get pure(): SyntaxNode | undefined {
        this.parse();
        return this.#pure;
    }

}

// DONE
export class ModelicaEnumerationLiteralSyntax extends ModelicaComponentDeclarationSyntax {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #descriptionString?: ModelicaDescriptionStringSyntax;
    #identifier?: ModelicaIdentifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEnumerationLiteral(this, ...args);
    }

    override get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    override get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    override async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment, value?: number): Promise<ModelicaEnumerationLiteralComponentSymbol> {

        if (parent instanceof ModelicaClassSymbol)
            return new ModelicaEnumerationLiteralComponentSymbol(parent, modificationEnvironment, this, parent, value);

        return new ModelicaEnumerationLiteralComponentSymbol(parent, modificationEnvironment, this, undefined, value);

    }

    static override new(source?: SyntaxNode | null): ModelicaEnumerationLiteralSyntax | undefined {

        if (source == null || source.type != "enumeration_literal")
            return undefined;

        return new ModelicaEnumerationLiteralSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "enumeration_literal")
            throw new Error(`Expected enumeration_literal, got ${this.source?.type}`);

        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(this.source, "descriptionString"));
        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaElseIfEquationClauseSyntax extends ModelicaSyntaxNode {

    #condition?: ModelicaExpressionSyntax;
    #equations?: ModelicaEquationSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElseIfEquationClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.equations != null)
                yield* node.equations;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get equations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#equations;
    }

    static override new(source?: SyntaxNode | null): ModelicaElseIfEquationClauseSyntax | undefined {

        if (source == null || source.type != "else_if_equation_clause")
            return undefined;

        return new ModelicaElseIfEquationClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "else_if_equation_clause")
            throw new Error(`Expected else_if_equation_clause, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#equations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "equations"), "equation")) {

            let equation = ModelicaEquationSyntax.new(child);

            if (equation != null)
                this.#equations.push(equation);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaElseIfExpressionClauseSyntax extends ModelicaSyntaxNode {

    #condition?: ModelicaExpressionSyntax;
    #expression?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElseIfExpressionClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.expression != null)
                yield node.expression;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    static override new(source?: SyntaxNode | null): ModelicaElseIfExpressionClauseSyntax | undefined {

        if (source == null || source.type != "else_if_expression_clause")
            return undefined;

        return new ModelicaElseIfExpressionClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "else_if_expression_clause")
            throw new Error(`Expected else_if_expression_clause, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));
        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaElseIfStatementClauseSyntax extends ModelicaSyntaxNode {

    #condition?: ModelicaExpressionSyntax;
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElseIfStatementClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    static override new(source?: SyntaxNode | null): ModelicaElseIfStatementClauseSyntax | undefined {

        if (source == null || source.type != "else_if_statement_clause")
            return undefined;

        return new ModelicaElseIfStatementClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "else_if_statement_clause")
            throw new Error(`Expected else_if_statement_clause, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// DONE
export class ModelicaElseWhenEquationClauseSyntax extends ModelicaSyntaxNode {

    #condition?: ModelicaExpressionSyntax;
    #equations?: ModelicaEquationSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElseWhenEquationClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.equations != null)
                yield* node.equations;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get equations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#equations;
    }

    static override new(source?: SyntaxNode | null): ModelicaElseWhenEquationClauseSyntax | undefined {

        if (source == null || source.type != "else_when_equation_clause")
            return undefined;

        return new ModelicaElseWhenEquationClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "else_when_equation_clause")
            throw new Error(`Expected else_when_equation_clause, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#equations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "equations"), "equation")) {

            let equation = ModelicaEquationSyntax.new(child);

            if (equation != null)
                this.#equations.push(equation);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaElseWhenStatementClauseSyntax extends ModelicaSyntaxNode {

    #condition?: ModelicaExpressionSyntax;
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitElseWhenStatementClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    static override new(source?: SyntaxNode | null): ModelicaElseWhenStatementClauseSyntax | undefined {

        if (source == null || source.type != "else_when_statement_clause")
            return undefined;

        return new ModelicaElseWhenStatementClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "else_when_statement_clause")
            throw new Error(`Expected else_when_statement_clause, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// DONE
export abstract class ModelicaEquationSyntax extends ModelicaSyntaxNode {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #descriptionString?: ModelicaDescriptionStringSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.descriptionString != null)
                yield node.descriptionString;

        }();

    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    static override new(source?: SyntaxNode | null): ModelicaEquationSyntax | undefined {

        switch (source?.type) {

            case "connect_clause":
                return ModelicaConnectClauseSyntax.new(source);

            case "function_application_equation":
                return ModelicaFunctionApplicationEquationSyntax.new(source);

            case "if_equation":
                return ModelicaIfEquationSyntax.new(source);

            case "for_equation":
                return ModelicaForEquationSyntax.new(source);

            case "simple_equation":
                return ModelicaSimpleEquationSyntax.new(source);

            case "when_equation":
                return ModelicaWhenEquationSyntax.new(source);

            default:
                return undefined;

        }

    }

    override parse(): void {
        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(this.source, "descriptionString"));
    }

}

// DONE
export class ModelicaConnectClauseSyntax extends ModelicaEquationSyntax {

    #component1?: ModelicaComponentReferenceExpressionSyntax;
    #component2?: ModelicaComponentReferenceExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConnectClause(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.component1 != null)
                yield node.component1;

            if (node.component2 != null)
                yield node.component2;

        }();

    }

    get component1(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#component1;
    }

    get component2(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#component2;
    }

    static override new(source?: SyntaxNode | null): ModelicaConnectClauseSyntax | undefined {

        if (source == null || source.type != "connect_clause")
            return undefined;

        return new ModelicaConnectClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "connect_clause")
            throw new Error(`Expected connect_clause, got ${this.source?.type}`);

        super.parse();

        this.#component1 = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "component1"));
        this.#component2 = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "component2"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaFunctionApplicationEquationSyntax extends ModelicaEquationSyntax {

    #arguments?: ModelicaExpressionSyntax[];
    #expression?: ModelicaExpressionSyntax;
    #functionReference?: ModelicaComponentReferenceExpressionSyntax;
    #indices?: ModelicaForIndexSyntax[];
    #namedArguments?: ModelicaNamedArgumentSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFunctionApplicationEquation(this, ...args);
    }

    get arguments(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

            if (node.expression != null)
                yield node.expression;

            if (node.functionReference != null)
                yield node.functionReference;

            if (node.indices != null)
                yield* node.indices;

            if (node.namedArguments != null)
                yield* node.namedArguments;

        }();

    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get functionReference(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#functionReference;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    get namedArguments(): ModelicaNamedArgumentSyntax[] | undefined {
        this.parse();
        return this.#namedArguments;
    }

    static override new(source?: SyntaxNode | null): ModelicaFunctionApplicationEquationSyntax | undefined {

        if (source == null || source.type != "function_application_equation")
            return undefined;

        return new ModelicaFunctionApplicationEquationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "function_application_equation")
            throw new Error(`Expected function_application_equation, got ${this.source?.type}`);

        super.parse();

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));
        this.#functionReference = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "functionReference"));
        this.#arguments = [];
        this.#namedArguments = [];

        let args = childForFieldName(this.source, "arguments");

        if (args != null) {

            for (let child of childrenForFieldName(childForFieldName(args, "arguments"), "argument")) {

                let argument = ModelicaExpressionSyntax.new(child);

                if (argument != null) {
                    this.#arguments.push(argument);
                } else {

                    argument = ModelicaFunctionPartialApplicationExpressionSyntax.new(child);

                    if (argument != null)
                        this.#arguments.push(argument);

                }

            }

            for (let child of childrenForFieldName(childForFieldName(args, "namedArguments"), "namedArgument")) {

                let namedArgument = ModelicaNamedArgumentSyntax.new(child);

                if (namedArgument != null)
                    this.#namedArguments.push(namedArgument);

            }

        }

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaIfEquationSyntax extends ModelicaEquationSyntax {

    #condition?: ModelicaExpressionSyntax;
    #elseIfClauses?: ModelicaElseIfEquationClauseSyntax[];
    #elseEquations?: ModelicaEquationSyntax[];
    #thenEquations?: ModelicaEquationSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitIfEquation(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.elseIfClauses != null)
                yield* node.elseIfClauses;

            if (node.elseEquations != null)
                yield* node.elseEquations;

            if (node.thenEquations != null)
                yield* node.thenEquations;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get elseIfClauses(): ModelicaElseIfEquationClauseSyntax[] | undefined {
        this.parse();
        return this.#elseIfClauses;
    }

    get elseEquations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#elseEquations;
    }

    static override new(source?: SyntaxNode | null): ModelicaIfEquationSyntax | undefined {

        if (source == null || source.type != "if_equation")
            return undefined;

        return new ModelicaIfEquationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "if_equation")
            throw new Error(`Expected if_equation, got ${this.source?.type}`);

        super.parse();

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#elseIfClauses = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseIfClauses"), "elseIfClause")) {

            let elseIfClause = ModelicaElseIfEquationClauseSyntax.new(child);

            if (elseIfClause != null)
                this.#elseIfClauses.push(elseIfClause);

        }

        this.#elseEquations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseEquations"), "elseEquation")) {

            let elseEquation = ModelicaEquationSyntax.new(child);

            if (elseEquation != null)
                this.#elseEquations.push(elseEquation);

        }

        this.#thenEquations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "thenEquations"), "thenEquation")) {

            let thenEquation = ModelicaEquationSyntax.new(child);

            if (thenEquation != null)
                this.#thenEquations.push(thenEquation);

        }

        this.parsed = true;

    }

    get thenEquations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#thenEquations;
    }

}

// DONE
export class ModelicaForEquationSyntax extends ModelicaEquationSyntax {

    #equations?: ModelicaEquationSyntax[];
    #indices?: ModelicaForIndexSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitForEquation(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.equations != null)
                yield* node.equations;

            if (node.indices != null)
                yield* node.indices;

        }();

    }

    get equations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#equations;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    static override new(source?: SyntaxNode | null): ModelicaForEquationSyntax | undefined {

        if (source == null || source.type != "for_equation")
            return undefined;

        return new ModelicaForEquationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "for_equation")
            throw new Error(`Expected for_equation, got ${this.source?.type}`);

        super.parse();

        this.#equations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "equations"), "equation")) {

            let equation = ModelicaEquationSyntax.new(child);

            if (equation != null)
                this.#equations.push(equation);

        }

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaSimpleEquationSyntax extends ModelicaEquationSyntax {

    #expression1?: ModelicaSimpleExpressionSyntax;
    #expression2?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitSimpleEquation(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expression1 != null)
                yield node.expression1;

            if (node.expression2 != null)
                yield node.expression2;

        }();

    }

    get expression1(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#expression1;
    }

    get expression2(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression2;
    }

    static override new(source?: SyntaxNode | null): ModelicaSimpleEquationSyntax | undefined {

        if (source == null || source.type != "simple_equation")
            return undefined;

        return new ModelicaSimpleEquationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "simple_equation")
            throw new Error(`Expected simple_equation, got ${this.source?.type}`);

        super.parse();

        this.#expression1 = ModelicaSimpleExpressionSyntax.new(childForFieldName(this.source, "expression1"));
        this.#expression2 = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression2"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaWhenEquationSyntax extends ModelicaEquationSyntax {

    #condition?: ModelicaExpressionSyntax;
    #elseWhenClauses?: ModelicaElseWhenEquationClauseSyntax[];
    #equations?: ModelicaEquationSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitWhenEquation(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.elseWhenClauses != null)
                yield* node.elseWhenClauses;

            if (node.equations != null)
                yield* node.equations;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get elseWhenClauses(): ModelicaElseWhenEquationClauseSyntax[] | undefined {
        this.parse();
        return this.#elseWhenClauses;
    }

    get equations(): ModelicaEquationSyntax[] | undefined {
        this.parse();
        return this.#equations;
    }

    static override new(source?: SyntaxNode | null): ModelicaWhenEquationSyntax | undefined {

        if (source == null || source.type != "when_equation")
            return undefined;

        return new ModelicaWhenEquationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "when_equation")
            throw new Error(`Expected when_equation, got ${this.source?.type}`);

        super.parse();

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#elseWhenClauses = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseWhenClauses"), "elseWhenClause")) {

            let elseWhenClause = ModelicaElseWhenEquationClauseSyntax.new(child);

            if (elseWhenClause != null)
                this.#elseWhenClauses.push(elseWhenClause);

        }

        this.#equations = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "equations"), "equation")) {

            let equation = ModelicaEquationSyntax.new(child);

            if (equation != null)
                this.#equations.push(equation);

        }

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaExpressionSyntax extends ModelicaSyntaxNode {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    abstract evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined>;

    static override new(source?: SyntaxNode | null): ModelicaExpressionSyntax | undefined {

        switch (source?.type) {

            case "array_comprehension":
                return ModelicaArrayComprehensionExpressionSyntax.new(source);

            case "array_concatenation":
                return ModelicaArrayConcatenationExpressionSyntax.new(source);

            case "array_constructor":
                return ModelicaArrayConstructorExpressionSyntax.new(source);

            case "binary_expression":
                return ModelicaBinaryExpressionSyntax.new(source);

            case "component_reference":
                return ModelicaComponentReferenceExpressionSyntax.new(source);

            case "end_expression":
                return ModelicaEndExpressionSyntax.new(source);

            case "function_application":
                return ModelicaFunctionApplicationExpressionSyntax.new(source);

            case "if_expression":
                return ModelicaIfExpressionSyntax.new(source);

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "parenthesized_expression":
                return ModelicaParenthesizedExpressionSyntax.new(source);

            case "range_expression":
                return ModelicaRangeExpressionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "unary_expression":
                return ModelicaUnaryExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            default:
                return undefined;

        }

    }

}

// DONE
export class ModelicaIfExpressionSyntax extends ModelicaExpressionSyntax {

    #condition?: ModelicaExpressionSyntax;
    #elseExpression?: ModelicaExpressionSyntax;
    #elseIfClauses?: ModelicaElseIfExpressionClauseSyntax[];
    #thenExpression?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitIfExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.elseExpression != null)
                yield node.elseExpression;

            if (node.elseIfClauses != null)
                yield* node.elseIfClauses;

            if (node.thenExpression != null)
                yield node.thenExpression;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get elseIfClauses(): ModelicaElseIfExpressionClauseSyntax[] | undefined {
        this.parse();
        return this.#elseIfClauses;
    }

    get elseExpression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#elseExpression;
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    static override new(source?: SyntaxNode | null): ModelicaIfExpressionSyntax | undefined {

        if (source == null || source.type != "if_expression")
            return undefined;

        return new ModelicaIfExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "if_expression")
            throw new Error(`Expected if_expression, got ${this.source?.type}`);

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#elseIfClauses = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseIfClauses"), "elseIfClause")) {

            let elseIfClause = ModelicaElseIfExpressionClauseSyntax.new(child);

            if (elseIfClause != null)
                this.#elseIfClauses.push(elseIfClause);

        }

        this.#elseExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "elseExpression"));
        this.#thenExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "thenExpression"));

        this.parsed = true;

    }

    get thenExpression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#thenExpression;
    }

}

// DONE
export class ModelicaFunctionPartialApplicationExpressionSyntax extends ModelicaExpressionSyntax {

    #namedArguments?: ModelicaNamedArgumentSyntax[];
    #typeSpecifier?: ModelicaTypeSpecifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFunctionPartialApplicationExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namedArguments != null)
                yield* node.namedArguments;

            if (node.typeSpecifier != null)
                yield node.typeSpecifier;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    get namedArguments(): ModelicaNamedArgumentSyntax[] | undefined {
        this.parse();
        return this.#namedArguments;
    }

    static override new(source?: SyntaxNode | null): ModelicaFunctionPartialApplicationExpressionSyntax | undefined {

        if (source == null || source.type != "function_partial_application")
            return undefined;

        return new ModelicaFunctionPartialApplicationExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "function_partial_application")
            throw new Error(`Expected function_partial_application, got ${this.source?.type}`);


        this.#namedArguments = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "namedArguments"), "namedArgument")) {

            let namedArgument = ModelicaNamedArgumentSyntax.new(child);

            if (namedArgument != null)
                this.#namedArguments.push(namedArgument);

        }

        this.#typeSpecifier = ModelicaTypeSpecifierSyntax.new(childForFieldName(this.source, "typeSpecifier"));

        this.parsed = true;

    }

    get typeSpecifier(): ModelicaTypeSpecifierSyntax | undefined {
        this.parse();
        return this.#typeSpecifier;
    }

}

// DONE
export class ModelicaRangeExpressionSyntax extends ModelicaExpressionSyntax {

    #startExpression?: ModelicaSimpleExpressionSyntax;
    #stepExpression?: ModelicaSimpleExpressionSyntax;
    #stopExpression?: ModelicaSimpleExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRangeExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.startExpression != null)
                yield node.startExpression;

            if (node.stepExpression != null)
                yield node.stepExpression;

            if (node.stopExpression != null)
                yield node.stopExpression;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    static override new(source?: SyntaxNode | null): ModelicaRangeExpressionSyntax | undefined {

        if (source == null || source.type != "range_expression")
            return undefined;

        return new ModelicaRangeExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "range_expression")
            throw new Error(`Expected range_expression, got ${this.source?.type}`);

        this.#startExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "startExpression"));
        this.#stepExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "stepExpression"));
        this.#stopExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "stopExpression"));

        this.parsed = true;

    }

    get startExpression(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#startExpression;
    }

    get stepExpression(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#stepExpression;
    }

    get stopExpression(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#stopExpression;
    }

}

// DONE
export abstract class ModelicaSimpleExpressionSyntax extends ModelicaExpressionSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    static override new(source?: SyntaxNode | null): ModelicaSimpleExpressionSyntax | undefined {

        switch (source?.type) {

            case "array_comprehension":
                return ModelicaArrayComprehensionExpressionSyntax.new(source);

            case "array_concatenation":
                return ModelicaArrayConcatenationExpressionSyntax.new(source);

            case "array_constructor":
                return ModelicaArrayConstructorExpressionSyntax.new(source);

            case "binary_expression":
                return ModelicaBinaryExpressionSyntax.new(source);

            case "component_reference":
                return ModelicaComponentReferenceExpressionSyntax.new(source);

            case "end_expression":
                return ModelicaEndExpressionSyntax.new(source);

            case "function_application":
                return ModelicaFunctionApplicationExpressionSyntax.new(source);

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "parenthesized_expression":
                return ModelicaParenthesizedExpressionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "unary_expression":
                return ModelicaUnaryExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            default:
                return undefined;

        }

    }

}

// DONE
export class ModelicaBinaryExpressionSyntax extends ModelicaSimpleExpressionSyntax {

    #operand1?: ModelicaSimpleExpressionSyntax;
    #operand2?: ModelicaSimpleExpressionSyntax;
    #operator?: ModelicaBinaryOperator;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitBinaryExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.operand1 != null)
                yield node.operand1;

            if (node.operand2 != null)
                yield node.operand2;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {

        let operand1 = await this.operand1?.evaluate(scope);
        let operand2 = await this.operand2?.evaluate(scope);

        if (operand1 == null || operand2 == null)
            return undefined;

        switch (this.operator) {

            case ModelicaBinaryOperator.ADD: {

                if (operand1 instanceof ModelicaIntegerObjectSymbol) {

                    if (operand2 instanceof ModelicaIntegerObjectSymbol)
                        return new ModelicaIntegerObjectSymbol(operand1.type, operand1.value + operand2.value);

                    if (operand2 instanceof ModelicaRealObjectSymbol)
                        return new ModelicaRealObjectSymbol(operand1.type, operand1.value + operand2.value);

                }

                if (operand1 instanceof ModelicaRealObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaRealObjectSymbol(operand1.type, operand1.value + operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaStringObjectSymbol(operand1.type, operand1.value + operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.DIVIDE: {

                if (operand1 instanceof ModelicaIntegerObjectSymbol) {

                    if (operand2 instanceof ModelicaIntegerObjectSymbol)
                        return new ModelicaIntegerObjectSymbol(operand1.type, operand1.value / operand2.value);

                    if (operand2 instanceof ModelicaRealObjectSymbol)
                        return new ModelicaRealObjectSymbol(operand1.type, operand1.value / operand2.value);

                }

                if (operand1 instanceof ModelicaRealObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaRealObjectSymbol(operand1.type, operand1.value / operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.ELEMENTWISE_ADD: {
                return undefined;
            }

            case ModelicaBinaryOperator.ELEMENTWISE_DIVIDE: {
                return undefined;
            }

            case ModelicaBinaryOperator.ELEMENTWISE_EXPONENTIATE: {
                return undefined;
            }

            case ModelicaBinaryOperator.ELEMENTWISE_MULTIPLY: {
                return undefined;
            }

            case ModelicaBinaryOperator.ELEMENTWISE_SUBTRACT: {
                return undefined;
            }

            case ModelicaBinaryOperator.EQUALITY: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value == operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value == operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value == operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.EXPONENTIATE: {

                if (operand1 instanceof ModelicaIntegerObjectSymbol) {

                    if (operand2 instanceof ModelicaIntegerObjectSymbol)
                        return new ModelicaIntegerObjectSymbol(operand1.type, operand1.value ** operand2.value);

                    if (operand2 instanceof ModelicaRealObjectSymbol)
                        return new ModelicaRealObjectSymbol(operand1.type, operand1.value ** operand2.value);

                }

                if (operand1 instanceof ModelicaRealObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaRealObjectSymbol(operand1.type, operand1.value ** operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.GREATER_THAN: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value > operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value > operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value > operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.GREATER_THAN_OR_EQUAL: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value >= operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value >= operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value >= operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.INEQUALITY: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value != operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value != operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value != operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.LESS_THAN: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value < operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value < operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value < operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.LESS_THAN_OR_EQUAL: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value <= operand2.value);

                if (operand1 instanceof ModelicaNumberObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value <= operand2.value);

                if (operand1 instanceof ModelicaStringObjectSymbol && operand2 instanceof ModelicaStringObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value <= operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.LOGICAL_AND: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value && operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.LOGICAL_OR: {

                if (operand1 instanceof ModelicaBooleanObjectSymbol && operand2 instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand1.type, operand1.value || operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.MULTIPLY: {

                if (operand1 instanceof ModelicaIntegerObjectSymbol) {

                    if (operand2 instanceof ModelicaIntegerObjectSymbol)
                        return new ModelicaIntegerObjectSymbol(operand1.type, operand1.value * operand2.value);

                    if (operand2 instanceof ModelicaRealObjectSymbol)
                        return new ModelicaRealObjectSymbol(operand1.type, operand1.value * operand2.value);

                }

                if (operand1 instanceof ModelicaRealObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaRealObjectSymbol(operand1.type, operand1.value * operand2.value);

                return undefined;

            }

            case ModelicaBinaryOperator.SUBTRACT: {

                if (operand1 instanceof ModelicaIntegerObjectSymbol) {

                    if (operand2 instanceof ModelicaIntegerObjectSymbol)
                        return new ModelicaIntegerObjectSymbol(operand1.type, operand1.value - operand2.value);

                    if (operand2 instanceof ModelicaRealObjectSymbol)
                        return new ModelicaRealObjectSymbol(operand1.type, operand1.value - operand2.value);

                }

                if (operand1 instanceof ModelicaRealObjectSymbol && operand2 instanceof ModelicaNumberObjectSymbol)
                    return new ModelicaRealObjectSymbol(operand1.type, operand1.value - operand2.value);

                return undefined;

            }

            default: {
                return undefined;
            }

        }

    }

    static override new(source?: SyntaxNode | null): ModelicaBinaryExpressionSyntax | undefined {

        if (source == null || source.type != "binary_expression")
            return undefined;

        return new ModelicaBinaryExpressionSyntax(source);

    }

    get operand1(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#operand1;
    }

    get operand2(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#operand2;
    }

    get operator(): ModelicaBinaryOperator | undefined {
        this.parse();
        return this.#operator;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "binary_expression")
            throw new Error(`Expected binary_expression, got ${this.source?.type}`);

        this.#operand1 = ModelicaSimpleExpressionSyntax.new(childForFieldName(this.source, "operand1"));
        this.#operand2 = ModelicaSimpleExpressionSyntax.new(childForFieldName(this.source, "operand2"));

        switch (childForFieldName(this.source, "operator")?.text) {

            case "+":
                this.#operator = ModelicaBinaryOperator.ADD;
                break;

            case "/":
                this.#operator = ModelicaBinaryOperator.DIVIDE;
                break;

            case ".+":
                this.#operator = ModelicaBinaryOperator.ELEMENTWISE_ADD;
                break;

            case "./":
                this.#operator = ModelicaBinaryOperator.ELEMENTWISE_DIVIDE;
                break;

            case ".^":
                this.#operator = ModelicaBinaryOperator.ELEMENTWISE_EXPONENTIATE;
                break;

            case ".*":
                this.#operator = ModelicaBinaryOperator.ELEMENTWISE_MULTIPLY;
                break;

            case ".-":
                this.#operator = ModelicaBinaryOperator.ELEMENTWISE_SUBTRACT;
                break;

            case "==":
                this.#operator = ModelicaBinaryOperator.EQUALITY;
                break;

            case "^":
                this.#operator = ModelicaBinaryOperator.EXPONENTIATE;
                break;

            case ">":
                this.#operator = ModelicaBinaryOperator.GREATER_THAN;
                break;

            case ">=":
                this.#operator = ModelicaBinaryOperator.GREATER_THAN_OR_EQUAL;
                break;

            case "<>":
                this.#operator = ModelicaBinaryOperator.INEQUALITY;
                break;

            case "<":
                this.#operator = ModelicaBinaryOperator.LESS_THAN;
                break;

            case "<=":
                this.#operator = ModelicaBinaryOperator.LESS_THAN_OR_EQUAL;
                break;

            case "and":
                this.#operator = ModelicaBinaryOperator.LOGICAL_AND;
                break;

            case "or":
                this.#operator = ModelicaBinaryOperator.LOGICAL_OR;
                break;

            case "*":
                this.#operator = ModelicaBinaryOperator.MULTIPLY;
                break;

            case "-":
                this.#operator = ModelicaBinaryOperator.SUBTRACT;
                break;

        }

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaPrimaryExpressionSyntax extends ModelicaSimpleExpressionSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    static override new(source?: SyntaxNode | null): ModelicaPrimaryExpressionSyntax | undefined {

        switch (source?.type) {

            case "array_comprehension":
                return ModelicaArrayComprehensionExpressionSyntax.new(source);

            case "array_concatenation":
                return ModelicaArrayConcatenationExpressionSyntax.new(source);

            case "array_constructor":
                return ModelicaArrayConstructorExpressionSyntax.new(source);

            case "component_reference":
                return ModelicaComponentReferenceExpressionSyntax.new(source);

            case "end_expression":
                return ModelicaEndExpressionSyntax.new(source);

            case "function_application":
                return ModelicaFunctionApplicationExpressionSyntax.new(source);

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "parenthesized_expression":
                return ModelicaParenthesizedExpressionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            default:
                return undefined;

        }

    }

}

// DONE
export class ModelicaArrayComprehensionExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #expression?: ModelicaExpressionSyntax;
    #indices?: ModelicaForIndexSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitArrayComprehensionExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expression != null)
                yield node.expression;

            if (node.indices != null)
                yield* node.indices;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    static override new(source?: SyntaxNode | null): ModelicaArrayComprehensionExpressionSyntax | undefined {

        if (source == null || source.type != "array_comprehension")
            return undefined;

        return new ModelicaArrayComprehensionExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "array_comprehension")
            throw new Error(`Expected array_comprehension, got ${this.source?.type}`);

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaArrayConcatenationExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #expressions?: ModelicaExpressionSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitArrayConcatenationExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expressions != null)
                yield* node.expressions;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    get expressions(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#expressions;
    }

    static override new(source?: SyntaxNode | null): ModelicaArrayConcatenationExpressionSyntax | undefined {

        if (source == null || source.type != "array_concatenation")
            return undefined;

        return new ModelicaArrayConcatenationExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "array_concatenation")
            throw new Error(`Expected array_concatenation, got ${this.source?.type}`);

        this.#expressions = [];

        for (let expressions of childrenForFieldName(this.source, "expressions")) {

            for (let child of childrenForFieldName(expressions, "expression")) {

                let expression = ModelicaExpressionSyntax.new(child);

                if (expression != null)
                    this.#expressions.push(expression);

            }

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaArrayConstructorExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #arguments?: ModelicaExpressionSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitArrayConstructorExpression(this, ...args);
    }

    get arguments(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {

        let value: Array<ModelicaObjectSymbol | undefined> = [];

        for (let argument of this.arguments ?? [])
            value.push(await argument.evaluate(scope));

        return new ModelicaArrayObjectSymbol(new ModelicaArrayClassSymbol(scope), value);

    }

    static override new(source?: SyntaxNode | null): ModelicaArrayConstructorExpressionSyntax | undefined {

        if (source == null || source.type != "array_constructor")
            return undefined;

        return new ModelicaArrayConstructorExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "array_constructor")
            throw new Error(`Expected array_constructor, got ${this.source?.type}`);

        this.#arguments = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "arguments"), "argument")) {

            let argument = ModelicaExpressionSyntax.new(child);

            if (argument != null)
                this.#arguments.push(argument);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaComponentReferenceExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #global?: boolean;
    #identifier?: ModelicaIdentifierSyntax;
    #qualifier?: ModelicaComponentReferenceExpressionSyntax;
    #subscripts?: ModelicaSubscriptSyntax[];

    constructor(source?: SyntaxNode | null, identifier?: ModelicaIdentifierSyntax) {
        super(source);
        this.#identifier = identifier;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitComponentReferenceExpression(this, ...args);
    }

    get components(): IterableIterator<ModelicaComponentReferenceExpressionSyntax> {

        let node = this;

        return function* () {

            if (node.qualifier != null)
                yield* node.qualifier.components;

            yield node;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {

        let value: ModelicaNamedElementSymbol | ModelicaObjectSymbol | undefined;

        for (let component of this.components) {

            if (value == null) {

                value = await scope.resolve(component.identifier, component.global) ?? undefined;

                if (value instanceof ModelicaComponentSymbol)
                    value = await value.value;

            } else if (value instanceof ModelicaClassSymbol) {

                value = await value.resolve(component.identifier) ?? undefined;

            } else if (value instanceof ModelicaComponentSymbol) {

                value = await value.value;

                if (component.identifier?.value != null)
                    value = value?.properties.get(component.identifier?.value) ?? undefined;

                else
                    return undefined;


            } else if (value instanceof ModelicaObjectSymbol) {

                if (component.identifier?.value != null)
                    value = value?.properties.get(component.identifier?.value) ?? undefined;

                else
                    return undefined;

            } else {

                return undefined;

            }

            if (value instanceof ModelicaObjectSymbol && component.subscripts != null && component.subscripts.length > 0) {

                for (let subscript of component.subscripts) {

                    let subscriptValue = await subscript.expression?.evaluate(scope);

                    if (subscriptValue == null)
                        return undefined;

                    if (subscriptValue instanceof ModelicaNumberObjectSymbol) {

                        if (subscriptValue.value < 1)
                            return undefined;

                        if (value instanceof ModelicaArrayObjectSymbol)
                            value = value.value[subscriptValue.value - 1];

                        else
                            return undefined;

                    } else {
                        return undefined;
                    }

                }

            }

        }

        if (value instanceof ModelicaComponentSymbol)
            return await value.value;

        if (value instanceof ModelicaObjectSymbol)
            return value;

        return undefined;

    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.identifier != null)
                yield node.identifier;

            if (node.qualifier != null)
                yield node.qualifier;

            if (node.subscripts != null)
                yield* node.subscripts;

        }();

    }

    get global(): boolean | undefined {
        this.parse();
        return this.#global;
    }

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    static override new(source?: SyntaxNode | null): ModelicaComponentReferenceExpressionSyntax | undefined {

        if (source == null || source.type != "component_reference") {

            if (source?.childCount == 0 && source.text != null)
                return new ModelicaComponentReferenceExpressionSyntax(source, ModelicaIdentifierSyntax.new(source));

            return undefined;
        }

        return new ModelicaComponentReferenceExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "component_reference") {

            if (this.#identifier == null)
                throw new Error(`Expected component_reference, got ${this.source?.type}`);

            this.parsed = true;
            return;

        }

        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));
        this.#qualifier = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "qualifier"));
        this.#global = childForFieldName(this.source, "global") != null;

        this.#subscripts = [];

        for (let item of childrenForFieldName(childForFieldName(this.source, "subscripts"), "subscript")) {

            let subscript = ModelicaSubscriptSyntax.new(item);

            if (subscript != null)
                this.#subscripts.push(subscript);

        }

        this.parsed = true;

    }

    get qualifier(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#qualifier;
    }

    get subscripts(): ModelicaSubscriptSyntax[] | undefined {
        this.parse();
        return this.#subscripts;
    }

    override toString(): string | undefined {

        let string = null;

        if (this.qualifier != null)
            string = this.qualifier.toString() + ".";

        else if (this.global == true)
            string = ".";

        else
            string = "";

        if (this.identifier != null)
            string += this.identifier.toString();

        else
            return undefined;

        if (this.subscripts != null)
            for (let subscript of this.subscripts)
                string += subscript.toString();

        return string;

    }

}

// DONE
export class ModelicaEndExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEndExpression(this, ...args);
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    static override new(source?: SyntaxNode | null): ModelicaEndExpressionSyntax | undefined {

        if (source == null || source.type != "end_expression")
            return undefined;

        return new ModelicaEndExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "end_expression")
            throw new Error(`Expected end_expression, got ${this.source?.type}`);

        this.parsed = true;

    }

}

// DONE
export class ModelicaFunctionApplicationExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #arguments?: ModelicaExpressionSyntax[];
    #functionReference?: ModelicaComponentReferenceExpressionSyntax;
    #index?: ModelicaExpressionSyntax;
    #indices?: ModelicaForIndexSyntax[];
    #namedArguments?: ModelicaNamedArgumentSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFunctionApplicationExpression(this, ...args);
    }

    get arguments(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

            if (node.functionReference != null)
                yield node.functionReference;

            if (node.index != null)
                yield node.index;

            if (node.indices != null)
                yield* node.indices;

            if (node.namedArguments != null)
                yield* node.namedArguments;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {

        let functionSymbol = await scope.resolveFunction(this.functionReference);

        if (functionSymbol == null)
            return undefined;

        if (functionSymbol.classRestriction == ModelicaClassRestriction.FUNCTION) {
            return await functionSymbol.construct(this.arguments, this.namedArguments);
        } else if (functionSymbol.classRestriction == ModelicaClassRestriction.RECORD) {
            return await functionSymbol.construct(this.arguments, this.namedArguments);
        }

        return undefined;
    }

    get functionReference(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#functionReference;
    }

    get index(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#index;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    get namedArguments(): ModelicaNamedArgumentSyntax[] | undefined {
        this.parse();
        return this.#namedArguments;
    }

    static override new(source?: SyntaxNode | null): ModelicaFunctionApplicationExpressionSyntax | undefined {

        if (source == null || source.type != "function_application")
            return undefined;

        return new ModelicaFunctionApplicationExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "function_application")
            throw new Error(`Expected function_application, got ${this.source?.type}`);

        this.#functionReference = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "functionReference", "der", "initial", "pure"));
        this.#index = ModelicaExpressionSyntax.new(childForFieldName(this.source, "index"));

        this.#arguments = [];
        this.#namedArguments = [];

        let args = childForFieldName(this.source, "arguments");

        if (args != null) {

            for (let child of childrenForFieldName(childForFieldName(args, "arguments"), "argument")) {

                let argument = ModelicaExpressionSyntax.new(child);

                if (argument != null) {
                    this.#arguments.push(argument);
                } else {

                    argument = ModelicaFunctionPartialApplicationExpressionSyntax.new(child);

                    if (argument != null)
                        this.#arguments.push(argument);

                }

            }

            for (let child of childrenForFieldName(childForFieldName(args, "namedArguments"), "namedArgument")) {

                let namedArgument = ModelicaNamedArgumentSyntax.new(child);

                if (namedArgument != null)
                    this.#namedArguments.push(namedArgument);

            }

        }

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaLiteralExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    static override new(source?: SyntaxNode | null): ModelicaLiteralExpressionSyntax | undefined {

        switch (source?.type) {

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            default:
                return undefined;

        }

    }

    abstract get value(): any | undefined;

}

// DONE
export class ModelicaLogicalLiteralExpressionSyntax extends ModelicaLiteralExpressionSyntax {

    #value?: boolean;

    constructor(source?: SyntaxNode | null, value?: boolean) {
        super(source);
        this.#value = value;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitLogicalLiteralExpression(this, ...args);
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaBooleanObjectSymbol | undefined> {

        let classSymbol = await scope.resolve("Boolean", true);

        if (classSymbol instanceof ModelicaBooleanClassSymbol)
            return new ModelicaBooleanObjectSymbol(classSymbol, this.value ?? false);

    }

    static override new(source?: SyntaxNode | null): ModelicaLogicalLiteralExpressionSyntax | undefined {

        if (source == null || source.type != "logical_literal_expression")
            return undefined;

        return new ModelicaLogicalLiteralExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "logical_literal_expression")
            throw new Error(`Expected logical_literal_expression, got ${this.source?.type}`);

        this.#value = this.source?.text == "true";

        this.parsed = true;

    }

    override get value(): boolean | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class ModelicaStringLiteralExpressionSyntax extends ModelicaLiteralExpressionSyntax {

    #value?: string;

    constructor(source?: SyntaxNode | null, value?: string) {
        super(source);
        this.#value = value;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStringLiteralExpression(this, ...args);
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaStringObjectSymbol | undefined> {

        let classSymbol = await scope.resolve("String", true);

        if (classSymbol instanceof ModelicaStringClassSymbol)
            return new ModelicaStringObjectSymbol(classSymbol, this.value ?? "");

    }

    static override new(source?: SyntaxNode | null): ModelicaStringLiteralExpressionSyntax | undefined {

        if (source == null || source.type != "string_literal_expression")
            return undefined;

        return new ModelicaStringLiteralExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "string_literal_expression")
            throw new Error(`Expected string_literal_expression, got ${this.source?.type}`);

        this.#value = this.source.text.slice(1, this.source.text.length - 1);

        this.parsed = true;

    }

    override get value(): string | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export abstract class ModelicaUnsignedNumberLiteralExpressionSyntax extends ModelicaLiteralExpressionSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    abstract override evaluate(scope: ModelicaScope): Promise<ModelicaNumberObjectSymbol | undefined>;

    static override new(source?: SyntaxNode | null): ModelicaUnsignedNumberLiteralExpressionSyntax | undefined {

        switch (source?.type) {

            case "unsigned_integer_literal":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            default:
                return undefined;

        }

    }

    abstract get value(): number | undefined;

}

// DONE
export class ModelicaUnsignedIntegerLiteralExpressionSyntax extends ModelicaUnsignedNumberLiteralExpressionSyntax {

    #value?: number;

    constructor(source?: SyntaxNode | null, value?: number) {

        super(source);

        if (value != null)
            this.#value = value | 0;

    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitUnsignedIntegerLiteralExpression(this, ...args);
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaIntegerObjectSymbol | undefined> {

        let classSymbol = await scope.resolve("Integer", true);

        if (classSymbol instanceof ModelicaIntegerClassSymbol)
            return new ModelicaIntegerObjectSymbol(classSymbol, this.value ?? 0);

    }

    static override new(source?: SyntaxNode | null): ModelicaUnsignedIntegerLiteralExpressionSyntax | undefined {

        if (source == null || source.type != "unsigned_integer_literal_expression")
            return undefined;

        return new ModelicaUnsignedIntegerLiteralExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "unsigned_integer_literal_expression")
            throw new Error(`Expected unsigned_integer_literal_expression, got ${this.source?.type}`);

        this.#value = parseInt(this.source.text);

        this.parsed = true;

    }

    override get value(): number | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class ModelicaUnsignedRealLiteralExpressionSyntax extends ModelicaUnsignedNumberLiteralExpressionSyntax {

    #value?: number;

    constructor(source?: SyntaxNode | null, value?: number) {
        super(source);
        this.#value = value;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitUnsignedRealLiteralExpression(this, ...args);
    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaRealObjectSymbol | undefined> {

        let classSymbol = await scope.resolve("Real", true);

        if (classSymbol instanceof ModelicaRealClassSymbol)
            return new ModelicaRealObjectSymbol(classSymbol, this.value ?? 0);

    }

    static override new(source?: SyntaxNode | null): ModelicaUnsignedRealLiteralExpressionSyntax | undefined {

        if (source == null || source.type != "unsigned_real_literal_expression")
            return undefined;

        return new ModelicaUnsignedRealLiteralExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "unsigned_real_literal_expression")
            throw new Error(`Expected unsigned_real_literal_expression, got ${this.source?.type}`);

        this.#value = parseFloat(this.source.text);

        this.parsed = true;

    }

    override get value(): number | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class ModelicaParenthesizedExpressionSyntax extends ModelicaPrimaryExpressionSyntax {

    #expressions?: (ModelicaExpressionSyntax | null)[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitParenthesizedExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expressions != null)

                for (let expression of node.expressions)

                    if (expression != null)
                        yield expression;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {
        return undefined;
    }

    get expressions(): (ModelicaExpressionSyntax | null)[] | undefined {
        this.parse();
        return this.#expressions;
    }

    static override new(source?: SyntaxNode | null): ModelicaParenthesizedExpressionSyntax | undefined {

        if (source == null || source.type != "parenthesized_expression")
            return undefined;

        return new ModelicaParenthesizedExpressionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "parenthesized_expression")
            throw new Error(`Expected parenthesized_expression, got ${this.source?.type}`);

        this.#expressions = [];
        let comma = true;

        for (let child of childrenForFieldName(childForFieldName(this.source, "expressions"), "expression", "comma")) {

            if (child.type == ",") {

                if (comma == true)
                    this.#expressions.push(null);

                comma = true;

            } else {
                this.#expressions.push(ModelicaExpressionSyntax.new(child) ?? null);
                comma = false;
            }

        }

        if (comma == true)
            this.#expressions.push(null);

        this.parsed = true;

    }

}

// DONE
export class ModelicaUnaryExpressionSyntax extends ModelicaSimpleExpressionSyntax {

    #operand?: ModelicaSimpleExpressionSyntax;
    #operator?: ModelicaUnaryOperator;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitUnaryExpression(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.operand != null)
                yield node.operand;

        }();

    }

    override async evaluate(scope: ModelicaScope): Promise<ModelicaObjectSymbol | undefined> {

        let operand = await this.operand?.evaluate(scope);

        if (operand == null)
            return undefined;

        switch (this.operator) {

            case ModelicaUnaryOperator.LOGICAL_NOT: {

                if (operand instanceof ModelicaBooleanObjectSymbol)
                    return new ModelicaBooleanObjectSymbol(operand.type, !operand.value);

                return undefined;

            }

            case ModelicaUnaryOperator.MINUS: {

                if (operand instanceof ModelicaIntegerObjectSymbol)
                    return new ModelicaIntegerObjectSymbol(operand.type, -operand.value);

                if (operand instanceof ModelicaRealObjectSymbol)
                    return new ModelicaIntegerObjectSymbol(operand.type, -operand.value);

                return undefined;

            }

            case ModelicaUnaryOperator.PLUS: {

                if (operand instanceof ModelicaIntegerObjectSymbol)
                    return new ModelicaIntegerObjectSymbol(operand.type, +operand.value);

                if (operand instanceof ModelicaRealObjectSymbol)
                    return new ModelicaIntegerObjectSymbol(operand.type, +operand.value);

                return undefined;
            }

            default: {
                return undefined;
            }

        }

    }

    static override new(source?: SyntaxNode | null): ModelicaUnaryExpressionSyntax | undefined {

        if (source == null || source.type != "unary_expression")
            return undefined;

        return new ModelicaUnaryExpressionSyntax(source);

    }

    get operand(): ModelicaSimpleExpressionSyntax | undefined {
        this.parse();
        return this.#operand;
    }

    get operator(): ModelicaUnaryOperator | undefined {
        this.parse();
        return this.#operator;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "unary_expression")
            throw new Error(`Expected unary_expression, got ${this.source?.type}`);

        this.#operand = ModelicaSimpleExpressionSyntax.new(childForFieldName(this.source, "operand"));

        switch (childForFieldName(this.source, "operator")?.text) {

            case "not":
                this.#operator = ModelicaUnaryOperator.LOGICAL_NOT;
                break;

            case "-":
                this.#operator = ModelicaUnaryOperator.MINUS;
                break;

            case "+":
                this.#operator = ModelicaUnaryOperator.PLUS;
                break;

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaExternalClauseSyntax extends ModelicaSyntaxNode {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #externalFunction?: ModelicaExternalFunctionSyntax;
    #languageSpecification?: ModelicaLanguageSpecificationSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitExternalClause(this, ...args);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    get externalFunction(): ModelicaExternalFunctionSyntax | undefined {
        this.parse();
        return this.#externalFunction;
    }

    get languageSpecification(): ModelicaLanguageSpecificationSyntax | undefined {
        this.parse();
        return this.#languageSpecification;
    }

    static override new(source?: SyntaxNode | null): ModelicaExternalClauseSyntax | undefined {

        if (source == null || source.type != "external_clause")
            return undefined;

        return new ModelicaExternalClauseSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "external_clause")
            throw new Error(`Expected external_clause, got ${this.source?.type}`);

        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#externalFunction = ModelicaExternalFunctionSyntax.new(childForFieldName(this.source, "externalFunction"));
        this.#languageSpecification = ModelicaLanguageSpecificationSyntax.new(childForFieldName(this.source, "languageSpecification"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaExternalFunctionSyntax extends ModelicaSyntaxNode {

    #componentReference?: ModelicaComponentReferenceExpressionSyntax;
    #identifier?: ModelicaIdentifierSyntax;
    #expressions?: ModelicaExpressionSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitExternalFunction(this, ...args);
    }

    get componentReference(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#componentReference;
    }

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    get expressions(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#expressions;
    }

    static override new(source?: SyntaxNode | null): ModelicaExternalFunctionSyntax | undefined {

        if (source == null || source.type != "external_function")
            return undefined;

        return new ModelicaExternalFunctionSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "external_function")
            throw new Error(`Expected external_function, got ${this.source?.type}`);

        this.#componentReference = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "componentReference"));
        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));

        this.#expressions = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "expressions"), "expression") ?? []) {

            let expression = ModelicaExpressionSyntax.new(child);

            if (expression != null)
                this.#expressions.push(expression);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaForIndexSyntax extends ModelicaSyntaxNode {

    #expression?: ModelicaExpressionSyntax;
    #identifier?: ModelicaIdentifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitForIndex(this, ...args);
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    static override new(source?: SyntaxNode | null): ModelicaForIndexSyntax | undefined {

        if (source == null || source.type != "for_index")
            return undefined;

        return new ModelicaForIndexSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "for_index")
            throw new Error(`Expected for_index, got ${this.source?.type}`);

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));
        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaIdentifierSyntax extends ModelicaSyntaxNode {

    #value?: string;

    constructor(source?: SyntaxNode | null, value?: string) {

        super(source);

        if (value != null) {
            this.#value = value;
            this.parsed = true;
        }

    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitIdentifier(this, ...args);
    }

    static override new(source?: SyntaxNode | null, value?: string): ModelicaIdentifierSyntax | undefined {

        if (source == null || source.type != "IDENT") {

            if (source?.childCount == 0 && source.text != null)
                return new ModelicaIdentifierSyntax(source, source.text);

            return undefined;
        }

        return new ModelicaIdentifierSyntax(source, value);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "IDENT")
            throw new Error(`Expected IDENT, got ${this.source?.type}`);

        this.parsed = true;

    }

    override toString(): string | undefined {
        return this.value;
    }

    get value(): string | undefined {

        this.parse();

        if (this.#value != null)
            return this.#value;

        return this.source?.text;

    }

}

// DONE
export class ModelicaLanguageSpecificationSyntax extends ModelicaSyntaxNode {

    #value?: string;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitLanguageSpecification(this, ...args);
    }

    static override new(source?: SyntaxNode | null): ModelicaLanguageSpecificationSyntax | undefined {

        if (source == null || source.type != "language_specification")
            return undefined;

        return new ModelicaLanguageSpecificationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "language_specification")
            throw new Error(`Expected language_specification, got ${this.source?.type}`);

        this.#value = this.source.text.slice(1, this.source.text.length - 1);

        this.parsed = true;

    }

    get value(): string | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class ModelicaModificationSyntax extends ModelicaSyntaxNode {

    #classModification?: ModelicaClassModificationSyntax;
    #expression?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitModification(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classModification != null)
                yield node.classModification;

            if (node.expression != null)
                yield node.expression;

        }();

    }

    get classModification(): ModelicaClassModificationSyntax | undefined {
        this.parse();
        return this.#classModification;
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    static override new(source?: SyntaxNode | null): ModelicaModificationSyntax | undefined {

        if (source == null || source.type != "modification")
            return undefined;

        return new ModelicaModificationSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "modification")
            throw new Error(`Expected modification, got ${this.source?.type}`);

        this.#classModification = ModelicaClassModificationSyntax.new(childForFieldName(this.source, "classModification"));
        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));

        this.parsed = true;

    }

}

// DONE
export class ModelicaNameSyntax extends ModelicaSyntaxNode {

    #identifier?: ModelicaIdentifierSyntax;
    #qualifier?: ModelicaNameSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitName(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.identifier != null)
                yield node.identifier;

            if (node.qualifier != null)
                yield node.qualifier;

        }();

    }

    static override new(source?: SyntaxNode | null): ModelicaNameSyntax | undefined {

        if (source == null || source.type != "name")
            return undefined;

        return new ModelicaNameSyntax(source);

    }

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    get identifiers(): string[] | undefined {
        return this.toString()?.split(".").map(item => item.trim());
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "name")
            throw new Error(`Expected name, got ${this.source?.type}`);

        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));
        this.#qualifier = ModelicaNameSyntax.new(childForFieldName(this.source, "qualifier"));

        this.parsed = true;

    }

    get qualifier(): ModelicaNameSyntax | undefined {
        this.parse();
        return this.#qualifier;
    }

    override toString(): string | undefined {

        if (this.identifier == null || this.identifier.value == null)
            return undefined;

        if (this.qualifier != null)
            return this.qualifier.toString() + "." + this.identifier.value;

        return this.identifier.value;

    }

}

// DONE
export class ModelicaNamedArgumentSyntax extends ModelicaSyntaxNode {

    #expression?: ModelicaExpressionSyntax;
    #identifier?: ModelicaIdentifierSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitNamedArgument(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expression != null)
                yield node.expression;

            if (node.identifier != null)
                yield node.identifier;

        }();

    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get identifier(): ModelicaIdentifierSyntax | undefined {
        this.parse();
        return this.#identifier;
    }

    static override new(source?: SyntaxNode | null): ModelicaNamedArgumentSyntax | undefined {

        if (source == null || source.type != "named_argument")
            return undefined;

        return new ModelicaNamedArgumentSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "named_argument")
            throw new Error(`Expected named_argument, got ${this.source?.type}`);

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));
        this.#identifier = ModelicaIdentifierSyntax.new(childForFieldName(this.source, "identifier"));

        this.parsed = true;

    }

}

// DONE
export abstract class ModelicaStatementSyntax extends ModelicaSyntaxNode {

    #annotationClause?: ModelicaAnnotationClauseSyntax;
    #descriptionString?: ModelicaDescriptionStringSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    get annotationClause(): ModelicaAnnotationClauseSyntax | undefined {
        this.parse();
        return this.#annotationClause;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.annotationClause != null)
                yield node.annotationClause;

            if (node.descriptionString != null)
                yield node.descriptionString;

        }();

    }

    get descriptionString(): ModelicaDescriptionStringSyntax | undefined {
        this.parse();
        return this.#descriptionString;
    }

    abstract execute(scope: ModelicaScope): Promise<void>;

    static override new(source?: SyntaxNode | null): ModelicaStatementSyntax | undefined {

        switch (source?.type) {

            case "assignment_statement":
                return ModelicaAssignmentStatementSyntax.new(source);

            case "break_statement":
                return ModelicaBreakStatementSyntax.new(source);

            case "if_statement":
                return ModelicaIfStatementSyntax.new(source);

            case "for_statement":
                return ModelicaForStatementSyntax.new(source);

            case "function_application_statement":
                return ModelicaFunctionApplicationStatementSyntax.new(source);

            case "multiple_output_function_application_statement":
                return ModelicaMultipleOutputFunctionApplicationStatementSyntax.new(source);

            case "return_statement":
                return ModelicaReturnStatementSyntax.new(source);

            case "when_statement":
                return ModelicaWhenStatementSyntax.new(source);

            case "while_statement":
                return ModelicaWhileStatementSyntax.new(source);

            default:
                return undefined;

        }

    }

    override parse(): void {
        this.#annotationClause = ModelicaAnnotationClauseSyntax.new(childForFieldName(this.source, "annotationClause"));
        this.#descriptionString = ModelicaDescriptionStringSyntax.new(childForFieldName(this.source, "descriptionString"));
    }

}

// DONE
export class ModelicaAssignmentStatementSyntax extends ModelicaStatementSyntax {

    #sourceExpression?: ModelicaExpressionSyntax;
    #targetExpression?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAssignmentStatement(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.sourceExpression != null)
                yield node.sourceExpression;

            if (node.targetExpression != null)
                yield node.targetExpression;

        }();

    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaAssignmentStatementSyntax | undefined {

        if (source == null || source.type != "assignment_statement")
            return undefined;

        return new ModelicaAssignmentStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "assignment_statement")
            throw new Error(`Expected assignment_statement, got ${this.source?.type}`);

        super.parse();

        this.#sourceExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "sourceExpression"));
        this.#targetExpression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "targetExpression"));

        this.parsed = true;

    }

    get sourceExpression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#sourceExpression;
    }

    get targetExpression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#targetExpression;
    }

}

// DONE
export class ModelicaBreakStatementSyntax extends ModelicaStatementSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitBreakStatement(this, ...args);
    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaBreakStatementSyntax | undefined {

        if (source == null || source.type != "break_statement")
            return undefined;

        return new ModelicaBreakStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "return_statement")
            throw new Error(`Expected return_statement, got ${this.source?.type}`);

        super.parse();

        this.parsed = true;

    }

}

// DONE
export class ModelicaIfStatementSyntax extends ModelicaStatementSyntax {

    #condition?: ModelicaExpressionSyntax;
    #elseIfClauses?: ModelicaElseIfStatementClauseSyntax[];
    #elseStatements?: ModelicaStatementSyntax[];
    #thenStatements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitIfStatement(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.elseIfClauses != null)
                yield* node.elseIfClauses;

            if (node.elseStatements != null)
                yield* node.elseStatements;

            if (node.thenStatements != null)
                yield* node.thenStatements;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get elseIfClauses(): ModelicaElseIfStatementClauseSyntax[] | undefined {
        this.parse();
        return this.#elseIfClauses;
    }

    get elseStatements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#elseStatements;
    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaIfStatementSyntax | undefined {

        if (source == null || source.type != "if_statement")
            return undefined;

        return new ModelicaIfStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "if_statement")
            throw new Error(`Expected if_statement, got ${this.source?.type}`);

        super.parse();

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#elseIfClauses = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseIfClauses"), "elseIfClause")) {

            let elseIfClause = ModelicaElseIfStatementClauseSyntax.new(child);

            if (elseIfClause != null)
                this.#elseIfClauses.push(elseIfClause);

        }

        this.#elseStatements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseStatements"), "elseStatement")) {

            let elseStatement = ModelicaStatementSyntax.new(child);

            if (elseStatement != null)
                this.#elseStatements.push(elseStatement);

        }

        this.#thenStatements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "thenStatements"), "thenStatement")) {

            let thenStatement = ModelicaStatementSyntax.new(child);

            if (thenStatement != null)
                this.#thenStatements.push(thenStatement);

        }

        this.parsed = true;

    }

    get thenStatements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#thenStatements;
    }

}

// DONE
export class ModelicaForStatementSyntax extends ModelicaStatementSyntax {

    #indices?: ModelicaForIndexSyntax[];
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitForStatement(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.indices != null)
                yield* node.indices;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    static override new(source?: SyntaxNode | null): ModelicaForStatementSyntax | undefined {

        if (source == null || source.type != "for_statement")
            return undefined;

        return new ModelicaForStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "for_statement")
            throw new Error(`Expected for_statement, got ${this.source?.type}`);

        super.parse();

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// DONE
export class ModelicaFunctionApplicationStatementSyntax extends ModelicaStatementSyntax {

    #arguments?: ModelicaExpressionSyntax[];
    #expression?: ModelicaExpressionSyntax;
    #functionReference?: ModelicaComponentReferenceExpressionSyntax;
    #indices?: ModelicaForIndexSyntax[];
    #namedArguments?: ModelicaNamedArgumentSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFunctionApplicationStatement(this, ...args);
    }

    get arguments(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

            if (node.expression != null)
                yield node.expression;

            if (node.functionReference != null)
                yield node.functionReference;

            if (node.indices != null)
                yield* node.indices;

            if (node.namedArguments != null)
                yield* node.namedArguments;

        }();

    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get functionReference(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#functionReference;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    get namedArguments(): ModelicaNamedArgumentSyntax[] | undefined {
        this.parse();
        return this.#namedArguments;
    }

    static override new(source?: SyntaxNode | null): ModelicaFunctionApplicationStatementSyntax | undefined {

        if (source == null || source.type != "function_application_statement")
            return undefined;

        return new ModelicaFunctionApplicationStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "function_application_statement")
            throw new Error(`Expected function_application_statement, got ${this.source?.type}`);

        super.parse();

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));
        this.#functionReference = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "functionReference"));
        this.#arguments = [];
        this.#namedArguments = [];

        let args = childForFieldName(this.source, "arguments");

        if (args != null) {

            for (let child of childrenForFieldName(childForFieldName(args, "arguments"), "argument")) {

                let argument = ModelicaExpressionSyntax.new(child);

                if (argument != null) {
                    this.#arguments.push(argument);
                } else {

                    argument = ModelicaFunctionPartialApplicationExpressionSyntax.new(child);

                    if (argument != null)
                        this.#arguments.push(argument);

                }

            }

            for (let child of childrenForFieldName(childForFieldName(args, "namedArguments"), "namedArgument")) {

                let namedArgument = ModelicaNamedArgumentSyntax.new(child);

                if (namedArgument != null)
                    this.#namedArguments.push(namedArgument);

            }

        }

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.parsed = true;

    }

}

// DONE
export class ModelicaMultipleOutputFunctionApplicationStatementSyntax extends ModelicaStatementSyntax {

    #arguments?: ModelicaExpressionSyntax[];
    #expression?: ModelicaExpressionSyntax;
    #functionReference?: ModelicaComponentReferenceExpressionSyntax;
    #indices?: ModelicaForIndexSyntax[];
    #namedArguments?: ModelicaNamedArgumentSyntax[];
    #targetExpression?: ModelicaParenthesizedExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitMultipleOutputFunctionApplicationStatement(this, ...args);
    }

    get arguments(): ModelicaExpressionSyntax[] | undefined {
        this.parse();
        return this.#arguments;
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.arguments != null)
                yield* node.arguments;

            if (node.expression != null)
                yield node.expression;

            if (node.functionReference != null)
                yield node.functionReference;

            if (node.indices != null)
                yield* node.indices;

            if (node.namedArguments != null)
                yield* node.namedArguments;

        }();

    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    get functionReference(): ModelicaComponentReferenceExpressionSyntax | undefined {
        this.parse();
        return this.#functionReference;
    }

    get indices(): ModelicaForIndexSyntax[] | undefined {
        this.parse();
        return this.#indices;
    }

    get namedArguments(): ModelicaNamedArgumentSyntax[] | undefined {
        this.parse();
        return this.#namedArguments;
    }

    static override new(source?: SyntaxNode | null): ModelicaMultipleOutputFunctionApplicationStatementSyntax | undefined {

        if (source == null || source.type != "multiple_output_function_application_statement")
            return undefined;

        return new ModelicaMultipleOutputFunctionApplicationStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "multiple_output_function_application_statement")
            throw new Error(`Expected multiple_output_function_application_statement, got ${this.source?.type}`);

        super.parse();

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));
        this.#functionReference = ModelicaComponentReferenceExpressionSyntax.new(childForFieldName(this.source, "functionReference"));
        this.#arguments = [];
        this.#namedArguments = [];

        let args = childForFieldName(this.source, "arguments");

        if (args != null) {

            for (let child of childrenForFieldName(childForFieldName(args, "arguments"), "argument")) {

                let argument = ModelicaExpressionSyntax.new(child);

                if (argument != null) {
                    this.#arguments.push(argument);
                } else {

                    argument = ModelicaFunctionPartialApplicationExpressionSyntax.new(child);

                    if (argument != null)
                        this.#arguments.push(argument);

                }

            }

            for (let child of childrenForFieldName(childForFieldName(args, "namedArguments"), "namedArgument")) {

                let namedArgument = ModelicaNamedArgumentSyntax.new(child);

                if (namedArgument != null)
                    this.#namedArguments.push(namedArgument);

            }

        }

        this.#indices = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "indices"), "index")) {

            let index = ModelicaForIndexSyntax.new(child);

            if (index != null)
                this.#indices.push(index);

        }

        this.#targetExpression = ModelicaParenthesizedExpressionSyntax.new(childForFieldName(this.source, "targetExpression"));

        this.parsed = true;

    }

    get targetExpression(): ModelicaParenthesizedExpressionSyntax | undefined {
        this.parse();
        return this.#targetExpression;
    }

}

// DONE
export class ModelicaReturnStatementSyntax extends ModelicaStatementSyntax {

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitReturnStatement(this, ...args);
    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaReturnStatementSyntax | undefined {

        if (source == null || source.type != "return_statement")
            return undefined;

        return new ModelicaReturnStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "return_statement")
            throw new Error(`Expected return_statement, got ${this.source?.type}`);

        super.parse();

        this.parsed = true;

    }

}

// DONE
export class ModelicaWhenStatementSyntax extends ModelicaStatementSyntax {

    #condition?: ModelicaExpressionSyntax;
    #elseWhenClauses?: ModelicaElseWhenStatementClauseSyntax[];
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitWhenStatement(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.elseWhenClauses != null)
                yield* node.elseWhenClauses;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    get elseWhenClauses(): ModelicaElseWhenStatementClauseSyntax[] | undefined {
        this.parse();
        return this.#elseWhenClauses;
    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaWhenStatementSyntax | undefined {

        if (source == null || source.type != "when_statement")
            return undefined;

        return new ModelicaWhenStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "when_statement")
            throw new Error(`Expected when_statement, got ${this.source?.type}`);

        super.parse();

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#elseWhenClauses = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "elseWhenClauses"), "elseWhenClause")) {

            let elseWhenClause = ModelicaElseWhenStatementClauseSyntax.new(child);

            if (elseWhenClause != null)
                this.#elseWhenClauses.push(elseWhenClause);

        }

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// DONE
export class ModelicaWhileStatementSyntax extends ModelicaStatementSyntax {

    #condition?: ModelicaExpressionSyntax;
    #statements?: ModelicaStatementSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitWhileStatement(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.condition != null)
                yield node.condition;

            if (node.statements != null)
                yield* node.statements;

        }();

    }

    get condition(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#condition;
    }

    override async execute(scope: ModelicaScope): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static override new(source?: SyntaxNode | null): ModelicaWhileStatementSyntax | undefined {

        if (source == null || source.type != "while_statement")
            return undefined;

        return new ModelicaWhileStatementSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "while_statement")
            throw new Error(`Expected while_statement, got ${this.source?.type}`);

        super.parse();

        this.#condition = ModelicaExpressionSyntax.new(childForFieldName(this.source, "condition"));

        this.#statements = [];

        for (let child of childrenForFieldName(childForFieldName(this.source, "statements"), "statement")) {

            let statement = ModelicaStatementSyntax.new(child);

            if (statement != null)
                this.#statements.push(statement);

        }

        this.parsed = true;

    }

    get statements(): ModelicaStatementSyntax[] | undefined {
        this.parse();
        return this.#statements;
    }

}

// TODO
export class ModelicaStoredDefinitionSyntax extends ModelicaSyntaxNode {

    #classDefinitions?: ModelicaClassDefinitionSyntax[];
    #filePath?: string[];
    #library?: ModelicaLibrary;
    #within?: ModelicaNameSyntax;

    constructor(source?: SyntaxNode | null, library?: ModelicaLibrary, filePath?: string[]) {
        super(source);
        this.#library = library;
        this.#filePath = filePath;
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStoredDefinition(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.classDefinitions != null)
                yield* node.classDefinitions;

            if (node.within != null)
                yield node.within;

        }();

    }

    get classDefinitions(): ModelicaClassDefinitionSyntax[] | undefined {
        this.parse();
        return this.#classDefinitions;
    }

    get flattenedClassDefinitions(): IterableIterator<ModelicaClassDefinitionSyntax> {

        let node = this;

        return function* () {

            for (let classDefinition of node.classDefinitions ?? []) {
                yield classDefinition;
                yield* classDefinition.flattenedClassDefinitions;
            }

        }();

    }

    async instantiate(parent: ModelicaScope, modificationEnvironment?: ModelicaModificationEnvironment): Promise<ModelicaClassSymbol[]> {

        // FIXME: add namespace if within parent does not exists, support updates
        //let within = await parent.resolve(this.within);

        //if (within instanceof ModelicaClassSymbol)
        //parent = within;

        let classSymbols: ModelicaClassSymbol[] = [];

        for (let classDefinition of this.classDefinitions ?? [])
            classSymbols.push(await classDefinition.instantiate(parent, modificationEnvironment));

        return classSymbols;

    }

    static override new(source?: SyntaxNode | null, library?: ModelicaLibrary, filePath?: string[]): ModelicaStoredDefinitionSyntax | undefined {

        if (source == null || source.type != "stored_definitions")
            return undefined;

        return new ModelicaStoredDefinitionSyntax(source, library, filePath);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "stored_definitions")
            throw new Error(`Expected stored_definitions, got ${this.source?.type}`);

        this.#classDefinitions = [];

        // TODO: structured entity should not have more than one class definition

        for (let storedDefinition of childrenForFieldName(this.source, "storedDefinitions")) {

            let classDefinition = ModelicaClassDefinitionSyntax.new(childForFieldName(storedDefinition, "classDefinition"), {
                final: childForFieldName(storedDefinition, "final")
            }, this.#library, this.#filePath);

            if (classDefinition != null)
                this.#classDefinitions.push(classDefinition);

        }

        this.#within = ModelicaNameSyntax.new(childForFieldName(this.source, "within"));

        this.parsed = true;

    }

    get within(): ModelicaNameSyntax | undefined {
        this.parse();
        return this.#within;
    }

}

// DONE
export class ModelicaSubscriptSyntax extends ModelicaSyntaxNode {

    #expression?: ModelicaExpressionSyntax;

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitSubscript(this, ...args);
    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.expression != null)
                yield node.expression;

        }();

    }

    get expression(): ModelicaExpressionSyntax | undefined {
        this.parse();
        return this.#expression;
    }

    static override new(source?: SyntaxNode | null): ModelicaSubscriptSyntax | undefined {

        if (source == null || source.type != "subscript")
            return undefined;

        return new ModelicaSubscriptSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "subscript")
            throw new Error(`Expected subscript, got ${this.source?.type}`);

        this.#expression = ModelicaExpressionSyntax.new(childForFieldName(this.source, "expression"));

        this.parsed = true;

    }

    override toString(): string {

        let string = this.expression?.toString();

        if (string != null)
            return "[" + string + "]";

        return "[:]";

    }

}

// DONE
export class ModelicaTypeSpecifierSyntax extends ModelicaSyntaxNode {

    #global?: boolean;
    #name?: ModelicaNameSyntax;
    #subscripts?: ModelicaSubscriptSyntax[];

    constructor(source?: SyntaxNode | null) {
        super(source);
    }

    override accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any {
        return visitor.visitTypeSpecifier(this, ...args);
    }

    array(subscripts?: ModelicaSubscriptSyntax[]): ModelicaTypeSpecifierSyntax {

        if (subscripts == null || subscripts.length == 0)
            return this;

        let typeSpecifier = new ModelicaTypeSpecifierSyntax(this.source);
        typeSpecifier.#global = this.global;
        typeSpecifier.#name = this.name;
        typeSpecifier.#subscripts = [...this.subscripts ?? [], ...subscripts];
        return typeSpecifier;

    }

    override get children(): IterableIterator<ModelicaSyntaxNode> {

        let node = this;
        let superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.subscripts != null)
                yield* node.subscripts;

        }();

    }

    get global(): boolean {
        this.parse();
        return this.#global ?? false;
    }

    get identifiers(): string[] | undefined {
        return this.name?.identifiers;
    }

    get name(): ModelicaNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(source?: SyntaxNode | null): ModelicaTypeSpecifierSyntax | undefined {

        if (source == null || source.type != "type_specifier")
            return undefined;

        return new ModelicaTypeSpecifierSyntax(source);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.source == null || this.source.type != "type_specifier")
            throw new Error(`Expected type_specifier, got ${this.source?.type}`);

        this.#global = childForFieldName(this.source, "global") != null;
        this.#name = ModelicaNameSyntax.new(childForFieldName(this.source, "name"));

        this.parsed = true;

    }

    get subscripts(): ModelicaSubscriptSyntax[] | undefined {
        this.parse();
        return this.#subscripts;
    }

    override toString(): string | undefined {

        let string = "";

        if (this.global == true)
            string += ".";

        if (this.name != null)
            string += this.name.toString();
        else
            return undefined;

        if (this.subscripts != null)
            for (let subscript of this.subscripts)
                string += subscript.toString();

        return string;

    }

}

// DONE
export abstract class ModelicaSyntaxVisitor {

    visitAlgorithmSection(node: ModelicaAlgorithmSectionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAnnotationClause(node: ModelicaAnnotationClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitArrayComprehensionExpression(node: ModelicaArrayComprehensionExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitArrayConcatenationExpression(node: ModelicaArrayConcatenationExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitArrayConstructorExpression(node: ModelicaArrayConstructorExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAssignmentStatement(node: ModelicaAssignmentStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitBinaryExpression(node: ModelicaBinaryExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitBreakStatement(node: ModelicaBreakStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitClassDefinition(node: ModelicaClassDefinitionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitClassModification(node: ModelicaClassModificationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitClassRedeclaration(node: ModelicaClassRedeclarationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitComponentDeclaration(node: ModelicaComponentDeclarationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitComponentRedeclaration(node: ModelicaComponentRedeclarationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitComponentReferenceExpression(node: ModelicaComponentReferenceExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConnectClause(node: ModelicaConnectClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConstrainingClause(node: ModelicaConstrainingClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDerivativeClassSpecifier(node: ModelicaDerivativeClassSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionString(node: ModelicaDescriptionStringSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElementModification(node: ModelicaElementModificationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElseIfEquationClause(node: ModelicaElseIfEquationClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElseIfStatementClause(node: ModelicaElseIfStatementClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElseWhenEquationClause(node: ModelicaElseWhenEquationClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElseIfExpressionClause(node: ModelicaElseIfExpressionClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitElseWhenStatementClause(node: ModelicaElseWhenStatementClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEndExpression(node: ModelicaEndExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEnumerationClassSpecifier(node: ModelicaEnumerationClassSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEnumerationLiteral(node: ModelicaEnumerationLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEquationSection(node: ModelicaEquationSectionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitExtendsClause(node: ModelicaExtendsClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitExtendsClassSpecifier(node: ModelicaExtendsClassSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitExternalClause(node: ModelicaExternalClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitExternalFunction(node: ModelicaExternalFunctionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitForEquation(node: ModelicaForEquationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitForIndex(node: ModelicaForIndexSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitForStatement(node: ModelicaForStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFunctionApplicationEquation(node: ModelicaFunctionApplicationEquationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFunctionApplicationExpression(node: ModelicaFunctionApplicationExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFunctionApplicationStatement(node: ModelicaFunctionApplicationStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFunctionPartialApplicationExpression(node: ModelicaFunctionPartialApplicationExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitIdentifier(node: ModelicaIdentifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitIfEquation(node: ModelicaIfEquationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitIfExpression(node: ModelicaIfExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitIfStatement(node: ModelicaIfStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitImportClause(node: ModelicaImportClauseSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitLanguageSpecification(node: ModelicaLanguageSpecificationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitLogicalLiteralExpression(node: ModelicaLogicalLiteralExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitLongClassSpecifier(node: ModelicaLongClassSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitModification(node: ModelicaModificationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitMultipleOutputFunctionApplicationStatement(node: ModelicaMultipleOutputFunctionApplicationStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitName(node: ModelicaNameSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitNamedArgument(node: ModelicaNamedArgumentSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitParenthesizedExpression(node: ModelicaParenthesizedExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRangeExpression(node: ModelicaRangeExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitReturnStatement(node: ModelicaReturnStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitShortClassDefinition(node: ModelicaShortClassDefinitionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitShortClassSpecifier(node: ModelicaShortClassSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitSimpleEquation(node: ModelicaSimpleEquationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStoredDefinition(node: ModelicaStoredDefinitionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStringLiteralExpression(node: ModelicaStringLiteralExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitSubscript(node: ModelicaSubscriptSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitTypeSpecifier(node: ModelicaTypeSpecifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitUnaryExpression(node: ModelicaUnaryExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitUnsignedIntegerLiteralExpression(node: ModelicaUnsignedIntegerLiteralExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitUnsignedRealLiteralExpression(node: ModelicaUnsignedRealLiteralExpressionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitWhenEquation(node: ModelicaWhenEquationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitWhenStatement(node: ModelicaWhenStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitWhileStatement(node: ModelicaWhileStatementSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

}

// DONE
export enum ModelicaBasePrefix {
    INPUT = "input",
    OUTPUT = "output",
}

// DONE
export enum ModelicaBinaryOperator {
    ADD = "+",
    DIVIDE = "/",
    ELEMENTWISE_ADD = ".+",
    ELEMENTWISE_DIVIDE = "./",
    ELEMENTWISE_EXPONENTIATE = ".^",
    ELEMENTWISE_MULTIPLY = ".*",
    ELEMENTWISE_SUBTRACT = ".-",
    EQUALITY = "==",
    EXPONENTIATE = "^",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    INEQUALITY = "<>",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    LOGICAL_AND = "and",
    LOGICAL_OR = "or",
    MULTIPLY = "*",
    SUBTRACT = "-"
}

// DONE
export enum ModelicaClassRestriction {
    BLOCK = "block",
    CLASS = "class",
    CONNECTOR = "connector",
    FUNCTION = "function",
    MODEL = "model",
    OPERATOR = "operator",
    PACKAGE = "package",
    RECORD = "record",
    TYPE = "type"
}

// DONE
export enum ModelicaUnaryOperator {
    LOGICAL_NOT = "not",
    MINUS = "-",
    PLUS = "+"
}

// DONE
export enum ModelicaVisibility {
    PROTECTED = "protected",
    PUBLIC = "public"
}

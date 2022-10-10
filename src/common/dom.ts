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

import { BufferedPrintWriter, PrintWriter } from './writer.js';

export abstract class XmlNode {

	#parent?: XmlElement;

	constructor(parent?: XmlElement) {
		this.#parent = parent;
	}

	get parent(): XmlElement | undefined {
		return this.#parent;
	}

	abstract serialize(printWriter: PrintWriter): void;

}

export class XmlElement extends XmlNode {

	#attributes: Map<string, any> = new Map<string, any>();
	#children: XmlNode[] = [];
	#styles: Map<string, any> = new Map<string, any>();
	#type: string;

	constructor(type: string, parent?: XmlElement) {
		super(parent);
		this.#type = type;
	}

	append(type: string): XmlElement {
		let element = new XmlElement(type, this);
		this.#children.push(element);
		return element;
	}

	appendText(value: any): XmlText {
		let text = new XmlText(String(value), this);
		this.#children.push(text);
		return text;
	}

	attr(name: string): string | undefined
	attr(name: string, value: any): XmlElement
	attr(name: string, value?: any): XmlElement | string | undefined {
		if (value == null)
			return this.#attributes.get(name);
		this.#attributes.set(name, value);
		return this;
	}

	get attributes(): Map<string, any> {
		return this.#attributes;
	}

	get children(): XmlNode[] {
		return this.#children;
	}

	override serialize(printWriter: PrintWriter): void {
		printWriter.print("<" + this.#type);
		for (let attribute of this.#attributes.entries())
			printWriter.print(` ${attribute[0]}="${attribute[1]}"`);
		if (this.#styles.size > 0) {
			printWriter.print(` style="`);
			for (let style of this.#styles.entries())
				printWriter.print(` ${style[0]}:${style[1]};`);
			printWriter.print(`"`);
		}
		printWriter.print(">");
		for (let child of this.#children)
			child.serialize(printWriter);
		printWriter.print("</" + this.#type + ">");
	}

	style(name: string): string | undefined
	style(name: string, value: any): XmlElement
	style(name: string, value?: string): XmlElement | string | undefined {
		if (value == null)
			return this.#styles.get(name);
		this.#styles.set(name, value);
		return this;
	}

	get styles(): Map<string, any> {
		return this.#styles;
	}

	override toString(): string {
		let printWriter = new BufferedPrintWriter();
		this.serialize(printWriter);
		return printWriter.toString();
	}

}

export class XmlText extends XmlNode {

	#value: string;

	constructor(value: string, parent?: XmlElement) {
		super(parent);
		this.#value = value;
	}

	override serialize(printWriter: PrintWriter): void {
		printWriter.print(this.#value);
	}

	get value(): string {
		return this.#value;
	}

	set value(value: string) {
		this.#value = value;
	}

}

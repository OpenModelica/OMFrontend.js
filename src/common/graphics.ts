/*
 * OMFrontend.js
 * Copyright (C) 2021-2022 Perpetual Labs, Ltd.
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

import { ModelicaClassSymbol, ModelicaComponentSymbol } from "./symbols.js";
import { ModelicaClassRestriction } from "./syntax.js";
import { XmlElement } from "./dom.js";

function computeExtent(extent?: any, coordinateSystem?: any, origin?: any, rotation?: any): [[number, number], [number, number]] {

    let cextent = coordinateSystem?.extent;

    let xmin = Math.min(cextent?.[0]?.[0] ?? -100, cextent?.[1]?.[0] ?? 100);
    let ymax = Math.max(cextent?.[1]?.[1] ?? 100, cextent?.[0]?.[1] ?? -100);

    let x0 = origin?.[0] ?? 0;
    let y0 = origin?.[1] ?? 0;
    let r = rotation ?? 0;

    return [
        computePoint(extent[0]?.[0] ?? 0, extent[0]?.[1] ?? 0, x0, y0, xmin, ymax, r),
        computePoint(extent[1]?.[0] ?? 0, extent[1]?.[1] ?? 0, x0, y0, xmin, ymax, r)
    ];

}

function computeFillPattern(defs: XmlElement, graphic: any): string {

    let id = defs.children.length;

    let fillColor = graphic.fillColor;
    let fillPattern = graphic.fillPattern;
    let lineColor = graphic.lineColor;
    let lineThickness = graphic.lineThickness ?? 0.25;

    switch (fillPattern) {

        case 1: // Solid
            return `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`;

        case 2: { // Horizontal

            let pattern = defs.append("pattern")
                .attr("height", 5)
                .attr("id", "Horizontal" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 5)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M0,0 L5,0")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#Horizontal${id})`;

        }

        case 3: { // Vertical

            let pattern = defs.append("pattern")
                .attr("height", 5)
                .attr("id", "Vertical" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 5)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M0,0 L0,5")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#Vertical${id})`;

        }

        case 4: { // Cross

            let pattern = defs.append("pattern")
                .attr("height", 5)
                .attr("id", "Cross" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 5)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 5)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M0,0 L5,0")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M0,0 L0,5")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#Cross${id})`;

        }

        case 5: { // Forward

            let pattern = defs.append("pattern")
                .attr("height", 7)
                .attr("id", "Forward" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 7)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 7)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 7)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M0,0 L7,7")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M6,-1 l3,3")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M-1,6 l3,3")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#Forward${id})`;

        }

        case 6: { // Backward

            let pattern = defs.append("pattern")
                .attr("height", 7)
                .attr("id", "Backward" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 7)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 7)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 7)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M7,0 l-7,7")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M1,-1 l-7,7")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M8,6 l-7,7")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#Backward${id})`;

        }

        case 7: { // CrossDiag

            let pattern = defs.append("pattern")
                .attr("height", 8)
                .attr("id", "CrossDiag" + id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 8)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("rect")
                .attr("height", 8)
                .attr("fill", `rgb(${fillColor?.[0] ?? 0},${fillColor?.[1] ?? 0},${fillColor?.[2] ?? 0})`)
                .attr("width", 8)
                .attr("x", 0)
                .attr("y", 0);

            pattern.append("path")
                .attr("d", "M0,0 l8,8")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            pattern.append("path")
                .attr("d", "M8,0 l-8,8")
                .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);

            return `url(#CrossDiag${id})`;

        }

        case 8: { // HorizontalCylinder

            let gradient = defs.append("linearGradient")
                .attr("id", "HorizontalCylinder" + id)
                .attr("x1", "0%")
                .attr("x2", "0%")
                .attr("y1", "0%")
                .attr("y2", "100%");

            let stops = [
                [0, 0],
                [0.3, 1],
                [0.7, 1],
                [1, 0]
            ];

            for (let stop of stops) {

                let color = getGradientColor(stop[1], lineColor, fillColor, 1);

                gradient.append("stop")
                    .attr("offset", stop[0])
                    .attr("stop-color", `rgb(${color[0]},${color[1]},${color[2]})`)
                    .attr("stop-opacity", 1);

            }

            return `url(#HorizontalCylinder${id})`;

        }

        case 9: { // VerticalCylinder

            let gradient = defs.append("linearGradient")
                .attr("id", "VerticalCylinder" + id)
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%");

            let stops = [
                [0, 0],
                [0.3, 1],
                [0.7, 1],
                [1, 0]
            ];

            for (let stop of stops) {

                let color = getGradientColor(stop[1], lineColor, fillColor, 1);

                gradient.append("stop")
                    .attr("offset", stop[0])
                    .attr("stop-color", `rgb(${color[0]},${color[1]},${color[2]})`)
                    .attr("stop-opacity", 1);

            }

            return `url(#VerticalCylinder${id})`;

        }

        case 10: { // Sphere

            let gradient;
            let stops;

            if (graphic["@type"] == "Ellipse") {

                gradient = defs.append("radialGradient")
                    .attr("id", "Sphere" + id)
                    .attr("cx", "50%")
                    .attr("cy", "50%")
                    .attr("fx", "50%")
                    .attr("fy", "50%")
                    .attr("r", "55%");

                stops = [
                    [0, 10],
                    [0.45, 8],
                    [0.7, 6],
                    [1, 0]
                ];

            } else {

                gradient = defs.append("radialGradient")
                    .attr("id", "Sphere" + id)
                    .attr("cx", "50%")
                    .attr("cy", "50%")
                    .attr("fx", "50%")
                    .attr("fy", "50%")
                    .attr("r", "0.9");

                stops = [
                    [0, 1],
                    [1, 0]
                ];

            }

            for (let stop of stops) {

                let color = getGradientColor(stop[1], lineColor, fillColor, 1);

                gradient.append("stop")
                    .attr("offset", stop[0])
                    .attr("stop-color", `rgb(${color[0]},${color[1]},${color[2]})`)
                    .attr("stop-opacity", 1);

            }

            return `url(#Sphere${id})`;

        }

        case 0: // None
        default: {

            if (graphic["@type"] == "Text")
                return `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`;

            return "none";

        }

    }

}

function computeLinePattern(linePattern: number, lineThickness: number): string | null {

    let dash = 16 * lineThickness;
    let dot = 4 * lineThickness;
    let space = 8 * lineThickness;

    switch (linePattern) {

        case 1: // Solid
            return null;

        case 2: // Dash
            return `${dash} ${space}`;

        case 3: // Dot
            return `${dot} ${space}`;

        case 4: // DashDot
            return `${dash} ${space} ${dot} ${space}`;

        case 5: // DashDotDot
            return `${dash} ${space} ${dot} ${space} ${dot} ${space}`;

        case 0: // None
        default:
            return null;

    }

}

function computeArrow(defs: XmlElement, arrow: number, arrowSize: number, lineThickness: number, lineColor?: any[]): string {

    let id = defs.children.length;

    switch (Math.abs(arrow)) {

        case 1: { // Open

            let marker = defs.append("marker")
                .attr("id", "Marker" + id)
                .attr("orient", "auto")
                .attr("overflow", "visible")
                .attr("viewBox", "0 0 3 3")
                .attr("markerHeight", `${arrowSize}`)
                .attr("markerUnits", "userSpaceOnUse")
                .attr("markerWidth", `${arrowSize}`)
                .attr("refY", 1.5);

            if (arrow > 0) {
                marker.attr("refX", 0).append("path")
                    .attr("d", "M 3 2.5 L 0 1.5 L 3 0.5")
                    .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`)
                    .attr("stroke-width", `${lineThickness}mm`)
                    .attr("vector-effect", "non-scaling-stroke")
                    .attr("fill", "none");
            } else {
                marker.attr("refX", 3).append("path")
                    .attr("d", "M 0 2.5 L 3 1.5 L 0 0.5")
                    .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`)
                    .attr("stroke-width", `${lineThickness}mm`)
                    .attr("vector-effect", "non-scaling-stroke")
                    .attr("fill", "none");
            }

            break;

        }

        case 3: { // Half

            let marker = defs.append("marker")
                .attr("id", "Marker" + id)
                .attr("orient", "auto")
                .attr("overflow", "visible")
                .attr("viewBox", "0 0 3 3")
                .attr("markerHeight", `${arrowSize}`)
                .attr("markerUnits", "userSpaceOnUse")
                .attr("markerWidth", `${arrowSize}`)
                .attr("refY", 1.5);

            if (arrow > 0) {
                marker.attr("refX", 0).append("path")
                    .attr("d", "M 3 2.5 L 0 1.5 L 3 1.5")
                    .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`)
                    .attr("stroke-width", `${lineThickness}mm`)
                    .attr("vector-effect", "non-scaling-stroke")
                    .attr("fill", "none");
            } else {
                marker.attr("refX", 3).append("path")
                    .attr("d", "M 0 2.5 L 3 1.5 L 0 1.5")
                    .attr("stroke", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`)
                    .attr("stroke-width", `${lineThickness}mm`)
                    .attr("vector-effect", "non-scaling-stroke")
                    .attr("fill", "none");
            }

            break;

        }

        case 2: { // Filled

            let marker = defs.append("marker")
                .attr("id", "Marker" + id)
                .attr("orient", "auto")
                .attr("overflow", "visible")
                .attr("viewBox", "0 0 3 3")
                .attr("markerHeight", `${arrowSize}`)
                .attr("markerUnits", "userSpaceOnUse")
                .attr("markerWidth", `${arrowSize}`)
                .attr("refY", 1.5);

            if (arrow > 0) {
                marker.attr("refX", 0).append("path")
                    .attr("d", "M 3 2.5 L 0 1.5 L 3 0.5 z")
                    .attr("fill", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);
            } else {
                marker.attr("refX", 3).append("path")
                    .attr("d", "M 0 2.5 L 3 1.5 L 0 0.5 z")
                    .attr("fill", `rgb(${lineColor?.[0] ?? 0},${lineColor?.[1] ?? 0},${lineColor?.[2] ?? 0})`);
            }

            break;

        }

    }

    return `url(#Marker${id})`;
}

function computePath(points: any[], coordinateSystem?: any, origin?: any, rotation?: any, closed?: boolean): string {

    let extent = coordinateSystem?.extent;

    let xmin = Math.min(extent?.[0]?.[0] ?? -100, extent?.[1]?.[0] ?? 100);
    let ymax = Math.max(extent?.[1]?.[1] ?? 100, extent?.[0]?.[1] ?? -100);

    let x0 = origin?.[0] ?? 0;
    let y0 = origin?.[1] ?? 0;
    let r = rotation ?? 0;
    let n = points.length - 1;

    let p0 = computePoint(points[0]?.[0] ?? 0, points[0]?.[1] ?? 0, x0, y0, xmin, ymax, r);
    let p1 = computePoint(points[1]?.[0] ?? 0, points[1]?.[1] ?? 0, x0, y0, xmin, ymax, r);
    let p2 = computePoint(points[2]?.[0] ?? 0, points[2]?.[1] ?? 0, x0, y0, xmin, ymax, r);
    let pn = computePoint(points[n]?.[0] ?? 0, points[n]?.[1] ?? 0, x0, y0, xmin, ymax, r);

    let result;

    if ((closed ?? false) == false) {
        result = `M ${p0[0]} ${p0[1]}`;
        result += ` L ${p0[0] + (p1[0] - p0[0]) / 2} ${p0[1] + (p1[1] - p0[1]) / 2}`;
    } else {
        result = `M ${p0[0]} ${p0[1]}`;
        result += ` Q ${p0[0]} ${p0[1]} ${p0[0] + (p1[0] - p0[0]) / 2} ${p0[1] + (p1[1] - p0[1]) / 2}`;
    }

    result += ` Q ${p1[0]} ${p1[1]} ${p1[0] + (p2[0] - p1[0]) / 2} ${p1[1] + (p2[1] - p1[1]) / 2}`;

    let pp = p2;
    for (let point of points.slice(3)) {
        let p = computePoint(point?.[0] ?? 0, point?.[1] ?? 0, x0, y0, xmin, ymax, r);
        result += ` Q ${pp[0]} ${pp[1]} ${pp[0] + (p[0] - pp[0]) / 2} ${pp[1] + (p[1] - pp[1]) / 2}`;
        pp = p;
    }

    if ((closed ?? false) == false)
        result += ` L ${pn[0]} ${pn[1]}`;

    else
        result += ` Z`;

    return result;

}

function computePoint(x: number, y: number, x0: number, y0: number, xmin: number, ymax: number, r: number): [number, number] {

    r = r / 180 * Math.PI;

    return [
        (x * Math.cos(r) - y * Math.sin(r) + x0) - xmin,
        ymax - (y * Math.sin(r) + y * Math.cos(r) + y0)
    ];

}

function computePoints(points?: any[], coordinateSystem?: any, origin?: any, rotation?: any, closed?: boolean): string {

    let extent = coordinateSystem?.extent;

    let xmin = Math.min(extent?.[0]?.[0] ?? -100, extent?.[1]?.[0] ?? 100);
    let ymax = Math.max(extent?.[1]?.[1] ?? 100, extent?.[0]?.[1] ?? -100);

    let x0 = origin?.[0] ?? 0;
    let y0 = origin?.[1] ?? 0;
    let r = rotation ?? 0;

    let result = "";

    for (let point of points ?? []) {
        let p = computePoint(point?.[0] ?? 0, point?.[1] ?? 0, x0, y0, xmin, ymax, r);
        result += `,${p[0]},${p[1]}`;
    }

    return result.substring(1) + (closed == true ? " Z" : "");

}

async function computeTextMacros(graphic: any, componentSymbol?: ModelicaComponentSymbol): Promise<string> {

    let textString: string = graphic.textString ?? graphic.string ?? "";

    textString = textString.replace(/\%\%/, "%");

    textString = textString.replace(/\%name\b/, componentSymbol?.identifier?.value ?? "%name");

    textString = textString.replace(/\%class\b/, (await componentSymbol?.classSymbol)?.identifier?.value ?? "%class");

    //textString = textString.replace(/\%[A-Za-z][A-Za-z0-9]*\b/, componentSymbol?.identifier?.value ?? "?");

    return textString;

}

function computeTransform(coordinateSystem: any, transformation: any): string {

    let cextent = coordinateSystem?.extent;

    let cx1 = cextent?.[0]?.[0] ?? -100;
    let cy1 = cextent?.[0]?.[1] ?? -100;
    let cx2 = cextent?.[1]?.[0] ?? 100;
    let cy2 = cextent?.[1]?.[1] ?? 100;

    let cxmin = Math.min(cx1, cx2);
    let cxmax = Math.max(cx2, cx1);
    let cymin = Math.min(cy1, cy2);
    let cymax = Math.max(cy2, cy1);

    let cwidth = Math.abs(cxmax - cxmin);
    let cheight = Math.abs(cymax - cymin);

    let textent = transformation?.extent;

    let tx1 = textent?.[0]?.[0] ?? -100;
    let ty1 = textent?.[0]?.[1] ?? -100;
    let tx2 = textent?.[1]?.[0] ?? 100;
    let ty2 = textent?.[1]?.[1] ?? 100;

    let txmin = Math.min(tx1, tx2);
    let txmax = Math.max(tx2, tx1);
    let tymin = Math.min(ty1, ty2);
    let tymax = Math.max(ty2, ty1);

    let twidth = Math.abs(txmax - txmin);
    let theight = Math.abs(tymax - tymin);

    let torigin = transformation?.origin;

    let tox = torigin?.[0] ?? 0;
    let toy = torigin?.[1] ?? 0;

    let tx = tox - cxmin - twidth / 2 + txmin + twidth / 2;
    let ty = cymax - toy - theight / 2 - tymin - theight / 2;

    let sx = twidth / cwidth;
    let sy = theight / cheight;

    let r = transformation?.rotation ?? 0;
    let ox = twidth / 2;
    let oy = theight / 2;

    return `translate(${tx},${ty}) rotate(${r},${ox},${oy}) scale(${sx},${sy})`;

}

function configureLayer(svg: XmlElement, coordinateSystem: any): void {

    let extent = coordinateSystem?.extent;
    let preserveAspectRatio = coordinateSystem?.preserveAspectRatio ?? true;

    let x1 = extent?.[0]?.[0] ?? -100;
    let y1 = extent?.[0]?.[1] ?? -100;
    let x2 = extent?.[1]?.[0] ?? 100;
    let y2 = extent?.[1]?.[1] ?? 100;

    let xmin = Math.min(x1, x2);
    let xmax = Math.max(x2, x1);
    let ymin = Math.min(y1, y2);
    let ymax = Math.max(y2, y1);

    let width = Math.abs(xmax - xmin);
    let height = Math.abs(ymax - ymin);

    svg.attr("overflow", "visible");
    svg.attr("width", `${width}`);
    svg.attr("height", `${height}`);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.attr("preserveAspectRatio", preserveAspectRatio ? "xMidYMid" : "none");

}

function getGradientColor(index: number, startColor: number[], stopColor: number[], midpoints: number): number[] {

    index |= 0;
    startColor = [(startColor[0] ?? 0) | 0, (startColor[1] ?? 0) | 0, (startColor[2] ?? 0) | 0];
    stopColor = [(stopColor[0] ?? 0) | 0, (stopColor[1] ?? 0) | 0, (stopColor[2] ?? 0) | 0];
    midpoints = midpoints < 0 ? 0 : midpoints | 0;

    if (index <= 0)
        return startColor;

    if (index > midpoints)
        return stopColor;

    return [
        startColor[0] + index * (stopColor[0] - startColor[0]) / (midpoints + 1),
        startColor[1] + index * (stopColor[1] - startColor[1]) / (midpoints + 1),
        startColor[2] + index * (stopColor[2] - startColor[2]) / (midpoints + 1)
    ];
}

export async function renderDiagram(svg: XmlElement, classSymbol: ModelicaClassSymbol, defs?: XmlElement): Promise<void> {

    if (defs == null)
        defs = svg.append("defs");

    for await (let baseClass of classSymbol.baseClasses)
        if (baseClass != null)
            await renderDiagram(svg, baseClass, defs);

    let diagram: any = null;
    let diagramAnnotation = await (await classSymbol.annotation)?.getNamedElement("Diagram");

    if (diagramAnnotation instanceof ModelicaClassSymbol)
        diagram = (await diagramAnnotation.construct())?.toJSON();

    let coordinateSystem = diagram?.coordinateSystem;
    let graphics = diagram?.graphics;

    configureLayer(svg, coordinateSystem);

    for (let graphic of graphics ?? [])
        await renderGraphic(svg, defs, graphic, coordinateSystem);

    for await (let connection of classSymbol.connections) {

        let annotation = await connection.annotationClause?.instantiate(classSymbol);

        if (annotation == null)
            continue;

        for await (let namedElement of annotation.namedElements) {

            if (!(namedElement instanceof ModelicaClassSymbol))
                continue;

            let graphic = (await namedElement.construct())?.toJSON();

            if (graphic == null)
                continue;

            await renderGraphic(svg, defs, graphic, coordinateSystem);

        }

    }

    for await (let componentSymbol of classSymbol.components) {

        let componentClassSymbol = await componentSymbol.classSymbol;

        if (componentClassSymbol == null)
            continue;

        let placement: any = null;
        let placementAnnotation = await (await componentSymbol?.annotation)?.getNamedElement("Placement");

        if (placementAnnotation instanceof ModelicaClassSymbol)
            placement = (await placementAnnotation.construct())?.toJSON();

        if (placement != null && placement["@type"] != "Placement")
            placement = null;

        if (placement?.visible == false)
            continue;

        let transformation = placement?.transformation;

        let g = svg.append("g");

        g.attr("transform", computeTransform(coordinateSystem, transformation));

        await renderIcon(g.append("svg").attr("overflow", "visible"), componentClassSymbol, componentSymbol, defs);

    }

}

export async function renderIcon(svg: XmlElement, classSymbol: ModelicaClassSymbol, componentSymbol?: ModelicaComponentSymbol, defs?: XmlElement): Promise<void> {

    if (defs == null)
        defs = svg.append("defs");

    for await (let baseClass of classSymbol.baseClasses)
        if (baseClass != null)
            await renderIcon(svg, baseClass, componentSymbol, defs);

    let icon: any = null;
    let iconAnnotation = await (await classSymbol.annotation)?.getNamedElement("Icon");

    if (iconAnnotation instanceof ModelicaClassSymbol)
        icon = (await iconAnnotation.construct())?.toJSON();

    if (icon == null || icon["@type"] != "Icon")
        return;

    let coordinateSystem = icon.coordinateSystem;
    let graphics = icon.graphics;

    configureLayer(svg, coordinateSystem);

    for (let graphic of graphics ?? [])
        await renderGraphic(svg, defs, graphic, coordinateSystem, componentSymbol);

    for await (let connectorSymbol of classSymbol.components) {

        let connectorClassSymbol = await connectorSymbol.classSymbol;

        if (connectorClassSymbol?.classRestriction != ModelicaClassRestriction.CONNECTOR)
            continue;

        let placement: any = null;
        let placementAnnotation = await (await connectorSymbol?.annotation)?.getNamedElement("Placement");

        if (placementAnnotation instanceof ModelicaClassSymbol)
            placement = (await placementAnnotation.construct())?.toJSON();

        if (placement != null && placement["@type"] != "Placement")
            placement = null;

        if (placement?.iconVisible == false || (placement?.iconVisible == null && placement?.visible == false))
            continue;

        let iconTransformation = placement?.iconTransformation;

        if (iconTransformation?.extent?.["@type"] == "Extent")
            iconTransformation = placement?.transformation;

        let g = svg.append("g");

        g.attr("transform", computeTransform(coordinateSystem, iconTransformation));

        await renderIcon(g.append("svg").attr("overflow", "visible"), connectorClassSymbol, connectorSymbol, defs);

    }

}


export async function renderSimpleIcon(svg: XmlElement, classSymbol: ModelicaClassSymbol, componentSymbol?: ModelicaComponentSymbol, defs?: XmlElement): Promise<void> {

    if (defs == null)
        defs = svg.append("defs");

    let icon: any = null;
    let iconAnnotation = await (await classSymbol.annotation)?.getNamedElement("Icon");

    if (iconAnnotation instanceof ModelicaClassSymbol)
        icon = (await iconAnnotation.construct())?.toJSON();

    if (icon == null || icon["@type"] != "Icon")
        return;

    let coordinateSystem = icon.coordinateSystem;
    let graphics = icon.graphics;

    configureLayer(svg, coordinateSystem);

    svg.attr("width", "100%");
    svg.attr("height", "100%");

    for (let graphic of graphics ?? [])
        await renderGraphic(svg, defs, graphic, coordinateSystem, componentSymbol);

}

async function renderGraphic(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any, componentSymbol?: ModelicaComponentSymbol): Promise<void> {

    if (graphic?.visible == false)
        return;

    switch (graphic["@type"]) {

        case "Bitmap":
            await renderBitmap(svg, defs, graphic, coordinateSystem);
            break;

        case "Ellipse":
            await renderEllipse(svg, defs, graphic, coordinateSystem);
            break;

        case "Line":
            await renderLine(svg, defs, graphic, coordinateSystem);
            break;

        case "Polygon":
            await renderPolygon(svg, defs, graphic, coordinateSystem);
            break;

        case "Rectangle":
            await renderRectangle(svg, defs, graphic, coordinateSystem);
            break;

        case "Text":
            await renderText(svg, defs, graphic, coordinateSystem, componentSymbol);
            break;

    }

}

async function renderBitmap(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any): Promise<void> {
}

async function renderEllipse(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any): Promise<void> {

    let element = svg.append("ellipse");

    let extent = computeExtent(graphic.extent, coordinateSystem, graphic.origin, graphic.rotation);

    element.attr('cx', extent[0][0] + Math.abs(extent[1][0] - extent[0][0]) / 2)
        .attr('cy', extent[0][1] - Math.abs(extent[1][1] - extent[0][1]) / 2)
        .attr('rx', (extent[1][0] - extent[0][0]) / 2)
        .attr('ry', (extent[1][1] - extent[0][1]) / 2);


    let lineColor = graphic.lineColor;
    let lineThickness = graphic.lineThickness ?? 0.25;
    let linePattern = computeLinePattern(graphic.pattern, lineThickness);

    if (linePattern != null || (graphic.pattern ?? 0) > 0) {

        if (lineColor != null)
            element.attr("stroke", `rgb(${lineColor[0] ?? 0},${lineColor[1] ?? 0},${lineColor[2] ?? 0})`);

        else
            element.attr("stroke", "none");

        element.attr("stroke-width", `${lineThickness}mm`);

        if (linePattern != null)
            element.attr("stroke-dasharray", linePattern);

    }

    element.attr('fill', computeFillPattern(defs, graphic));

    element.attr("vector-effect", "non-scaling-stroke");

}

async function renderLine(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any): Promise<void> {

    let element;

    if (graphic.smooth == 1 && graphic.points?.length > 2) {

        element = svg.append("path")
            .attr("d", computePath(graphic.points, coordinateSystem, graphic.origin, graphic.rotation));

    } else {

        element = svg.append("polyline")
            .attr("points", computePoints(graphic.points, coordinateSystem, graphic.origin, graphic.rotation));

    }

    let lineColor = graphic.color;
    let lineThickness = graphic.thickness ?? 0.25;
    let linePattern = computeLinePattern(graphic.pattern, lineThickness);

    if (linePattern != null || (graphic.pattern ?? 0) > 0) {

        if (lineColor != null)
            element.attr("stroke", `rgb(${lineColor[0] ?? 0},${lineColor[1] ?? 0},${lineColor[2] ?? 0})`);

        else
            element.attr("stroke", "none");

        element.attr("stroke-width", `${lineThickness}mm`);

        if (linePattern != null)
            element.attr("stroke-dasharray", linePattern);

    }

    let arrowSize = graphic.arrowSize ?? 3;

    if ((graphic.arrow?.[0] ?? 0) > 0)
        element.attr("marker-start", computeArrow(defs, graphic.arrow[0], arrowSize, lineThickness, lineColor));

    if ((graphic.arrow?.[1] ?? 0) > 0)
        element.attr("marker-end", computeArrow(defs, -graphic.arrow[1], arrowSize, lineThickness, lineColor));

    element.attr("fill", "none");
    element.attr("vector-effect", "non-scaling-stroke");

}

async function renderPolygon(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any): Promise<void> {

    let element;

    if (graphic.smooth == 1 && graphic.points?.length > 2) {

        element = svg.append("path")
            .attr("d", computePath(graphic.points, coordinateSystem, graphic.origin, graphic.rotation, true));

    } else {

        element = svg.append("polyline")
            .attr("points", computePoints(graphic.points, coordinateSystem, graphic.origin, graphic.rotation, true));

    }

    let lineColor = graphic.lineColor;
    let lineThickness = graphic.lineThickness ?? 0.25;
    let linePattern = computeLinePattern(graphic.pattern, lineThickness);

    if (linePattern != null || (graphic.pattern ?? 0) > 0) {

        if (lineColor != null)
            element.attr("stroke", `rgb(${lineColor[0] ?? 0},${lineColor[1] ?? 0},${lineColor[2] ?? 0})`);

        else
            element.attr("stroke", "none");

        element.attr("stroke-width", `${lineThickness}mm`);

        if (linePattern != null)
            element.attr("stroke-dasharray", linePattern);

    }

    element.attr('fill', computeFillPattern(defs, graphic));

    element.attr("vector-effect", "non-scaling-stroke");

}

async function renderRectangle(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any): Promise<void> {

    let element = svg.append("rect");

    let extent = computeExtent(graphic.extent, coordinateSystem, graphic.origin, graphic.rotation);

    element.attr('x', extent[0][0])
        .attr('y', extent[1][1] - Math.abs(extent[1][1] - extent[0][1]))
        .attr('width', Math.abs(extent[1][0] - extent[0][0]))
        .attr('height', Math.abs(extent[1][1] - extent[0][1]));

    let radius = graphic.radius ?? 0;
    element.attr("rx", radius);
    element.attr("ry", radius);

    let lineColor = graphic.lineColor;
    let lineThickness = graphic.lineThickness ?? 0.25;
    let linePattern = computeLinePattern(graphic.pattern, lineThickness);

    if (linePattern != null || (graphic.pattern ?? 0) > 0) {

        if (lineColor != null)
            element.attr("stroke", `rgb(${lineColor[0] ?? 0},${lineColor[1] ?? 0},${lineColor[2] ?? 0})`);

        else
            element.attr("stroke", "none");

        element.attr("stroke-width", `${lineThickness}mm`);

        if (linePattern != null)
            element.attr("stroke-dasharray", linePattern);

    }

    element.attr('fill', computeFillPattern(defs, graphic));

    element.attr("vector-effect", "non-scaling-stroke");

}

async function renderText(svg: XmlElement, defs: XmlElement, graphic: any, coordinateSystem?: any, componentSymbol?: ModelicaComponentSymbol): Promise<void> {

    let element = svg.append("text");

    element.appendText(await computeTextMacros(graphic, componentSymbol));

    element.attr('font-family', 'monospace');

    let textColor = graphic.textColor;

    if (textColor != null)
        element.attr("fill", `rgb(${textColor[0] ?? 0},${textColor[1] ?? 0},${textColor[2] ?? 0})`);

    else
        element.attr("fill", "none");

    let extent = computeExtent(graphic.extent, coordinateSystem);

    element.attr('x', extent[0][0] + (extent[1][0] - extent[0][0]) / 2);
    element.attr('y', extent[0][1] + (extent[1][1] - extent[0][1]) / 2);

    let fontSize = Number(graphic.fontSize) ?? 0;

    element.attr("font-size", fontSize > 0 ? fontSize : Math.abs(extent[1][1] - extent[0][1]));
    element.attr("dominant-baseline", "middle");
    element.attr("text-anchor", "middle");
    //element.attr("textLength", extent[1][0] - extent[0][0]);

}


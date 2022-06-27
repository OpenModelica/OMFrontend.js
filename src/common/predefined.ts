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

export const MODELICA_PREDEFINED = `
/*
 * Copyright © 1998-2020, Modelica Association (https://www.modelica.org)
 *
 * All rights reserved. Reproduction or use of editorial or pictorial content is permitted, i.e., this document can
 * be freely distributed especially electronically, provided the copyright notice and these conditions are retained.
 * No patent liability is assumed with respect to the use of information contained herein. While every precaution
 * has been taken in the preparation of this document no responsibility for errors or omissions is assumed.
 */

package ModelicaAnnotations

    type Arrow = enumeration(None, Open, Filled, Half);

    record Authorization
        String licensor = "" "Optional string to show information about the licensor";
        String libraryKey "Matching the key in the class. Must be encrypted and not visible";
        License license[:] "Definition of the license options and of the access rights";
    end Authorization;

    record Axis
        Real min "Axis lower bound, in ’unit’";
        Real max "Axis upper bound, in ’unit’";
        String unit = "" "Unit of axis tick labels";
        String label "Axis label";
    end Axis;

    record Bitmap
        extends GraphicItem;
        Extent extent;
        String fileName "Name of bitmap file";
        String imageSource "Base64 representation of bitmap";
    end Bitmap;

    constant Color Black = {0, 0, 0};

    type BorderPattern = enumeration(None, Raised, Sunken, Engraved);

    type Color = Integer[3](min = 0, max = 255) "RGB representation";

    record CoordinateSystem
        Extent extent;
        Boolean preserveAspectRatio = true;
        Real initialScale = 0.1;
        DrawingUnit grid[2];
    end CoordinateSystem;

    record Curve
        expression x = time "X coordinate values";
        expression y "Y coordinate values";
        String legend "Legend";
    end Curve;

    record Diagram "Representation of the diagram layer"
        CoordinateSystem coordinateSystem(extent = {{-100, -100}, {100, 100}});
        GraphicItem[:] graphics;
    end Diagram;

    record DiagramMap
        Extent extent = {{0, 0}, {0, 0}};
        Boolean primitivesVisible = true;
    end DiagramMap;

    record Dialog
        parameter String tab = "General";
        parameter String group = "Parameters";
        parameter Boolean enable = true;
        parameter Boolean showStartAttribute = false;
        parameter Boolean colorSelector = false;
        parameter Selector loadSelector;
        parameter Selector saveSelector;
        parameter String groupImage = "";
        parameter Boolean connectorSizing = false;
    end Dialog;

    record Documentation
        String info = "" "Description of the class";
        String revisions = "" "Revision history";
        Figure[:] figures = {}; "Simulation result figures";
    end Documentation;

    type DrawingUnit = Real(final unit="mm");

    record Ellipse
        extends GraphicItem;
        extends FilledShape;
        Extent extent;
        Real startAngle(quantity = "angle", unit = "deg") = 0;
        Real endAngle(quantity = "angle", unit = "deg") = 360;
        EllipseClosure closure = if startAngle == 0 and endAngle == 360
        then EllipseClosure.Chord
        else EllipseClosure.Radial;
    end Ellipse;

    type EllipseClosure = enumeration(None, Chord, Radial);

    type Extent = Point[2] "Defines a rectangular area {{x1, y1}, {x2, y2}}";

    record Figure
        String title = "" "Title meant for display";
        String identifier "Identifier meant for programmatic access";
        String group = "" "Name of plot group";
        Boolean preferred = false "Automatically display figure after simulation";
        Plot[:] plots "Plots";
        String caption "Figure caption";
    end Figure;

    record FilledShape "Style attributes for filled shapes"
        Color lineColor = Black "Color of border line";
        Color fillColor = Black "Interior fill color";
        LinePattern pattern = LinePattern.Solid "Border line pattern";
        FillPattern fillPattern = FillPattern.None "Interior fill pattern";
        DrawingUnit lineThickness = 0.25 "Line thickness";
    end FilledShape;

    type FillPattern = enumeration(None, Solid, Horizontal, Vertical,
        Cross, Forward, Backward, CrossDiag,
        HorizontalCylinder, VerticalCylinder, Sphere);

    partial record GraphicItem
        Boolean visible = true;
        Point origin = {0, 0};
        Real rotation(quantity="angle", unit="deg")=0;
    end GraphicItem;

    record Icon "Representation of the icon layer"
        CoordinateSystem coordinateSystem(extent = {{-100, -100}, {100, 100}});
        GraphicItem[:] graphics;
    end Icon;

    record IconMap
        Extent extent = {{0, 0}, {0, 0}};
        Boolean primitivesVisible = true;
    end IconMap;

    record License
        String licensee = "" "Optional string to show information about the licensee";
        String id[:] "Unique machine identifications, e.g.\ MAC addresses";
        String features[:] = fill("", 0) "Activated library license features";
        String startDate = "" "Optional start date in UTCformat YYYY-MM-DD";
        String expirationDate = "" "Optional expiration date in UTCformat YYYY-MM-DD";
        String operations[:] = fill("", 0) "Library usage conditions";
    end License;

    record Line
        extends GraphicItem;
        Point points[:];
        Color color = Black;
        LinePattern pattern = LinePattern.Solid;
        DrawingUnit thickness = 0.25;
        Arrow arrow[2] = {Arrow.None, Arrow.None} "{start arrow, end arrow}";
        DrawingUnit arrowSize = 3;
        Smooth smooth = Smooth.None "Spline";
    end Line;

    type LinePattern = enumeration(None, Solid, Dash, Dot, DashDot, DashDotDot);

    record OnMouseDownEditInteger
        Integer variable "Name of variable to change";
    end OnMouseDownEditInteger;

    record OnMouseDownEditReal
        Real variable "Name of variable to change";
    end OnMouseDownEditReal;

    record OnMouseDownEditString
        String variable "Name of variable to change";
    end OnMouseDownEditString;

    record OnMouseDownSetBoolean
        Boolean variable "Name of variable to change when mouse button pressed";
        Boolean value "Assigned value";
    end OnMouseDownSetBoolean;

    record OnMouseMoveXSetReal
        Real xVariable "Name of variable to change when cursor moved in x direction";
        Real minValue;
        Real maxValue;
    end OnMouseMoveXSetReal;

    record OnMouseMoveYSetReal
        Real yVariable "Name of variable to change when cursor moved in y direction";
        Real minValue;
        Real maxValue;
    end OnMouseMoveYSetReal;

    record OnMouseUpSetBoolean
        Boolean variable "Name of variable to change when mouse button released";
        Boolean value "Assigned value";
    end OnMouseUpSetBoolean;

    record Placement
        Boolean visible = true;
        Transformation transformation "Placement in the diagram layer";
        Boolean iconVisible "Visible in icon layer; for public connector";
        Transformation iconTransformation "Placement in the icon layer; for public connector";
    end Placement;

    record Plot
        String title "Title meant for display";
        String identifier "Identifier meant for programmatic access";
        Curve[:] curves "Plot curves";
        Axis x "X axis properties";
        Axis y "Y axis properties";
    end Plot;

    type Point = DrawingUnit[2] "{x, y}";

    record Polygon
        extends GraphicItem;
        extends FilledShape;
        Point points[:];
        Smooth smooth = Smooth.None "Spline outline";
    end Polygon;

    record Rectangle
        extends GraphicItem;
        extends FilledShape;
        BorderPattern borderPattern = BorderPattern.None;
        Extent extent;
        DrawingUnit radius = 0 "Corner radius";
    end Rectangle;

    record Selector
        parameter String filter = "";
        parameter String caption = "";
    end Selector;

    type Smooth = enumeration(None, Bezier);

    record Text
        extends GraphicItem;
        extends FilledShape;
        Extent extent;
        String string;
        String textString;
        Real fontSize = 0 "unit pt";
        String fontName;
        TextStyle textStyle[:];
        Color textColor = lineColor;
        TextAlignment horizontalAlignment = TextAlignment.Center;
        Integer index;
    end Text;

    type TextAlignment = enumeration(Left, Center, Right);

    type TextStyle = enumeration(Bold, Italic, UnderLine);

    record Transformation
        Point origin = {0, 0};
        Extent extent;
        Real rotation(quantity = "angle", unit = "deg") = 0;
    end Transformation;

end ModelicaAnnotations;
`;
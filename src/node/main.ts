#!/usr/bin/env -S node --enable-source-maps

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

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ModelicaNodeContext, ModelicaScriptContext } from "./context.js";
import fs from "fs";
import { ModelicaStoredDefinitionSyntax, ModelicaInteractiveStatementsSyntax } from "../common/syntax.js";
const yargz = yargs(hideBin(process.argv));
import { BufferedPrintWriter } from "../common/writer.js";
import JSZip from "jszip";

import util from "util";

yargz.scriptName("omf")
  .usage("usage: $0 <command> [options]")
  .alias("h", "help")
  .alias("v", "version")
  .option("silent", {
    alias: "q",
    default: false,
    describe: "Turns on silent mode",
    type: "boolean"
  })
  .option("std", {
    choices: ["3.5", "latest"],
    default: "latest",
    describe: "Sets the language standard that should be used"
  })
  .showHelpOnFail(true)
  .demandCommand(1)
  .wrap(yargz.terminalWidth())
  .command("parse <file>", "Parse Modelica file", (yargs) => {
    yargs.positional("file", {
      describe: "file to parse",
      type: "string",
    })
  }, async (args: any) => {
    let context = new ModelicaNodeContext();
    let text = fs.readFileSync(args.file, { encoding: "utf8" });
    let tree = context.parse(text);
    console.log(tree.rootNode.toString());
  })
  .command("inst <file>.mo <class>", "Instantiate the given class in the given Modelica file", (yargs) => {
    yargs.positional("file", {
      describe: "file to parse and load",
      type: "string",
    }),
    yargs.positional("class", {
      describe: "class to instantiate",
      type: "string",
    })
  }, async (args: any) => {
    let context = new ModelicaNodeContext();
    let text = fs.readFileSync(args.file, { encoding: "utf8" });
    let tree = context.parse(text);
    let node = ModelicaStoredDefinitionSyntax.new(tree.rootNode);
    let symbols = await node?.instantiate(context);
    let s = symbols ?? ["failed to instantiate"];
    for(var sym of s)
    {
      if (!(typeof sym === 'string'))
      {
        let bpw = new BufferedPrintWriter();
        await sym.print(bpw);
        console.log(bpw.toString());
      }
    }
  })
  .command("run <script>.mos", "Run Modelica script file", (yargs) => {
    yargs.positional("script", {
      describe: "script file to run",
      type: "string",
    })
  }, async (args: any) => {
    let context = new ModelicaScriptContext();
    let text = fs.readFileSync(args.script, { encoding: "utf8" });
    let tree = context.parse(text);
    let node = ModelicaInteractiveStatementsSyntax.new(tree.rootNode);
    let symbols = await node?.execute(context);
  })
  .argv;
  
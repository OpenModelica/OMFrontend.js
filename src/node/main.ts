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
import path from "path";

const args = yargz.scriptName("omf")
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
  .command("run <file>", "Run Modelica/ModelicaScript file", (yargs) => {
    yargs.positional("file", {
      describe: "file to handle [.mo or .mos]",
      type: "string",
    })
  }, async (args: any) => {
    let file:string = args.file;
    let ext:string = path.extname(file);
    let text = fs.readFileSync(file, { encoding: "utf8" });
    let tree = undefined;
    if (ext == "mos") { // execute it when is a .mos script
      let context = new ModelicaScriptContext();
      tree = context.parse(text);
      let node = ModelicaInteractiveStatementsSyntax.new(tree.rootNode);
      let sym = await node?.execute(context);
      if (sym != undefined)
      {
        if (!(typeof sym === 'string'))
        {
          let bpw = new BufferedPrintWriter();
          await sym.print(bpw);
          console.log(bpw.toString());
        }
      }
    } else if (ext = "mo") { // inst if is a .mo file
      let context = new ModelicaNodeContext();
      tree = context.parse(text);
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
    }
    if (tree != undefined) 
      console.log(tree.rootNode.toString());
  })
  .argv;


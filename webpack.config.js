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

import CopyPlugin from "copy-webpack-plugin";
import ResolveTypeScriptPlugin from "resolve-typescript-plugin";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (env, argv) => {
    return {
        mode: "development",
        entry: {
            OMFrontend: "./src/browser/index.ts",
            "editor.worker": "monaco-editor-core/esm/vs/editor/editor.worker.js",
            "json.worker": "monaco-editor/esm/vs/language/json/json.worker"
        },
        target: "web",
        output: {
            filename: "[name].js",
            globalObject: "self",
            path: resolve(__dirname, "./dist")
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                }
            ]
        },
        resolve: {
            extensions: [".js", ".ts"],
            fallback: {
                assert: false,
                child_process: false,
                fs: false,
                http: false,
                https: false,
                net: false,
                os: false,
                path: false,
                process: false,
                stream: false,
                tls: false,
                url: false,
                util: false,
                zlib: false
            },
            modules: [
                join(__dirname, "./node_modules"),
            ],
            plugins: [
                new ResolveTypeScriptPlugin()
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "./node_modules/web-tree-sitter/tree-sitter.wasm", to: "./" },
                    { from: "./node_modules/tree-sitter-modelica/tree-sitter-modelica.wasm", to: "./" },
                    { from: "./node_modules/tree-sitter-modelicascript/tree-sitter-modelicascript.wasm", to: "./" },
                ],
            })
        ],
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    }
};

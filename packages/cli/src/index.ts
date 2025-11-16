#!/usr/bin/env node
/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Command } from "commander";

import { installCommand } from "./commands/install.js";
import type { InstallOptions } from "./types.js";

const program = new Command();

program
    .name("blueprint")
    .description("Interactive CLI for installing and managing Blueprint")
    .version("0.1.0");

program
    .command("install")
    .description("Install Blueprint in your project")
    .option("--format <format>", "Stylesheet format (scss or css)")
    .option("--path <path>", "Installation path")
    .option("--yes, -y", "Skip prompts and use defaults")
    .action(async (options: InstallOptions) => {
        await installCommand(options);
    });

program.parse();

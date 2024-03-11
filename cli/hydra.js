#! /usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { resolve as pathResolve, dirname } from 'path';
import * as fs from 'fs';
import { camelCase, paramCase, pascalCase, snakeCase } from 'change-case';
import pluralize from 'pluralize';
import { exec } from 'child_process';

program
	.command('list')
	.alias('ls')
	.description('list all the Hydra commands')
	.action(() => {
		try {
			const child = exec('hydra --help', (err) => {
				if (err) throw err;
			});
			child.stdout.on('data', (data) => {
				process.stdout.write(
					chalk.bold(
						chalk.bgBlack(`
			${chalk.red(`
|⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄|
|⠄⠄⣴⣶⣤⡤⠦⣤⣀⣤⠆⠄⠄⠄⠄⠄⣈⣭⣭⣿⣶⣿⣦⣼⣆⠄⠄⠄⠄⠄⠄⠄⠄|
|⠄⠄⠄⠉⠻⢿⣿⠿⣿⣿⣶⣦⠤⠄⡠⢾⣿⣿⡿⠋⠉⠉⠻⣿⣿⡛⣦⠄⠄⠄⠄⠄⠄|
|⠄⠄⠄⠄⠄⠈⠄⠄⠄⠈⢿⣿⣟⠦⠄⣾⣿⣿⣷⠄⠄⠄⠄⠻⠿⢿⣿⣧⣄⠄⠄⠄⠄|
|⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣸⣿⣿⢧⠄⢻⠻⣿⣿⣷⣄⣀⠄⠢⣀⡀⠈⠙⠿⠄⠄⠄⠄|
|⠄⠄⢀⠄⠄⠄⠄⠄⠄⢠⣿⣿⣿⠈⠄⠄⠡⠌⣻⣿⣿⣿⣿⣿⣿⣿⣛⣳⣤⣀⣀⠄⠄|
|⠄⠄⢠⣧⣶⣥⡤⢄⠄⣸⣿⣿⠘⠄⠄⢀⣴⣿⣿⡿⠛⣿⣿⣧⠈⢿⠿⠟⠛⠻⠿⠄⠄|
|⠄⣰⣿⣿⠛⠻⣿⣿⡦⢹⣿⣷⠄⠄⠄⢊⣿⣿⡏⠄⠄⢸⣿⣿⡇⠄⢀⣠⣄⣾⠄⠄⠄|
|⣠⣿⠿⠛⠄⢀⣿⣿⣷⠘⢿⣿⣦⡀⠄⢸⢿⣿⣿⣄⠄⣸⣿⣿⡇⣪⣿⡿⠿⣿⣷⡄⠄|
|⠙⠃⠄⠄⠄⣼⣿⡟⠌⠄⠈⠻⣿⣿⣦⣌⡇⠻⣿⣿⣷⣿⣿⣿⠐⣿⣿⡇⠄⠛⠻⢷⣄|
|⠄⠄⠄⠄⠄⢻⣿⣿⣄⠄⠄⠄⠈⠻⣿⣿⣿⣷⣿⣿⣿⣿⣿⡟⠄⠫⢿⣿⡆⠄⠄⠄⠁|
|⠄⠄⠄⠄⠄⠄⠻⣿⣿⣿⣿⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⢀⣀⣤⣾⡿⠃⠄⠄⠄⠄|
|⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄|`)}${chalk.blue(`
|⠄⠄⠄⠄⢰⣶⠄⠄⣶⠄⢶⣆⢀⣶⠂⣶⡶⠶⣦⡄⢰⣶⠶⢶⣦⠄⠄⣴⣶⠄⠄⠄⠄|
|⠄⠄⠄⠄⢸⣿⠶⠶⣿⠄⠈⢻⣿⠁⠄⣿⡇⠄⢸⣿⢸⣿⢶⣾⠏⠄⣸⣟⣹⣧⠄⠄⠄|
|⠄⠄⠄⠄⠸⠿⠄⠄⠿⠄⠄⠸⠿⠄⠄⠿⠷⠶⠿⠃⠸⠿⠄⠙⠷⠤⠿⠉⠉⠿⠆⠄⠄|`)}
`),
					),
				);
				process.stdout.write(data.toString());
			});
			child.stderr.on('data', (data) => {
				process.stdout.write(data.toString());
			});
		} catch (error) {
			process.stdout.write('error', error);
		}
	});

program
	.command('make:module')
	.description('create a new rest module')
	.action(() => {
		inquirer
			.prompt([
				{
					name: 'module',
					type: 'input',
					message: 'Enter module name that you want to generate :',
					validate(value) {
						if (value.length) {
							return true;
						}
						return 'Please provide a module name.';
					},
				},
				{
					name: 'version',
					type: 'input',
					message: 'Enter api module version that you want to generate (1,2,3.. etc):',
					validate(value) {
						if (typeof Number(value) === 'number') {
							return true;
						}
						return 'Please provide a version number.';
					},
				},
			])
			.then((answers) => {
				const moduleName = answers.module;
				const moduleVersion = answers.version;
				const apiModuleDirectory = pathResolve(dirname('./'), `src/modules/v${moduleVersion}`);
				const moduleTemplateDirectory = pathResolve(dirname('./'), 'cli/templates/moduleTemplate');
				const files = fs.readdirSync(moduleTemplateDirectory);
				files.forEach((fileName) => {
					const readFileContent = fs.readFileSync(`${moduleTemplateDirectory}/${fileName}`, 'utf8');

					const writeFileContent = readFileContent
						.replace(/__pluralizeParamCase__/g, paramCase(pluralize(moduleName)))
						.replace(/__pluralizeCamelCase__/g, camelCase(pluralize(moduleName)))
						.replace(/__pluralize__/g, pluralize(moduleName))
						.replace(
							/__normalCase__/g,
							moduleName.toLowerCase().charAt(0).toUpperCase() + moduleName.toLowerCase().substring(1),
						)
						.replace(/__lowerCase__/g, moduleName.toLowerCase())
						.replace(/__camelCase__/g, camelCase(moduleName))
						.replace(/__pascalCase__/g, pascalCase(moduleName));
					const writeDirectoryName = pluralize(paramCase(moduleName));
					const writeFileName = fileName
						.replace('__camelCase__', camelCase(moduleName))
						.replace('.template', '.js');
					fs.mkdirSync(`${apiModuleDirectory}/${writeDirectoryName}`, { recursive: true });
					fs.writeFileSync(`${apiModuleDirectory}/${writeDirectoryName}/${writeFileName}`, writeFileContent);
				});
			})
			.catch((error) => {
				if (error.isTtyError) {
					// Prompt couldn't be rendered in the current environment
				} else {
					// Something else went wrong
				}
			});
	});

program
	.command('make:model')
	.description('create a new table/collection model')
	.action(() => {
		inquirer
			.prompt([
				{
					name: 'databaseType',
					type: 'list',
					message: 'Enter database type between :',
					choices: ['sql', 'nosql', 'memory'],
				},
				{
					name: 'databaseNumber',
					type: 'number',
					message: 'Enter database number :',
					default: 0,
					validate(value) {
						if (Number.isInteger(value)) {
							return true;
						}
						return 'Please provide a database number.';
					},
				},
				{
					name: 'modelName',
					type: 'input',
					message: 'Enter model name that you want to create :',
					validate(value) {
						if (value.length) {
							return true;
						}
						return 'Please provide a model name.';
					},
				},
			])
			.then((answers) => {
				const { databaseType, databaseNumber, modelName } = answers;
				if (databaseType === 'sql') {
					const modelDirectory = pathResolve(
						dirname('./'),
						`src/databases/${databaseType}/db${databaseNumber}`,
					);
					const modelTemplateDirectory = pathResolve(
						dirname('./'),
						`cli/templates/databaseTemplate/${databaseType}Template`,
					);
					const files = fs.readdirSync(modelTemplateDirectory);
					files.forEach((fileName) => {
						const readFileContent = fs.readFileSync(`${modelTemplateDirectory}/${fileName}`, 'utf8');
						const writeFileContent = readFileContent
							.replace(/__lowerCase__/g, modelName.toLowerCase())
							.replace(/__camelCase__/g, camelCase(modelName))
							.replace(/__pascalCase__/g, pascalCase(modelName))
							.replace(/__snakeCase__/g, snakeCase(modelName))
							.replace(/__tableName__/g, pluralize(snakeCase(modelName)));

						const writeFileName = fileName
							.replace('__pascalCase__', pascalCase(modelName))
							.replace('.template', '.js');
						fs.mkdirSync(`${modelDirectory}`, { recursive: true });
						fs.writeFileSync(`${modelDirectory}/${writeFileName}`, writeFileContent);
					});
				}
			})
			.catch((error) => {
				if (error.isTtyError) {
					// Prompt couldn't be rendered in the current environment
				} else {
					// Something else went wrong
				}
			});
	});

program.parse(process.argv);

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const captureException = async (err) => {
	try {
		// Extract the relevant information from the stack trace
		const lines = err.stack.split('\n');
		const topLines = lines.slice(1, 4); // Extract the top 3 lines of the stack trace
		// const bottomLines = lines.slice(-3); // Extract the bottom 3 lines of the stack trace

		// Extract the function name, file name, and line number from the top line of the stack trace
		const [, functionName, fileName, lineNumber] = /([^(]+)\s+\((.+):(\d+):\d+\)/.exec(topLines[0]);

		// Get the absolute path of the file where the exception occurred
		const filePath = path.normalize(fileName).replace(/\//g, '\\').replace('file:\\', '');
		// Read the file where the exception occurred
		const fileContent = fs.readFileSync(filePath, 'utf8');

		// Split the file content into an array of lines
		const fileLines = fileContent.split('\n');

		// Extract the 10-line code snippet around the line where the exception occurred
		const startLine = Math.max(0, Number(lineNumber) - 5);
		const endLine = Math.min(fileLines.length - 1, Number(lineNumber) + 4);
		const codeSnippet = fileLines.slice(startLine, endLine + 1).join('\n');

		// Format the relevant information as a string
		const output = `Function: ${functionName} \n File: ${filePath} \n Line: ${lineNumber} \n Code snippet:${codeSnippet}`;

		// eslint-disable-next-line no-console
		console.log(chalk.red('Exception :>> '), chalk.red(err.message), err.stack, output);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(chalk.red('Exception :>> '), chalk.red(err.message), err.stack);
	}
	return true;
};

export const captureErrorMessage = async (message) => {
	// eslint-disable-next-line no-console
	console.log(chalk.red('Message :>> '), message);
	return true;
};

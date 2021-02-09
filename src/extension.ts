// Not published

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pyclassgen.initGen', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor){
			vscode.window.showInformationMessage("Editor does not exist.");
			return;
		}

		function getClassName() {
			return vscode.window.showInputBox({
				placeHolder: "Enter class"
			});
		}

		function getAttributes() {
			return vscode.window.showInputBox({
				placeHolder: "Enter attribute"
			});
		}

		function displayClass(pos: any, attribs: Array<string>): void {
			editor?.edit((edit) => {
				edit.insert(pos, `class ${className}:`);
				edit.insert(pos, `\n\t${initMethod}`);

				attribs.forEach(function (value) {
					edit.insert(pos, `\n\t\tself.${value} = ${value}`);

				});
			});
		}

		const className = await getClassName();
		let attributes: Array<string> = [];
		let singleAttribute = await getAttributes();
		let initMethod = "def __init__ (self, ";
		let position = new vscode.Position(editor.selection.active.line, editor.selection.active.character);

		while (singleAttribute) {
			attributes.push(singleAttribute);
			singleAttribute = await getAttributes();
		}

		// generate the __init__ method
		attributes.forEach(function (value) {
			if (value === attributes[attributes.length - 1]) {
				initMethod += `${value}):`;
			} else {
				initMethod += `${value}, `;
			}
		});

		if (className) {
			displayClass(position, attributes);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

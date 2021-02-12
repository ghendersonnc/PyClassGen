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
		// TODO: More elegant method of indenting method/attributes
		// FIXME: Inner class methods/attributes not indenting
		function displayClass(attribs: Array<string>): void {
			let pos = new vscode.Position(editor?.selection.active.line as number,
										editor?.selection.active.character as number);
			console.log(pos.character);
			editor?.edit((edit) => {
				edit.insert(pos, `class ${className}:`);
				edit.insert(pos, `\n    ${initMethod}`);

				attribs.forEach(function (value) {
					edit.insert(pos, `\n        self.${value} = ${value}`);

				});
			});
		}

		const className = await getClassName();
		let attributes: Array<string> = [];
		let singleAttribute = await getAttributes();
		let initMethod = "def __init__ (self, ";

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
			displayClass(attributes);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

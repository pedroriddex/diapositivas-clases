import { spawn } from 'node:child_process';
import process from 'node:process';

const processes = [];
let shuttingDown = false;

function startProcess(label, command, args, cwd) {
	const child = spawn(command, args, {
		cwd,
		stdio: ['inherit', 'pipe', 'pipe'],
		env: process.env
	});

	const prefix = `[${label}]`;

	child.stdout.on('data', (chunk) => {
		process.stdout.write(`${prefix} ${chunk}`);
	});

	child.stderr.on('data', (chunk) => {
		process.stderr.write(`${prefix} ${chunk}`);
	});

	child.on('exit', (code, signal) => {
		const detail = signal ? `signal ${signal}` : `code ${code ?? 0}`;
		process.stdout.write(`${prefix} exited with ${detail}\n`);

		if (!shuttingDown) {
			shutdown(typeof code === 'number' ? code : 0);
		}
	});

	processes.push(child);
	return child;
}

function shutdown(exitCode = 0) {
	if (shuttingDown) return;
	shuttingDown = true;

	for (const child of processes) {
		if (!child.killed) {
			child.kill('SIGTERM');
		}
	}

	setTimeout(() => {
		for (const child of processes) {
			if (!child.killed) {
				child.kill('SIGKILL');
			}
		}
		process.exit(exitCode);
	}, 1000).unref();
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

const root = process.cwd();

startProcess(
	'web',
	process.platform === 'win32' ? 'npm.cmd' : 'npm',
	['run', 'dev:web', '--', '--host', 'localhost', '--port', '5173'],
	root
);

startProcess(
	'wordpress',
	process.platform === 'win32' ? 'npm.cmd' : 'npm',
	['run', 'dev:wordpress', '--', '--host', 'localhost', '--port', '5174'],
	root
);

startProcess(
	'studio',
	process.platform === 'win32' ? 'npm.cmd' : 'npm',
	['run', 'dev:studio'],
	root
);

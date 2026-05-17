import { exec } from 'child_process';

export function runShellCommand(command) {
  return new Promise((resolve) => {
    exec(command, { shell: true, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        error,
        stdout: stdout ? stdout.toString() : '',
        stderr: stderr ? stderr.toString() : ''
      });
    });
  });
}

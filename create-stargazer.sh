#!/bin/bash
# Script to create stargazer video project

cd "/Users/tim/Desktop/ProgrammaicVideo/Video Version 1"

# Create a Node.js script to handle the interactive prompts
node << 'EOF'
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const proc = spawn('npx', ['create-video@latest', '--stargazer'], {
  stdio: 'inherit',
  shell: true
});

proc.on('close', (code) => {
  process.exit(code);
});
EOF

/*
*   This file will update all aurelia framework packages.
*   Just run from cmd "node update-aurelia.js"
*/

const package = require('./package.json');
const npm = require('npm');
const dependencies = Object.assign(package.dependencies, package.devDependencies);
const exec = require('child_process').exec;

let aureliaPackages = '';


for (let [k, v] of Object.entries(dependencies)) {
    if (/aurelia/ig.test(k)) aureliaPackages += `${k}@latest `;
}

child = exec(`npm i ${aureliaPackages} -S`).stderr.pipe(process.stderr);

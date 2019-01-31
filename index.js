#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

const readFile = (file) => {
  return fs.readFileSync(file).toString();
};

const askQuestions = () => {
  const questions = [
    {
      name: 'FILENAME',
      type: 'input',
      message: 'What is the name of the file including extension?'
    },
    {
      name: 'LIMIT',
      type: 'input',
      message: 'What is the character limit (number)?'
    },
    {
      name: 'DELIMITER',
      type: 'input',
      message: 'What is the line break character? (single character)'
    }
  ];
  return inquirer.prompt(questions);
};

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync('line breaker', {
        font: 'colossal'
      })
    )
  );
};

const createFile = (filename, data) => {
  const filePath = `${process.cwd()}/lb-${filename}`;
  
  fs.writeFile(`lb-${filename}`, data, (err, data) => {
    if (err) console.log(err);
  });
  return filePath;
};

const success = (filepath) => {
  console.log(
    chalk.green.bold(`Done! File created at ${filepath}`)
  );
};

const lastDelimiter = (str, delimiter) => {
  let pos = 0;
  let i = -1;
  let lastPos = 0;
     
  while (pos != -1) {
    pos = str.indexOf(delimiter, i + 1);
    i = pos;
    if (pos >= 0) {
      lastPos = pos;
    }
  }
  
  return lastPos + 1;
}; 

const run = async () => {
  init();
  
  const answers = await askQuestions();
  const { FILENAME, LIMIT, DELIMITER } = answers;
  const fileStr = readFile(FILENAME);
    
  let newStr = '';
  let ch = 0;
  
  while (newStr.length <= fileStr.length) {
    const tempStr = fileStr.slice(ch, ch + parseInt(LIMIT));
    newStr += [fileStr.slice(ch, ch + lastDelimiter(tempStr, DELIMITER)), '\n'].join('');
    ch = ch + lastDelimiter(tempStr, DELIMITER);
    console.log('*** str length:', [fileStr.slice(ch, ch + lastDelimiter(tempStr, DELIMITER)), '\n'].join('').length);
  }
        
  const filePath = createFile(FILENAME, newStr);
  
  success(filePath);
};

run();
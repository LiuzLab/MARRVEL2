const fs = require('fs');
const config = require('../config');

exports.liftover = async (chr, pos, fromOrg, fromDb, toOrg, toDb,
  minMatch, isMultiRegionAllowed, minQuery, minChain, minBlocks, isThickFudgeSet) => {
  // generate input BED file with random name
  const inputBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;
  fs.writeFileSync(inputBed, `chr${chr}\t${pos}\t${pos}\n`);
  // generate output BED file with random name
  const outputBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;
  // generate unlifted BED file with random name
  const unliftedBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;

  if (!config.liftoverCmdTool[fromOrg][fromDb][toOrg][toDb]) {
    throw new Error('liftOver chain file is not configured properly');
  }
  const cmdArgs = [
    inputBed,
    config.liftoverCmdTool[fromOrg][fromDb][toOrg][toDb],
    outputBed,
    unliftedBed
  ];
  if (minBlocks) {
    cmdArgs.push(`-minBlocks=${minBlocks}`);
  }
  if (isThickFudgeSet) {
    cmdArgs.push('-fudgeThick');
  }
  if (minMatch) {
    cmdArgs.push(`-minMatch=${minMatch}`);
  }
  if (isMultiRegionAllowed) {
    cmdArgs.push('-multiple');
  }
  if (minQuery) {
    cmdArgs.push(`-minSizeQ=${minQuery}`);
  }
  if (minChain) {
    cmdArgs.push(`-minChainT=${minChain}`);
  }

  // run liftOver command line tool
  try {
    await runLiftover(cmdArgs);
  } catch (error) {
    console.error(`Error occurred while running liftOver: ${error.message}`);
    return {
      message: 'Error occurred while running liftOver'
    };
  }
  // read output BED file
  let lifted = null;
  try {
    const output = fs.readFileSync(outputBed, 'utf8');
    lifted = (output.split('\n')[0] || '').split('\t');
  } catch (error) {
    console.error(`Error reading output BED file: ${error.message}`);
    return {
      message: 'Error reading output BED file'
    };
  }
  if (!lifted || lifted.length < 2) {
    return {
      message: 'No lifted position found'
    };
  }
  // clean up temporary files
  fs.unlinkSync(inputBed);
  fs.unlinkSync(outputBed);
  fs.unlinkSync(unliftedBed);
  return {
    inputChr: chr,
    inputPos: pos,
    chr: lifted[0].replace('chr', ''),
    pos: parseInt(lifted[1])
  };
};

const runLiftover = (args) => {
  return new Promise((resolve, reject) => {
    const spawn = require('child_process').spawn;
    const child = spawn(config.liftoverCmdTool.path, args);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`liftOver process exited with code ${code}: ${stderr}`));
      }
      return resolve(stdout);
    });
    child.on('error', (err) => {
      return reject(err);
    });
  });
};

const fs = require('fs');
const config = require('../config');

const cleanupTempFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error cleaning up temp file ${filePath}: ${error.message}`);
    }
  }
};

exports.liftover = async (chr, pos, fromOrg, fromDb, toOrg, toDb,
  minMatch, isMultiRegionAllowed, minQuery, minChain, minBlocks, isThickFudgeSet) => {
  if (!config.liftoverCmdTool[fromOrg][fromDb][toOrg][toDb]) {
    throw new Error('liftOver chain file is not configured properly');
  }

  // generate input/output/unlifted BED files with random names
  const inputBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;
  const outputBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;
  const unliftedBed = `/tmp/${Math.random().toString(36).substring(2, 15)}.bed`;

  try {
    fs.writeFileSync(inputBed, `chr${chr}\t${pos}\t${pos}\n`);

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
    return {
      inputChr: chr,
      inputPos: pos,
      chr: lifted[0].replace('chr', ''),
      pos: parseInt(lifted[1])
    };
  } finally {
    cleanupTempFile(inputBed);
    cleanupTempFile(outputBed);
    cleanupTempFile(unliftedBed);
  }
};

const runLiftover = (args) => {
  return new Promise((resolve, reject) => {
    const spawn = require('child_process').spawn;
    const child = spawn(config.liftoverCmdTool.path, args, { timeout: 15000, killSignal: 'SIGKILL' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    child.on('close', (code, signal) => {
      if (signal) {
        return reject(new Error(`liftOver process was killed (signal: ${signal})`));
      }
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

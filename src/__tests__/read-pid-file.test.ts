import { readPidFile as subject } from '../read-pid-file';
import * as tempy from 'tempy';
import { writeConfigFile } from '@carnesen/bitcoin-config';
import { join } from 'path';
import { writeFileSync } from 'fs';

describe(subject.name, () => {
  it('reads the contents of the bitcoin server pid file', () => {
    const datadir = tempy.directory();
    const pid = 55438;
    const pidFilePath = join(datadir, 'bitcoind.pid');
    writeFileSync(pidFilePath, pid, { encoding: 'utf8' });
    const configFilePath = join(datadir, 'bitcoin.conf');
    writeConfigFile(configFilePath, { datadir });
    expect(subject(configFilePath)).toBe(pid);
  });

  it('returns null if there is no pid file', () => {
    const datadir = tempy.directory();
    const configFilePath = join(datadir, 'bitcoin.conf');
    writeConfigFile(configFilePath, { datadir });
    expect(subject(configFilePath)).toBe(null);
  });

  it('throws if the pid file contains a non-number', () => {
    const datadir = tempy.directory();
    const pid = 'carl';
    const pidFilePath = join(datadir, 'bitcoind.pid');
    writeFileSync(pidFilePath, pid, { encoding: 'utf8' });
    const configFilePath = join(datadir, 'bitcoin.conf');
    writeConfigFile(configFilePath, { datadir });
    expect(() => {
      subject(configFilePath);
    }).toThrow('convert pid');
  });
});

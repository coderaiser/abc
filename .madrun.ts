import {run} from 'madrun';

export default {
    'android': () => 'react-native run-android',
    'ios': () => 'react-native run-ios',
    'start': () => 'react-native start',
    'lint': () => 'putout .',
    'fix:lint': () => run('lint', '--fix'),
    'tsc': () => 'tsc --noEmit',
    'test': () => 'jest',
    'coverage': () => run('test', '--coverage'),
};

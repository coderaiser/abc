import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    getDefaultConfig,
    mergeConfig,
} from '@react-native/metro-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(getDefaultConfig(__dirname), {});

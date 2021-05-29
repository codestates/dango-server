import devconfig from './development';
import prodconfig from './production';

const config = process.env.NODE_ENV === 'production' ? prodconfig : devconfig;
console.log(config.port)
export default config;

import { prettier } from '@nizhdanov/prettier';

export default prettier({
  tailwindStylesheet: './src/index.css',
  tailwindFunctions: ['twMerge', 'clsx', 'cn'],
  plugins: ['prettier-plugin-tailwindcss']
});

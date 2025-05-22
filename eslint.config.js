import { defineConfig } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo/base';
import unicorn from 'eslint-config-cheminfo/unicorn';
import globals from 'globals';

export default defineConfig(cheminfo, unicorn, {
  languageOptions: { globals: { ...globals.browser } },
});

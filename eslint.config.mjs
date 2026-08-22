import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // React Bits / Magic UI components intentionally use these animation patterns.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off'
    }
  },
  {
    // Registry components mirror upstream shadcn/Plate implementations.
    files: ['components/editor/**/*.tsx', 'components/ui/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'app/generated/**'
    ]
  }
]

export default eslintConfig

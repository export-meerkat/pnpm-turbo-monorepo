const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

/**
 * ESLint v9+ 차세대 플랫 설정(Flat Config) 전역 아키텍처 명세
 * 모노레포 환경에서 하위 패키지들을 단일 설정으로 통합 제어합니다.
 */
module.exports = tseslint.config(
  {
    // 정적 문법 검사 대상에서 제외할 빌드 산출물 및 임시 캐시 디렉토리 지정
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      'openapi.json',
      'scripts/**',
      'eslint.config.js',
      'docs/**',
      'packages/supabase/src/types/database.types.ts', // Supabase CLI 자동 생성 파일 제외
      'supabase/.temp/**', // Supabase CLI 로컬 연결 캐시 디렉토리 제외
      '**/next-env.d.ts', // Next.js 자동 생성 타입 선언 파일 제외
    ],
  },
  // ESLint 및 TypeScript 기술 스펙 추천 규칙 일괄 적용
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier 스타일 위반 사항을 빌드 타임 에러로 설정
      'prettier/prettier': 'error',
      // 안전한 런타임 타입 추론 유지를 위해 명시적 any 타입 선언 제한
      '@typescript-eslint/no-explicit-any': 'error',
      // 미사용 변수는 에러로 처리하되, 언더바(_) 접두사를 붙인 인자는 예외 허용 (BFF 핸들러용)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Prettier 서식 엔진과의 구문 해석 충돌 방지를 위한 통합 포맷터 잠금
  eslintConfigPrettier,
  // CommonJS 설정 파일(.js)에 대한 모듈 문법 호환성 처리
  {
    files: ['**/*.js'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);

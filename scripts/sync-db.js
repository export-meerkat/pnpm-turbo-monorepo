const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 프로젝트 최상위 루트의 .env 파일로부터 인프라 식별자 변수를 환경 변수에 바인딩
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * 원격 Supabase Cloud 스키마를 추적하여 로컬 타입스크립트 인터페이스로 자동 동기화하는 엔진
 * Windows/macOS/Linux 커널 간의 셸 환경 변수 문법 편차를 Node.js 런타임 단에서 우회 제어합니다.
 */
function syncDatabaseTypes() {
  console.log('--- Initiating Supabase Database Schema Sync ---');

  const projectId = process.env.SUPABASE_PROJECT_ID;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!projectId || !accessToken) {
    console.error(
      'Configuration Error: SUPABASE_PROJECT_ID or SUPABASE_ACCESS_TOKEN is missing in .env',
    );
    process.exit(1);
  }

  // 구형 npm 커널 간섭 경고를 차단하기 위해 pnpm exec 독립 격리 실행 파이프라인 가동
  const command = `pnpm exec supabase gen types typescript --project-id="${projectId}"`;

  try {
    // 원격지 데이터베이스 스키마 스트림을 메모리에 안전하게 먼저 확보 (대용량 버퍼 10MB 할당)
    const rawSchemaTypes = execSync(command, {
      env: {
        ...process.env,
      },
      maxBuffer: 1024 * 1024 * 10,
    });

    const outputPath = path.join(__dirname, '../packages/supabase/src/types/database.types.ts');
    const dir = path.dirname(outputPath);

    // 타겟 디렉토리 유실 대비 파일 시스템 가상 폴더 동적 생성
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 원천 파일 오버라이트 실행 (이 파일은 사람이 직접 수정하지 않는 인프라 제어 영역입니다)
    fs.writeFileSync(outputPath, rawSchemaTypes, 'utf-8');
    console.log('Success: Database types synchronized successfully.');
    console.log(`Output Path: ${outputPath}`);
  } catch (error) {
    console.error('Runtime Error: Failed to fetch infrastructure schema from remote host.');
    if (error.stderr) console.error(error.stderr.toString());
    process.exit(1);
  }
}

syncDatabaseTypes();

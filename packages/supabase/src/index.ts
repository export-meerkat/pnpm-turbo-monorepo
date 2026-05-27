import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

/**
 * 🔒 1. 브라우저 및 클라이언트 사이드 전용 공개 익명 클라이언트 생성 싱글톤
 * RLS(행 레벨 보안) 정책의 엄격한 통제를 받으며 공통코드 조회 데이터를 안전하게 피딩합니다.
 */
export const getSupabaseBrowserClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
};

/**
 * 🔑 2. 백엔드 BFF(Next.js 서버 레이어) 전용 마스터 어드민 클라이언트 생성 싱글톤
 * RLS 보안 자물쇠를 완전히 우회(Bypass)하여 업로드 및 숏링크 발급 인프라를 총괄합니다.
 */
export const getSupabaseAdminClient = () => {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Secret Keys 매핑 확인
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
};

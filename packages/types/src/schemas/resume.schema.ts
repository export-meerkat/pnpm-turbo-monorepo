import { z } from 'zod';

/**
 * 이력서 입력 폼(Resume Input Form) 전용 데이터 규격 명세서
 * 프론트엔드 이력서 작성 화면의 Form Validation과 백엔드 BFF 레이어의 데이터 검증에 동일하게 공유됩니다.
 */
export const PdfGenerateRequestSchema = z.object({
  // 이력서 파일명 및 타이틀 데이터 유효성 강제 (공백 입력 제한)
  title: z.string().min(1, { message: '이력서 제목은 최소 1글자 이상 입력되어야 합니다.' }),

  // 지원자 핵심 인적사항 서브 도메인 격리 구조체
  personal: z.object({
    name: z.string().min(1, { message: '지원자 성명은 필수 입력 항목입니다.' }),
    // 이메일 포맷 유효성 검증 규격
    email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
  }),

  // Supabase 원천 기술 스택 데이터(common_codes) 참조 전용 배열 규격
  skills: z
    .array(z.string())
    .min(1, { message: '최소 1개 이상의 전문 기술 스택이 지정되어야 합니다.' }),
});

// 외부 프레임워크 애플리케이션들이 개별 인터페이스 선언 없이 참조할 정적 타입 추론 명세 추출
export type PdfGenerateRequest = z.infer<typeof PdfGenerateRequestSchema>;

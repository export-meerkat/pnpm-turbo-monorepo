const fs = require('fs');
const path = require('path');
const { generateSchema } = require('@anatine/zod-openapi');

// @expo-meerkat/types 패키지가 tsc 컴파일을 마친 물리 dist 경로를 절대 주소로 바인딩
const targetPath = path.resolve(__dirname, '../packages/types/dist/index.js');
const { PdfGenerateRequestSchema } = require(targetPath);

/**
 * 전역 Zod 데이터 명세를 빌드 타임에 실시간 리버스 엔지니어링하여 OpenAPI 3.0 사양서를 추출하는 빌더
 */
function buildOpenApiSpecification() {
  console.log('--- Initiating OpenAPI Specification Build ---');

  // Zod 구조체 원본 도면을 글로벌 엔터프라이즈 OpenAPI JSON Schema 표준 규격으로 자동 변환
  const pdfGenerateSchema = generateSchema(PdfGenerateRequestSchema);

  // OpenAPI 3.0.0 글로벌 표준 사양에 맞춘 정적 문서 객체 구조 설계
  const openApiDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Resume PDF Compiler BFF API Specification',
      version: '0.1.0',
      description:
        'API contract specification for Next.js BFF gateway layer handling Resume Input Form submission requests.',
    },
    paths: {
      '/api/resume/pdf': {
        post: {
          summary: 'Generate resume PDF binary and issue temporary storage signed URL',
          operationId: 'generateResumePdf',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: pdfGenerateSchema,
              },
            },
          },
          responses: {
            200: {
              description: 'Successful compilation and generation of signed resource URL',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      signedUrl: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: { description: 'Bad Request: Schema validation failed via API data contract' },
            500: { description: 'Internal Server Error: Runtime compile exception occurred' },
          },
        },
      },
    },
  };

  // 프로젝트 최상위 마스터 루트 디렉토리 경로로 openapi.json 정적 파일 출력 지정
  const outputPath = path.join(__dirname, '../openapi.json');

  // 가공 완료된 OpenAPI 문서를 포맷팅 정렬하여 JSON 파일로 최종 배포 적재 실행
  fs.writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2), 'utf-8');

  console.log(`Success: Static API document generated at ${outputPath}`);
}

buildOpenApiSpecification();

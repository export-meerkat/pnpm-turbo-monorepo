// CSS 파일 임포트에 대한 글로벌 타입 세이프티 규격 정의
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

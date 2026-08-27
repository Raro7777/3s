// ============================================================
// 제품 카탈로그 — 이 파일만 수정하면 사이트에 바로 반영됩니다.
//
//  price    : 출고가(원). 최저 용량 기준이며 "~" 표기로 노출됩니다.
//             ※ 출고가는 제조사/통신사 정책에 따라 변동될 수 있으니
//               개통 전 최신 가격을 확인하고 수정하세요.
//  storages : 판매 용량 옵션
//  colors   : [{ name, hex }] — 색상 스와치 (모르면 빈 배열 [])
//  badge    : "NEW" | "인기" | "가성비" | ""
//  img      : 이미지 경로(확장자 제외). images/ 폴더에
//             같은 이름의 .png / .jpg / .webp 를 넣으면 자동 표시됩니다.
//  official : 공식 제품 페이지 (이미지 다운로드 출처)
// ============================================================

const PRODUCTS = [
  // ---------------- 삼성 ----------------
  {
    id: "galaxy-z-fold8-ultra",
    brand: "samsung",
    name: "갤럭시 Z 폴드8 울트라",
    tagline: "역대 가장 얇은 폴드 · 8형 대화면 · 215g",
    price: 2577300,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "크림", hex: "#f0e9dc" },
      { name: "그린 쉐도우", hex: "#6b7a5e" }
    ],
    badge: "NEW",
    img: "images/galaxy-z-fold8-ultra",
    official: "https://www.samsung.com/sec/smartphones/galaxy-z-fold8/"
  },
  {
    id: "galaxy-z-fold8",
    brand: "samsung",
    name: "갤럭시 Z 폴드8",
    tagline: "펼치면 태블릿, 접으면 스마트폰",
    price: 2278100,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "라벤더", hex: "#cabced" },
      { name: "크림", hex: "#f0e9dc" },
      { name: "그라파이트", hex: "#4a4a4f" },
      { name: "피스타치오", hex: "#cfd9b4" }
    ],
    badge: "NEW",
    img: "images/galaxy-z-fold8",
    official: "https://www.samsung.com/sec/smartphones/galaxy-z-fold8/"
  },
  {
    id: "galaxy-z-flip8",
    brand: "samsung",
    name: "갤럭시 Z 플립8",
    tagline: "감성 폴더블의 정점 · 더 강력해진 플렉스윈도우",
    price: 1683000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "핑크", hex: "#f3c9d3" },
      { name: "민트", hex: "#cfe8d9" },
      { name: "크림", hex: "#f0e9dc" },
      { name: "그라파이트", hex: "#4a4a4f" }
    ],
    badge: "NEW",
    img: "images/galaxy-z-flip8",
    official: "https://www.samsung.com/sec/smartphones/galaxy-z-flip8/"
  },
  {
    id: "galaxy-s26-ultra",
    brand: "samsung",
    name: "갤럭시 S26 울트라",
    tagline: "2억 화소 카메라 · S펜 내장 · 프라이버시 디스플레이",
    price: 1797400,
    storages: ["256GB", "512GB", "1TB"],
    colors: [
      { name: "블랙", hex: "#1c1c1e" },
      { name: "코발트 바이올렛", hex: "#6d5ba8" },
      { name: "스카이 블루", hex: "#a7c8e8" },
      { name: "화이트", hex: "#f3f3f0" }
    ],
    badge: "인기",
    img: "images/galaxy-s26-ultra",
    official: "https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/"
  },
  {
    id: "galaxy-s26-plus",
    brand: "samsung",
    name: "갤럭시 S26+",
    tagline: "대화면 플래그십 · 갤럭시 AI",
    price: 1452000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "블랙", hex: "#1c1c1e" },
      { name: "스카이 블루", hex: "#b9d4ea" },
      { name: "실버 쉐도우", hex: "#c9cdd2" },
      { name: "핑크 골드", hex: "#efc8b8" },
      { name: "화이트", hex: "#f3f3f0" }
    ],
    badge: "",
    img: "images/galaxy-s26-plus",
    official: "https://www.samsung.com/sec/smartphones/galaxy-s26/"
  },
  {
    id: "galaxy-s26",
    brand: "samsung",
    name: "갤럭시 S26",
    tagline: "손에 꼭 맞는 컴팩트 플래그십",
    price: 1254000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "스카이 블루", hex: "#b9d4ea" },
      { name: "핑크 골드", hex: "#efc8b8" },
      { name: "블랙", hex: "#1c1c1e" },
      { name: "화이트", hex: "#f3f3f0" }
    ],
    badge: "",
    img: "images/galaxy-s26",
    official: "https://www.samsung.com/sec/smartphones/galaxy-s26/"
  },

  // ---------------- 애플 ----------------
  {
    id: "iphone-17-pro-max",
    brand: "apple",
    name: "아이폰 17 프로 맥스",
    tagline: "아이폰의 정점 · 역대 최장 배터리",
    price: 1990000,
    storages: ["256GB", "512GB", "1TB"],
    colors: [
      { name: "코스믹 오렌지", hex: "#c46e2f" },
      { name: "딥 블루", hex: "#2c3e5c" },
      { name: "실버", hex: "#d8d8d3" }
    ],
    badge: "인기",
    img: "images/iphone-17-pro-max",
    official: "https://www.apple.com/kr/iphone-17-pro/"
  },
  {
    id: "iphone-17-pro",
    brand: "apple",
    name: "아이폰 17 프로",
    tagline: "A19 Pro 칩 · 프로 카메라 시스템",
    price: 1790000,
    storages: ["256GB", "512GB", "1TB"],
    colors: [
      { name: "코스믹 오렌지", hex: "#c46e2f" },
      { name: "딥 블루", hex: "#2c3e5c" },
      { name: "실버", hex: "#d8d8d3" }
    ],
    badge: "",
    img: "images/iphone-17-pro",
    official: "https://www.apple.com/kr/iphone-17-pro/"
  },
  {
    id: "iphone-air",
    brand: "apple",
    name: "아이폰 에어",
    tagline: "역대 가장 얇은 아이폰 · 5.6mm · 165g",
    price: 1590000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "스카이 블루", hex: "#b8d3e8" },
      { name: "라이트 골드", hex: "#e8dcc0" },
      { name: "클라우드 화이트", hex: "#f0efea" },
      { name: "스페이스 블랙", hex: "#2a2a2c" }
    ],
    badge: "",
    img: "images/iphone-air",
    official: "https://www.apple.com/kr/iphone-air/"
  },
  {
    id: "iphone-17",
    brand: "apple",
    name: "아이폰 17",
    tagline: "120Hz ProMotion · 4,800만 화소 카메라",
    price: 1287000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "라벤더", hex: "#d5c8e8" },
      { name: "미스트 블루", hex: "#b8c8d8" },
      { name: "세이지", hex: "#c2ccb8" },
      { name: "화이트", hex: "#f5f5f2" },
      { name: "블랙", hex: "#232325" }
    ],
    badge: "",
    img: "images/iphone-17",
    official: "https://www.apple.com/kr/iphone-17/"
  },
  {
    id: "iphone-17e",
    brand: "apple",
    name: "아이폰 17e",
    tagline: "A19 칩을 가장 합리적인 가격으로",
    price: 990000,
    storages: ["256GB", "512GB"],
    colors: [
      { name: "소프트 핑크", hex: "#f2d4cf" },
      { name: "화이트", hex: "#f5f5f2" },
      { name: "블랙", hex: "#232325" }
    ],
    badge: "가성비",
    img: "images/iphone-17e",
    official: "https://www.apple.com/kr/iphone-17e/"
  }
];

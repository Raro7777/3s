// ============================================================
// 제품 상세 데이터 — 상세 화면(사양표·갤러리·색상별 이미지)
//
//  specs     : [항목, 내용] 배열 — 공식 페이지 기준 요약
//  gallery   : 추가 각도/색상 컷 (images/detail/)
//  colorImgs : 색상명 → 이미지 경로. products.js의 색상명과
//              일치하면 상세 화면에서 색상 클릭 시 이미지가 바뀝니다.
// ============================================================

const DETAILS = {
  // ---------------- 삼성 ----------------
  "galaxy-z-fold8-ultra": {
    specs: [
      ["폼팩터", "폴더블 (북 타입)"],
      ["메인 디스플레이", "8형 몰입형 대화면"],
      ["두께 · 무게", "펼침 4.1mm · 215g — 역대 가장 얇고 가벼운 폴드"],
      ["내부 전면 카메라", "10MP · 100도 화각"],
      ["배터리", "4,400mAh"],
      ["용량", "256GB · 512GB"],
      ["색상", "크림 · 그린 쉐도우(삼성닷컴 전용)"]
    ],
    gallery: ["images/detail/galaxy-z-fold8-ultra-g1.jpg", "images/detail/galaxy-z-fold8-ultra-g2.jpg"]
  },
  "galaxy-z-fold8": {
    specs: [
      ["폼팩터", "폴더블 (북 타입)"],
      ["디스플레이", "대화면 메인 + 커버 디스플레이"],
      ["갤럭시 AI", "My FanCam 자동 추적 촬영 · 에이전틱 AI"],
      ["콘텐츠 최적화", "화면비 최적화 멀티태스킹"],
      ["용량", "256GB · 512GB"],
      ["색상", "라벤더 · 크림 · 그라파이트 · 피스타치오(전용)"]
    ],
    gallery: []
  },
  "galaxy-z-flip8": {
    specs: [
      ["폼팩터", "폴더블 (플립)"],
      ["커버 디스플레이", "대형 플렉스윈도우 · 나우 브리프"],
      ["카메라 기능", "캠코더 그립 · 슈퍼 스테디(수평 고정) · 듀얼 레코딩"],
      ["셀피", "접은 채로 후면 카메라 셀피"],
      ["용량", "256GB · 512GB"],
      ["색상", "핑크 · 민트 · 크림 · 그라파이트"]
    ],
    gallery: []
  },
  "galaxy-s26-ultra": {
    specs: [
      ["디스플레이", "6.9형 · 반사 방지 · QHD+"],
      ["카메라", "200MP 광각 · F1.4 — 야간 촬영 강화"],
      ["S펜", "내장"],
      ["프라이버시 디스플레이", "측면 시야각 차단 (스마트폰 세계 최초)"],
      ["배터리", "5,000mAh · 최대 31시간 영상 재생"],
      ["프로세서", "2nm 엑시노스 2600"],
      ["용량", "256GB · 512GB · 1TB"]
    ],
    gallery: ["images/detail/galaxy-s26-ultra-g1.jpg", "images/detail/galaxy-s26-ultra-g2.jpg"]
  },
  "galaxy-s26-plus": {
    specs: [
      ["디스플레이", "대화면 · QHD+ 화질 지원"],
      ["카메라", "50MP 광각 + 12MP 초광각 + 망원"],
      ["배터리", "4,900mAh · 최대 31시간 영상 재생"],
      ["갤럭시 AI", "나우 브리프 · 포토 어시스트 · 서클 투 서치"],
      ["용량", "256GB · 512GB"]
    ],
    gallery: ["images/detail/galaxy-s26-plus-g1.jpg", "images/detail/galaxy-s26-plus-g2.jpg"]
  },
  "galaxy-s26": {
    specs: [
      ["디스플레이", "컴팩트 6.3형 (대각 159.3mm)"],
      ["카메라", "50MP 광각 트리플 카메라"],
      ["갤럭시 AI", "서클 투 서치 · 빅스비 · 포토 어시스트"],
      ["용량", "256GB · 512GB"],
      ["색상", "스카이 블루 · 핑크 골드 · 블랙 · 화이트 외"]
    ],
    gallery: ["images/detail/galaxy-s26-g1.jpg", "images/detail/galaxy-s26-g2.jpg"]
  },

  // ---------------- 애플 ----------------
  "iphone-17-pro-max": {
    specs: [
      ["디스플레이", "6.9형 Super Retina XDR · ProMotion 120Hz"],
      ["칩", "A19 Pro"],
      ["카메라", "48MP Fusion 트리플 (광각 · 초광각 · 망원)"],
      ["전면 카메라", "센터 스테이지 전면 카메라"],
      ["배터리", "최대 37시간 비디오 재생 — 역대 아이폰 최장"],
      ["디자인", "히트포지드 알루미늄 유니바디 · 베이퍼 챔버 냉각"],
      ["용량", "256GB · 512GB · 1TB"]
    ],
    colorImgs: {
      "코스믹 오렌지": "images/detail/iphone-17-pro-max-cosmicorange.png",
      "딥 블루": "images/detail/iphone-17-pro-max-deepblue.png",
      "실버": "images/detail/iphone-17-pro-max-silver.png"
    },
    gallery: ["images/detail/iphone-17-pro-max-av2.jpg", "images/detail/iphone-17-pro-max-av3.jpg"]
  },
  "iphone-17-pro": {
    specs: [
      ["디스플레이", "6.3형 Super Retina XDR · ProMotion 120Hz"],
      ["칩", "A19 Pro"],
      ["카메라", "48MP Fusion 트리플 (광각 · 초광각 · 망원)"],
      ["전면 카메라", "센터 스테이지 전면 카메라"],
      ["배터리", "최대 33시간 비디오 재생"],
      ["디자인", "히트포지드 알루미늄 유니바디 · 베이퍼 챔버 냉각"],
      ["용량", "256GB · 512GB · 1TB"]
    ],
    colorImgs: {
      "코스믹 오렌지": "images/detail/iphone-17-pro-cosmicorange.png",
      "딥 블루": "images/detail/iphone-17-pro-deepblue.png",
      "실버": "images/detail/iphone-17-pro-silver.png"
    },
    gallery: ["images/detail/iphone-17-pro-av2.jpg", "images/detail/iphone-17-pro-av3.jpg"]
  },
  "iphone-air": {
    specs: [
      ["디자인", "두께 5.6mm · 165g — 역대 가장 얇은 아이폰"],
      ["디스플레이", "6.5형 Super Retina XDR · ProMotion 120Hz"],
      ["칩", "A19 Pro"],
      ["카메라", "48MP Fusion 카메라"],
      ["배터리", "최대 27시간 비디오 재생"],
      ["소재", "티타늄 프레임"],
      ["용량", "256GB · 512GB"]
    ],
    colorImgs: {
      "스카이 블루": "images/detail/iphone-air-skyblue.png",
      "라이트 골드": "images/detail/iphone-air-lightgold.png",
      "클라우드 화이트": "images/detail/iphone-air-cloudwhite.png",
      "스페이스 블랙": "images/detail/iphone-air-spaceblack.png"
    },
    gallery: ["images/detail/iphone-air-av2.jpg", "images/detail/iphone-air-av3.jpg"]
  },
  "iphone-17": {
    specs: [
      ["디스플레이", "6.3형 · ProMotion 120Hz (기본형 최초)"],
      ["칩", "A19"],
      ["카메라", "48MP Fusion 듀얼 (광각 · 초광각)"],
      ["전면 카메라", "센터 스테이지 전면 카메라"],
      ["배터리", "최대 30시간 비디오 재생"],
      ["용량", "256GB · 512GB"]
    ],
    colorImgs: {
      "라벤더": "images/detail/iphone-17-lavender.png",
      "미스트 블루": "images/detail/iphone-17-mistblue.png",
      "세이지": "images/detail/iphone-17-sage.png",
      "화이트": "images/detail/iphone-17-white.png",
      "블랙": "images/detail/iphone-17-black.png"
    },
    gallery: ["images/detail/iphone-17-av2.jpg", "images/detail/iphone-17-av3.jpg"]
  },
  "iphone-17e": {
    specs: [
      ["디스플레이", "6.1형 Super Retina XDR"],
      ["칩", "A19"],
      ["카메라", "48MP Fusion 2-in-1 카메라"],
      ["Apple Intelligence", "지원"],
      ["배터리", "최대 26시간 비디오 재생"],
      ["용량", "256GB · 512GB"]
    ],
    colorImgs: {
      "소프트 핑크": "images/detail/iphone-17e-softpink.png",
      "화이트": "images/detail/iphone-17e-white.png",
      "블랙": "images/detail/iphone-17e-black.png"
    },
    gallery: ["images/detail/iphone-17e-av2.jpg"]
  }
};

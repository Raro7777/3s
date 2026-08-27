# 제품 이미지 넣는 방법

공식 홈페이지에서 받은 제품 이미지를 **이 폴더에 아래 파일명으로 저장**하면
사이트에 자동으로 표시됩니다. (이미지를 넣기 전까지는 깔끔한 플레이스홀더가 표시됩니다)

- 확장자는 `.png` / `.jpg` / `.webp` 모두 인식합니다 (png 권장 — 배경 투명)
- 정사각형에 가까운 제품 단독 컷(누끼)이 가장 예쁘게 나옵니다
- 파일명은 아래 표와 **정확히 일치**해야 합니다 (소문자, 하이픈)

## 파일명 목록

| 모델 | 저장할 파일명 | 이미지 받는 곳 (공식 페이지) |
|---|---|---|
| 갤럭시 Z 폴드8 울트라 | `galaxy-z-fold8-ultra.png` | https://www.samsung.com/sec/smartphones/galaxy-z-fold8/ |
| 갤럭시 Z 폴드8 | `galaxy-z-fold8.png` | https://www.samsung.com/sec/smartphones/galaxy-z-fold8/ |
| 갤럭시 Z 플립8 | `galaxy-z-flip8.png` | https://www.samsung.com/sec/smartphones/galaxy-z-flip8/ |
| 갤럭시 S26 울트라 | `galaxy-s26-ultra.png` | https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/ |
| 갤럭시 S26+ | `galaxy-s26-plus.png` | https://www.samsung.com/sec/smartphones/galaxy-s26/ |
| 갤럭시 S26 | `galaxy-s26.png` | https://www.samsung.com/sec/smartphones/galaxy-s26/ |
| 아이폰 17 프로 맥스 | `iphone-17-pro-max.png` | https://www.apple.com/kr/iphone-17-pro/ |
| 아이폰 17 프로 | `iphone-17-pro.png` | https://www.apple.com/kr/iphone-17-pro/ |
| 아이폰 에어 | `iphone-air.png` | https://www.apple.com/kr/iphone-air/ |
| 아이폰 17 | `iphone-17.png` | https://www.apple.com/kr/iphone-17/ |
| 아이폰 17e | `iphone-17e.png` | https://www.apple.com/kr/iphone-17e/ |

> 삼성 보도자료 이미지는 [삼성 뉴스룸](https://news.samsung.com/kr) /
> [Samsung Mobile Press](https://www.samsungmobilepress.com)에서도 받을 수 있습니다.

## 이미지 저장 팁

1. 공식 제품 페이지에서 제품 이미지에 마우스 오른쪽 클릭 → **"이미지를 다른 이름으로 저장"**
2. 위 표의 파일명으로 저장 (예: `galaxy-s26-ultra.png`)
3. 이 폴더(`images/`)에 넣기 → 끝!

## 새 모델을 추가하려면

`js/products.js`에 항목을 추가하고, 같은 이름의 이미지를 이 폴더에 넣으면 됩니다.

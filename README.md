# 폰마트 — 삼성·애플 스마트폰 쇼핑몰

삼성 갤럭시 / 애플 아이폰 판매점을 위한 원페이지 쇼핑몰입니다.
제품 카탈로그, 이벤트·혜택, 구매 가이드, FAQ, **최저가 상담 신청 폼**으로 구성되어 있으며
프레임워크 없이 순수 HTML/CSS/JS라 어떤 호스팅에도 바로 올릴 수 있습니다.

## 폴더 구조

```
index.html        ← 메인 페이지 (섹션 구성/문구 수정)
css/style.css     ← 디자인
js/config.js      ← ★ 매장 설정 (매장명, 전화번호, 카톡, Supabase)
js/products.js    ← ★ 제품 목록 (모델, 출고가, 용량, 색상)
js/app.js         ← 동작 로직 (수정할 일 거의 없음)
images/           ← 제품 이미지 (README.md에 넣는 방법 안내)
```

## 처음 할 일 3가지

1. **`js/config.js`** — 매장명과 전화번호를 실제 값으로 변경
2. **`images/`** — 공식 홈페이지에서 받은 제품 이미지를 안내된 파일명으로 저장
   (넣기 전에는 플레이스홀더가 표시되므로 사이트는 바로 사용 가능)
3. **`index.html` 푸터** — 사업자 정보(대표자명, 사업자등록번호, 통신판매업신고, 주소) 입력

## 로컬에서 확인

`index.html`을 브라우저로 열기만 하면 됩니다. (서버 불필요)

## 배포 (GitHub Pages)

1. 이 브랜치를 `main`에 머지
2. GitHub 저장소 → Settings → Pages → Branch: `main`, 폴더 `/ (root)` 선택
3. 몇 분 뒤 `https://<계정명>.github.io/3s/` 로 접속 가능

커스텀 도메인(예: 폰마트.kr)도 같은 화면에서 연결할 수 있습니다.

## 가격·모델 수정

`js/products.js`에서 수정합니다. 출고가는 참고용으로 표기되며
("출고가 N원~ / 실구매가는 상담 시 안내") 통신사 정책 변경 시 이 파일만 고치면 됩니다.

## 상담신청 DB 연동 (선택)

기본값: 상담 신청 시 **문자(SMS) 앱**이 열려 신청 내용이 자동 입력됩니다.

Supabase를 연동하면 신청 내역이 데이터베이스에 자동 저장됩니다:

1. Supabase 프로젝트에 아래 테이블 생성:

```sql
create table phone_consultations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  model text,
  carrier text,
  purchase_type text,
  internet_bundle boolean default false,
  message text
);

alter table phone_consultations enable row level security;

-- 웹사이트(익명)에서는 "신청 등록"만 가능하고 조회는 불가능하게
create policy "anyone can insert" on phone_consultations
  for insert to anon with check (true);
```

2. `js/config.js`의 `supabaseUrl`, `supabaseAnonKey`에 프로젝트 값 입력
3. 신청 내역은 Supabase 대시보드 → Table Editor에서 확인

## 법적 고지 관련

- 푸터에 "공식 스토어가 아닌 판매점" 고지와 상표권 귀속 문구가 포함되어 있습니다.
- 상담 폼에는 개인정보 수집·이용 동의(필수) 체크가 포함되어 있습니다.
- 제품 이미지는 각 제조사 공식 홈페이지에서 내려받아 사용하며, 저작권은 각 제조사에 있습니다.

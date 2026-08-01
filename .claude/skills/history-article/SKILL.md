---
name: history-article
description: contents/history/ 의 투자 역사 사건 글을 쓰거나 고칠 때 활성화된다. 출처를 먼저 확인하고 그 위에 본문을 쓰는 순서를 강제하고, 본문 수치를 타임라인 차트·배지와 일치시킨다.
---

# History Article

`/timeline` 페이지의 사건 글을 쓰는 절차다. 일반 블로그 글과 다른 점이 두 가지 있다.

1. **글 위에 차트가 자동으로 뜬다.** 본문 수치가 차트·배지와 어긋나면 독자가 같은 화면에서 다른 숫자 두 개를 본다.
2. **역사적 사실을 다룬다.** 아는 내용으로 쓰고 나중에 표준 문헌을 참고 자료에 적으면 안 된다.

## 순서 (이 순서를 바꾸지 않는다)

### 1. 데이터에서 수치를 뽑는다

`data/timeline/series.json` 에 7개 계열이 1900-01 부터 월간으로 들어 있다.
`sp500`, `nasdaq`, `gold`, `ust10y`, `policyRate`, `cpi`, `kospi`.

```bash
npx tsx -e "
const f=require('./data/timeline/series.json');
const at=(k,y)=>{const h=f.series[k].values.find(p=>p[0]===y);return h?h[1]:null;};
const pct=(k,a,b)=>((at(k,b)/at(k,a)-1)*100).toFixed(2);
console.log('지수', pct('sp500','PEAK','TROUGH')+'%');
"
```

회복 시점, 최대·최소, 특정 구간의 경로 같은 것도 여기서 계산한다.
**손으로 숫자를 지어내지 않는다.**

### 2. 출처를 먼저 확인한다

본문에 쓸 역사적 사실을 **쓰기 전에** 1차 출처로 확인한다. 이미 확인해 둔 곳:

| 출처 | 무엇을 확인할 수 있나 |
|---|---|
| [NBER 경기순환 기준일](https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions) | 침체 시작·종료·기간 |
| [연준 사료](https://www.federalreservehistory.org/) | 사건별 에세이. 날짜와 정책 대응 |
| [연준 공개시장조작 기록](https://www.federalreserve.gov/monetarypolicy/openmarket_archive.htm) | 금리 변경 일자·폭 |
| [FOMC 성명 아카이브](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) | QE 같은 조치의 원문과 금액 |
| [FDIC](https://www.fdic.gov/history/1930-1939) | 은행 파산, 예금보험 |

확인하지 못한 사실은 **쓰지 않는다.** "널리 알려진 바로는" 으로 눙치지도 않는다.

### 3. 본문을 쓴다

- 수치는 1단계에서 뽑은 값, 사실은 2단계에서 확인한 것만 쓴다
- 차트가 본문 위에 자동으로 뜨므로 차트를 말로 다시 설명하지 않는다. **차트에서 무엇을 봐야 하는지**를 쓴다
- 다른 사건 글과 링크로 연결한다 (`/history/{slug}`). 비교가 이 페이지의 핵심이다
- 저장소 규칙: 이모지 금지, ASCII 대신 Mermaid, 마지막 본문 섹션은 "마무리",
  heading 은 `content-heading-style` 스킬의 번호 체계

### 4. 검사를 돌린다

```bash
npx tsx scripts/generateStaticData.ts   # timeline.json 갱신
npm run check:content                    # 기계적 검사
```

`check:content` 는 실제로 겪은 오류 5종을 잡는다. 통과해야 다음으로 간다.

### 5. 브라우저에서 렌더링을 본다

```bash
npm run build && npx serve out -l 3100
```

**이 단계를 건너뛰지 않는다.** 마크다운 함정 세 가지가 전부 여기서만 발견됐다.
차트 2종, 표, 목차, 내부 링크, 다크모드를 확인한다.

## 한국어 마크다운 함정

전부 실제로 당한 것들이다. `check:content` 가 잡지만 원인을 알아두면 애초에 안 쓰게 된다.

| 함정 | 왜 | 해결 |
|---|---|---|
| `**1.75%**까지` | 강조가 문장부호로 끝나고 조사가 붙으면 별표가 리터럴로 남는다. `**1954년 9월**이` 처럼 한글로 끝나면 정상이라 헷갈린다 | 조사를 강조 안으로: `**1.75%까지**` |
| `1~3월, 그리고 9~12월` | 한 줄에 물결표가 둘이면 GFM 취소선이 된다 | 문장을 바꾼다: `1월부터 3월까지` |
| `](...Exuberance_(book))` | URL 의 괄호에서 링크가 잘린다 | `%28` `%29` 로 인코딩 |

## frontmatter

```yaml
event:
  kind: drawdown          # 또는 moment
  peak: 2007-10           # moment 면 at 하나만
  trough: 2009-03
  label: 금융위기          # 차트 마커용 짧은 라벨
  summary: 한 줄 요약      # 사건 카드에서 배지 바로 위에 나온다
  headlineDrawdown: -56.8 # 선택. 아래 설명 참고
stub: false               # 본문을 쓰면 false
```

**`summary` 에 퍼센트를 쓸 때는 배지 값과 맞춘다.** 카드에서 위아래로 붙어 나온다.
`check:content` 가 이걸 검사한다.

**`headlineDrawdown` 은 손으로 넣는 유일한 숫자다.**
Shiller S&P 500 이 월중 평균이고 구간도 월 단위라 자동 계산이 통상 인용 수치와 벌어진다
(코로나: 자동 -19.07% vs 통상 -34%). 일간 종가 기준 고점→저점을 확인해서 넣되,
자동 계산과 3%p 이상 차이 날 때만 넣는다. **차트와 나머지 지표는 언제나 자동 계산이다.**

## 참고 자료 섹션

- 본문이 다룬 지표는 전부 출처가 있어야 한다. 금을 한 절 쓰고 금 출처가 없으면 안 된다
- 항목마다 링크를 건다. 책은 위키백과에 문서가 있으면 그쪽, 없으면 Open Library
  (출판사 페이지는 봇 차단이 잦아 확인이 어렵다)
- FRED 는 홈페이지가 아니라 실제로 쓴 시리즈로 건다 (`fred.stlouisfed.org/series/<ID>`)
- **그 시리즈가 그 사건의 연도를 실제로 덮는지 확인한다.** 계열마다 시작 연도가 다르고,
  `fetchTimelineData.ts` 가 오래된 구간을 다른 소스로 이어 붙인다. 1954년 사건에 `FEDFUNDS` 를 걸면 틀린 출처다.

  | 지표 | 이른 구간 | 이후 구간 |
  |---|---|---|
  | 정책금리 | `M13009USM156NNBR` NY연은 재할인율 (1914-11~1954-06) | `FEDFUNDS` (1954-07~) |
  | 10년물 | Shiller (~1961-12) | `DGS10` (1962-01~) |
  | 물가 | Shiller (~) | `CPIAUCNS` |
  | 금 | 법정 고정가 $20.67 → $35 | LBMA 시장가 (1968-04~) |
  | 나스닥 | 없음 | `NASDAQCOM` (1971-02~) |
  | 한국 | 없음 | `SPASTT01KRM661N` (1981~) |

  실제 사고: 1937년 글이 정책금리 출처로 `FEDFUNDS` 를 걸었다. 그 시리즈는 1954년에야 시작한다.
- 링크는 넣기 전에 응답을 확인한다

## 이 절차가 잡지 못하는 것

`check:content` 는 기계적 검사다. 아래는 1차 출처를 봐야만 알 수 있고, 실제로 이렇게 틀렸었다.

- "두 달 만에 2%p 올렸다" → 연준 기록을 보니 **일주일**이었다 (1931-10-09, 10-16)
- "FDIC 가 생겼고 글래스-스티걸법이 통과됐다" → **같은 법**이다 (1933년 은행법)
- "대공황 다음으로 깊은 낙폭" → 확인 범위를 넘는 일반화였다
- "당시 가장 큰 우려가 디플레이션이었다" → 근거가 없었다

**2단계를 건너뛰면 이런 것들이 그대로 나간다.**

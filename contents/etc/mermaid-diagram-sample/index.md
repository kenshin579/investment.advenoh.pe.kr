---
title: "Mermaid 다이어그램 샘플"
description: "블로그에서 Mermaid 다이어그램을 사용하는 방법과 다양한 다이어그램 유형 샘플입니다."
date: 2025-01-23
category: Etc
tags:
  - mermaid
  - diagram
  - 다이어그램
  - sample
---

## Flowchart (흐름도)

투자 의사결정 흐름도:

```mermaid
flowchart TD
    A[종목 발굴] --> B{기본 분석 통과?}
    B -->|Yes| C[재무제표 분석]
    B -->|No| D[제외]
    C --> E{적정 가치 대비 저평가?}
    E -->|Yes| F[매수]
    E -->|No| G[관심 종목 등록]
    F --> H{목표가 도달?}
    H -->|Yes| I[매도]
    H -->|No| J[보유 유지]
```

## Sequence Diagram (시퀀스 다이어그램)

주식 주문 처리 과정:

```mermaid
sequenceDiagram
    participant 투자자
    participant 증권사
    participant 거래소
    participant 결제원

    투자자->>증권사: 매수 주문
    증권사->>거래소: 주문 전송
    거래소->>거래소: 매칭 처리
    거래소-->>증권사: 체결 통보
    증권사-->>투자자: 체결 알림
    거래소->>결제원: 결제 요청 (T+2)
    결제원-->>거래소: 결제 완료
```

## Pie Chart (파이 차트)

포트폴리오 자산 배분:

```mermaid
pie title 자산 배분 비율
    "국내 주식" : 30
    "해외 주식" : 35
    "채권" : 20
    "현금성 자산" : 10
    "대체 투자" : 5
```

## Gantt Chart (간트 차트)

투자 리밸런싱 일정:

```mermaid
gantt
    title 분기별 리밸런싱 계획
    dateFormat  YYYY-MM-DD
    section 1분기
    포트폴리오 점검     :a1, 2025-01-01, 7d
    리밸런싱 실행       :a2, after a1, 3d
    section 2분기
    포트폴리오 점검     :b1, 2025-04-01, 7d
    리밸런싱 실행       :b2, after b1, 3d
    section 3분기
    포트폴리오 점검     :c1, 2025-07-01, 7d
    리밸런싱 실행       :c2, after c1, 3d
```

## State Diagram (상태 다이어그램)

주식 주문 상태 변화:

```mermaid
stateDiagram-v2
    [*] --> 주문접수
    주문접수 --> 대기중: 주문 전송
    대기중 --> 체결: 매칭 성공
    대기중 --> 부분체결: 일부 매칭
    부분체결 --> 체결: 잔량 매칭
    부분체결 --> 취소: 잔량 취소
    대기중 --> 취소: 주문 취소
    체결 --> [*]
    취소 --> [*]
```

## 에러 케이스 (잘못된 문법)

아래는 의도적으로 잘못된 Mermaid 문법입니다. 에러 메시지가 표시되어야 합니다:

```mermaid
invalid diagram syntax !!!
this should show an error message
```

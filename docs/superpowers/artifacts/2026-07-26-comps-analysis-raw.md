# ALPHABET (GOOGL) — COMPARABLE COMPANY ANALYSIS

Alphabet (GOOGL) • Microsoft (MSFT) • Amazon (AMZN) • Meta Platforms (META) • Apple (AAPL, reference only)

As of 2026-07-26 | All figures in USD millions except per-share amounts, ratios, and multiples

---

## Data Source Hierarchy — Disclosure

This skill's data-source priority is: (1) S&P Kensho / FactSet / Daloopa MCP, (2) Bloomberg or
SEC EDGAR, (3) never web search as a primary source.

**Tier 1 (MCP) is unavailable in this environment.** No S&P Kensho, FactSet, Capital IQ, or
Daloopa connector is present. Bloomberg Terminal is also unavailable. This analysis therefore
executes at **Tier 2: SEC EDGAR primary filings**, retrieved through the XBRL Company Facts API
(`data.sec.gov/api/xbrl/companyfacts/`) and, where XBRL coverage failed, from the filed 10-Q
document text.

One class of input cannot be obtained at Tier 2 at all: **market prices**. SEC filings do not
contain share prices. Prices below are Tier 3 (public market-data aggregators), cross-verified
across two independent providers, and are flagged as such in every place they are used. Every
multiple in Section B inherits that Tier 3 dependency through its numerator.

Consensus/forward estimates, beta, and historical multiple bands are Tier 1 products with no
Tier 2 substitute. They are not estimated here. See Section F.

---

## Section A: Operating Statistics & Financial Metrics

All figures are last-twelve-months (LTM), built from four consecutive reported quarters per
company. Where a company does not tag a standalone fourth quarter in XBRL (the common case, as
Q4 appears only inside the annual figure), the quarter is derived as **FY total minus 9-month
year-to-date total** from the same filing family. Derivation is noted per company in Section G.

| Company | LTM window | Revenue | Rev growth YoY | Gross profit | Gross margin | Operating income | Op margin | D&A | EBITDA | EBITDA margin | Net income | Net margin |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **GOOGL** | 2025Q3–2026Q2 | 445,867 | +20.1% | 271,517 | 60.9% | 147,628 | 33.1% | 26,028 | 173,656 | 38.9% | **244,205** | **54.8%** |
| MSFT | FY25Q4–FY26Q3 | 318,273 | +17.9% | 217,410 | 68.3% | 148,957 | 46.8% | 35,600 | 184,557 | 58.0% | 125,216 | 39.3% |
| AMZN | 2025Q2–2026Q1 | 742,776 | +14.2% | 375,875 | 50.6% | 85,422 | 11.5% | 70,439 | 155,861 | 21.0% | 90,798 | 12.2% |
| META | 2025Q2–2026Q1 | 214,962 | +26.2% | 176,141 | 81.9% | 88,593 | 41.2% | 20,715 | 109,308 | 50.8% | 70,587 | 32.8% |
| *AAPL (ref)* | *FY25Q3–FY26Q2* | *451,442* | *+12.8%* | *216,071* | *47.9%* | *147,366* | *32.6%* | *12,610* | *159,976* | *35.4%* | *122,575* | *27.2%* |

**Prior-year LTM revenue used for the growth column** (same construction, one year earlier):
GOOGL 371,246; MSFT 269,982; AMZN 650,329; META 170,343; AAPL 400,132. All from the same
XBRL revenue series as the current-year figure.

**GOOGL net margin of 54.8% is not an operating result.** It exceeds the company's own
operating margin of 33.1%. See Section E — this figure must not be read as profitability.

### Source citations — Section A

| Company | Filings used | Accession numbers |
|---|---|---|
| GOOGL | 10-Q 2026-06-30; 10-Q 2026-03-31; 10-K 2025-12-31; 10-Q 2025-09-30 | [0001652044-26-000071](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000071/goog-20260630.htm), [0001652044-26-000048](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000048/goog-20260331.htm), [0001652044-26-000018](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/goog-20251231.htm), [0001652044-25-000091](https://www.sec.gov/Archives/edgar/data/1652044/000165204425000091/goog-20250930.htm) |
| MSFT | 10-Q 2026-03-31; 10-Q 2025-12-31; 10-Q 2025-09-30; 10-K 2025-06-30 | [0001193125-26-191507](https://www.sec.gov/Archives/edgar/data/789019/000119312526191507/msft-20260331.htm), [0001193125-26-027207](https://www.sec.gov/Archives/edgar/data/789019/000119312526027207/msft-20251231.htm), [0001193125-25-256321](https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm), [0000950170-25-100235](https://www.sec.gov/Archives/edgar/data/789019/000095017025100235/msft-20250630.htm) |
| AMZN | 10-Q 2026-03-31; 10-K 2025-12-31; 10-Q 2025-09-30; 10-Q 2025-06-30 | [0001018724-26-000014](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000014/amzn-20260331.htm), [0001018724-26-000004](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm), [0001018724-25-000123](https://www.sec.gov/Archives/edgar/data/1018724/000101872425000123/amzn-20250930.htm), [0001018724-25-000086](https://www.sec.gov/Archives/edgar/data/1018724/000101872425000086/amzn-20250630.htm) |
| META | 10-Q 2026-03-31; 10-K 2025-12-31; 10-Q 2025-09-30; 10-Q 2025-06-30 | [0001628280-26-028526](https://www.sec.gov/Archives/edgar/data/1326801/000162828026028526/meta-20260331.htm), [0001628280-26-003942](https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm), [0001628280-25-047240](https://www.sec.gov/Archives/edgar/data/1326801/000162828025047240/meta-20250930.htm), [0001628280-25-036791](https://www.sec.gov/Archives/edgar/data/1326801/000162828025036791/meta-20250630.htm) |
| AAPL | 10-Q 2026-03-28; 10-Q 2025-12-27; 10-K 2025-09-27; 10-Q 2025-06-28 | [0000320193-26-000013](https://www.sec.gov/Archives/edgar/data/320193/000032019326000013/aapl-20260328.htm), [0000320193-26-000006](https://www.sec.gov/Archives/edgar/data/320193/000032019326000006/aapl-20251227.htm), [0000320193-25-000079](https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm), [0000320193-25-000073](https://www.sec.gov/Archives/edgar/data/320193/000032019325000073/aapl-20250628.htm) |

---

## Section B: Valuation Multiples

Share prices are the **2026-07-24 regular-session close** (2026-07-26 is a Sunday; 07-24 Friday is
the last close). Each price was independently retrieved from two providers that agreed to the cent:

- Yahoo Finance chart API (`query1.finance.yahoo.com/v8/finance/chart/{ticker}`), `regularMarketTime` 2026-07-24 20:00 UTC
- stockanalysis.com quote pages (`stockanalysis.com/stocks/{ticker}/`), "last updated July 24, 2026, 4:00 PM EDT"

Both are Tier 3 sources. They are not SEC filings and carry no audit trail.

| Company | Share price | Shares out | Market cap | Cash + ST inv. | Total debt | Net cash / (debt) | Enterprise value | EV/Sales | EV/EBITDA | P/E |
|---|---|---|---|---|---|---|---|---|---|---|
| **GOOGL** | 319.74 | 12,230.0 | 3,910,420 | 242,474 | 100,164 | 142,310 | 3,768,110 | **8.45x** | **21.70x** | **16.01x** |
| MSFT | 381.70 | 7,429.0 | 2,835,649 | 78,272 | 40,262 | 38,010 | 2,797,639 | 8.79x | 15.16x | 22.65x |
| AMZN | 232.11 | 10,754.0 | 2,496,111 | 143,089 | 121,906 | 21,183 | 2,474,928 | 3.33x | 15.88x | 27.49x |
| META | 595.19 | 2,538.0 | 1,510,592 | 81,180 | 58,748 | 22,432 | 1,488,160 | 6.92x | 13.61x | 21.40x |
| *AAPL (ref)* | *333.02* | *14,667.7* | *4,884,637* | *68,507* | *82,714* | *(14,207)* | *4,898,844* | *10.85x* | *30.62x* | *39.85x* |

**Market cap reconciliation (independent check).** Market cap here is computed as
EDGAR-sourced share count times the cross-verified close price — it is not taken from an
aggregator. The computed values reconcile with stockanalysis.com's independently published
market caps to within rounding: GOOGL 3.910T vs 3.91T; MSFT 2.836T vs 2.84T; AMZN 2.496T vs
2.50T; META 1.511T vs 1.51T; AAPL 4.885T vs 4.89T. This confirms the share counts and prices
are mutually consistent.

### Share count sources

| Company | Shares outstanding | As of | Source |
|---|---|---|---|
| GOOGL | 12,230.0M (all classes) | 2026-06-30 | 10-Q 0001652044-26-000071, `CommonStockSharesOutstanding` |
| MSFT | 7,429.0M | 2026-03-31 | 10-Q 0001193125-26-191507, `CommonStockSharesOutstanding` |
| AMZN | 10,754.0M | 2026-03-31 | 10-Q 0001018724-26-000014, `CommonStockSharesOutstanding` |
| META | 2,538.0M (Class A 2,196M + Class B 342M) | 2026-03-31 | 10-Q 0001628280-26-028526, balance-sheet equity caption — **not available via XBRL Company Facts; read from filing text** |
| AAPL | 14,667.7M | 2026-03-28 | 10-Q 0000320193-26-000013, `CommonStockSharesOutstanding` |

### Balance-sheet component sources

| Company | Cash & equiv. | Short-term inv. | Debt (current + non-current) | Balance sheet date |
|---|---|---|---|---|
| GOOGL | 55,911 | 186,563 | 1,999 + 98,165 = 100,164 | 2026-06-30 |
| MSFT | 32,105 | 46,167 | 8,839 + 31,423 = 40,262 | 2026-03-31 |
| AMZN | 101,816 | 41,273 | 2,832 + 119,074 = 121,906 | 2026-03-31 |
| META | 23,426 | 57,754 | 0 + 58,748 = 58,748 | 2026-03-31 |
| AAPL | 45,572 | 22,935 | 8,310 + 74,404 = 82,714 | 2026-03-28 |

All from the same filings cited in Section A.

---

## Section C: Statistics

Peer set for all statistics is **MSFT, AMZN, META only**. AAPL is excluded from every statistic
per the reference-only instruction; its column above is shown in italics and never enters a
median, quartile, mean, max, or min.

| Metric | Max | 75th %ile | Median | 25th %ile | Min | Mean | GOOGL | GOOGL vs median |
|---|---|---|---|---|---|---|---|---|
| Revenue growth % | 26.19 | 22.04 | 17.89 | 16.05 | 14.22 | 19.43 | 20.10 | +12.4% |
| Gross margin % | 81.94 | 75.12 | 68.31 | 59.46 | 50.60 | 66.95 | 60.90 | -10.9% |
| Operating margin % | 46.80 | 44.01 | 41.21 | 26.36 | 11.50 | 33.17 | 33.11 | -19.7% |
| EBITDA margin % | 57.99 | 54.42 | 50.85 | 35.92 | 20.98 | 43.27 | 38.95 | -23.4% |
| Net margin % | 39.34 | 36.09 | 32.84 | 22.53 | 12.22 | 28.13 | 54.77 | +66.8% |
| EV/Sales | 8.79 | 7.86 | 6.92 | 5.13 | 3.33 | 6.35 | 8.45 | +22.1% |
| EV/EBITDA | 15.88 | 15.52 | 15.16 | 14.39 | 13.61 | 14.88 | 21.70 | +43.1% |
| P/E | 27.49 | 25.07 | 22.65 | 22.02 | 21.40 | 23.85 | 16.01 | -29.3% |

**Statistical caveat.** With n=3, the 75th and 25th percentiles are linear interpolations
between the max/median and median/min respectively. They contain no information beyond the three
underlying observations and should not be read as distribution parameters. The skill's standard
five-row statistics block is reproduced because it is the required output format, not because
n=3 supports quartile inference. Median and min/max are the only meaningful rows here.

---

## Section D: Premium / Discount Verdict

**The two multiple families disagree, and the disagreement is the finding.**

| Multiple | GOOGL | Peer median | Verdict |
|---|---|---|---|
| P/E (as reported) | 16.01x | 22.65x | **29.3% DISCOUNT** |
| EV/Sales | 8.45x | 6.92x | 22.1% premium |
| EV/EBITDA | 21.70x | 15.16x | **43.1% PREMIUM** |

A comps table that stopped here would be actively misleading. P/E says Alphabet is the cheapest
name in the group by a wide margin; EV/EBITDA says it is the most expensive. Both cannot be true.

The reconciliation is in Section E. **The EV-based multiples are correct and the P/E is the
broken one.** Enterprise-value multiples run off operating income and EBITDA, which are unaffected
by the distortion; P/E runs off net income, which is not.

**Adjusted verdict: Alphabet trades at roughly a 40% premium to its peer median on both
normalized-earnings and EBITDA bases.**

| Basis | GOOGL | Peer median | Premium |
|---|---|---|---|
| P/E adjusted for one-time securities gains | 31.89x | 22.65x | +40.8% |
| EV/EBITDA (unaffected, independent check) | 21.70x | 15.16x | +43.1% |

Two methodologically independent routes land 2.3 percentage points apart. That convergence is
the reason to trust the premium conclusion and discard the headline P/E.

**What this does not tell you.** Whether a ~40% premium is justified requires forward estimates
and Alphabet's own historical multiple band. Neither is obtainable at Tier 2. See Section F. This
analysis establishes *that* Alphabet trades at a premium to these three peers on 2026-07-24
prices and LTM fundamentals. It does not establish whether the stock is cheap or expensive.

---

## Section E: Earnings Quality — the GOOGL P/E Distortion

Alphabet's LTM net income of 244,205 exceeds its LTM operating income of 147,628 by 96,577.
Net income above operating income is possible but is a standing red flag; at this magnitude it
means the majority of reported profit was generated below the operating line.

Decomposition of GOOGL LTM (2025Q3–2026Q2), all from the filings cited in Section A:

| Line | LTM amount | XBRL tag |
|---|---|---|
| Operating income | 147,628 | `OperatingIncomeLoss` |
| Non-operating income, net | 151,641 | `NonoperatingIncomeExpense` |
| — of which gains on debt and equity securities | 149,012 | `DebtAndEquitySecuritiesGainLoss` |
| Pre-tax income | 299,269 | derived (147,628 + 151,641) |
| Net income | 244,205 | `NetIncomeLoss` |
| Implied effective tax rate | 18.40% | derived (1 − 244,205 / 299,269) |

**Non-operating income (151,641) is larger than operating income (147,628).** Of that,
149,012 — 98.3% — is gains on debt and equity securities.

Corroboration from the filed cash flow statement rather than XBRL: Alphabet's six months ended
2026-06-30 statement of cash flows shows net income of 174,771 with a non-cash adjustment line
"Loss (gain) on debt and equity securities, net" of **(135,803)** for the six-month period alone
(10-Q 0001652044-26-000071). The balance sheet in the same filing shows non-marketable securities
rising from 68,687 at 2025-12-31 to 131,461 at 2026-06-30, and marketable securities rising from
96,135 to 186,563 over the same six months. The gains are predominantly mark-to-market on the
investment portfolio, not cash earnings from the core business.

### Normalization

Stripping the securities gains and holding the implied effective tax rate constant:

| Step | Amount |
|---|---|
| Pre-tax income as reported | 299,269 |
| Less: gains on debt and equity securities | (149,012) |
| Adjusted pre-tax income | 150,257 |
| Tax at 18.40% implied effective rate | (27,647) |
| **Adjusted net income** | **122,610** |
| Adjusted EPS (÷ 12,230.0M shares) | 10.03 |
| **Adjusted P/E at 319.74** | **31.89x** |

Reported LTM EPS is 19.97 and reported P/E is 16.01x. Roughly **half of Alphabet's reported
trailing earnings is non-operating mark-to-market gain.**

**Caveats on the adjustment.** (1) Applying the blended effective tax rate to the excluded gains
is an approximation; the actual tax treatment of unrealized securities gains differs from
operating income, and the true normalized rate is not disclosed at this granularity.
(2) `DebtAndEquitySecuritiesGainLoss` (149,012) and the alternative tag
`EquitySecuritiesFvNiGainLoss` (148,982) differ by 30, or 0.02% — immaterial, but the figure used
throughout is the former. (3) No attempt is made to normalize prior-year earnings, so the
adjusted P/E is not comparable to a historical adjusted series.

### Peer check — is this distortion unique to GOOGL?

| Company | Operating income | Net income | Non-operating, net | Securities gains | Net income > operating income? |
|---|---|---|---|---|---|
| GOOGL | 147,628 | 244,205 | 151,641 | 149,012 | Yes — severe |
| MSFT | 148,957 | 125,216 | 5,546 | 1,356 | No |
| AMZN | 85,422 | 90,798 | 30,044 | 522 | Yes — modest |
| META | 88,593 | 70,587 | 710 | not tagged | No |
| AAPL | 147,366 | 122,575 | 304 | not tagged | No |

Amazon also reports net income above operating income, but its non-operating income of 30,044 is
predominantly interest and equity-method income rather than securities marks (securities gains
are only 522). At 35% of operating income the effect is real but an order of magnitude smaller
than Alphabet's, and no adjustment is applied to AMZN here. **This is flagged as a secondary
item worth checking, not resolved.**

---

## Section F: UNSOURCED Register

Per instruction, figures that could not be traced to a source are recorded as UNSOURCED rather
than estimated. **Ten line items are UNSOURCED.** Each is a Tier 1 data product with no SEC
EDGAR substitute.

| # | Item | Why unavailable | Consequence |
|---|---|---|---|
| 1 | Forward P/E (NTM consensus), all 5 companies | Sell-side consensus is a licensed product; no free primary source | Cannot compare valuation on forward earnings, the basis most practitioners use |
| 2 | Forward EV/EBITDA (NTM consensus), all 5 | Same | Cannot test whether the LTM premium persists on forward numbers |
| 3 | Consensus revenue/EPS growth estimates | Same | Growth-adjusted multiples (PEG) not computable |
| 4 | GOOGL 5-year historical EV/EBITDA band | Requires historical price series joined to historical fundamentals | **Cannot say whether 21.70x is high or low for Alphabet itself** |
| 5 | Peer-group historical median multiple | Same | Cannot say whether the 43.1% premium is unusual or normal for this group |
| 6 | Beta (all 5) | Requires historical return series | No risk-adjusted comparison; WACC not computable |
| 7 | Analyst price targets / consensus ratings | Licensed | No external check on the premium conclusion |
| 8 | Net debt at 2026-07-24 (the pricing date) | Latest balance sheets are 2026-03-31 (2026-06-30 for GOOGL) | EV mixes a July price with a March/June balance sheet — see Section H |
| 9 | GOOGL segment-level operating income (Search / Cloud / YouTube) at LTM | Reported quarterly but not assembled here; out of scope for a comps table | Cannot attribute the EBITDA premium to a specific segment |
| 10 | Share prices from a Tier 1/Tier 2 source | SEC filings contain no market prices | Every multiple in Section B rests on a Tier 3 input |

Item 4 is the most consequential. Without Alphabet's own historical multiple band, this analysis
can state that GOOGL is expensive *relative to these three peers today* but cannot state that it
is expensive *relative to its own history* — which is the question most investment decisions
actually turn on.

Item 10 is the structural one: the tier-2 fallback the skill prescribes cannot, even in
principle, produce a valuation multiple, because half of every multiple is a market price and
the SEC does not publish market prices.

---

## Section G: Notes & Methodology

### Data sources and quality

- **Fundamentals:** SEC EDGAR XBRL Company Facts API, plus filed 10-Q/10-K document text where
  XBRL coverage failed (META share count). All filings cited by accession number in Section A.
- **Period:** LTM through each company's most recent reported quarter. Windows are not aligned —
  see Section H, item 1.
- **Verification:** Market caps were computed from filing-sourced share counts and independently
  cross-checked against a third-party published market cap (Section B). Prices were
  cross-verified across two independent providers with zero variance. Fundamental line items were
  not independently re-verified against a second data provider — no second provider is available.

### Key definitions

- **LTM:** sum of four consecutive reported quarters. Where a standalone Q4 is not tagged in
  XBRL, it is derived as (annual figure) − (nine-month year-to-date figure) from the same filing
  family. Applied to: GOOGL Q4 2025; MSFT Q4 FY2025; AMZN Q4 2025; META Q4 2025; AAPL Q4 FY2025.
- **Gross profit:** Revenue − cost of revenue. AMZN, GOOGL, and META do not tag `GrossProfit` in
  current filings, so gross profit is derived for those three. MSFT and AAPL tag it directly and
  the tagged value is used.
- **D&A:** depreciation plus amortization of intangibles, taking the broadest tag each company
  reports. GOOGL = `Depreciation` 25,237 + `AmortizationOfIntangibleAssets` 791. MSFT =
  `Depreciation` 30,300 + `AmortizationOfIntangibleAssets` 5,300. AMZN =
  `DepreciationDepletionAndAmortization` 70,439 (already inclusive). META =
  `DepreciationDepletionAndAmortization` 20,715. AAPL =
  `DepreciationDepletionAndAmortization` 12,610. **The tag is not the same across all five
  companies** — see Section H, item 3.
- **EBITDA:** operating income + D&A. Stock-based compensation is **not** added back; this is
  unadjusted EBITDA, not "adjusted EBITDA" as companies typically report it. SBC is material for
  all five names, so these EBITDA figures are lower than company-presented adjusted EBITDA and
  the multiples correspondingly higher.
- **Enterprise value:** market cap + total debt − (cash and equivalents + short-term investments).
- **P/E:** market cap ÷ LTM net income (equivalent to price ÷ LTM EPS on the same share count).

### Valuation methodology choices

- **Long-term investments are excluded from the cash netting** for all companies, consistently.
  This materially affects two names: AAPL carries 78,088 of non-current marketable securities and
  MSFT carries 33,683 of long-term investments, neither of which reduces EV here. Including them
  would lower AAPL's EV to roughly 4,820,756 (EV/EBITDA ~30.13x) and MSFT's to roughly 2,763,956
  (EV/EBITDA ~14.98x). The exclusion is applied uniformly, but practitioners commonly include
  Apple's long-term securities, and that convention would make Apple look cheaper.
- **GOOGL's non-marketable securities of 131,461 are excluded from cash** despite being the asset
  base that generated the earnings distortion in Section E. Including them would cut GOOGL's EV to
  roughly 3,636,649 and EV/EBITDA to 20.94x, still a 38.1% premium. The conclusion is not
  sensitive to this choice.
- **Operating lease liabilities are excluded from debt** for all companies. This is the
  conventional treatment matching the skill's stated `EV = Market Cap ± Net Debt` definition, but
  it understates EV for lease-heavy businesses. The effect is very uneven across this peer set:
  AMZN carries 91,617 of operating lease liabilities (12,550 current + 79,067 non-current) versus
  GOOGL's 18,037 and META's 28,021. Capitalizing leases would raise AMZN's EV by roughly 3.7% and
  GOOGL's by roughly 0.5%, making Amazon look relatively more expensive than shown.

### Analysis framework

The question asked is whether Alphabet trades at a premium or discount to MSFT/AMZN/META. The
metrics that answer it are EV/EBITDA and EV/Sales, because both are immune to the capital-structure
and non-operating distortions that break P/E for this particular target. P/E is retained in the
table only because it is a required output and because its divergence from the EV multiples is
itself the analytical finding.

---

## Section H: Red Flags and Sanity Checks

### Sanity checks run

| Check | Result |
|---|---|
| Gross margin > EBITDA margin > net margin | **FAILS for GOOGL** (60.9% > 38.9% but net margin 54.8% is above EBITDA margin). The skill states this ordering is "always true by definition." It is not — it holds only when non-operating income is small. See Section E |
| EV/Sales in 0.5–20x range | Pass, all five (3.33x–10.85x) |
| EV/EBITDA in 8–25x range | Pass for GOOGL/MSFT/AMZN/META (13.61x–21.70x). AAPL at 30.62x is above the range |
| P/E in 10–50x range | Pass, all five (16.01x–39.85x) |
| Higher growth correlates with higher multiple | **Fails within this set.** META has the highest growth (+26.2%) and the *lowest* EV/EBITDA (13.61x); AAPL has the lowest growth (+12.8%) and the highest (30.62x) |
| Cross-source price variance <10% | Pass — zero variance across two providers on all five names |
| Market cap reconciliation vs third source | Pass — all five within rounding |
| No #DIV/0 or missing denominators | Pass |

### Red flags raised

1. **Inconsistent time periods across the peer set.** GOOGL's LTM ends 2026-06-30; MSFT, AMZN,
   and META end 2026-03-31; AAPL ends 2026-03-28. Alphabet is one quarter ahead of the peer group
   because it reported on 2026-07-23, three days before this analysis date. In a quarter where
   Alphabet grew revenue 20% YoY, that extra quarter is not neutral. Recomputed on a matched
   window through 2026-03-31, Alphabet's LTM is: revenue 422,499; gross profit 255,053 (60.4%);
   operating income 138,129 (32.7%); EBITDA 161,260 (38.2%); net income 160,208 (37.9%). Margins
   move by less than one percentage point, so **the operating comparison is robust to the
   mismatch**, but the revenue and EBITDA levels are not, and the freshest-data table above is
   the one presented.

2. **Fiscal year ends differ.** MSFT's fiscal year ends 30 June and AAPL's in late September;
   GOOGL, AMZN, and META use calendar years. LTM construction neutralizes this for the aggregate
   figures but not for seasonality — AAPL's LTM window straddles two holiday quarters differently
   than META's does.

3. **D&A is not tagged consistently across companies.** Three of the five report
   `DepreciationDepletionAndAmortization`; GOOGL and MSFT report `Depreciation` and
   `AmortizationOfIntangibleAssets` separately. EBITDA and therefore EV/EBITDA — the multiple this
   analysis's conclusion rests on — depends on reconciling these by hand. A single-tag pull
   would have produced wrong EBITDA for two of the five companies.

4. **Stale-tag trap: silent, not loud.** GOOGL stopped tagging revenue as
   `RevenueFromContractWithCustomerExcludingAssessedTax` after the quarter ended 2025-03-31 and
   switched to `Revenues`. Querying the former returns a well-formed response whose newest data
   point is 15 months old, with no error and no warning. The same trap exists for
   `GrossProfit` on AMZN, where the newest value is from **2009**. Any pipeline that picks one tag
   and trusts it will silently produce stale numbers.

5. **Market cap and enterprise value are priced at 2026-07-24 but netted against balance sheets
   dated 2026-03-31 (2026-06-30 for GOOGL).** Every EV here mixes a July price with a March or
   June balance sheet. For MSFT, AMZN, META, and AAPL that is a four-month gap during which cash
   and debt moved. This is unavoidable — interim balance sheets do not exist between filings —
   but it is a real inconsistency and it is not symmetric, since GOOGL's gap is three days.

6. **Peer-set comparability is imperfect.** AMZN is roughly 60% low-margin retail by revenue and
   sits at an 11.5% operating margin against 33–47% for the others. It is included because it is
   Alphabet's principal cloud competitor, but on a whole-company basis it is arguably a
   different business. Its EV/Sales of 3.33x versus the group's 6.92x median is a mix effect, not
   a valuation signal. The skill's own guidance — "better to have 3 perfect comps than 6
   questionable ones" — argues for either excluding AMZN or comping the cloud segments separately.

7. **META's share count is not in XBRL Company Facts at all.** Neither
   `dei:EntityCommonStockSharesOutstanding` nor `us-gaap:CommonStockSharesOutstanding` is present;
   the only `dei` fact is `EntityPublicFloat`. The count used here was read out of the filed
   balance sheet text. An automated pipeline would have had no share count for META and therefore
   no market cap and no multiples.

8. **GOOGL's balance sheet moved violently in six months** and warrants confirmation before
   reuse: total assets 595,281 → 921,983; property and equipment, net 246,597 → 321,212; goodwill
   33,380 → 57,828 (implying a large acquisition); inventory 2,439 → 9,991. Six-month capex was
   80,598. These are consistent with the securities-driven asset growth in Section E but are large
   enough that they should be confirmed against the filing narrative before being cited.

---

## Section I: Verification Queue

Figures below drive the conclusion and were derived rather than read directly, or are single-source.
They should be confirmed before external use.

1. GOOGL LTM net income 244,205 and the 149,012 securities-gain adjustment — the entire Section D
   verdict flips on these.
2. GOOGL LTM D&A of 26,028, which sets EBITDA of 173,656 and the 21.70x headline multiple.
3. All four derived Q4 figures (GOOGL, AMZN, META Q4 2025; MSFT Q4 FY2025; AAPL Q4 FY2025) — each
   is a subtraction, not a reported number.
4. META share count of 2,538.0M, read from filing text rather than XBRL.
5. GOOGL marketable securities of 186,563 at 2026-06-30, up from 96,135 six months earlier.
6. The 18.40% implied effective tax rate used to normalize adjusted earnings.
7. All five share prices — Tier 3 sources, and the sole input not obtainable from primary filings.
8. AMZN non-operating income of 30,044 and whether it warrants the same normalization applied to
   GOOGL.

---

*Prepared 2026-07-26. Fundamentals from SEC EDGAR primary filings as cited. Prices as of the
2026-07-24 close from third-party aggregators. No MCP or Bloomberg data was available; consensus
estimates, historical multiple bands, and beta are absent for that reason and are recorded as
UNSOURCED in Section F rather than estimated.*

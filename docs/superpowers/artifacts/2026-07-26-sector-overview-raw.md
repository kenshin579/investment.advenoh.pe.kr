# US Semiconductor Sector Overview

**Date of analysis:** 2026-07-26
**Data cut-off:** Market data as of close 2026-07-24; filings through 2026-07-26
**Prepared under constraint:** No paid data connectors (FactSet / Capital IQ / Daloopa) available. All figures sourced from SEC EDGAR XBRL company facts, company IR releases, industry association releases (WSTS, SIA, SEMI), third-party research press releases (TrendForce, Counterpoint), and the free tier of stockanalysis.com. Every number below carries a source tag. Figures that could not be sourced are marked **UNSOURCED** and are not estimated.

---

## Step 1: Scope

| Item | Definition |
|---|---|
| Sector | Semiconductors and semiconductor equipment, US-listed |
| Universe | Public companies only. US-listed primary or ADR (TSM, ARM, NXPI included as US-listed) |
| Depth | High-level overview |
| Angle | Neutral landscape, with explicit attention to where the cycle currently sits |
| Purpose | Sector initiation / thematic research base |

**Segments covered:** logic & compute (fabless + IDM), memory, analog & mixed-signal, foundry, semiconductor capital equipment, EDA/IP.

---

## Step 2: Market Overview

### 2.1 Market size and growth

| Metric | Value | Source |
|---|---|---|
| Global semiconductor sales, 2024 | $630.5B | [SIA, 2026-02](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/) |
| Global semiconductor sales, 2025 | $791.7B (+25.6% YoY) | [SIA, 2026-02](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/) |
| Q4 2025 sales | $236.6B (+37.1% YoY, +13.6% QoQ) | [SIA, 2026-02](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/) |
| Q1 2026 sales | +25% QoQ vs Q4 2025 | [SIA, 2026-05](https://www.semiconductors.org/global-semiconductor-sales-increase-25-from-q4-2025-to-q1-2026/) |
| 2026 forecast — WSTS Spring 2026 | $1.51T (+90% YoY) | [WSTS Spring 2026 release, May 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| 2026 forecast — WSTS Autumn 2025 | $975B (+>25% YoY) | [WSTS Autumn 2025 forecast](https://www.wsts.org/esraCMS/extension/media/f/WST/7310/WSTS_FC-Release-2025_11.pdf) |
| 2026 forecast — SIA | "roughly $1 trillion" | [Tom's Hardware citing SIA](https://www.tomshardware.com/tech-industry/semiconductors/semiconductor-industry-on-track-to-hit-usd1-trillion-in-sales-in-2026-sia-predicts-bumper-forecast-follows-usd791-7-billion-haul-for-2025) |
| 2026 forecast — IDC | $1.29T (+52.8%) | [IDC blog](https://www.idc.com/resource-center/blog/semiconductor-market-to-surge-past-the-trillion-dollar-threshold-ai-infrastructure-drives-market-growth/) |
| 2027 forecast — WSTS | ~$1.9T (+27%) | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |

> **Flag — forecast dispersion is unusually wide.** The 2026 forecasts range from ~$975B (WSTS Autumn 2025) to $1.51T (WSTS Spring 2026), a spread of more than $500B. The gap is almost entirely memory pricing. WSTS revised its own 2026 number upward by ~55% in six months. Any model built on a single 2026 TAM number is fragile. **Do not average these.** They embed different memory ASP assumptions.

### 2.2 Segment growth, 2026E (WSTS Spring 2026)

| Segment | 2026E growth | 2026E size | Source |
|---|---|---|---|
| Memory | +~250% | >$800B | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| Logic | +37% | UNSOURCED (absolute size not disclosed in release) | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| Microprocessors | +20% | UNSOURCED | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| Analog | +10% | UNSOURCED | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| Discrete | +8% | UNSOURCED | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |
| Sensors & optoelectronics | +3% | UNSOURCED | [WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026) |

Regional 2026E growth: Americas +112%, Asia Pacific +87%, Europe +58%, Japan +28% ([WSTS Spring 2026](https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026)).

**Read-through:** this is not a broad cycle. Memory is carrying the index. Analog at +10% and discretes at +8% describe an industry still working through a normal, unremarkable recovery, while memory is in a price-driven melt-up.

### 2.3 Value chain map

```
Design IP / EDA          ARM, Synopsys, Cadence
        |
Chip design (fabless)    NVIDIA, AMD, Broadcom, Qualcomm, Marvell
        |
IDM (design + fab)       Intel, Texas Instruments, Analog Devices, Micron, ON Semi
        |
Foundry                  TSMC, Samsung Foundry, GlobalFoundries, UMC, SMIC
        |
Advanced packaging       TSMC (CoWoS), ASE, Amkor
        |
Capital equipment        ASML, Applied Materials, Lam Research, KLA, Tokyo Electron
        |
Materials / substrates   (not covered in this note)
```

**Where value is accruing in this cycle:** two chokepoints.

1. **Advanced packaging (CoWoS).** TSMC's CoWoS capacity and N3 node are reported sold out through end-2026 with lead times into 2027; CEO C.C. Wei acknowledged packaging is now constraining customer growth ([TechTimes, 2026-07-16](https://www.techtimes.com/articles/320696/20260716/tsmc-posts-record-quarter-ai-chip-demand-pushes-full-year-growth-outlook-past-40.htm); [AI Weekly, 2026-07](https://aiweekly.co/node/6826)).
2. **HBM / DRAM supply.** Suppliers are reallocating wafer starts from commodity DDR5 to HBM4, which tightens conventional DRAM further ([TrendForce, 2026-06-02](https://www.trendforce.com/presscenter/news/20260602-13074.html)).

### 2.4 Industry structure and concentration

| Sub-industry | Concentration | Source |
|---|---|---|
| Foundry (Q1 2026 share) | TSMC 72.3%, Samsung 6.5%, SMIC 5.1%, UMC 3.9%, GlobalFoundries 3.3%, HuaHong 2.5%, Tower 0.8%, Nexchip 0.8%, VIS 0.8%, PSMC 0.8% | [TrendForce via EE Times Asia / gulfnews](https://gulfnews.com/technology/tsmc-market-share-rises-to-67-6-in-q1-extending-global-foundry-lead-1.500164069) |
| Foundry top-10 revenue, Q1 2026 | $47.95B (+3.7% QoQ), record | [TrendForce via EE Times Asia](https://www.eetasia.com/trendforce-top-10-foundries-register-3-7-qoq-revenue-growth-in-1q-2026/) |
| TSMC Q1 2026 foundry revenue | $35.86B (+6.3% QoQ) | [TrendForce via SammyGuru](https://sammyguru.com/samsung-lags-far-behind-tsmc-in-q1-2026-foundry-market/) |
| DRAM (Q1 2026 revenue share) | Samsung 38.5% ($37.32B), SK hynix 28.8% ($27.98B), Micron 22.4% ($21.75B) | [TrendForce, 2026-06-01](https://www.trendforce.com/presscenter/news/20260601-13070.html) |
| DRAM industry revenue, Q1 2026 | +81% QoQ; total memory maker revenue $97B in Q1 2026 (+81% YoY) | [TrendForce, 2026-06-01](https://www.trendforce.com/presscenter/news/20260601-13070.html) |

> **Note on a source conflict.** One aggregator reports TSMC Q1 2026 foundry share as 67.6%, another as 72.3%, both attributed to TrendForce. The difference is almost certainly "top-10 foundry only" versus "total foundry market including IDM foundry services." Both are cited above; the 72.3% figure is the one consistent with the named 10-company ranking. **Verify against the primary TrendForce release before publication.**

### 2.5 Secular drivers

1. **AI infrastructure capex.** Hyperscale capex exceeded $100B in a single quarter for the first time in Q3 2025; 2026 hyperscaler capex is reported at approximately $600B, +70% YoY ([Sourceability](https://sourceability.com/post/semiconductor-industry-outlook-for-2026-shows-rebound-amid-mergers)). IDC forecasts data center semiconductor revenue of $477.1B in 2026 ([IDC](https://www.idc.com/resource-center/blog/semiconductor-market-to-surge-past-the-trillion-dollar-threshold-ai-infrastructure-drives-market-growth/)).
2. **Memory supercycle.** TrendForce forecasts Q2 2026 conventional DRAM contract prices +58–63% QoQ and NAND +70–75% QoQ, after a near-doubling in Q1 ([TrendForce](https://www.trendforce.com/presscenter/news/20260601-13070.html); [AI Weekly](https://aiweekly.co/alerts/trendforce-dram-prices-to-jump-63-again-in-q2)). 2026 HBM shipments forecast to exceed 30 billion Gb, with HBM4 overtaking HBM3E in 2H26 ([TrendForce](https://www.trendforce.com/presscenter/news/20260602-13074.html)).
3. **Custom silicon (ASIC/XPU) taking share of accelerator spend.** Broadcom reiterated FY2026 AI semiconductor revenue of $56B and FY2027 in excess of $100B ([Broadcom Q2 FY26 release, 2026-06-03](https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial); [CNBC](https://www.cnbc.com/2026/06/03/broadcom-avgo-earnings-report-q2-2026.html)).
4. **Analog/auto/industrial cycle turning up.** TI Q2 2026 analog revenue $4.37B (+26% YoY), embedded $788M (+16% YoY), gross margin +340bp QoQ ([Futurum on TI Q2 FY26](https://futurumgroup.com/insights/texas-instruments-q2-fy-2026-earnings-climb-on-broad-based-analog-growth/); [DigiTimes, 2026-07-23](https://www.digitimes.com/news/a20260723VL201/texas-instruments-2026-market-earnings-revenue.html)).
5. **Capex intensity.** Total semiconductor equipment sales forecast at a record $139B in 2026, with WFE +9.0% to $135.2B; 300mm fab equipment spending +18% to $133B in 2026; 2027 equipment forecast $156B ([SEMI](https://www.semi.org/en/semi-press-release/global-total-semiconductor-equipment-sales-forecast-to-reach-a-record-of-dollar-139-billion-in-2026-semi-reports); [SEMI 300mm outlook, April 2026](https://www.semi.org/en/semi-press-release/semi-projects-double-digit-growth-in-global-300mm-fab-equipment-spending-for-2026-and-2027); [SEMI 2027](https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-projected-to-reach-a-record-of-156-billion-dollars-in-2027-semi-reports)).

> **Internal inconsistency to note:** SEMI has $139B total equipment sales in 2026 while separately projecting $133B for 300mm fab equipment alone. These are different scopes measured differently (billings vs. fab-level spend, and one excludes assembly/test) but the near-equality is not reconcilable from the public releases. **Do not present both in the same chart.**

### 2.6 Headwinds and risks

**Geopolitical / policy**

- On 2026-01-13 BIS changed the China export license review policy for NVIDIA H200- and AMD MI325X-class parts from "presumption of denial" to case-by-case review; on 2026-01-14 the administration announced it would approve H200 sales to China while imposing a 25% tariff on advanced chips ([BIS press release](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china); [East Asia Forum, 2026-03-11](https://eastasiaforum.org/2026/03/11/us-chip-export-controls-have-cooled-down/)).
- Congressional pushback: the AI OVERWATCH Act cleared the House Foreign Affairs Committee on 2026-01-22 and would give Congress veto power over AI chip export licenses ([East Asia Forum](https://eastasiaforum.org/2026/03/11/us-chip-export-controls-have-cooled-down/)).
- **Risk framing:** policy direction has loosened, but the loosening is executive-branch discretion that Congress is actively trying to claw back. This is a two-sided risk — a China revenue tailwind that can reverse on a single vote or a single administration change.
- CHIPS Act: the US government converted remaining Intel grants into a ~9.9% non-voting equity stake ([Forbes, 2026-01-09](https://www.forbes.com/sites/greatspeculations/2026/01/09/intel-foundry-in-2026-an-inflection-point/)). State equity participation in a listed semiconductor company is a new governance variable for the sector.
- Concentration risk: TSMC at 72.3% of foundry means the sector's leading-edge supply is a single-company, single-island dependency. TSMC has committed a further $100B to Arizona, lifting the Arizona program to $265B ([TechTimes, 2026-07-17](https://www.techtimes.com/articles/320841/20260717/tsmc-lifts-arizona-265-billion-after-record-quarter-four-fabs-target-ai-packaging-bottleneck.htm)) — but geographic diversification of leading-edge capacity is a multi-year fix, not a 2026 fix.

**Cyclical**

- Memory is the entire 2026 growth story and memory is the most cyclical part of the industry. TrendForce notes HBM prices could enter a correction after 2026 as competition intensifies and capacity expands ([TrendForce](https://www.trendforce.com/presscenter/news/20260602-13074.html)). Micron itself expects meaningful new supply not before 2027 ([TrendForce commentary](https://www.trendforce.com/news/2026/05/18/news-memory-supercycle-drives-1q26-price-surge-samsung-flags-146-asp-jump-sk-hynix-sees-mid-60-dram-gains/)).
- The price-driven nature of the memory upcycle means reported revenue growth substantially overstates unit/bit growth. Micron's FQ3 2026 gross margin of 84.6% (calculated from EDGAR, see §3.1) is a pricing artifact, not a durable structural margin.
- Downstream demand concentration: a large share of 2026 semiconductor demand traces to a handful of hyperscaler capex budgets. Those budgets are annual and discretionary.
- Advanced packaging sold out through 2026 caps upside in the near term and creates a double-order risk in 2027 if customers over-book against constrained supply.

**Competitive / structural**

- Chinese domestic substitution: SMIC at 5.1% foundry share and rising; CXMT DRAM share grew from 3% to 8% ([Counterpoint via X](https://x.com/MojoTricks/status/2075169846514659744) — secondary source, treat as indicative only).
- Intel's foundry turnaround is unresolved. Intel 14A customer decisions are expected 2H26 into 1H27; failure to land a primary customer by late 2026 points to a slower path ([Forbes, 2026-01-09](https://www.forbes.com/sites/greatspeculations/2026/01/09/intel-foundry-in-2026-an-inflection-point/)).

### 2.7 M&A activity

| Deal | Value | Source |
|---|---|---|
| Texas Instruments / Silicon Labs | $7.5B, $231/share cash, ~$7B incremental debt, close expected early 2027 | [Embedded Computing Design](https://embeddedcomputing.com/technology/processing/semiconductor-ip/semiconductor-ma-heats-up-early-in-2026-more-to-come) |
| SMIC domestic foundry acquisition | RMB 40.601B (~$5.9B) | [TechNode, 2026-05-12](https://technode.com/2026/05/12/smic-secures-approval-for-5-9-billion-acquisition-in-chinas-largest-domestic-wafer-foundry-ma/) |
| IonQ / SkyWater Technology | ~$1.8B | [Embedded Computing Design](https://embeddedcomputing.com/technology/processing/semiconductor-ip/semiconductor-ma-heats-up-early-in-2026-more-to-come) |
| GlobalFoundries / Synopsys ARC Processor IP | Terms not disclosed | [Embedded Computing Design](https://embeddedcomputing.com/technology/processing/semiconductor-ip/semiconductor-ma-heats-up-early-in-2026-more-to-come) |
| Sector deal value YTD through February 2026 | >$17B | [Embedded Computing Design](https://embeddedcomputing.com/technology/processing/semiconductor-ip/semiconductor-ma-heats-up-early-in-2026-more-to-come) |

**Transaction multiples paid: UNSOURCED.** Target-level revenue and EBITDA for Silicon Labs, the SMIC target, and SkyWater were not obtainable from free sources within this workflow. No implied EV/EBITDA or EV/Revenue for these deals is presented.

---

## Step 3: Competitive Landscape

### 3.1 Operating metrics — most recent reported quarter

All revenue, gross profit, operating income, and net income figures below are pulled directly from **SEC EDGAR XBRL company facts** (`data.sec.gov/api/xbrl/companyconcept`), tags `Revenues` / `RevenueFromContractWithCustomerExcludingAssessedTax`, `GrossProfit`, `OperatingIncomeLoss`, `NetIncomeLoss`, form 10-Q. Margins and YoY growth are **calculated** from those filed figures. Fiscal periods differ by company and are stated explicitly.

| Company | Segment | Period (fiscal quarter end) | Revenue ($M) | YoY rev growth | Gross margin | Operating margin | Net income ($M) |
|---|---|---|---|---|---|---|---|
| NVIDIA (NVDA) | Logic / accelerators | FQ1 FY27, ended 2026-04-26 | 81,615 | +85.2% | 74.9% | 65.6% | 58,321 |
| Broadcom (AVGO) | Logic / custom ASIC | FQ2 FY26, ended 2026-05-03 | 22,187 | +47.9% | 69.5% | 48.6% | not retrieved |
| Micron (MU) | Memory | FQ3 FY26, ended 2026-05-28 | 41,456 | +345.7% | 84.6% | 80.4% | 28,243 |
| Intel (INTC) | Logic IDM / foundry | Q2 2026, ended 2026-06-27 | 16,128 | +25.4% | 40.4% | 11.1% | −11,033 |
| AMD | Logic | Q1 2026, ended 2026-03-28 | 10,253 | +37.8% | 52.8% | 14.4% | 1,383 |
| Qualcomm (QCOM) | Logic / mobile | FQ2 FY26, ended 2026-03-29 | 10,599 | −3.5% | not retrieved | 21.8% | 7,370 |
| Applied Materials (AMAT) | Equipment | FQ2 FY26, ended 2026-04-26 | 7,910 | +11.4% | 49.9% | 31.9% | 2,806 |
| Lam Research (LRCX) | Equipment | FQ3 FY26, ended 2026-03-29 | 5,841 | +23.7% | 49.8% | 35.0% | 1,825 |
| Texas Instruments (TXN) | Analog | Q2 2026, ended 2026-06-30 | 5,463 | +22.8% | 61.4% | 42.3% | 1,980 |
| ADI | Analog | FQ2 FY26, ended 2026-05-02 | 3,623 | +37.2% | 67.3% | 38.1% | 1,176 |
| KLA (KLAC) | Equipment | FQ3 FY26, ended 2026-03-31 | 3,415 | +11.5% | not retrieved | not retrieved | 1,200 |
| NXP (NXPI) | Analog / auto | Q1 2026, ended 2026-03-29 | 3,181 | +12.2% | 56.2% | 47.3% (see flag) | 1,122 |
| Marvell (MRVL) | Logic / custom | FQ1 FY27, ended 2026-05-02 | 2,417 | +27.5% | 52.1% | 14.0% | 34 |
| ON Semiconductor (ON) | Analog / power | Q1 2026, ended 2026-04-03 | 1,513 | +4.7% | 38.5% | −3.6% | −34 |
| TSMC (TSM) | Foundry | Q2 2026 | ~$39.62B (NT$1.27T) | +36% | not retrieved | not retrieved | NT$706.56B (+77.4%) |

TSMC figures from [TechTimes 2026-07-16](https://www.techtimes.com/articles/320696/20260716/tsmc-posts-record-quarter-ai-chip-demand-pushes-full-year-growth-outlook-past-40.htm) and [AI Weekly](https://aiweekly.co/node/6826) — secondary sources; TSMC files a 20-F under IFRS taxonomy and its quarterly data is not available through the same EDGAR XBRL endpoint used for US filers. **Verify against TSMC's own IR release before publication.**

> **Three data-quality flags on the table above. Do not use these three cells without checking the filing.**
>
> 1. **NXP operating margin of 47.3%** implies operating expenses of only ~9% of revenue, which is far below NXP's normal opex run rate. The `OperatingIncomeLoss` value as tagged ($1,505M) may include a non-recurring item or may be tagged at a different level than the income-statement operating line. Check the Q1 2026 10-Q income statement.
> 2. **Qualcomm net income ($7,370M) exceeds operating income ($2,309M).** This implies a large below-the-line gain in FQ2 FY26. Not investigated here.
> 3. **Intel reports positive operating income of $1,796M and a net loss of $11,033M** in the same quarter. Again a large below-the-line item. stockanalysis.com reports an Intel trailing-twelve-month net loss of $11.29B and trailing EPS of −$2.30, consistent with a single large charge in Q2 2026. Not investigated here.
>
> Missing cells marked "not retrieved" are cases where the company does not file that us-gaap tag, or files it only annually. They are **not** zero and were **not** estimated.

**EDGAR coverage gaps encountered:** NVIDIA's FQ4 FY26 quarter (Oct 2025–Jan 2026) is not separately tagged in the concept API (annual-only presentation of Q4); Microchip (MCHP) returned no 2026 periods for the tags queried; GlobalFoundries (GFS) returned no data on either revenue tag. These companies are therefore under-covered in this note.

### 3.2 Company notes

**NVIDIA** — Q1 FY27 revenue $81.6B, +85% YoY and +20% QoQ; Data Center $75B, +92% YoY, split into Hyperscale $38B and ACIE (AI Clouds / Industrial / Enterprise) $37B; GAAP gross margin 74.9% ([NVIDIA IR, Q1 FY2027](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx)). Moat is CUDA plus systems-level integration; the binding constraint is CoWoS and HBM supply, not demand. Chief risk is customer concentration in a small number of hyperscaler capex budgets and the emergence of custom ASICs at those same customers.

**Broadcom** — Q2 FY26 total revenue $22.19B (+48% YoY), custom AI (XPU) revenue $10.8B (+143% YoY), against guidance of $10.7B. Guided Q3 FY26 AI semiconductor revenue of $16.0B (+>200% YoY); reiterated FY26 AI semis $56B and FY27 >$100B ([Broadcom IR](https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial); [CNBC](https://www.cnbc.com/2026/06/03/broadcom-avgo-earnings-report-q2-2026.html)). Six named custom-silicon customers reportedly including Google, Meta, OpenAI and Anthropic. This is the clearest structural share shift in the sector: accelerator spend migrating from merchant GPU to customer-specific ASIC.

**Micron** — FQ3 FY26 revenue $41,456M vs $9,301M in FQ3 FY25, gross margin 84.6%, operating margin 80.4% (EDGAR). This is the single most extreme datapoint in the sector and it is a **price** phenomenon: DRAM contract prices rose ~81% QoQ in Q1 2026 and are forecast +58–63% again in Q2 ([TrendForce](https://www.trendforce.com/presscenter/news/20260601-13070.html)). Micron holds 22.4% DRAM revenue share, third behind Samsung (38.5%) and SK hynix (28.8%). An 84.6% gross margin in a commodity memory business has no historical precedent and should be modeled as temporary.

**Intel** — Q2 2026 revenue $16,128M (+25.4% YoY), gross margin 40.4%, operating income $1,796M, net loss $11,033M (EDGAR). US government holds ~9.9% non-voting equity. 18A ramping with reported yield improvement; AWS finalizing a multiyear commitment covering a custom Xeon 6 on Intel 3 and an AI fabric chip on 18A; up to $3B Secure Enclave award ([Forbes, 2026-01-09](https://www.forbes.com/sites/greatspeculations/2026/01/09/intel-foundry-in-2026-an-inflection-point/)). The equity story is binary on 14A external customer wins in 2H26–1H27.

**Texas Instruments** — Q2 2026 revenue $5,463M (+22.8% YoY), gross margin 61.4%, operating margin 42.3% (EDGAR). Analog $4.37B (+26% YoY), embedded $788M (+16% YoY), gross margin +340bp QoQ on 300mm loadings ([Futurum](https://futurumgroup.com/insights/texas-instruments-q2-fy-2026-earnings-climb-on-broad-based-analog-growth/)). Announced $7.5B acquisition of Silicon Labs. This is the clean read on the non-AI cycle: it is recovering, but at 20-something percent growth rather than triple digits.

**Applied Materials / Lam Research / KLA** — the equipment complex is growing 11–24% YoY on the quarters above, well below the memory and accelerator names, which is what you would expect at this point in a capex cycle where spending decisions lead revenue recognition. SEMI's 2026 equipment forecast of $139B and 2027 of $156B implies the equipment names have a longer runway than the current growth rates suggest.

**ON Semiconductor** — Q1 2026 revenue $1,513M (+4.7% YoY), gross margin 38.5%, operating margin −3.6%, net loss $34M (EDGAR). The clearest evidence that the "semiconductor supercycle" narrative does not extend to power/automotive analog.

### 3.3 Competitive dynamics — who is gaining

| Vector | Winner | Loser | Evidence |
|---|---|---|---|
| Foundry share | TSMC (70.4% → 72.3% QoQ) | Samsung Foundry (6.5%) | [TrendForce Q1 2026](https://gulfnews.com/technology/tsmc-market-share-rises-to-67-6-in-q1-extending-global-foundry-lead-1.500164069) |
| DRAM share | Samsung (36.5% → 38.5% QoQ) | SK hynix (32.9% → 28.8% QoQ) | [TrendForce Q1 2026](https://www.trendforce.com/presscenter/news/20260601-13070.html) |
| Accelerator spend | Broadcom custom XPU (+143% YoY) | merchant GPU share of wallet | [Broadcom IR](https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial) |
| Mobile / handset | — | Qualcomm (−3.5% YoY, only decliner in the table) | EDGAR, calculated |
| China domestic | SMIC, CXMT | incumbent foreign suppliers into China | [TrendForce](https://gulfnews.com/technology/tsmc-market-share-rises-to-67-6-in-q1-extending-global-foundry-lead-1.500164069); Counterpoint (secondary) |

SK hynix losing 4.1 points of DRAM share in a single quarter while the DRAM market grew 81% QoQ is the most surprising line in this table and warrants primary-source verification.

---

## Step 4: Valuation Context

All valuation data in this section is from **stockanalysis.com** statistics pages, prices as of close **2026-07-24 16:00 EDT**, pages last updated 2026-07-25. This is a free secondary aggregator, not a licensed data vendor. Forward P/E reflects that provider's consensus estimate feed; the underlying consensus EPS and the estimate date are **not disclosed by the source** and are therefore **UNSOURCED**.

| Company | Price | Market cap | EV | P/E (TTM) | P/E (fwd) | EV/EBITDA | EV/Sales |
|---|---|---|---|---|---|---|---|
| NVIDIA | $206.84 | $5.01T | $4.97T | 31.68 | 20.76 | 30.02 | 19.60 |
| TSMC | $403.41 | $1.88T | $1.81T | 27.04 | 19.05 | 18.39 | 12.94 |
| Broadcom | $381.92 | $1.82T | $1.86T | 63.56 | 24.23 | 44.88 | 24.68 |
| Micron | $920.95 | $1.04T | $1.02T | 20.78 | 6.42 | 14.89 | 11.26 |
| AMD | $521.95 | $851.09B | $842.62B | 174.05 | 58.52 | 114.13 | 22.50 |
| Intel | $92.32 | $465.66B | $486.22B | n/a (loss) | 56.01 | 39.52 | 8.53 |
| Applied Materials | $536.25 | $425.76B | $424.79B | 50.43 | 35.90 | 48.34 | 14.64 |
| Lam Research | $305.21 | $381.69B | $380.67B | 57.65 | 40.00 | 48.51 | 17.56 |
| Arm Holdings | $260.01 | $277.71B | $274.60B | 307.20 | 119.89 | 238.99 | 55.81 |
| KLA | $210.52 | $275.00B | $276.18B | 59.59 | 43.83 | 47.21 | 21.09 |
| Texas Instruments | $279.58 | $255.33B | $262.38B | 42.46 | 28.90 | 27.74 | 13.49 |
| Analog Devices | $371.86 | $181.13B | $186.40B | 55.36 | 26.55 | 30.54 | 14.63 |
| Qualcomm | $166.97 | $175.99B | $181.46B | 18.24 | 16.94 | 14.03 | 4.08 |
| Marvell | $194.23 | $170.10B | $171.53B | 67.09 | 42.78 | 64.17 | 19.68 |
| NXP | $269.24 | $67.98B | $75.99B | 25.75 | 17.15 | 16.41 | 6.02 |
| ON Semiconductor | $86.81 | $33.79B | $34.63B | 61.42 | 25.64 | 24.58 | 5.71 |
| GlobalFoundries | $53.53 | $29.37B | $27.32B | 38.53 | 26.99 | 13.02 | 3.99 |

Source for every row: stockanalysis.com/stocks/{ticker}/statistics/, e.g. [NVDA](https://stockanalysis.com/stocks/nvda/statistics/), [AVGO](https://stockanalysis.com/stocks/avgo/statistics/), [MU](https://stockanalysis.com/stocks/mu/statistics/), [AMD](https://stockanalysis.com/stocks/amd/statistics/), [TSM](https://stockanalysis.com/stocks/tsm/statistics/), [INTC](https://stockanalysis.com/stocks/intc/statistics/), [AMAT](https://stockanalysis.com/stocks/amat/statistics/), [LRCX](https://stockanalysis.com/stocks/lrcx/statistics/), [KLAC](https://stockanalysis.com/stocks/klac/statistics/), [TXN](https://stockanalysis.com/stocks/txn/statistics/), [ADI](https://stockanalysis.com/stocks/adi/statistics/), [QCOM](https://stockanalysis.com/stocks/qcom/statistics/), [MRVL](https://stockanalysis.com/stocks/mrvl/statistics/), [ARM](https://stockanalysis.com/stocks/arm/statistics/), [NXPI](https://stockanalysis.com/stocks/nxpi/statistics/), [ON](https://stockanalysis.com/stocks/on/statistics/), [GFS](https://stockanalysis.com/stocks/gfs/statistics/).

### 4.1 What the multiples say

**The dispersion is the story.** Forward P/E across this 17-name set ranges from 6.4x (Micron) to 119.9x (Arm) — an 18x spread inside a single sector. That is not a sector trading as a bloc; it is three separate markets:

1. **Cycle-peak-discounted memory.** Micron at 6.4x forward with a trailing 20.8x. The market is explicitly pricing in that FQ3's 84.6% gross margin does not persist. A 6.4x forward multiple on a company growing revenue 346% YoY is not a value signal — it is the market's estimate of where normalized earnings sit relative to the current print.
2. **Compute at growth-adjusted-reasonable multiples.** NVIDIA at 20.8x forward and TSMC at 19.1x forward are, remarkably, among the *cheapest* forward multiples in the group despite being the two largest beneficiaries. Broadcom at 24.2x forward against a 63.6x trailing shows a very steep expected earnings ramp — the entire multiple rests on the $56B FY26 / >$100B FY27 AI guidance being met.
3. **Everything else at 25–45x forward.** Equipment (AMAT 35.9x, LRCX 40.0x, KLAC 43.8x) and analog (TXN 28.9x, ADI 26.6x, ON 25.6x) sit in a tight band, pricing a normal recovery.

**Outliers worth flagging:**
- **AMD at 58.5x forward and 114.1x EV/EBITDA** versus NVIDIA at 20.8x/30.0x. AMD's Q1 2026 operating margin was 14.4% versus NVIDIA's 65.6%. The multiple gap is inverse to the margin gap.
- **Arm at 119.9x forward, 239x EV/EBITDA, 55.8x EV/Sales.** Priced as a royalty annuity on the entire compute base, not as a semiconductor company.
- **Intel at 56.0x forward with a TTM net loss.** The forward multiple is doing all the work and depends entirely on foundry recovery assumptions.
- **Qualcomm at 16.9x forward and 4.1x EV/Sales** — the cheapest large-cap in the set and the only revenue decliner. The market is pricing structural handset stagnation.

### 4.2 Sector versus market, and historical context

| Metric | Value | Source |
|---|---|---|
| PHLX Semiconductor Index (SOX) level | 11,818.89 as of 2026-07-24, −4.25% on the day | [Nasdaq OMX index page](https://indexes.nasdaqomx.com/Index/Overview/SOX) |
| SOX YTD 2026 return | **UNSOURCED** — the Nasdaq index page exposes YTD only through an interactive control that does not render a numeric value in the fetched page | — |
| SOX trailing 12-month return | ~127.6% (search-snippet attribution, no primary source located) — **treat as UNSOURCED** | — |
| Sector historical forward P/E range (5yr / 10yr) | **UNSOURCED** — no free source provides a licensed historical sector multiple series | — |
| S&P 500 forward P/E for relative comparison | **UNSOURCED** — not retrievable from free sources within this workflow | — |

> **This is a material gap.** A valuation section without a historical multiple range cannot answer "is the sector expensive versus its own history," which is the central question a sector overview is supposed to answer. The current-multiple table above is a snapshot only. **Any premium/discount claim in this note would be unsupported and none is made.**

Recent M&A transaction multiples: **UNSOURCED** (see §2.7).

---

## Step 5: Investment Implications

### 5.1 The central debate

**Bull case:** AI infrastructure spend of ~$600B in 2026 (+70% YoY) is contracted, sold-out capacity through 2026 at TSMC's CoWoS and N3, Broadcom's FY27 >$100B AI guidance, SEMI's 2027 equipment forecast of $156B — the visibility extends past the current fiscal year. NVIDIA at 20.8x forward and TSMC at 19.1x forward are not bubble multiples for companies with this growth and this position.

**Bear case:** 90% industry revenue growth in a single year (WSTS) driven ~entirely by memory pricing is a definitional cycle peak. WSTS revised its own 2026 forecast up 55% in six months, which is a sign of forecast momentum-chasing, not of forecast reliability. Micron's 84.6% gross margin will mean-revert. HBM prices are already flagged for post-2026 correction. Sold-out capacity invites double-ordering. And the demand base is a handful of hyperscaler capex budgets that reset annually.

**The honest reading:** the two cases are about different things. The AI compute buildout has multi-year visibility. The memory pricing spike does not. Treating them as one "semiconductor cycle" is the main analytical error available in this sector right now.

### 5.2 Where risk/reward looks best on the numbers presented

This is framed as observations from the data above, not as recommendations. No price targets are set; setting one would require earnings estimates this workflow could not source.

- **Best growth-per-turn-of-multiple:** NVIDIA (85% revenue growth, 65.6% operating margin, 20.8x forward) and TSMC (36% growth, 19.1x forward). Both are the tightest chokepoints in the value chain and both trade below the sector's median forward multiple.
- **Highest embedded expectation:** AMD (58.5x forward, 14.4% operating margin) and Arm (119.9x forward). Both require large step-changes to justify current levels.
- **Cleanest non-AI cycle exposure:** Texas Instruments and ADI — 23–37% growth, 38–42% operating margins, 27–29x forward. If the thesis is "the non-AI recovery has further to run," this is the direct expression and it is not priced for perfection.
- **Highest variance:** Micron. Extraordinary current economics, a 6.4x forward multiple that says the market disbelieves them, and a supply picture that TrendForce says loosens after 2026.
- **Binary:** Intel. Loss-making, government-part-owned, 56x forward, with 14A customer decisions landing 2H26–1H27.

### 5.3 Catalysts to watch

| Date / window | Event | Why it matters |
|---|---|---|
| 2H26 – 1H27 | Intel 14A external customer decisions | Determines whether US leading-edge foundry is viable | 
| 2H26 | HBM4 overtakes HBM3E in shipment mix | Tests whether HBM4 pricing holds as capacity ramps |
| Post-2026 | TrendForce-flagged HBM price correction | The main risk to the memory earnings base |
| Ongoing | AI OVERWATCH Act progress | Could re-tighten China AI chip exports by statute |
| Q3 2026 reporting | Broadcom Q3 AI semis vs $16.0B guide | The single cleanest test of the custom-ASIC thesis |
| 2027 | New memory supply arrives (Micron guidance) | End of the pricing window |

---

## Step 6: Output Notes and Limitations

**Format delivered:** markdown, per explicit user request. The skill's default output specification (Word or PowerPoint deliverable, plus an Excel appendix with detailed company data, plus charts — market size waterfall, competitive positioning matrix, valuation scatter) was **not** produced. No charts were generated.

**What could not be sourced without paid connectors, listed explicitly:**

1. Consensus estimates (revenue, EPS, EBITDA) for any company, at any forward period. The forward P/E column in §4 is a black-box figure from a free aggregator with no disclosed estimate date or contributor count.
2. Historical sector valuation ranges — no premium/discount analysis is possible.
3. S&P 500 forward multiple for relative valuation.
4. SOX index YTD and trailing return series.
5. M&A transaction multiples for the 2026 deals listed.
6. Market share for AI accelerators specifically (as distinct from foundry and DRAM share, which were sourced).
7. Segment-level revenue splits for most companies — only NVIDIA, Broadcom, and TI disclosed enough in public releases to be cited here.
8. Company-level backlog, bookings, and book-to-bill for the equipment names.
9. TSMC quarterly financials at income-statement granularity (IFRS 20-F filer, not in the EDGAR XBRL endpoint used).
10. Microchip (MCHP) and GlobalFoundries (GFS) operating data — EDGAR concept queries returned no usable 2026 periods for the tags used.

**Sources actually used:** SEC EDGAR XBRL company facts API (primary, 15 companies); WSTS, SIA, SEMI press releases (industry associations); TrendForce and Counterpoint press releases and secondary coverage (third-party research); NVIDIA and Broadcom investor relations releases (primary); BIS press release (primary, policy); stockanalysis.com free tier (market data); trade and general press for TSMC, Intel, TI, and M&A (secondary).

**Staleness warning:** sector overviews age fast, and this one is built at what may be a cycle peak in memory pricing. The valuation snapshot is a single close (2026-07-24). The memory price forecasts have a demonstrated history of being revised by large margins within a single quarter. Re-date this note before any external use.

**Verification queue — items in this note that a second reader should check against primary filings before publication:**
- NXP Q1 2026 operating margin (47.3%, implies implausible opex)
- Qualcomm FQ2 FY26 net income exceeding operating income
- Intel Q2 2026 positive operating income alongside an $11.0B net loss
- TSMC foundry share: 67.6% vs 72.3%, both attributed to TrendForce
- SK hynix DRAM share falling 4.1 points QoQ in an 81% QoQ growth quarter
- All TSMC Q2 2026 figures (secondary sources only)
- Hyperscaler 2026 capex of ~$600B (single secondary source)

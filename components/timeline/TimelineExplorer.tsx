'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './TimelineExplorer.module.css';
import timelineDataRaw from '@/lib/timeline/timeline-data.json';
import knotDataRaw from '@/lib/timeline/knot-data.json';
import { STRINGS, type Lang } from '@/lib/timeline/strings';
import type { TimelineData, TimelineEra, KnotData, KnotPath } from '@/lib/timeline/types';

const DATA = timelineDataRaw as unknown as TimelineData;
const KNOT = knotDataRaw as unknown as KnotData;

// ============ static layout (pure math, ported verbatim from the prototype) ============
const VB_W = 1400;
const MARGIN = { top: 24, right: 30, bottom: 34, left: 30 };
const LANE_GAP = 8,
  ROW_H = 30,
  EVENT_TRACK_H = 22,
  LANE_TOP_PAD = 20;
const YEAR_MIN = -260,
  YEAR_MAX = 2026;
const totalYears = YEAR_MAX - YEAR_MIN;
const baseCenterYear = (YEAR_MIN + YEAR_MAX) / 2;
const MIN_ZOOM = 1,
  MAX_ZOOM = 400;
const CHAR_PX = 8.0;
const CLUSTER_PX = 20;

const laneOrder = DATA.lanes
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((l) => l.id);
const laneFillVar: Record<string, string> = { ca: '--lane-ca', ee: '--lane-ee', an: '--lane-an', me: '--lane-me', sa: '--lane-sa' };

function laneLabel(id: string, lang: Lang) {
  const l = DATA.lanes.find((x) => x.id === id)!;
  return lang === 'en' ? l.label_en : l.label_tr;
}
function eraName(e: TimelineEra, lang: Lang) {
  return lang === 'en' ? e.name_en : e.name_tr;
}
function eventTitle(e: TimelineData['events'][number], lang: Lang) {
  return lang === 'en' ? e.title_en : e.title_tr;
}

const erasByLane: Record<string, TimelineEra[]> = {};
laneOrder.forEach((id) => (erasByLane[id] = []));
DATA.eras.forEach((e) => erasByLane[e.lane].push(e));

// Pack overlapping eras within a lane into stacked rows -- buffered by a few
// years, not just one, since a ribbon's rendered pennant tip protrudes past
// its actual start/end date, so two eras separated by only a sliver of time
// can still visually collide even though their real ranges don't overlap.
const packed: TimelineEra[] = [];
laneOrder.forEach((laneId) => {
  const list = erasByLane[laneId].slice().sort((a, b) => a.start - b.start);
  const rowEnds: number[] = [];
  list.forEach((e) => {
    let row = rowEnds.findIndex((endYear) => e.start > endYear + 6);
    if (row === -1) {
      row = rowEnds.length;
      rowEnds.push(e.end);
    } else {
      rowEnds[row] = e.end;
    }
    e.row = row;
    packed.push(e);
  });
});
const maxRowsByLane: Record<string, number> = {};
laneOrder.forEach((id) => {
  maxRowsByLane[id] = packed.filter((p) => p.lane === id).reduce((m, p) => Math.max(m, (p.row ?? 0) + 1), 1);
});

const laneHeights: Record<string, number> = {};
const laneOffsets: Record<string, number> = {};
{
  let cursorY = MARGIN.top;
  laneOrder.forEach((id) => {
    laneHeights[id] = LANE_TOP_PAD + EVENT_TRACK_H + maxRowsByLane[id] * ROW_H + 6;
    laneOffsets[id] = cursorY;
    cursorY += laneHeights[id] + LANE_GAP;
  });
}
const plotBottom = laneOrder.reduce((y, id) => laneOffsets[id] + laneHeights[id], 0) - LANE_GAP;
const VB_H = plotBottom + 20;

function laneY(id: string) {
  return laneOffsets[id];
}
function laneH(id: string) {
  return laneHeights[id];
}
function ribbonYH(e: TimelineEra) {
  const y = laneY(e.lane) + LANE_TOP_PAD + EVENT_TRACK_H + (e.row ?? 0) * ROW_H;
  const h = ROW_H * 0.74;
  return { y: y + (ROW_H - h) / 2, h };
}
const eventBaseY: Record<string, number> = {};
laneOrder.forEach((id) => {
  eventBaseY[id] = laneY(id) + LANE_TOP_PAD + EVENT_TRACK_H / 2 + 2;
});

const plotX0 = MARGIN.left;
const plotX1 = VB_W - MARGIN.right;
const plotWidth = plotX1 - plotX0;

const KNOT_ASPECT = (() => {
  const [, , w, h] = KNOT.left_viewbox.split(' ').map(Number);
  return w / h;
})();

const NS = 'http://www.w3.org/2000/svg';
function el(tag: string, attrs: Record<string, string | number>, parent?: Element) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

export default function TimelineExplorer() {
  const { theme } = useTheme();
  const [lang, setLang] = useState<Lang>('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Desktop only -- the visualization needs real screen width to be usable
  // at all. null = not yet determined (avoids a flash of the full tool before
  // JS can check, matching ThemeProvider's own deferred client-only pattern);
  // resolved once on mount since this is a "which experience to render" gate,
  // not something that should hot-swap mid-session on a resize.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rumiDefsRef = useRef<SVGDefsElement>(null);
  const lanesGroupRef = useRef<SVGGElement>(null);
  const labelsFixedRef = useRef<SVGGElement>(null);
  const erasGroupRef = useRef<SVGGElement>(null);
  const eventsGroupRef = useRef<SVGGElement>(null);
  const axisTicksRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const sidebarListRef = useRef<HTMLDivElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const centerSpacerRef = useRef<HTMLDivElement>(null);
  const topSpacerRef = useRef<HTMLDivElement>(null);

  // Mutable interaction state that must NOT trigger a React re-render on every
  // drag/wheel frame -- the prototype used bare module-level `let` for the
  // same reason. render() reaches into these refs directly, exactly like the
  // original reached into its own closure variables.
  const zoomRef = useRef(1);
  const panYearsRef = useRef(0);
  const activeEraRef = useRef<TimelineEra | null>(null);
  const langRef = useRef<Lang>('en');
  const knotNodeCache = useRef<Record<string, Element>>({});
  const svgParserRef = useRef<DOMParser | null>(null);
  const searchTextRef = useRef('');

  // Imperative functions defined inside the big effect below (they close over
  // this render's refs) but invoked from JSX event handlers outside it.
  const apiRef = useRef<{
    zoomAt: (z: number, year: number, x: number) => void;
    centerYear: () => number;
    clearSelection: () => void;
    buildSidebar: (filterText: string) => void;
    rebuildForLangChange: () => void;
    reset: () => void;
  } | null>(null);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    searchTextRef.current = searchText;
  }, [searchText]);

  useEffect(() => {
    svgParserRef.current = new DOMParser();

    function pxPerYear() {
      return (plotWidth / totalYears) * zoomRef.current;
    }
    function centerYear() {
      return baseCenterYear + panYearsRef.current;
    }
    function domainStart() {
      return centerYear() - plotWidth / pxPerYear() / 2;
    }
    function yearToX(year: number) {
      return plotX0 + (year - domainStart()) * pxPerYear();
    }
    function fmtYear(y: number) {
      const r = Math.round(y);
      if (langRef.current === 'en') return r < 0 ? `${-r} BCE` : `${r} CE`;
      return r < 0 ? `MÖ ${-r}` : `MS ${r}`;
    }
    function clampPan() {
      const halfSpan = plotWidth / pxPerYear() / 2;
      const minCenter = YEAR_MIN + halfSpan - halfSpan * 0.9;
      const maxCenter = YEAR_MAX - halfSpan + halfSpan * 0.9;
      let c = centerYear();
      if (minCenter < maxCenter) c = Math.min(maxCenter, Math.max(minCenter, c));
      panYearsRef.current = c - baseCenterYear;
    }

    function laneSolidColor(id: string) {
      if (!rootRef.current) return '#000';
      return getComputedStyle(rootRef.current).getPropertyValue(laneFillVar[id]).trim();
    }
    function shadeColor(hex: string, percent: number) {
      hex = hex.trim().replace('#', '');
      if (hex.length === 3)
        hex = hex
          .split('')
          .map((c) => c + c)
          .join('');
      const num = parseInt(hex, 16);
      let r = (num >> 16) & 255,
        g = (num >> 8) & 255,
        b = num & 255;
      const mix = percent > 0 ? 255 : 0;
      const p = Math.abs(percent);
      r = Math.round(r + (mix - r) * p);
      g = Math.round(g + (mix - g) * p);
      b = Math.round(b + (mix - b) * p);
      return `rgb(${r},${g},${b})`;
    }
    function setupGradients() {
      const defs = rumiDefsRef.current;
      if (!defs) return;
      defs.innerHTML = '';
      laneOrder.forEach((id) => {
        const base = laneSolidColor(id);
        const grad = el('linearGradient', { id: `grad-${id}`, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
        el('stop', { offset: '0%', 'stop-color': shadeColor(base, 0.32) }, grad);
        el('stop', { offset: '50%', 'stop-color': base }, grad);
        el('stop', { offset: '100%', 'stop-color': shadeColor(base, -0.22) }, grad);
      });
    }
    function laneFill(id: string) {
      return `url(#grad-${id})`;
    }

    function getKnotNode(side: 'left' | 'right') {
      if (!knotNodeCache.current[side]) {
        const vb = side === 'left' ? KNOT.left_viewbox : KNOT.right_viewbox;
        const paths = side === 'left' ? KNOT.left_paths : KNOT.right_paths;
        const pathsMarkup = paths.map((p: KnotPath) => `<path d="${p.d}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>`).join('');
        const doc = svgParserRef.current!.parseFromString(`<svg xmlns="${NS}" viewBox="${vb}">${pathsMarkup}</svg>`, 'image/svg+xml');
        knotNodeCache.current[side] = document.importNode(doc.documentElement, true);
      }
      return knotNodeCache.current[side].cloneNode(true) as SVGElement;
    }
    function drawKnotCap(parent: Element, x: number, y: number, h: number, isLeft: boolean) {
      const node = getKnotNode(isLeft ? 'left' : 'right');
      const capW = h * KNOT_ASPECT;
      node.setAttribute('x', String(isLeft ? x : x - capW));
      node.setAttribute('y', String(y));
      node.setAttribute('width', String(capW));
      node.setAttribute('height', String(h));
      parent.appendChild(node);
      return capW;
    }

    function buildStaticLanes() {
      const lanesGroup = lanesGroupRef.current;
      const labelsFixed = labelsFixedRef.current;
      if (!lanesGroup || !labelsFixed) return;
      lanesGroup.innerHTML = '';
      labelsFixed.innerHTML = '';
      laneOrder.forEach((id, i) => {
        const y = laneY(id),
          h = laneH(id);
        el('rect', { x: 0, y, width: VB_W, height: h, fill: i % 2 === 0 ? 'rgb(120,110,95,0.06)' : 'transparent' }, lanesGroup);
        if (i > 0) el('line', { x1: 0, y1: y - LANE_GAP / 2, x2: VB_W, y2: y - LANE_GAP / 2, class: styles.laneSep }, lanesGroup);
        const lbl = el('text', { x: 8, y: y + 11, class: `${styles.laneLabel} font-label-sm` }, labelsFixed);
        lbl.textContent = laneLabel(id, langRef.current);
      });
    }

    function buildLegend() {
      const legend = legendRef.current;
      if (!legend) return;
      legend.innerHTML = '';
      laneOrder.forEach((id) => {
        const chip = document.createElement('div');
        chip.className = styles.legendChip;
        const sw = document.createElement('div');
        sw.className = styles.legendSwatch;
        sw.style.background = laneSolidColor(id);
        const span = document.createElement('span');
        span.textContent = laneLabel(id, langRef.current);
        chip.appendChild(sw);
        chip.appendChild(span);
        legend.appendChild(chip);
      });
    }

    function showTip(ev: MouseEvent, html: string) {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.innerHTML = html;
      tooltip.style.opacity = '1';
      moveTip(ev);
    }
    function moveTip(ev: MouseEvent) {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.style.left = ev.clientX + 14 + 'px';
      tooltip.style.top = ev.clientY + 10 + 'px';
    }
    function hideTip() {
      if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
    }

    function truncateToWidth(text: string, pxAvailable: number) {
      const maxChars = Math.max(0, Math.floor(pxAvailable / CHAR_PX));
      if (text.length <= maxChars) return text;
      if (maxChars <= 1) return '';
      return text.slice(0, Math.max(1, maxChars - 1)) + '…';
    }

    function ribbonPath(x1: number, x2: number, y: number, h: number) {
      // enforce a minimum on-screen width so very short-lived states render as
      // a small legible pill instead of a near-invisible sliver
      if (x2 - x1 < 5) {
        const mid = (x1 + x2) / 2;
        x1 = mid - 2.5;
        x2 = mid + 2.5;
      }
      // x1/x2 are the era's true start/end years -- the pennant's sharp point
      // sits exactly there. The flat "rectangle" body is inset from each tip
      // by `point`, never the other way around, so the shape's total on-screen
      // width is always exactly x2-x1: it can't protrude past its own real
      // date range and collide with a neighboring era's tip.
      const point = Math.min(h * 0.42, (x2 - x1) / 2);
      const midY = y + h / 2;
      return `M ${x1} ${midY} L ${x1 + point} ${y} L ${x2 - point} ${y} L ${x2} ${midY} L ${x2 - point} ${y + h} L ${x1 + point} ${y + h} Z`;
    }
    function tickStep() {
      const visibleYears = plotWidth / pxPerYear();
      const target = visibleYears / 8;
      const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
      return steps.find((s) => s >= target) || 1000;
    }

    const ACTIVE_LABEL_Y = 48;

    function render() {
      const axisTicks = axisTicksRef.current;
      const erasGroup = erasGroupRef.current;
      const eventsGroup = eventsGroupRef.current;
      if (!axisTicks || !erasGroup || !eventsGroup) return;

      axisTicks.innerHTML = '';
      const step = tickStep();
      const visStart = domainStart();
      const visEnd = visStart + plotWidth / pxPerYear();
      const first = Math.ceil(visStart / step) * step;
      for (let yr = first; yr <= visEnd; yr += step) {
        const x = yearToX(yr);
        if (x < plotX0 - 2 || x > plotX1 + 2) continue;
        const g = el('g', { class: `${styles.axisTick} font-label-sm` }, axisTicks);
        el('line', { x1: x, y1: 1, x2: x, y2: 8 }, g);
        const t = el('text', { x: x, y: 24 }, g);
        t.textContent = fmtYear(yr);
      }

      const activeEra = activeEraRef.current;
      if (activeEra) {
        const xs = yearToX(activeEra.start),
          xe = yearToX(activeEra.end);
        const visible = (x: number) => x >= plotX0 - 2 && x <= plotX1 + 2;
        if (Math.abs(xe - xs) < 60) {
          const mid = (xs + xe) / 2;
          if (visible(mid)) {
            const g = el('g', { class: `${styles.axisTickActive} font-label-sm` }, axisTicks);
            el('line', { x1: mid, y1: 0, x2: mid, y2: ACTIVE_LABEL_Y - 14 }, g);
            el('circle', { cx: mid, cy: 0, r: 2.2 }, g);
            const label = activeEra.start === activeEra.end ? fmtYear(activeEra.start) : `${fmtYear(activeEra.start)}–${fmtYear(activeEra.end)}`;
            const t = el('text', { x: mid, y: ACTIVE_LABEL_Y }, g);
            t.textContent = label;
          }
        } else {
          ([
            [xs, activeEra.start],
            [xe, activeEra.end],
          ] as const).forEach(([x, yr]) => {
            if (!visible(x)) return;
            const g = el('g', { class: `${styles.axisTickActive} font-label-sm` }, axisTicks);
            el('line', { x1: x, y1: 0, x2: x, y2: ACTIVE_LABEL_Y - 14 }, g);
            el('circle', { cx: x, cy: 0, r: 2.2 }, g);
            const t = el('text', { x: x, y: ACTIVE_LABEL_Y }, g);
            t.textContent = fmtYear(yr);
          });
        }
      }

      erasGroup.innerHTML = '';
      packed.forEach((e) => {
        const x1 = yearToX(e.start),
          x2 = yearToX(e.end);
        if (x2 < plotX0 || x1 > plotX1) return;
        const { y, h } = ribbonYH(e);
        const name = eraName(e, langRef.current);
        const isActive = activeEra === e;
        const isDimmed = !!activeEra && !isActive;
        const cls = [styles.eraRibbon, isActive && styles.eraRibbonActive, isDimmed && styles.eraRibbonDim].filter(Boolean).join(' ');
        const path = el(
          'path',
          {
            d: ribbonPath(x1, x2, y, h),
            class: cls,
            fill: isDimmed ? 'var(--dim-fill)' : laneFill(e.lane),
          },
          erasGroup
        );
        path.addEventListener('mouseenter', (ev) => showTip(ev as MouseEvent, `<strong>${name}</strong><span class="${styles.tooltipDates}">${fmtYear(e.start)} – ${fmtYear(e.end)}</span>`));
        path.addEventListener('mousemove', (ev) => moveTip(ev as MouseEvent));
        path.addEventListener('mouseleave', hideTip);
        path.addEventListener('click', () => {
          if (activeEraRef.current === e) clearSelection();
          else selectEra(e);
        });

        const screenW = x2 - x1;
        let capW = 0;
        if (isActive && screenW > 36) {
          if (x1 >= plotX0 - 4) capW = drawKnotCap(erasGroup, Math.max(x1, plotX0), y, h, true);
          if (x2 <= plotX1 + 4) drawKnotCap(erasGroup, Math.min(x2, plotX1), y, h, false);
        }
        if (zoomRef.current > 1.6 && screenW > 22) {
          const startX = Math.max(x1, plotX0);
          const textX = startX + (capW ? capW + 4 : 4);
          const visibleW = Math.min(x2, plotX1) - textX - 4;
          const text = truncateToWidth(name, visibleW);
          if (text) {
            const label = el('text', { x: textX, y: y + h / 2 + 3.8, class: `${styles.eraLabel}${isDimmed ? ' ' + styles.eraLabelDim : ''} font-label-lg` }, erasGroup);
            label.textContent = text;
          }
        }
      });

      eventsGroup.innerHTML = '';
      laneOrder.forEach((laneId) => {
        const evs = DATA.events
          .filter((e) => e.lane === laneId)
          .slice()
          .sort((a, b) => a.date - b.date);
        const clusters: { cx: number; items: TimelineData['events'] }[] = [];
        evs.forEach((e) => {
          const x = yearToX(e.date);
          if (x < plotX0 - 30 || x > plotX1 + 30) return;
          const last = clusters[clusters.length - 1];
          if (last && x - last.cx < CLUSTER_PX) {
            last.items.push(e);
            last.cx = (last.cx * (last.items.length - 1) + x) / last.items.length;
          } else {
            clusters.push({ cx: x, items: [e] });
          }
        });
        const baseY = eventBaseY[laneId];
        clusters.forEach((c, ci) => {
          const nextCx = ci + 1 < clusters.length ? clusters[ci + 1].cx : Infinity;
          const availableToNext = Math.min(nextCx - c.cx, plotX1 - c.cx) - 12;
          if (c.items.length === 1) {
            const e = c.items[0];
            const title = eventTitle(e, langRef.current);
            let labelText = '';
            if (zoomRef.current > 8 && availableToNext > 14) {
              labelText = truncateToWidth(title, availableToNext);
            }
            const g = el('g', { class: styles.eventPin }, eventsGroup);
            const hitW = labelText ? Math.max(20, labelText.length * CHAR_PX + 10) : 20;
            el('rect', { x: c.cx - 5, y: baseY - 10, width: hitW, height: 20, fill: 'transparent' }, g);
            el('circle', { cx: c.cx, cy: baseY, r: 3.8 }, g);
            if (labelText) {
              const lbl = el('text', { x: c.cx + 5, y: baseY + 3, class: `${styles.eventLabel} font-label-sm` }, g);
              lbl.textContent = labelText;
            }
            g.addEventListener('mouseenter', (ev) => showTip(ev as MouseEvent, `<strong>${title}</strong><span class="${styles.tooltipDates}">${fmtYear(e.date)}</span>`));
            g.addEventListener('mousemove', (ev) => moveTip(ev as MouseEvent));
            g.addEventListener('mouseleave', hideTip);
          } else {
            const g = el('g', { class: styles.clusterBadge }, eventsGroup);
            el('circle', { cx: c.cx, cy: baseY, r: 10 }, g);
            const t = el('text', { x: c.cx, y: baseY + 3, class: 'font-label-sm' }, g);
            t.textContent = String(c.items.length);
            const titles =
              c.items
                .map((i) => eventTitle(i, langRef.current))
                .slice(0, 5)
                .join(' · ') + (c.items.length > 5 ? ' …' : '');
            g.addEventListener('mouseenter', (ev) =>
              showTip(
                ev as MouseEvent,
                `<strong>${c.items.length} ${STRINGS[langRef.current].events} (${fmtYear(c.items[0].date)} – ${fmtYear(c.items[c.items.length - 1].date)})</strong><span class="${styles.tooltipDates}">${titles}</span>`
              )
            );
            g.addEventListener('mousemove', (ev) => moveTip(ev as MouseEvent));
            g.addEventListener('mouseleave', hideTip);
          }
        });
      });
    }

    function zoomAt(newZoom: number, yearAtCursor: number, svgX: number) {
      newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
      zoomRef.current = newZoom;
      const ppy = pxPerYear();
      const halfSpan = plotWidth / ppy / 2;
      const desiredDomainStart = yearAtCursor - (svgX - plotX0) / ppy;
      panYearsRef.current = desiredDomainStart + halfSpan - baseCenterYear;
      clampPan();
      render();
    }

    function eraKey(e: TimelineEra) {
      return e.lane + '|' + e.name_tr;
    }
    function highlightSidebarItem(e: TimelineEra) {
      sidebarListRef.current?.querySelectorAll(`.${styles.sidebarItem}`).forEach((n) => {
        n.classList.toggle(styles.sidebarItemActive, (n as HTMLElement).dataset.key === eraKey(e));
      });
    }
    function selectEra(e: TimelineEra) {
      activeEraRef.current = e;
      const span = Math.max(1, e.end - e.start);
      const desiredSpanYears = span * 1.6;
      const targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, totalYears / desiredSpanYears));
      zoomRef.current = targetZoom;
      panYearsRef.current = (e.start + e.end) / 2 - baseCenterYear;
      clampPan();
      render();

      const stageWrap = stageWrapRef.current;
      // Measure the just-rendered ribbon's REAL on-screen position rather than
      // computing it from SVG viewBox coordinates -- the viewBox is always
      // 1400 units wide, but the rendered SVG almost never is exactly 1400px
      // (sidebar width, screen size, zoom level all vary it), so treating
      // viewBox y-units as CSS pixels for scrollTop drifted further off the
      // more the two diverged. Reading getBoundingClientRect() after render()
      // sidesteps unit conversion entirely -- it's the browser's own layout
      // truth, correct regardless of scale.
      const activeEl = erasGroupRef.current?.querySelector(`.${styles.eraRibbonActive}`);
      if (stageWrap && activeEl) {
        // An era near the very top or bottom of the whole timeline has
        // nowhere to scroll TO in that direction -- scrollTop is clamped to
        // [0, scrollHeight-clientHeight] by the browser, so centering it
        // would need to scroll past an edge that doesn't exist. Grow spacers
        // on BOTH ends (half a viewport each, more than enough for any era)
        // only while something's selected, so centering always has room to
        // work but browsing normally doesn't carry a permanent empty gap.
        const halfViewport = `${stageWrap.clientHeight / 2}px`;
        if (topSpacerRef.current) topSpacerRef.current.style.height = halfViewport;
        if (centerSpacerRef.current) centerSpacerRef.current.style.height = halfViewport;
        const stageRect = stageWrap.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        const delta = elRect.top + elRect.height / 2 - (stageRect.top + stageRect.height / 2);
        stageWrap.scrollTop = Math.max(0, stageWrap.scrollTop + delta);
      }
      highlightSidebarItem(e);
    }
    function clearSelection() {
      activeEraRef.current = null;
      render();
      if (topSpacerRef.current) topSpacerRef.current.style.height = '0px';
      if (centerSpacerRef.current) centerSpacerRef.current.style.height = '0px';
      sidebarListRef.current?.querySelectorAll(`.${styles.sidebarItemActive}`).forEach((n) => n.classList.remove(styles.sidebarItemActive));
    }

    function buildSidebar(filterText: string) {
      const list = sidebarListRef.current;
      if (!list) return;
      list.innerHTML = '';
      const q = (filterText || '').trim().toLowerCase();
      laneOrder.forEach((laneId) => {
        const items = erasByLane[laneId]
          .slice()
          .sort((a, b) => a.start - b.start)
          .filter((e) => {
            if (!q) return true;
            return eraName(e, langRef.current).toLowerCase().includes(q);
          });
        if (!items.length) return;
        const head = document.createElement('div');
        head.className = `${styles.sidebarLaneHead} font-label-sm`;
        head.textContent = laneLabel(laneId, langRef.current);
        list.appendChild(head);
        items.forEach((e) => {
          const row = document.createElement('div');
          row.className = `${styles.sidebarItem} font-body-md`;
          row.dataset.key = eraKey(e);
          const sw = document.createElement('span');
          sw.className = styles.sidebarItemSwatch;
          sw.style.background = laneSolidColor(laneId);
          const nameSpan = document.createElement('span');
          nameSpan.textContent = eraName(e, langRef.current);
          const yrs = document.createElement('span');
          yrs.className = styles.sidebarItemYrs;
          yrs.textContent = `${fmtYear(e.start)}–${fmtYear(e.end)}`;
          row.appendChild(sw);
          row.appendChild(nameSpan);
          row.appendChild(yrs);
          row.onclick = () => selectEra(e);
          list.appendChild(row);
        });
      });
      if (activeEraRef.current) highlightSidebarItem(activeEraRef.current);
    }

    // ---- expose the handful of functions the JSX event handlers need ----
    apiRef.current = {
      zoomAt,
      centerYear,
      clearSelection,
      buildSidebar,
      rebuildForLangChange: () => {
        buildStaticLanes();
        buildLegend();
        buildSidebar(searchTextRef.current);
        render();
      },
      reset: () => {
        zoomRef.current = 1;
        panYearsRef.current = 0;
        render();
      },
    };

    setupGradients();
    buildStaticLanes();
    buildLegend();
    buildSidebar(searchTextRef.current);
    render();

    // ---- drag to pan (pointer) + wheel to zoom ----
    const svg = svgRef.current;
    const stageWrap = stageWrapRef.current;
    if (!svg || !stageWrap) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = svg!.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * VB_W;
      const yearAtCursor = domainStart() + (svgX - plotX0) / pxPerYear();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(zoomRef.current * factor, yearAtCursor, svgX);
    }
    let dragging = false,
      dragStartX = 0,
      dragStartY = 0,
      dragStartPan = 0,
      dragStartScroll = 0;
    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartPan = panYearsRef.current;
      dragStartScroll = stageWrap!.scrollTop;
      svg!.classList.add(styles.stageDragging);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const rect = svg!.getBoundingClientRect();
      const scaleFactor = VB_W / rect.width;
      const deltaPx = (e.clientX - dragStartX) * scaleFactor;
      panYearsRef.current = dragStartPan - deltaPx / pxPerYear();
      clampPan();
      stageWrap!.scrollTop = dragStartScroll - (e.clientY - dragStartY);
      render();
    }
    function onPointerUp() {
      dragging = false;
      svg!.classList.remove(styles.stageDragging);
    }

    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    // theme flips which CSS custom properties the getComputedStyle() reads
    // resolve to, so the whole engine needs to rebuild off the new values;
    // re-running the full effect (not just a color patch) is what the
    // prototype's own setTheme() did too. isDesktop is included because the
    // refs this effect wires up don't exist in the DOM at all until the
    // desktop branch below actually renders them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, isDesktop]);

  useEffect(() => {
    // lang change: rebuild the lane labels, legend, sidebar AND the SVG's own
    // era/event text -- all four read langRef.current at build time, mirroring
    // the prototype's setLang() tail call.
    apiRef.current?.rebuildForLangChange();
  }, [lang]);

  const s = STRINGS[lang];

  if (isDesktop === null) {
    return <div className={styles.root} />;
  }

  if (isDesktop === false) {
    return (
      <div className={styles.root} style={{ alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div className="parchment-grain" />
        <p className="font-headline-sm text-headline-sm text-primary" style={{ position: 'relative', zIndex: 1, marginBottom: '12px' }}>
          {lang === 'en' ? 'The Long Road' : 'Uzun Yol'}
        </p>
        <p className="font-body-md" style={{ position: 'relative', zIndex: 1, color: 'var(--text-secondary)', maxWidth: '32rem' }}>
          {lang === 'en'
            ? 'This interactive timeline needs a wider screen to be usable. Please visit on a desktop or tablet in landscape.'
            : 'Bu etkileşimli zaman çizelgesi için daha geniş bir ekran gerekiyor. Lütfen masaüstü veya yatay tablet ile ziyaret edin.'}
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <div className="parchment-grain" />

      <header className={styles.header}>
        <div className={styles.brand}>
          <h1 className="font-headline-sm text-primary" style={{ fontSize: '1.25rem', lineHeight: 1.2, margin: 0 }}>
            {s.title}
          </h1>
          <p className="font-body-md" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: 0 }}>
            {s.subtitle}
          </p>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.headerToolbar}>
            <button
              type="button"
              className={styles.headerToolBtn}
              title={s.zoomIn}
              aria-label={s.zoomIn}
              onClick={() => apiRef.current?.zoomAt(zoomRef.current * 1.5, apiRef.current.centerYear(), (plotX0 + plotX1) / 2)}
            >
              <span className={`material-symbols-outlined ${styles.headerToolIc}`}>zoom_in</span>
            </button>
            <button
              type="button"
              className={styles.headerToolBtn}
              title={s.zoomOut}
              aria-label={s.zoomOut}
              onClick={() => apiRef.current?.zoomAt(zoomRef.current / 1.5, apiRef.current.centerYear(), (plotX0 + plotX1) / 2)}
            >
              <span className={`material-symbols-outlined ${styles.headerToolIc}`}>zoom_out</span>
            </button>
            <div className={styles.headerDivider} />
            <button type="button" className={styles.headerToolBtn} title={s.reset} aria-label={s.reset} onClick={() => apiRef.current?.reset()}>
              <span className={`material-symbols-outlined ${styles.headerToolIc}`}>restart_alt</span>
            </button>
          </div>
          <div className={`${styles.langToggle} font-label-sm`}>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>
              TR
            </button>
          </div>
        </div>
      </header>

      <div className={styles.legendRow}>
        <div ref={legendRef} className={`${styles.legend} font-label-sm`} />
        <p className={`${styles.flagNote} font-label-sm`}>{s.flagNote}</p>
      </div>

      <div className={styles.mainRow}>
        <div className={`${styles.sidebar}${sidebarCollapsed ? ' ' + styles.sidebarCollapsed : ''}`}>
          <div className="parchment-grain" />
          <div className={`${styles.sidebarHead} font-label-lg`}>
            <span>{s.sidebarTitle}</span>
            <button type="button" className={styles.iconBtn} onClick={() => setSidebarCollapsed(true)} title="Collapse" aria-label="Collapse index">
              ‹
            </button>
          </div>
          <input
            className={`${styles.sidebarSearch} font-body-md`}
            placeholder={s.searchPlaceholder}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              searchTextRef.current = e.target.value;
              apiRef.current?.buildSidebar(e.target.value);
            }}
          />
          <div ref={sidebarListRef} className={styles.sidebarList} />
        </div>
        <div className={styles.stageWrap} ref={stageWrapRef}>
          <div ref={topSpacerRef} style={{ height: 0 }} />
          {/* Zero-height sticky anchor: stays pinned to the top of the visible
              scroll viewport (both the vertical scroll AND the drag-to-pan
              handler move stageWrap.scrollTop) without pushing the SVG down,
              since the tab itself is absolutely positioned off this anchor
              rather than off stageWrap directly. Padding lives on the SVG
              (a sibling), not on stageWrap itself -- stageWrap's padding
              would also shift this anchor's own position, since it's normal
              flow, undoing the separation from the label it's meant to create. */}
          <div className={styles.sidebarExpandTabAnchor}>
            <button
              type="button"
              className={`${styles.sidebarExpandTab}${sidebarCollapsed ? ' ' + styles.sidebarExpandTabShow : ''}`}
              onClick={() => setSidebarCollapsed(false)}
              title="Show index"
              aria-label="Show index"
            >
              ›
            </button>
          </div>
          {/* The grain lives here, not as a direct absolute child of stageWrap:
              stageWrap is a scroll container, so inset:0 there sizes the grain
              to stageWrap's fixed, unscrolled viewport height (its "padding
              box"), not the full scrollable content height -- past that point
              (all 5 lanes stacked is much taller than one screenful) there's
              simply no more grain div left to render, hence the hard seam.
              This wrapper is a normal in-flow block that auto-sizes to the
              SVG's actual full height, so inset:0 here covers everything, and
              it scrolls together with the SVG since neither escapes the flow. */}
          <div className={styles.stageContent}>
            <div className="parchment-grain" />
            <svg
              ref={svgRef}
              className={styles.stage}
              width="100%"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              style={{ touchAction: 'none', paddingLeft: sidebarCollapsed ? 28 : 0 }}
            >
              <defs ref={rumiDefsRef}></defs>
              <g ref={lanesGroupRef}></g>
              <g ref={labelsFixedRef}></g>
              <g ref={erasGroupRef}></g>
              <g ref={eventsGroupRef}></g>
            </svg>
          </div>
          <div ref={centerSpacerRef} style={{ height: 0 }} />
          <div ref={tooltipRef} className={`${styles.tooltip} font-body-md`} />
        </div>
      </div>

      <div className={styles.bottomDock}>
        <div className="parchment-grain" />
        <svg className={styles.axisBar} width="100%" viewBox="0 0 1400 60" preserveAspectRatio="none">
          <line className={styles.axisBaseline} x1={0} y1={1} x2={1400} y2={1}></line>
          <g ref={axisTicksRef}></g>
        </svg>
      </div>
    </div>
  );
}

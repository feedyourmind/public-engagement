/**
 * Funnel layout computation utilities.
 * Computes grid and funnel positions for 1000 squares,
 * and funnel border geometry.
 */

const TOTAL = 1000;

// ── Grid layout (100×10 matching DistributionGrid) ──────────────

const GRID_COLS = 100;

export function computeGridPositions(
  containerW: number,
  _containerH: number
): { x: Float32Array; y: Float32Array; cellSize: number } {
  const cellSize = containerW / GRID_COLS;
  const x = new Float32Array(TOTAL);
  const y = new Float32Array(TOTAL);

  for (let i = 0; i < TOTAL; i++) {
    x[i] = (i % GRID_COLS) * cellSize;
    y[i] = Math.floor(i / GRID_COLS) * cellSize;
  }

  return { x, y, cellSize };
}

// ── Funnel layout (target position) ──────────────────────────────

export interface FunnelDimensions {
  topWidth: number;
  bottomWidth: number;
  height: number;
  topY: number;
  centerX: number;
}

export const DEFAULT_FUNNEL: FunnelDimensions = {
  topWidth: 560,
  bottomWidth: 20,
  height: 460,
  topY: 5,
  centerX: 300,
};

/** Get funnel width at a given y-position */
function funnelWidthAtY(y: number, f: FunnelDimensions): number {
  const t = Math.max(0, Math.min(1, (y - f.topY) / f.height));
  return f.topWidth - (f.topWidth - f.bottomWidth) * t;
}

/**
 * Count how many squares fit in the funnel at a given cellSize,
 * and how far down they reach.
 */
function simulatePacking(
  cellSize: number,
  funnel: FunnelDimensions
): { totalFit: number; lastY: number } {
  let count = 0;
  let y = funnel.topY;
  const funnelBottom = funnel.topY + funnel.height;

  while (count < TOTAL && y + cellSize <= funnelBottom + cellSize) {
    const w = funnelWidthAtY(y, funnel);
    const perRow = Math.max(1, Math.floor(w / cellSize));
    const needed = TOTAL - count;
    count += Math.min(perRow, needed);
    if (count >= TOTAL) {
      return { totalFit: count, lastY: y + cellSize };
    }
    y += cellSize;
  }

  return { totalFit: count, lastY: y };
}

/**
 * Binary-search for the cell size that makes squares fill
 * the funnel from top to approximately the bottom.
 */
function findOptimalCellSize(funnel: FunnelDimensions): number {
  let lo = 2;
  let hi = 30;

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const { lastY } = simulatePacking(mid, funnel);
    const funnelBottom = funnel.topY + funnel.height;

    if (lastY < funnelBottom - mid) {
      // Squares end too high — need bigger cells (fewer per row → more rows)
      lo = mid;
    } else {
      // Squares reach or exceed bottom — cells could be smaller
      hi = mid;
    }
  }

  return (lo + hi) / 2;
}

export function computeFunnelPositions(
  segmentAreas: number[],
  containerW: number,
  _containerH: number,
  funnel: FunnelDimensions = DEFAULT_FUNNEL
): { x: Float32Array; y: Float32Array; bandBoundaries: number[]; cellSize: number } {
  const counts = segmentAreas.map((pct) => Math.round((pct / 100) * TOTAL));
  let diff = TOTAL - counts.reduce((a, b) => a + b, 0);
  const largest = counts.indexOf(Math.max(...counts));
  counts[largest] += diff;

  const cumulative: number[] = [0];
  for (let i = 0; i < counts.length; i++) {
    cumulative.push(cumulative[i] + counts[i]);
  }

  // Auto-compute cell size so squares fill the full funnel height
  const cellSize = findOptimalCellSize(funnel);

  const x = new Float32Array(TOTAL);
  const y = new Float32Array(TOTAL);

  const cxOffset = (containerW - funnel.centerX * 2) / 2;

  let squareIndex = 0;
  let currentY = funnel.topY;

  while (squareIndex < TOTAL) {
    const w = funnelWidthAtY(currentY, funnel);
    const squaresPerRow = Math.max(1, Math.floor(w / cellSize));
    const rowCount = Math.min(TOTAL - squareIndex, squaresPerRow);

    const rowWidth = rowCount * cellSize;
    const rowStartX = cxOffset + funnel.centerX - rowWidth / 2;

    for (let col = 0; col < rowCount; col++) {
      x[squareIndex] = rowStartX + col * cellSize;
      y[squareIndex] = currentY;
      squareIndex++;
    }

    currentY += cellSize;
  }

  const bandBoundaries: number[] = [funnel.topY];
  for (let seg = 0; seg < counts.length; seg++) {
    const lastIdx = cumulative[seg + 1] - 1;
    bandBoundaries.push(lastIdx >= 0 ? y[lastIdx] + cellSize : funnel.topY);
  }

  return { x, y, bandBoundaries, cellSize };
}

// ── Easing ──────────────────────────────────────────────────────

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Segment square mapping (matches DistributionGrid) ───────────

export function computeSquareSegments(segmentAreas: number[]): Uint8Array {
  const counts = segmentAreas.map((pct) => Math.round((pct / 100) * TOTAL));
  let diff = TOTAL - counts.reduce((a, b) => a + b, 0);
  const largest = counts.indexOf(Math.max(...counts));
  counts[largest] += diff;

  const arr = new Uint8Array(TOTAL);
  let idx = 0;
  for (let seg = 0; seg < counts.length; seg++) {
    for (let j = 0; j < counts[seg]; j++) {
      arr[idx++] = seg;
    }
  }
  return arr;
}

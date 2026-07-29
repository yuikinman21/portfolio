'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ContributionDay = {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
};

type ContributionCalendar = {
    username: string;
    total: number;
    days: ContributionDay[];
};

type ContributionGraphProps = {
    username?: string;
    /** キャプション（件数とレジェンド）を表示するか */
    showCaption?: boolean;
    className?: string;
};

// GitHubと同系統の緑スケール（0は空セル）
const LEVEL_COLORS = ['#e6e9ef', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const MAX_WEEKS = 53;
const MIN_WEEKS = 13;
// この幅を確保できるときはセルを縮めて1年分すべて表示する（GitHubらしい見た目を優先）
const YEAR_MIN_WIDTH = 440;

const dayOfWeek = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

// 日付順の配列を「列 = 週」「行 = 曜日」のグリッドに変換する
const toGrid = (days: ContributionDay[]) => {
    const columns: (ContributionDay | null)[][] = [];
    let column: (ContributionDay | null)[] = new Array(7).fill(null);
    let offset = days.length > 0 ? dayOfWeek(days[0].date) : 0;

    days.forEach((day) => {
        const row = dayOfWeek(day.date);
        if (row < offset) {
            columns.push(column);
            column = new Array(7).fill(null);
        }
        column[row] = day;
        offset = row;
    });

    if (column.some(Boolean)) {
        columns.push(column);
    }

    return columns;
};

// 表示している期間を日本語で表す（例: 1年 / 6か月）
const periodLabel = (weeks: number) =>
    weeks >= MAX_WEEKS - 1 ? '1年' : `${Math.max(1, Math.round(weeks / 4.345))}か月`;

export default function ContributionGraph({
    username = 'yuikinman21',
    showCaption = true,
    className = '',
}: ContributionGraphProps) {
    const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
    const [boxWidth, setBoxWidth] = useState(0);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch(`/api/contributions?user=${encodeURIComponent(username)}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`status ${res.status}`);
                return res.json();
            })
            .then((data: ContributionCalendar) => {
                if (Array.isArray(data?.days) && data.days.length > 0) {
                    setCalendar(data);
                }
            })
            // 取得に失敗しても壊れた画像は出さず、空のグリッドのまま表示する
            .catch(() => undefined);

        return () => controller.abort();
    }, [username]);

    // 幅に応じて表示する週数を変える（スマホでもセルが潰れないように）
    useEffect(() => {
        const element = boxRef.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            setBoxWidth(entry.contentRect.width);
        });
        observer.observe(element);
        setBoxWidth(element.getBoundingClientRect().width);

        return () => observer.disconnect();
    }, []);

    const columns = useMemo(
        () => (calendar ? toGrid(calendar.days) : []),
        [calendar]
    );

    const weeks = useMemo(() => {
        if (boxWidth <= 0 || boxWidth >= YEAR_MIN_WIDTH) return MAX_WEEKS;
        const fits = Math.floor((boxWidth + GAP) / PITCH);
        return Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, fits));
    }, [boxWidth]);

    const visible = useMemo(() => columns.slice(-weeks), [columns, weeks]);

    // 読み込み前・失敗時はプレースホルダーの空グリッドを描いてレイアウトを維持する
    const placeholder = visible.length === 0;
    const width = weeks * PITCH - GAP;
    const height = 7 * PITCH - GAP;
    const shownTotal = visible
        .flat()
        .reduce((sum, day) => sum + (day?.count ?? 0), 0);

    return (
        <div ref={boxRef} className={`w-full ${className}`}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                role="img"
                aria-label={
                    calendar
                        ? `@${username} の直近${periodLabel(weeks)}のコントリビューション ${shownTotal} 件`
                        : `@${username} のコントリビューショングラフ`
                }
                className="block h-auto w-full"
            >
                {placeholder
                    ? Array.from({ length: weeks * 7 }, (_, index) => (
                          <rect
                              key={index}
                              x={Math.floor(index / 7) * PITCH}
                              y={(index % 7) * PITCH}
                              width={CELL}
                              height={CELL}
                              rx={2}
                              fill={LEVEL_COLORS[0]}
                          />
                      ))
                    : visible.map((column, columnIndex) =>
                          column.map((day, rowIndex) =>
                              day ? (
                                  <rect
                                      key={day.date}
                                      x={columnIndex * PITCH}
                                      y={rowIndex * PITCH}
                                      width={CELL}
                                      height={CELL}
                                      rx={2}
                                      fill={LEVEL_COLORS[day.level]}
                                  >
                                      <title>{`${day.date}: ${day.count} contributions`}</title>
                                  </rect>
                              ) : null
                          )
                      )}
            </svg>

            {showCaption && (
                <div className="mt-2.5 flex items-center justify-between gap-3 font-mono text-[10px] tracking-wide text-slate-400">
                    <span className="truncate">
                        {calendar
                            ? `直近${periodLabel(weeks)}で ${shownTotal.toLocaleString('en-US')} contributions`
                            : 'Loading contributions…'}
                    </span>
                    <span className="hidden shrink-0 items-center gap-1 sm:flex">
                        <span className="mr-0.5">Less</span>
                        {LEVEL_COLORS.map((color) => (
                            <span
                                key={color}
                                className="h-2 w-2 rounded-[2px]"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <span className="ml-0.5">More</span>
                    </span>
                </div>
            )}
        </div>
    );
}

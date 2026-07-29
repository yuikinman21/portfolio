import { NextResponse } from "next/server";

// GitHubのコントリビューションカレンダーを取得するAPI。
// 以前は github-contributions-api.deno.dev のSVGを直接<img>で読んでいたが、
// Deno Deploy Classicが2026-07-20に終了して404になったため、
// GitHub本体からデータを取得して自前で描画する方式に変更した。

export const revalidate = 3600;

const DEFAULT_USER = "yuikinman21";
const USERNAME_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  username: string;
  total: number;
  days: ContributionDay[];
  source: "graphql" | "html";
};

const LEVEL_BY_NAME: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const toLevel = (value: string | undefined): ContributionDay["level"] => {
  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 4) {
    return numeric as ContributionDay["level"];
  }
  return 0;
};

// トークンがある場合は公式GraphQL APIを使う（最も正確・安定）
async function fetchFromGraphQL(
  username: string,
  token: string
): Promise<ContributionCalendar> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-contribution-graph",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL responded ${res.status}`);
  }

  const json = await res.json();
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error("GitHub GraphQL returned no calendar");
  }

  const days: ContributionDay[] = [];
  for (const week of calendar.weeks ?? []) {
    for (const day of week.contributionDays ?? []) {
      days.push({
        date: String(day.date),
        count: Number(day.contributionCount) || 0,
        level: LEVEL_BY_NAME[day.contributionLevel] ?? 0,
      });
    }
  }

  return {
    username,
    total: Number(calendar.totalContributions) || 0,
    days,
    source: "graphql",
  };
}

// トークン不要のフォールバック。GitHubのプロフィール用カレンダーHTMLを読む。
async function fetchFromProfileHtml(
  username: string
): Promise<ContributionCalendar> {
  const res = await fetch(
    `https://github.com/users/${username}/contributions`,
    {
      headers: {
        Accept: "text/html",
        "User-Agent": "portfolio-contribution-graph",
      },
      next: { revalidate },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub profile calendar responded ${res.status}`);
  }

  const html = await res.text();

  // ツールチップ（"3 contributions on July 1st." など）から日毎の件数を引く
  const counts = new Map<string, number>();
  const tooltipPattern =
    /<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  for (const match of html.matchAll(tooltipPattern)) {
    const text = match[2];
    const amount = text.match(/([\d,]+)\s+contribution/);
    counts.set(match[1], amount ? Number(amount[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  const cellPattern = /<td[^>]*\sdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  for (const match of html.matchAll(cellPattern)) {
    const tag = match[0];
    const id = tag.match(/\sid="([^"]+)"/)?.[1];
    days.push({
      date: match[1],
      count: (id && counts.get(id)) || 0,
      level: toLevel(tag.match(/\sdata-level="([^"]+)"/)?.[1]),
    });
  }

  if (days.length === 0) {
    throw new Error("GitHub profile calendar could not be parsed");
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  return {
    username,
    total: days.reduce((sum, day) => sum + day.count, 0),
    days,
    source: "html",
  };
}

export async function GET(request: Request) {
  const requested =
    new URL(request.url).searchParams.get("user") ?? DEFAULT_USER;

  if (!USERNAME_PATTERN.test(requested)) {
    return NextResponse.json({ error: "invalid username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;

  try {
    const calendar = token
      ? await fetchFromGraphQL(requested, token).catch(() =>
          fetchFromProfileHtml(requested)
        )
      : await fetchFromProfileHtml(requested);

    return NextResponse.json(calendar, {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[contributions] failed to load calendar", error);
    return NextResponse.json(
      { error: "failed to load contributions" },
      { status: 502 }
    );
  }
}

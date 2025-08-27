import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Conform strictly to Next.js 15: params is Promise-like (async) and must be awaited
// https://nextjs.org/docs/messages/sync-dynamic-apis
type ChapterParams = { chapter: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<ChapterParams> }) {
  try {
  const { chapter } = await params;
    const n = parseInt(chapter, 10);
    if (![1, 2, 3, 4, 5].includes(n)) return NextResponse.json({ error: "Capítulo inválido" }, { status: 400 });
    const file = path.join(process.cwd(), "public", `chapter${n}.json`);
    const json = await fs.readFile(file, "utf-8");
    return new NextResponse(json, { status: 200, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao ler" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<ChapterParams> }) {
  try {
  const { chapter } = await params;
    const n = parseInt(chapter, 10);
    if (![1, 2, 3, 4, 5].includes(n)) return NextResponse.json({ error: "Capítulo inválido" }, { status: 400 });
    const body = await req.text();
    // Validate JSON
    let parsed: any;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    if (!parsed || typeof parsed !== "object" || !parsed.nodes) {
      return NextResponse.json({ error: "Estrutura inválida: nodes ausente" }, { status: 400 });
    }
    const file = path.join(process.cwd(), "public", `chapter${n}.json`);
    await fs.writeFile(file, JSON.stringify(parsed, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao salvar" }, { status: 500 });
  }
}

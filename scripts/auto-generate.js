const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_ID = process.env.AMAZON_TRACKING_ID || '';
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

const KEYWORDS = [
  {kw:"\u30b5\u30a6\u30ca \u521d\u5fc3\u8005 \u5165\u308a\u65b9 \u57fa\u672c",genre:"beginner"},
  {kw:"\u3068\u3068\u306e\u3046 \u610f\u5473 \u611f\u899a",genre:"howto"},
  {kw:"\u30b5\u30a6\u30ca \u52b9\u679c \u5065\u5eb7 \u7f8e\u5bb9",genre:"health"},
  {kw:"\u30b5\u30a6\u30ca\u30cf\u30c3\u30c8 \u304a\u3059\u3059\u3081",genre:"goods"},
  {kw:"\u6c34\u98a8\u5442 \u82e6\u624b \u514b\u670d \u65b9\u6cd5",genre:"howto"},
  {kw:"\u30b5\u30a6\u30ca \u6771\u4eac \u304a\u3059\u3059\u3081\u65bd\u8a2d",genre:"facility"},
  {kw:"\u5916\u6c17\u6d74 \u30b3\u30c4 \u6b63\u3057\u3044\u65b9\u6cd5",genre:"howto"},
  {kw:"\u30b5\u30a6\u30ca \u983b\u5ea6 \u9031\u4f55\u56de",genre:"health"},
  {kw:"\u30b5\u30a6\u30ca\u30b0\u30c3\u30ba \u304a\u3059\u3059\u3081",genre:"goods"},
  {kw:"\u30b5\u30a6\u30ca \u5927\u962a \u304a\u3059\u3059\u3081",genre:"facility"}
];

const SYS = `あなたはサウナ専門ライターです。読者目線で分かりやすく、SEOに強い記事を書きます。見出しはH2/H3を使ってください。文字数2000字以上。Markdown形式で出力。記事内でおすすめ商品を紹介する箇所には[AMAZON:商品名]と[RAKUTEN:商品名]を合計5箇所挿入してください。`;

function insertLinks(text) {
  text = text.replace(/\[AMAZON:([^\]]+)\]/g, (_, p) => {
    return `[🛒 ${p}をAmazonでチェック](https://www.amazon.co.jp/s?k=${encodeURIComponent(p)}&tag=${AMAZON_ID})`;
  });
  text = text.replace(/\[RAKUTEN:([^\]]+)\]/g, (_, p) => {
    return `[🛍 ${p}を楽天でチェック](https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p)}/?rafcid=${RAKUTEN_ID})`;
  });
  return text;
}

function toSlug(kw) {
  return kw.replace(/[\s\u3000]+/g, '-').replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') + '-' + Date.now();
}

async function generateArticle(kw, genre) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYS,
      messages: [{ role: 'user', content: `ジャンル：${genre}\nキーワード：「${kw}」\n\nSEO記事をMarkdownで書いてください。` }],
    }),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || '').join('') || '';
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  const targets = KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 5);

  for (const { kw, genre } of targets) {
    console.log(`生成中: ${kw}`);
    try {
      let text = await generateArticle(kw, genre);
      text = insertLinks(text);
      const slug = toSlug(kw);
      const content = `---\ntitle: "${kw}"\ndate: "${new Date().toISOString().split('T')[0]}"\ngenre: "${genre}"\ntags: [${genre}]\n---\n\n${text}\n`;
      fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
      console.log(`完了: ${slug}.mdx`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`エラー: ${kw}`, e.message);
    }
  }
  console.log('全記事生成完了！');
}

main();

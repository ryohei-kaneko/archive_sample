/* ===========================
   ARCHIVE JP — Shared Data
   Used by: main.js, person.js
   =========================== */

const ROLE_LABEL = {
  photographer:       "Photo",
  model:              "Model",
  stylist:            "Styling",
  hair_makeup:        "HM&UA",
  hair:               "Hair",
  makeup:             "Makeup",
  director:           "Director",
  videographer:       "Video Cam",
  editor:             "Edit",
  art_director:       "Art Dir.",
  creative_director:  "CD",
  casting:            "Casting",
  producer:           "Producer",
  set_designer:       "Set Design",
  retoucher:          "Retouch",
  other:              "Other",
};

const WORK_TYPES = [
  { id: "all",          label: "ALL",          labelJP: "すべて"       },
  { id: "look_book",    label: "LOOK BOOK",    labelJP: "LOOKブック"   },
  { id: "campaign",     label: "CAMPAIGN",     labelJP: "キャンペーン" },
  { id: "editorial",    label: "EDITORIAL",    labelJP: "エディトリアル" },
  { id: "video",        label: "VIDEO",        labelJP: "映像"         },
  { id: "special_page", label: "SPECIAL PAGE", labelJP: "特集ページ"   },
  { id: "event",        label: "EVENT",        labelJP: "イベント"     },
];

const CREDIT_ROLES_NAV = [
  { id: "photographer",      label: "Photographer",       count: 24 },
  { id: "model",             label: "Model",              count: 38 },
  { id: "stylist",           label: "Stylist",            count: 19 },
  { id: "hair_makeup",       label: "Hair & Makeup",      count: 15 },
  { id: "director",          label: "Director",           count: 8  },
  { id: "art_director",      label: "Art Director",       count: 11 },
  { id: "creative_director", label: "Creative Director",  count: 6  },
  { id: "retoucher",         label: "Retoucher",          count: 7  },
  { id: "set_designer",      label: "Set Designer",       count: 4  },
  { id: "casting",           label: "Casting",            count: 5  },
];

const agencies = [
  { id: "a1", name: "スペースクラフト",  type: "model",    website: "#" },
  { id: "a2", name: "イマージュ",        type: "model",    website: "#" },
  { id: "a3", name: "アース",            type: "model",    website: "#" },
  { id: "a4", name: "フロムファースト",  type: "creative", website: "#" },
  { id: "a5", name: "エルシーエー",      type: "creative", website: "#" },
  { id: "a6",   name: "テンカラット",      type: "model",    website: "#" },
  { id: "a-n8", name: "NUMBER EIGHT MODELS", type: "model", website: "https://numbereight-models.jp/" },
];

const brands = [
  { id: "b1",  name: "TOGA",             category: "womens",  works: 4 },
  { id: "b2",  name: "SACAI",            category: "unisex",  works: 3 },
  { id: "b3",  name: "HYKE",             category: "womens",  works: 3 },
  { id: "b4",  name: "ISSEY MIYAKE",     category: "unisex",  works: 5 },
  { id: "b5",  name: "Fumito Ganryu",    category: "mens",    works: 2 },
  { id: "b6",  name: "STUDIO NICHOLSON", category: "unisex",  works: 2 },
  { id: "b7",  name: "BEAMS",            category: "unisex",  works: 3 },
  { id: "b8",  name: "nest Robe",        category: "womens",  works: 4 },
  { id: "b9",  name: "YANUK",            category: "womens",  works: 3 },
  { id: "b10", name: "UNITED ARROWS",    category: "unisex",  works: 5 },
  { id: "b11", name: "IENA",             category: "womens",  works: 2 },
  { id: "b12", name: "SHISEIDO",         category: "beauty",  works: 2 },
];

const people = [
  {
    id: "p1", name: "中村 浩一", name_kana: "なかむら こういち", name_en: "Koichi Nakamura",
    primary_role: "photographer", roles: ["photographer"],
    agency_id: "a4",
    tags: ["ナチュラル", "ポートレート", "LOOKブック"],
    color: "#3A5A48", is_verified: true,
  },
  {
    id: "p2", name: "渡辺 幸子", name_kana: "わたなべ さちこ", name_en: "Sachiko Watanabe",
    primary_role: "stylist", roles: ["stylist", "art_director"],
    tags: ["コンテンポラリー", "セレクトショップ", "PR"],
    color: "#584878", is_verified: true,
  },
  {
    id: "p3", name: "山田 拓海", name_kana: "やまだ たくみ", name_en: "Takumi Yamada",
    primary_role: "photographer", roles: ["photographer"],
    agency_id: "a5",
    tags: ["ストリート", "スナップ", "エディトリアル"],
    color: "#784838", is_verified: false,
  },
  {
    id: "p4", name: "石川 智子", name_kana: "いしかわ ともこ", name_en: "Tomoko Ishikawa",
    primary_role: "hair_makeup", roles: ["hair_makeup"],
    tags: ["ナチュラルビューティー", "コレクション"],
    color: "#783848", is_verified: true,
  },
  {
    id: "p5", name: "高橋 彩",   name_kana: "たかはし あや",  name_en: "Aya Takahashi",
    primary_role: "hair_makeup", roles: ["hair", "makeup"],
    tags: ["トレンド", "ビューティーショット", "広告"],
    color: "#783058", is_verified: false,
  },
  {
    id: "p6", name: "伊藤 隆",   name_kana: "いとう たかし",  name_en: "Takashi Ito",
    primary_role: "photographer", roles: ["photographer"],
    agency_id: "a4",
    tags: ["広告", "キャンペーン", "ブランドビジュアル"],
    color: "#384868", is_verified: true,
  },
  {
    id: "p7", name: "木村 慎",   name_kana: "きむら しん",    name_en: "Shin Kimura",
    primary_role: "director", roles: ["director", "videographer"],
    tags: ["コレクションフィルム", "ブランドムービー"],
    color: "#285848", is_verified: false,
  },
  {
    id: "p8", name: "小林 美穂", name_kana: "こばやし みほ",  name_en: "Miho Kobayashi",
    primary_role: "stylist", roles: ["stylist"],
    tags: ["ウィメンズ", "エシカル", "セレクトショップ"],
    color: "#584028", is_verified: false,
  },
  {
    id: "p9", name: "坂本 健",   name_kana: "さかもと けん",  name_en: "Ken Sakamoto",
    primary_role: "photographer", roles: ["photographer", "videographer"],
    tags: ["映像", "スチール", "ストリートキャスティング"],
    color: "#403860", is_verified: false,
  },
  {
    id: "p10", name: "青木 優里", name_kana: "あおき ゆり",   name_en: "Yuri Aoki",
    primary_role: "model", roles: ["model"],
    agency_id: "a1",
    tags: ["コレクション", "LOOKブック", "広告"],
    color: "#384060", is_verified: true,
  },
  {
    id: "p-jumpei",
    name: "岡﨑 順平", name_kana: "おかざき じゅんぺい", name_en: "Jumpei Okazaki",
    primary_role: "model", roles: ["model"],
    agency_id: "a-n8",
    tags: ["メンズ", "LOOKブック", "キャンペーン", "エディトリアル"],
    bio: "NUMBER EIGHT MODELS所属。身長185cm。",
    instagram_url: "https://www.instagram.com/jumpei_m1n/",
    profile_image: "images/jumpei.jpg",
    color: "#2A3040", is_verified: true,
  },
];

const works = [
  {
    id: "w1", title: "2026AW LOOK BOOK",
    type: "look_book", brand_id: "b1", brand: "TOGA", season: "2026AW", year: 2026,
    tags: ["コンテンポラリー", "スタジオ撮影", "モノトーン"],
    is_published: true, featured: true, color: "#1E1E1C", accent: "#C0A070",
    credits: [
      { credit_role: "photographer", person: "中村 浩一",        order_index: 1 },
      { credit_role: "stylist",      person: "渡辺 幸子",        order_index: 1 },
      { credit_role: "hair_makeup",  person: "石川 智子",        order_index: 1 },
      { credit_role: "model",        person: "青木 優里",        order_index: 1 },
      { credit_role: "model",        person: "田中 葵",          order_index: 2 },
      { credit_role: "retoucher",    person: "デジタルアーツ 東京", order_index: 1 },
    ],
  },
  {
    id: "w2", title: "SS26 CAMPAIGN VISUAL",
    type: "campaign", brand_id: "b2", brand: "SACAI", season: "2026SS", year: 2026,
    tags: ["広告", "アーバン", "モード"],
    is_published: true, featured: true, color: "#14141C", accent: "#7878A8",
    credits: [
      { credit_role: "photographer",      person: "伊藤 隆",          order_index: 1 },
      { credit_role: "stylist",           person: "渡辺 幸子",        order_index: 1 },
      { credit_role: "creative_director", person: "阿部 千登勢",      order_index: 1 },
      { credit_role: "hair_makeup",       person: "石川 智子",        order_index: 1 },
      { credit_role: "model",             person: "青木 優里",        order_index: 1 },
      { credit_role: "retoucher",         person: "デジタルアーツ 東京", order_index: 1 },
    ],
  },
  {
    id: "w3", title: "KNITWEAR COLLECTION FILM",
    type: "video", brand_id: "b5", brand: "Fumito Ganryu", season: "2025AW", year: 2025,
    tags: ["コレクションフィルム", "ニット", "映像"],
    is_published: true, featured: false, color: "#1A2418", accent: "#6A8868",
    credits: [
      { credit_role: "director",     person: "木村 慎",   order_index: 1 },
      { credit_role: "videographer", person: "坂本 健",   order_index: 1 },
      { credit_role: "stylist",      person: "鈴木 真由", order_index: 1 },
      { credit_role: "hair_makeup",  person: "武田 恵",   order_index: 1 },
      { credit_role: "model",        person: "松本 愛",   order_index: 1 },
    ],
  },
  {
    id: "w4", title: "SPRING BEAUTY CLOSE-UP",
    type: "editorial", brand_id: "b12", brand: "SHISEIDO", season: "2026SS", year: 2026,
    tags: ["ビューティー", "クローズアップ", "春"],
    is_published: true, featured: false, color: "#281818", accent: "#B87878",
    credits: [
      { credit_role: "photographer",  person: "中村 浩一", order_index: 1 },
      { credit_role: "hair",          person: "高橋 彩",   order_index: 1 },
      { credit_role: "makeup",        person: "武田 恵",   order_index: 1 },
      { credit_role: "model",         person: "伊藤 七海", order_index: 1 },
      { credit_role: "art_director",  person: "渡辺 幸子", order_index: 1 },
    ],
  },
  {
    id: "w5", title: "STREET CASTING — SHIBUYA",
    type: "editorial", brand_id: "b7", brand: "BEAMS", season: "2026SS", year: 2026,
    tags: ["ストリートキャスティング", "渋谷", "スナップ"],
    is_published: true, featured: false, color: "#101828", accent: "#5A7AA8",
    credits: [
      { credit_role: "photographer", person: "坂本 健",     order_index: 1 },
      { credit_role: "stylist",      person: "長谷川 亜紀", order_index: 1 },
      { credit_role: "casting",      person: "フロムファースト", order_index: 1 },
      { credit_role: "model",        person: "公募モデル 12名", order_index: 1 },
    ],
  },
  {
    id: "w6", title: "次世代スタイリスト特集",
    type: "special_page", brand_id: null, brand: null, season: "2025", year: 2025,
    tags: ["特集", "スタイリスト", "インタビュー"],
    is_published: true, featured: false, color: "#201808", accent: "#B89048",
    credits: [
      { credit_role: "photographer", person: "山田 拓海",  order_index: 1 },
      { credit_role: "photographer", person: "坂本 健",    order_index: 2 },
      { credit_role: "stylist",      person: "鈴木 真由",  order_index: 1 },
      { credit_role: "stylist",      person: "長谷川 亜紀", order_index: 2 },
    ],
  },
  {
    id: "w7", title: "2025AW LOOK BOOK",
    type: "look_book", brand_id: "b8", brand: "nest Robe", season: "2025AW", year: 2025,
    tags: ["ナチュラル", "リネン", "屋外撮影"],
    is_published: true, featured: false, color: "#282018", accent: "#A89060",
    credits: [
      { credit_role: "photographer", person: "山田 拓海", order_index: 1 },
      { credit_role: "stylist",      person: "小林 美穂", order_index: 1 },
      { credit_role: "hair_makeup",  person: "高橋 彩",   order_index: 1 },
      { credit_role: "model",        person: "松本 愛",   order_index: 1 },
      { credit_role: "model",        person: "田中 葵",   order_index: 2 },
    ],
  },
  {
    id: "w8", title: "HAIR ARCHIVE 2025",
    type: "editorial", brand_id: "b12", brand: "SHISEIDO", season: "2025", year: 2025,
    tags: ["ヘア", "ビューティー", "アーカイブ"],
    is_published: true, featured: false, color: "#200A10", accent: "#A87878",
    credits: [
      { credit_role: "photographer", person: "木下 裕二", order_index: 1 },
      { credit_role: "hair",         person: "高橋 彩",   order_index: 1 },
      { credit_role: "model",        person: "田中 葵",   order_index: 1 },
      { credit_role: "model",        person: "伊藤 七海", order_index: 2 },
    ],
  },
  {
    id: "w9", title: "AW25 LOOK BOOK",
    type: "look_book", brand_id: "b6", brand: "STUDIO NICHOLSON", season: "2025AW", year: 2025,
    tags: ["エシカル", "ミニマル", "ロンドン"],
    is_published: true, featured: false, color: "#101A10", accent: "#608060",
    credits: [
      { credit_role: "photographer", person: "山田 拓海", order_index: 1 },
      { credit_role: "stylist",      person: "小林 美穂", order_index: 1 },
      { credit_role: "hair_makeup",  person: "武田 恵",   order_index: 1 },
      { credit_role: "model",        person: "松本 愛",   order_index: 1 },
    ],
  },
  {
    id: "w10", title: "DIGITAL FASHION FILM",
    type: "video", brand_id: "b4", brand: "ISSEY MIYAKE", season: "2025AW", year: 2025,
    tags: ["コレクションフィルム", "デジタル", "映像"],
    is_published: true, featured: false, color: "#08080F", accent: "#506888",
    credits: [
      { credit_role: "director",     person: "木村 慎",   order_index: 1 },
      { credit_role: "videographer", person: "伊藤 隆",   order_index: 1 },
      { credit_role: "stylist",      person: "渡辺 幸子", order_index: 1 },
      { credit_role: "hair_makeup",  person: "石川 智子", order_index: 1 },
      { credit_role: "model",        person: "田中 葵",   order_index: 1 },
      { credit_role: "editor",       person: "タケウチ 映像編集", order_index: 1 },
    ],
  },
  {
    id: "w11", title: "スタイリスト特集：渡辺 幸子",
    type: "special_page", brand_id: null, brand: null, season: "2025", year: 2025,
    tags: ["特集", "インタビュー", "スタイリスト"],
    is_published: true, featured: false, color: "#180E04", accent: "#907040",
    credits: [
      { credit_role: "photographer", person: "中村 浩一", order_index: 1 },
      { credit_role: "stylist",      person: "渡辺 幸子", order_index: 1 },
    ],
  },
  {
    id: "w12", title: "POP-UP EVENT VISUAL",
    type: "event", brand_id: "b9", brand: "YANUK", season: "2026SS", year: 2026,
    tags: ["ポップアップ", "イベント", "デニム"],
    is_published: true, featured: false, color: "#101020", accent: "#485880",
    credits: [
      { credit_role: "photographer",  person: "坂本 健",     order_index: 1 },
      { credit_role: "stylist",       person: "長谷川 亜紀", order_index: 1 },
      { credit_role: "hair_makeup",   person: "武田 恵",     order_index: 1 },
      { credit_role: "model",         person: "青木 優里",   order_index: 1 },
      { credit_role: "set_designer",  person: "山下スタジオ", order_index: 1 },
      { credit_role: "producer",      person: "川田 裕子",   order_index: 1 },
    ],
  },

  // ── Jumpei Okazaki works ──
  {
    id: "wj1", title: "2021AW LOOK BOOK",
    type: "look_book", brand_id: null, brand: "CLANE HOMME", season: "2021AW", year: 2021,
    tags: ["メンズ", "スタジオ", "モノトーン"],
    is_published: true, featured: false, color: "#1A1A18", accent: "#888878",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2021/06/j1-4-249x300.jpg",
    credits: [
      { credit_role: "photographer",  person: "中村 浩一",  order_index: 1 },
      { credit_role: "stylist",       person: "渡辺 幸子",  order_index: 1 },
      { credit_role: "hair_makeup",   person: "石川 智子",  order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
    ],
  },
  {
    id: "wj2", title: "OUTDOOR COLLECTION",
    type: "editorial", brand_id: null, brand: "UNITED ARROWS", season: "2021SS", year: 2021,
    tags: ["アウトドア", "カジュアル", "屋外"],
    is_published: true, featured: false, color: "#182010", accent: "#708060",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2021/06/o1-1-249x300.jpg",
    credits: [
      { credit_role: "photographer",  person: "坂本 健",    order_index: 1 },
      { credit_role: "stylist",       person: "小林 美穂",  order_index: 1 },
      { credit_role: "hair_makeup",   person: "高橋 彩",    order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
    ],
  },
  {
    id: "wj3", title: "MEN'S FUDGE — FEATURE",
    type: "editorial", brand_id: null, brand: "Men's FUDGE", season: "2021 No.112", year: 2021,
    tags: ["エディトリアル", "雑誌", "メンズ"],
    is_published: true, featured: false, color: "#201830", accent: "#887898",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2021/06/j3-2-249x300.jpg",
    credits: [
      { credit_role: "photographer",  person: "山田 拓海",  order_index: 1 },
      { credit_role: "stylist",       person: "渡辺 幸子",  order_index: 1 },
      { credit_role: "hair_makeup",   person: "石川 智子",  order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
      { credit_role: "art_director",  person: "渡辺 幸子",  order_index: 1 },
    ],
  },
  {
    id: "wj4", title: "SS21 CAMPAIGN",
    type: "campaign", brand_id: null, brand: "SHIPS", season: "2021SS", year: 2021,
    tags: ["キャンペーン", "広告", "ライフスタイル"],
    is_published: true, featured: false, color: "#101820", accent: "#506878",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2021/06/j6-1-249x300.jpg",
    credits: [
      { credit_role: "photographer",  person: "伊藤 隆",    order_index: 1 },
      { credit_role: "stylist",       person: "小林 美穂",  order_index: 1 },
      { credit_role: "hair_makeup",   person: "高橋 彩",    order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
      { credit_role: "producer",      person: "川田 裕子",  order_index: 1 },
    ],
  },
  {
    id: "wj5", title: "BRAND VISUAL",
    type: "campaign", brand_id: null, brand: "MIOKO", season: "2021SS", year: 2021,
    tags: ["ブランドビジュアル", "コンテンポラリー"],
    is_published: true, featured: false, color: "#201010", accent: "#987060",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2021/06/MIOKO-249x300.jpg",
    credits: [
      { credit_role: "photographer",  person: "中村 浩一",  order_index: 1 },
      { credit_role: "stylist",       person: "渡辺 幸子",  order_index: 1 },
      { credit_role: "hair_makeup",   person: "石川 智子",  order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
      { credit_role: "creative_director", person: "阿部 千登勢", order_index: 1 },
    ],
  },
  {
    id: "wj6", title: "AGENCY BOOK 2025",
    type: "look_book", brand_id: null, brand: "NUMBER EIGHT MODELS", season: "2025", year: 2025,
    tags: ["エージェンシーブック", "ポートレート"],
    is_published: true, featured: false, color: "#141820", accent: "#607090",
    image_url: "https://numbereight-models.jp/wp-content/uploads/2025/03/%E5%B2%A1%E5%B4%8E%E9%A0%86%E5%B9%B3%E3%80%90NUMBER-EIGHT%E3%80%91F-1024x724.jpg",
    credits: [
      { credit_role: "photographer",  person: "木下 裕二",  order_index: 1 },
      { credit_role: "model",         person: "岡﨑 順平",  order_index: 1 },
    ],
  },
];

// ── Shared helpers ──

function groupCredits(credits) {
  const order = ["photographer","art_director","creative_director","stylist",
    "hair_makeup","hair","makeup","model","director","videographer",
    "editor","set_designer","retoucher","producer","casting","other"];
  const grouped = {};
  credits.forEach(c => {
    if (!grouped[c.credit_role]) grouped[c.credit_role] = [];
    grouped[c.credit_role].push(c.person);
  });
  return order.filter(r => grouped[r]).map(r => ({ role: r, people: grouped[r] }));
}

function getWorkColor(type) {
  const map = {
    look_book:    "var(--type-look)",
    campaign:     "var(--type-campaign)",
    editorial:    "var(--type-editorial)",
    video:        "var(--type-video)",
    special_page: "var(--type-special)",
    event:        "var(--type-event)",
  };
  return map[type] || "var(--text-muted)";
}

function buildCreditNameHTML(name, linkPrefix) {
  const match = people.find(p => p.name === name);
  if (match) {
    return `<a class="credit-name credit-link" href="${linkPrefix}person.html?id=${match.id}">${name}</a>`;
  }
  return `<span class="credit-name">${name}</span>`;
}

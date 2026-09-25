// Core logic for Summoners War Manager

// 1. プリセットデータ定義（初期モンスターデータ約12体）
const PRESET_MONSTERS = [
  {
    id: "preset-water-panda",
    name: "水パンダ (モアイ)",
    attribute: "水",
    stars: 5,
    role: "耐久アタッカー / デバッファー / PVP",
    recommendedRunes: "暴走 + 意志 (速度/体力/体力)",
    guildMemo: "スキル3の相打ち狙い（自身の体力を70%消費して敵に同等ダメージ）が極めて強力。\n【攻め編成例】\n・水パンダ、風ハープ(トリアーナ)、火アーク(ヴェラジュエル)\nトリアーナのパッシブで水パンダの自傷死を防ぐシナジーが優秀。",
    cairosMemo: "カイロス適性は低め。主にアリーナ・占領戦で運用。",
    generalMemo: "ステータスは体力を最優先。サブステータスで速度と効果抵抗を盛る。スキル2の全体スタン＆剥がしも強力。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-harp",
    name: "風ハープ (トリアーナ)",
    attribute: "風",
    stars: 4,
    role: "サポーター / 免役 / 蘇生支援 / PVP",
    recommendedRunes: "暴走 + 意志 (速度/体力/防御)",
    guildMemo: "パッシブ「救済の響き」で、味方が即死するダメージを受けた時にそのダメージを無効化しターンを獲得する。\n水パンダや風パンダと組み合わせる防衛・攻め双方が強力。",
    cairosMemo: "死のダンジョンなどで事故防止用として使うこともあるが、基本はPVP用。",
    generalMemo: "トリアーナが先に動いてシールドや回復を貼れるよう、速度調整が重要。暴走ルーンでの割り込みが狙い目。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-fire-vampire",
    name: "火ヴァンパイア (ヴェルデハイル)",
    attribute: "火",
    stars: 4,
    role: "ゲージアッパー / カイロス必須 / PVE",
    recommendedRunes: "迅速 + 刃 または 暴走 + 反撃 (速度/クリ率/体力)",
    guildMemo: "アリーナ・ギルバトの攻め（速度パ）でリーダーとして使うことがある。",
    cairosMemo: "【カイロス周回の神】\nクリティカルヒット時に味方全員の攻撃ゲージを20%（スキル1なら2回で40%）増加させるパッシブを持つ。\n・巨人深淵、ドラゴンダンジョン、死のダンジョン全てでゲージ回しの要。\n※クリティカル率「100%」が絶対条件。",
    generalMemo: "調合で必ず作成すべき最重要モンスターの一体。クリ率100%を最優先で確保し、次に速度と耐久を盛る。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-light-cowgirl",
    name: "光カウガール (ローレン)",
    attribute: "光",
    stars: 3,
    role: "単体剥がし / 速度デバフ / ゲージ下げ / 万能PVE",
    recommendedRunes: "迅速 + 集中 または 暴走 + 反撃 (速度/体力/効果的中)",
    guildMemo: "相手の耐久防衛（水パンなど）を単体で完封できる。持続ダメージや防御弱化、強化剥がしが便利。",
    cairosMemo: "巨人、ドラゴン、タワー攻略で大活躍。\n攻撃するたびに敵のゲージを下げ、防御弱化（縦割り）を付与する。\n【必要ステータス】\n・効果的中: 最低 45% (カイロス用) / 55% (ドラゴンダンジョン用)",
    generalMemo: "秘密のダンジョンで獲得可能。すべての攻撃が多段ヒットで、パッシブによる防御弱化とゲージダウンが凶悪。初心者から上級者まで必須。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-dark-ifrit",
    name: "闇イフリート (ヴェラモス)",
    attribute: "闇",
    stars: 5,
    role: "弱化解除 / アタッカー / カイロス / タワー",
    recommendedRunes: "暴走 + 元気 または 迅速 + 集中 (速度/体力/体力)",
    guildMemo: "持続ダメージやスタンを多用してくる防衛に対するカウンターとして有効。",
    cairosMemo: "【巨人ダンジョン安定化の要】\n自身のターンが回ってくるたびに、味方全員の弱化効果（デバフ）を1つ解除し、体力を回復する。\n巨人ダンジョンでボスが付与してくる「防御弱化」を即座に解除して事故を防ぐ。",
    generalMemo: "調合で入手可能。スキル2の全体スタン＆持続ダメージも優秀。PVE攻略における大黒柱。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-panda",
    name: "風パンダ (風燕)",
    attribute: "風",
    stars: 5,
    role: "耐久アタッカー / 反撃 / PVP破壊王",
    recommendedRunes: "暴走 + 意志 または 暴走 + 守護 (速度/防御/防御)",
    guildMemo: "防御力比例アタッカー。パッシブで攻撃を受けるとゲージが上がり、通常攻撃に防御力比例の追加ダメージが乗る。\n【攻め編成例】\n・風パンダ、火アーク、水防衛対策キャラ。ソロ性能も非常に高い。",
    cairosMemo: "カイロスには不向き。完全なPVP（占領戦、アリーナ、RTA）向け。",
    generalMemo: "防御力をとにかく高く盛る（+1500以上目標）。クリダメ型にしなくてもパッシブの固定ダメージで十分火力を出せる。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-homunculus",
    name: "水ホムンクルス (氷結・持続型)",
    attribute: "水",
    stars: 5,
    role: "全体持続アタッカー / タワー攻略 / 異界",
    recommendedRunes: "絶望 + 集中 (速度/クリダメ/攻撃力 または 速度/体力/的中)",
    guildMemo: "全体攻撃が多く絶望ルーンでの拘束力が高いが、基本はPVE（タワー、次元の裂け目）用。",
    cairosMemo: "試練のタワー（ノーマル/ハード）で無類の強さを誇る。\n全スキルを全体攻撃にスキル進化させ、持続ダメージとゲージダウンをばら撒く構成が強力。",
    generalMemo: "錬成製作で作成し、異界ダンジョンの素材を使ってスキルを進化させる。絶望ルーンと組み合わせることでタワーをほぼ完封できる。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-light-paladin",
    name: "光パラディン (ジャンヌ)",
    attribute: "光",
    stars: 5,
    role: "全体挑発 / 無敵サポーター / タワー / PVP",
    recommendedRunes: "暴走 + 反撃 または 反撃+反撃+意志 (速度/体力/体力)",
    guildMemo: "スキル3の2ターン全体挑発が非常に強力。味方1体に無敵＆弱化解除を貼るスキル2で味方を守る。",
    cairosMemo: "タワー攻略でボス階の取り巻きを無力化するのに適している。",
    generalMemo: "調合で入手可能。スキル1で挑発状態の敵を攻撃すると自身や味方を回復するため、反撃ルーンとの相性が極めて良い。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-fire-inugami",
    name: "二次覚醒火インガミ (ラオーク)",
    attribute: "火",
    stars: 3,
    role: "高速周回アタッカー / 協力攻撃 / 死ダン / 次元",
    recommendedRunes: "暴走 + 刃 または 猛攻 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "パッシブによる「敵撃破時の即時ターン獲得」と「通常攻撃の確率連続ヒット」で、時に理不尽な暴走火力を出すロマン砲。",
    cairosMemo: "【高速周回のキー】\nスキル2「協力攻撃」で味方2〜3体と一斉に攻撃し、味方のスキル再使用時間を短縮する。\n死のダンジョンや次元ホール（カルザンなど）の高速化で複数体並べて運用される。",
    generalMemo: "二次覚醒が必須。攻撃・クリ率・クリダメを極限まで高めて、一撃で雑魚敵を倒せるように調整する。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-pixie",
    name: "二次覚醒風ピクシー (シェノン)",
    attribute: "風",
    stars: 2,
    role: "バッファー / 速度デバフ / 初心者巨人向け",
    recommendedRunes: "絶望 + 元気 (速度/体力/体力)",
    guildMemo: "PVP適性は低め。",
    cairosMemo: "【初心者向け巨人10階安定サポーター】\n3ターンの間、味方全体の攻撃力と防御力を大幅に上げるバフを持つ。ボスに速度低下やミス誘発のデバフを付与し、受ける被ダメージを最小限に抑える。",
    generalMemo: "星2なので入手が容易。二次覚醒することでステータスが星4並に強化され、後半のコンテンツでも耐久不足になりにくくなる。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-garuda",
    name: "水ガルーダ (コナミヤ)",
    attribute: "水",
    stars: 2,
    role: "リモーション / 全体回復 / デバフ解除",
    recommendedRunes: "暴走 + 意志 または 迅速 (速度/体力/体力)",
    guildMemo: "スキル2「リモーション」で、味方アタッカー（例：ルシェン、コッパーなど）に即時ターンを渡して大ダメージを出させるギミック攻めで活躍。",
    cairosMemo: "ドラゴンダンジョン等で、持続ダメージの解除＆ヒール役として活躍できる。",
    generalMemo: "スキル2は対象の攻撃力を1ターン上げる効果もあるため、鈍足超火力アタッカーと組ませるのが定石。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-polar-queen",
    name: "風極地女王 (ティアナ)",
    attribute: "風",
    stars: 5,
    role: "絶対剥がし / ゲージアップ / PVPの神",
    recommendedRunes: "迅速 + 意志 (最速調整)",
    guildMemo: "【攻め性能SSS】\nスキル3「吹き荒れる風」は、敵味方全体のすべての強化・弱化効果を解除し、味方の攻撃ゲージを30%増加させる。\n※この剥がしは「抵抗されない」ため、意志ルーンや免疫防衛を100%崩すことができる。",
    cairosMemo: "カイロスでは不要。ギルバト・アリーナ攻めの核。",
    generalMemo: "速度を極限まで盛る。味方のアタッカー（ルシェンや全体アタッカーなど）がティアナの直後に割り込まれずに動けるように速度調整（速度同調）することが最も重要。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-himmel",
    name: "ヒンメル (葬送のフリーレンコラボ)",
    attribute: "水",
    stars: 5,
    role: "ボス特効アタッカー / 被ダメ軽減 / カイロス人権",
    recommendedRunes: "激怒 + 刃 または 猛攻 + 刃 (速度/クリダメ/攻撃 または 攻撃/クリダメ/攻撃)",
    guildMemo: "味方全体の被ダメ20%カットパッシブとスキル2の全体防御バフにより、耐久攻めパーティの軸になれる。",
    cairosMemo: "【巨人・ドラゴン深淵Hardの超新星】\nパッシブ「勇者ヒンメル」により、ボス戦で自身の与ダメが常時100%増加（実質2倍！）。\nさらに自分以外の味方の被ダメを20%軽減するため、巨人深淵の7回反撃事故を強力に防止する。\n道中をジュリーやテシャールで処理し、ボスをヒンメルで叩き割る高速パで大活躍。",
    generalMemo: "コラボイベントで全プレイヤーにスキルマ・星6Lv40で配布された超優秀モンスター。クリ率・クリダメ・攻撃力をしっかり盛ることで、カイロスボスの体力を一撃で消し飛ばす。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-ifrit",
    name: "風イフリート (アカムアミール)",
    attribute: "風",
    stars: 5,
    role: "弱化比例超火力アタッカー / 全体スタン / 巨人深淵特効",
    recommendedRunes: "激怒 + 刃 または 猛攻 + 刃 (攻撃/クリダメ/攻撃 または 速度/クリダメ/攻撃)",
    guildMemo: "全体攻撃2種（スタン＋弱化比例）持ち。ガレオン等の全体盾割りと合わせてアリーナ・占領戦の速攻攻めで活躍。",
    cairosMemo: "【巨人深淵Hardの救世主・低ルーン高安定の核】\n巨人は水属性のため完全な有利属性（クリ率+15%ボーナス・被ダメ大幅減・強打判定）。\nスキル3「マッハクラッシュ」は敵にかかっている弱化効果1つにつきダメージが約30%〜40%跳ね上がり、フリルレアの単体縦割りや持続が入ったボスに十数万ダメージを叩き出す。\nジュリーの「HP満タン維持」のような厳しい条件がなく、純正星5の高耐久のためボスの反撃で即死しない。",
    generalMemo: "ギルドショップの召喚ピースで誰でも入手可能。クリ率は有利ボーナス込みで「85%」あれば100%クリティカル確定。ジュリーのルーン敷居に苦戦している場合の最良の乗り換え先。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-fire-shaina",
    name: "火チャクラム舞姫 (シャイナ)",
    attribute: "火",
    stars: 4,
    role: "ダンジョン攻撃力33%リーダー / 防御弱化 / スタン / ブメチャク連携",
    recommendedRunes: "闘志 + 闘志 + 闘志 または 激怒 + 刃 / 暴走 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "ブーメラン（サブリナやマルナ等）と組ませることで開幕から防御弱化とスタンをばら撒く。占領戦の星4拠点攻めで強力。",
    cairosMemo: "【審判・ドラゴン・死ダンの高速化リーダー】\nリーダースキルでダンジョン限定の味方攻撃力が33%上昇。\nパッシブでブーメラン戦士と共に攻撃し、敵全体に防御弱化を付与する。審判のダンジョンでは強力な攻撃力33%リーダーと防御弱化で味方全体の火力を極限まで引き上げる。",
    generalMemo: "ブーメラン戦士と必ずセットで編成する。ダンジョン攻撃力33%UPリーダーが非常に強力。ジークのクリバフ編成ではクリ率70%でOK。闘志ルーンを積むことで全体の攻撃力をさらに底上げできる。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-julie",
    name: "水ピエレット (ジュリー)",
    attribute: "水",
    stars: 4,
    role: "道中WAVE一掃 / 全体多段アタッカー / カイロス速攻",
    recommendedRunes: "激怒 + 刃 または 猛攻 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "アリーナ攻めでバステトやルシェンと組み合わせた速攻パの露払い役。",
    cairosMemo: "【巨人深淵・審判のダンジョンの道中殲滅神】\n自身の体力が100%（MAX）の時、スキル3「シャッフル」が最大6連撃の全体攻撃に強化され、道中の雑魚敵・クリスタルを一撃で粉砕する。\n審判ダンジョンでは最速ジークの攻撃＆クリ率バフを受けることで、クリ率70%で確定クリティカルとなり、WAVE1・3を瞬殺できる。",
    generalMemo: "体力が1でも削れるとスキル3のヒット数が落ちるため、道中で敵に動かれる前に最速クラスで動かすこと。アーティファクトで「体力満タン時クリダメ」「スキル3クリダメ」「水属性への与ダメ」を厳選するとワンパンが非常に安定する。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-sabrina",
    name: "水ブーメラン戦士 (サブリナ)",
    attribute: "水",
    stars: 4,
    role: "協力攻撃 / 与ダメUP＆被ダメ軽減パッシブ / 防御弱化",
    recommendedRunes: "闘志 + 闘志 + 闘志 または 激怒 + 刃 / 暴走 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "タリアやシャイナと組んで単体ターゲットを即座に溶かす速攻アタッカー。",
    cairosMemo: "【双子高速周回の心臓部】\nパッシブ「卓越した指揮」により、味方のチャクラム舞姫が攻撃する際に必ず同時攻撃を行う。\nさらに強化効果のない相手への与ダメージが増加し、受けるダメージを減少させる。シャイナ・タリアと組み合わせることでボスのHPを一瞬で消し飛ばす。",
    generalMemo: "チャクラム舞姫の行動に合わせて追撃するため、手数と火力が実質2倍になる。審判ダンジョンでは闘志ルーンを3セット積んで味方の火力を大幅に引き上げる役割も担える。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-water-talia",
    name: "水チャクラム舞姫 (タリア)",
    attribute: "水",
    stars: 4,
    role: "単体超特大フィニッシャー / ボス瞬殺 / カイロス特効",
    recommendedRunes: "激怒 + 刃 または 猛攻 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "スキル2の自己バフからのスキル3で相手の耐久モンスを一撃で落とす単体アタッカー。",
    cairosMemo: "【カイロスボスキラー・最高峰の瞬間単体火力】\nスキル3「回転切り」は対象の体力が半分以下の時にダメージが大幅に跳ね上がる。\nサブリナとの協力攻撃で防御弱化が入ったボスに叩き込むことで、審判ボスの残HPを一撃で消し去るフィニッシャー。ジークのクリバフ込みでクリ率70%確保推奨。",
    generalMemo: "激怒ルーンでクリダメと攻撃力を限界まで伸ばす。行動順はサブリナやシャイナの後に設定し、防御弱化が入った状態のボスにスキル3を当てるのが鉄則。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-fire-sieq",
    name: "火ケルベロス (ジーク)",
    attribute: "火",
    stars: 2,
    role: "最速バッファー (攻撃50%UP+クリ率30%UP) / 闘志枠 / 速攻支援",
    recommendedRunes: "闘志 + 闘志 + 闘志 または 迅速 + 闘志 (速度/クリダメ/攻撃 または 速度/体力/攻撃)",
    guildMemo: "アリーナ・占領戦でルシェンやカタリーナの開幕バッファーとして運用される。",
    cairosMemo: "【審判・精霊深淵の最速テンプレバッファー】\nスキル3「遠吠え」で3ターンの間、味方全体の攻撃力を50%UP＆クリティカル率を30%UPする。\nこのスキルのおかげで、パーティ全員のクリ率目標を「70%」まで引き下げることができ、アタッカーのルーン敷居を劇的に緩和する。自身も闘志ルーンを3セット積むことで全体攻撃力+24%に貢献。",
    generalMemo: "星2で育成が非常に容易。スキルマも簡単。審判周回では味方最速で動かす速度調整（+110〜+130以上推奨）が必須条件。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-fire-bale",
    name: "火雷帝 (バーレイグ)",
    attribute: "火",
    stars: 5,
    role: "知識超特大アタッカー / レイド・異界・迷宮ボス特効",
    recommendedRunes: "激怒 + 意志 または 猛攻 + 刃 (攻撃/クリダメ/攻撃 または 速度/クリダメ/攻撃)",
    guildMemo: "ギルバト攻撃力44%UPリーダー。味方のバフ（攻撃・防御・免疫）で知識が即5溜まり、知識5「雷神降臨」で敵を壊滅させる。",
    cairosMemo: "異界レイド（バレカタ・バレバレ）やタルタロスの迷宮ボス戦の単体瞬間火力として大活躍。",
    generalMemo: "調合で入手可能。知識が5個溜まるごとに大技を撃てるため、バフを多用するサポーター（ライリー、タラニス等）と極めて相性が良い。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-taranis",
    name: "風ドルイド (タラニス)",
    attribute: "風",
    stars: 5,
    role: "蘇生サポーター / 全体防御バフ / 自動復活パッシブ / ギルバト・迷宮",
    recommendedRunes: "暴走 + 意志 または 守護 + 守護 + 意志 (速度/防御/防御)",
    guildMemo: "ギルバト防御力44%UPリーダー。スキル3で倒れた味方を蘇生し、生存している味方全員に2ターン防御バフを付与。自身もドルイドの魂で倒れた時に即座に自動復活する不沈艦。",
    cairosMemo: "タルタロス迷宮全般で事故防止役として無類の強さを誇る。全体防御バフで即死事故を防ぐ。",
    generalMemo: "防御力を極限まで盛る。挑発や自己回復も持っているため、PVP・PVEともに安定攻略の最高峰。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-riley",
    name: "風トーテム術士 (ライリー)",
    attribute: "風",
    stars: 5,
    role: "万能サポーター / 毎ターン免疫 / 全体回復 / 攻撃バフ",
    recommendedRunes: "暴走 + 意志 または 迅速 + 元気 (速度/体力/体力)",
    guildMemo: "ギルバト・占領戦で最強クラスの耐久サポート。トーテムが溜まると全体回復＋弱化解除＋攻撃バフ＋免疫を連発する。",
    cairosMemo: "タルタロスの迷宮（レオス・タルタロス本体）でデバフ完全遮断の要。毎ターン免疫を維持できる。",
    generalMemo: "調合で入手可能。スキルマ必須。速度と体力をしっかり確保することでパーティ全体の生存率が劇的に跳ね上がる。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-light-darion",
    name: "二次覚醒光放浪騎士 (ダリオン)",
    attribute: "光",
    stars: 3,
    role: "常時被ダメ20%カットパッシブ / 確定盾割り / 攻撃力弱化 / 迷宮・レイド",
    recommendedRunes: "元気 + 元気 + 反撃 または 守護 + 元気 + 反撃 (体力/体力/防御)",
    guildMemo: "パッシブ「騎士の道」で自身以外の味方全員が受けるダメージを常に20%カットする。反撃ルーンで盾割りをばら撒く。",
    cairosMemo: "【タルタロスの迷宮・コト＆タルタロスの特効役】味方の被ダメを常時20%カットし、ヒンメルと重複して被ダメ最大40%減！スキル1で防御弱化、スキル2でコトを無力化する攻撃力弱化（剣折り）を付与。",
    generalMemo: "二次覚醒でステータスが星5並に上昇。反撃ルーンを積むことで相手の行動時に盾割り・剣折りをばら撒ける。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-barbarian",
    name: "風バーバリアンキング (フレスベルグ)",
    attribute: "風",
    stars: 4,
    role: "全体速度バフ＋攻撃バフ / 持続回復 / 単体烙印 / 異界・迷宮",
    recommendedRunes: "迅速 + 刃 または 暴走 + 刃 (速度/クリダメ/攻撃 または 攻撃/クリダメ/攻撃)",
    guildMemo: "ギルバト攻撃33%UPリーダー。スキル3で味方全体の攻撃力と攻撃速度を上げ、持続回復を付与する万能加速バッファー。",
    cairosMemo: "水の異界魔獣やタルタロスの迷宮（レオス・水）で大活躍。速度バフと持続回復で味方の手数を劇的に増やし、ライリーのトーテム回転を加速させる。",
    generalMemo: "スキル3使用後の待機中に自身の攻撃速度と毎ターン回復が強化されるため耐久も高い。スキル2で烙印を付与して味方の与ダメを25%底上げできる。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-wind-stark",
    name: "シュタルク (葬送のフリーレンコラボ)",
    attribute: "風",
    stars: 4,
    role: "風属性単体高火力アタッカー / スキル強化 / 迷宮レオス削り",
    recommendedRunes: "激怒 + 刃 または 猛攻 + 刃 (攻撃/クリダメ/攻撃)",
    guildMemo: "自身の攻撃力を高めて重い単体打点を叩き込む戦士。風属性のアタッカー枠として活用可能。",
    cairosMemo: "タルタロスの迷宮（レオス・水）において有利属性アタッカーとして活躍。フレスベルグの攻撃バフやローレンの盾割りと合わせて左右のルーンを一撃で破壊する。",
    generalMemo: "フリーレンコラボ限定モンスター。クリ率を85%以上（水属性相手なら有利+15%で100%クリティカル）確保し、クリダメと攻撃力を伸ばすことでボスのHPを一気に削れる。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  }
];

// 1-2. カイロス周回パーティ初期プリセットデータ（6大ダンジョン）
const PRESET_PARTIES = [
  {
    id: "preset-party-giants-abyss-himmel",
    name: "巨人深淵Hard 高速ヒンメル＆ジュリー軸 (リン・風ホム不要)",
    dungeon: "巨人ダンジョン (深淵Hard)",
    dungeonCategory: "巨人",
    averageTime: "約32秒 (ルーン発展途上時は約50秒)",
    successRate: "99%",
    members: [
      { name: "ルシェン", attribute: "風", role: "ダンジョン攻撃力33%UP (L)・切断で道中殲滅", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "フリルレア", attribute: "風", role: "最速単体盾割り (ボス開幕確定縦割り・的中45%+必須)", runes: "闘志+闘志+意志 または 迅速 (速度+110以上)", isLeader: false },
      { name: "ジュリー", attribute: "水", role: "道中wave一掃 (開幕100%全体撃破)", runes: "激怒+刃 または 猛攻+刃 (攻/クリダメ/攻)", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リモーション (ヒンメルへ即ターン渡し)", runes: "迅速+闘志 (速度微調整)", isLeader: false },
      { name: "ヒンメル", attribute: "水", role: "ボス特攻2倍火力・味方被ダメ20%軽減 (核)", runes: "激怒+刃 (速度/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フリルレア ➔ ジュリー ➔ ヒンメル ➔ コナミヤ ➔ ルシェン (または コナミヤ ➔ ヒンメル)",
    speedTuningMemo: "フリルレア最速（速度+110以上・効果的中45〜54%確保）。※フリルレアは全スキルで単体防御弱化を付与可能（全体盾割りではありません）。ジュリーはフリルレア直後（体力100%維持）。\n【重要！リモーション誤爆防止テクニック】コナミヤは「一番ゲージが低い味方」にリモーションを撃ちます。ジュリー直後に動かすとジュリーに飛ぶ事故があるため、ヒンメルをコナミヤの直前に動かす（フリルレア➔ジュリー➔ヒンメル➔コナミヤ）調整にすると、ヒンメル行動後即リモーションでヒンメルが連続行動し、ボスを一瞬で削れます。",
    requirementsMemo: "【ヒンメルのパッシブが超強力】ルシェンのダンジョン攻撃33%UPリーダーで全体火力を底上げ。ボス戦でヒンメルの与ダメが+100%（2倍）＆味方被ダメ20%軽減！\n\n【⚠️ルーンが弱い段階での改善・事故防止チェックリスト】\n① ジュリーの火力不足（道中ワンパン不可）：フリルレアは単体攻撃のため、道中の雑魚には盾割りが入りません！ジュリーが自力でワンパンできるよう、アーティファクトの「水属性への与ダメUP」「スキル3クリダメUP」「体力満タン時クリダメUP」「追加ダメージ（攻撃力比例等）」を厳選して火力を底上げしてください。\n② 闘志ルーンの活用：フリルレアやコナミヤに「闘志ルーン」を2〜4セット装備させると、味方全体の攻撃力が+16%〜+32%底上げされ、ジュリーのワンパン敷居が大幅に下がります。\n③ ボスの反撃全滅対策：フリルレアは単体盾割り役であり攻撃力弱化は持っていません。ボスの攻撃力を下げられないため、ボスの反撃で倒されないよう、フリルレアの効果的中を「45%〜54%」確保してボスを素早く削り切ること、およびアタッカーやコナミヤにアーティファクトで「水属性からの被ダメ減少」を積んで耐久を補強することが極めて重要です。\n④ クリ率の確保：巨人は水属性のため、水属性のヒンメルやジュリーには属性ボーナスがありません。クリ率は85%〜100%を目指してください。",
    targetMemo: "ボス直撃ターゲット指定でOK。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-giants-abyss-amir-himmel",
    name: "巨人深淵Hard アカムアミール＆ヒンメル軸 (ジュリー不要・低ルーン安定1分切り)",
    dungeon: "巨人ダンジョン (深淵Hard)",
    dungeonCategory: "巨人",
    averageTime: "約42秒",
    successRate: "99%",
    members: [
      { name: "ルシェン", attribute: "風", role: "ダンジョン攻撃力33%UP (L)・切断で道中殲滅", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "フリルレア", attribute: "風", role: "最速単体盾割り (ボス開幕確定縦割り・的中45%+)", runes: "闘志+闘志+意志 または 迅速 (速度+100以上)", isLeader: false },
      { name: "アカムアミール", attribute: "風", role: "道中一掃＆ボス弱化比例大砲 (有利属性・高耐久)", runes: "激怒+刃 または 猛攻+刃 (攻/クリダメ/攻)", isLeader: false },
      { name: "ヒンメル", attribute: "水", role: "ボス特攻2倍火力・味方被ダメ20%軽減 (核)", runes: "激怒+刃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リモーション (ヒンメルまたはアミールへ即ターン渡し)", runes: "迅速+闘志 (速度微調整)", isLeader: false }
    ],
    turnOrder: "フリルレア ➔ ルシェン ➔ アカムアミール ➔ ヒンメル ➔ コナミヤ (または コナミヤ ➔ ヒンメル)",
    speedTuningMemo: "フリルレア最速でボスに確実に単体盾割りを付与。ルシェンとアミールが動いて道中雑魚を一撃粉砕（ジュリーと違って体力100%縛りがないため安定）。ボス戦ではフリルレアの縦割りの上にアミールの弱化比例超火力＋ヒンメルのボス特攻が炸裂。",
    requirementsMemo: "【ジュリーのルーン敷居が高い場合の最適解！】\n風イフリート（アカムアミール）は巨人と有利属性のため、クリ率+15%ボーナス（クリ率85%で100%確定）と被ダメ軽減が働き、ルーンが発展途上でもボスの反撃で倒されません。\nスキル3「マッハクラッシュ」は弱化効果の数に応じてダメージが激増（フリルレアの縦割りが入っていれば特大ダメージ）。ジュリーのような「HP満タン維持」のプレッシャーが一切なく、道中に盾割りがなくてもルシェンとアミールで突破できるため、40〜48秒台で超安定して1分切りが可能です。",
    targetMemo: "ボス直撃ターゲット指定でOK。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-giants-abyss-lushen-shaman",
    name: "巨人深淵Hard ルシェン＆シャーマン軸 (F2P・リン/風ホム不要)",
    dungeon: "巨人ダンジョン (深淵Hard)",
    dungeonCategory: "巨人",
    averageTime: "約42秒",
    successRate: "98%",
    members: [
      { name: "アカムアミール", attribute: "風", role: "全体速度リーダー・弱化比例火力 (L)", runes: "激怒+刃 または 猛攻+刃 (攻/クリダメ/攻)", isLeader: true },
      { name: "フリルレア", attribute: "風", role: "最速単体盾割り (ボス開幕確定縦割り)", runes: "迅速+集中 または 闘志", isLeader: false },
      { name: "ルシェン", attribute: "風", role: "切断の魔法で道中wave一掃", runes: "激怒+刃 (攻/クリダメ/攻)", isLeader: false },
      { name: "シャーマン", attribute: "光", role: "スキル2特攻・最大体力比例ダメ (リン代用)", runes: "激怒+刃 (クリダメ型)", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リモーション・デバフ解除", runes: "迅速+元気 (速度調整)", isLeader: false }
    ],
    turnOrder: "フリルレア ➔ ルシェン ➔ コナミヤ ➔ シャーマン ➔ アカムアミール",
    speedTuningMemo: "フリルレア最速でボスに単体盾割り。ルシェンが道中を一掃し、ボス戦ではコナミヤがシャーマンにリモーションをかけてスキル2特攻を連発。",
    requirementsMemo: "リンと風ホムの代わりに、調合ルシェンと秘密ダンジョンのシャーマン（二次覚醒）を採用。シャーマンのスキル2は光属性・最大体力比例なので属性関係なく巨人に刺さります。",
    targetMemo: "ボス直撃ターゲット指定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-giants-abyss-speed",
    name: "巨人深淵Hard 高速ジュリー＆リン軸 (テシャール・ルナ不要)",
    dungeon: "巨人ダンジョン (深淵Hard)",
    dungeonCategory: "巨人",
    averageTime: "約38秒",
    successRate: "98%",
    members: [
      { name: "フリルレア", attribute: "風", role: "最速単体盾割り (ボス戦縦割り・LSなし)", runes: "闘志+闘志+意志 (速度+110以上)", isLeader: false },
      { name: "ジュリー", attribute: "水", role: "道中wave一掃 (開幕100%全体撃破)", runes: "激怒+刃 または 猛攻+刃 (攻/クリダメ/攻)", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リモーション (リンへ即ターン渡し)", runes: "迅速+闘志 (速度微調整)", isLeader: false },
      { name: "リン", attribute: "光", role: "ボス特効最大体力比例 (ルナ代用・核)", runes: "激怒+刃 (クリダメ200%+/クリ率85%+)", isLeader: false },
      { name: "風ホムンクルス", attribute: "風", role: "単体高火力・多段デバフ追撃", runes: "激怒+刃 または 猛攻 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フリルレア ➔ ジュリー ➔ コナミヤ ➔ リン ➔ 風ホムンクルス",
    speedTuningMemo: "フリルレア最速（速度+110以上）。ジュリーはフリルレアの直後に動いて道中雑魚を一掃。コナミヤはジュリー/リンの直後に動き、即座にリモーションをリンへ渡してボスにスキル3特効を撃たせる。",
    requirementsMemo: "【テシャール・ルナなし高速構成】※フリルレアをはじめ本編成は全員リーダースキルを持たないため、速度や火力は闘志ルーン（4〜6セット推奨）やルーンのサブOPでしっかり確保します。ジュリーは開幕体力100%を維持してスキル3の最大打点を出す。リンはスキル3が敵最大体力比例のため激怒ルーン推奨。",
    targetMemo: "ボス直撃ターゲット指定でOK。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-giants-abyss-f2p-amir",
    name: "巨人深淵Hard アカムアミール＆リン軸 (調合・完全F2P)",
    dungeon: "巨人ダンジョン (深淵Hard)",
    dungeonCategory: "巨人",
    averageTime: "約48秒",
    successRate: "99%",
    members: [
      { name: "アカムアミール", attribute: "風", role: "全体速度リーダー・弱化比例火力 (L)", runes: "激怒+刃 または 猛攻+刃 (攻/クリダメ/攻)", isLeader: true },
      { name: "フリルレア", attribute: "風", role: "最速単体盾割り (ボス開幕確定縦割り)", runes: "迅速+集中 または 闘志", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リモーション・デバフ解除", runes: "迅速+元気 (速度調整)", isLeader: false },
      { name: "リン", attribute: "光", role: "ボス最大体力比例特効", runes: "激怒+刃 (クリダメ型)", isLeader: false },
      { name: "風ホムンクルス", attribute: "風", role: "単体ボス削り・持続・トドメ", runes: "猛攻+刃 または 激怒", isLeader: false }
    ],
    turnOrder: "フリルレア ➔ アカムアミール ➔ コナミヤ ➔ リン ➔ 風ホムンクルス",
    speedTuningMemo: "フリルレア最速でボスに単体盾割り。アカムアミールが全体攻撃で取り巻きを一掃・ボスを削り、コナミヤがリンにターンを渡してボスに大打撃。",
    requirementsMemo: "ギルドショップ・調合・星3モンスターのみで組める高安定パ。風属性中心のため有利属性ボーナス（クリ率+15%）があり、ルーン厳選の敷居が低めです。",
    targetMemo: "ボス直撃ターゲット指定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-dragons-abyss-speed",
    name: "ドラゴン深淵Hard 高速リアム＆カイル軸",
    dungeon: "ドラゴンダンジョン (深淵Hard)",
    dungeonCategory: "ドラゴン",
    averageTime: "約35秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "リアム", attribute: "水", role: "ボス特効・超火力トドメ", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "カイル", attribute: "水", role: "最大体力比例・ボス削り", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ジュリー", attribute: "水", role: "道中wave一掃 (開幕全体)", runes: "猛攻+刃 (クリダメ型)", isLeader: false },
      { name: "ガレオン", attribute: "水", role: "全体縦割り＆攻撃バフ", runes: "迅速+意志 (的中55%以上)", isLeader: false }
    ],
    turnOrder: "ガレオン ➔ ジュリー ➔ カイル ➔ リアム ➔ ヴェルデハイル",
    speedTuningMemo: "ガレオン最速でバフ＋縦割り。ジュリーが次点でwaveを一掃。ボス戦ではカイルとリアムが動いてボスを一瞬で削り落とす。",
    requirementsMemo: "ヴェルデハイルのクリ率100%は絶対条件。イカルサイクル不可のためボスが行動する前に削り切る火力が求められる。闘志ルーン推奨。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-dragons-abyss-veramos",
    name: "ドラゴン深淵Hard ヴェラモス＆スペクトラ軸 (持続解除・安定F2P)",
    dungeon: "ドラゴンダンジョン (深淵Hard)",
    dungeonCategory: "ドラゴン",
    averageTime: "約50秒",
    successRate: "99%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "ヴェラモス", attribute: "闇", role: "毎ターン味方持続解除＆ボス持続削り", runes: "暴走+果報 または 迅速 (速度/体力/体力)", isLeader: false },
      { name: "スペクトラ", attribute: "火", role: "ボス最大体力特攻＆全体速度デバフ (2A)", runes: "迅速+刃 (速度/クリダメ/体力)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "強化剥がし＆持続縦割り・ゲージ下げ", runes: "迅速+集中 (速度/体力/的中55%+)", isLeader: false },
      { name: "ベラデオン", attribute: "光", role: "全体ゲージ上げ・免疫剥がし・回復 (2A)", runes: "暴走+集中 または 迅速 (速度/体力/防御)", isLeader: false }
    ],
    turnOrder: "ローレン ➔ スペクトラ ➔ ベラデオン ➔ ヴェラモス ➔ ヴェルデハイル",
    speedTuningMemo: "ローレン最速で剥がしと縦割り。スペクトラが速度デバフ＆特攻、ベラデオンが免疫クリスタルのバフ剥がし・ゲージ上げ、ヴェラモスが持続を即時解除してヴェルデハイルが回転させます。",
    requirementsMemo: "イカルサイクル廃止後の定番・最安定編成！調合と秘密ダンジョン（2次覚醒）のみで組める完全無課金（F2P）仕様。ヴェラモスのパッシブでドラゴンの持続ブレス事故を完全に封殺します。",
    targetMemo: "ボス直撃ターゲット設定（または右免疫タワー ➔ ボス）。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-dragons-abyss-liam-tarq",
    name: "ドラゴン深淵Hard 【超高速】リアム＆ターク軸 (20秒台・最速テンプレ)",
    dungeon: "ドラゴンダンジョン (深淵Hard)",
    dungeonCategory: "ドラゴン",
    averageTime: "約26秒",
    successRate: "98%",
    members: [
      { name: "ガレオン", attribute: "水", role: "攻撃リーダー・開幕全体盾割り＆剣バフ (L)", runes: "闘志+闘志+意志 (的中55%+)", isLeader: true },
      { name: "ジュリー", attribute: "水", role: "道中wave1/3を一撃一掃 (最速SHOT)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "コナミヤ", attribute: "水", role: "リアムへ最速リモーション (速度微調整)", runes: "迅速+闘志 または 闘志×3", isLeader: false },
      { name: "リアム", attribute: "水", role: "ボス特効超火力フィニッシャー (核)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ターク", attribute: "水", role: "集団ハントで味方と追撃・ボスターン渡さず瞬殺 (2A)", runes: "闘志+闘志+闘志 (攻撃型)", isLeader: false }
    ],
    turnOrder: "ジュリー ➔ ガレオン ➔ コナミヤ ➔ リアム ➔ ターク",
    speedTuningMemo: "ジュリーが開幕フル体力で道中雑魚を一撃粉砕。ボス戦ではガレオンの盾割りからリアムが削り、コナミヤがリモーションでリアムに即ターンを渡し、タークの集団ハントでボスが動く前に消滅させます。",
    requirementsMemo: "上級者向け最速編成！闘志ルーンを4〜6セット積むことでジュリーの要求ステータスを緩和。ドラゴンに一切行動させずに20秒台でクリア可能です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-dragons-abyss-no-liam-kahli",
    name: "ドラゴン深淵Hard 【リアム不要・星4/星3】カイル＆カーリー防御無視軸",
    dungeon: "ドラゴンダンジョン (深淵Hard)",
    dungeonCategory: "ドラゴン",
    averageTime: "約38秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・全体ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "カイル", attribute: "水", role: "ボス最大体力比例特効削り (核)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "カーリー", attribute: "火", role: "防御無視特大火力＆味方攻撃・速度バフ", runes: "激怒+刃 または 猛攻+刃 (クリダメ型)", isLeader: false },
      { name: "ジュリー", attribute: "水", role: "開幕全体SHOTで道中wave1/3を一掃", runes: "激怒+刃 または 猛攻+刃", isLeader: false },
      { name: "ガレオン", attribute: "水", role: "全体縦割り＆攻撃バフ", runes: "迅速+意志 (的中55%+)", isLeader: false }
    ],
    turnOrder: "ガレオン ➔ ジュリー ➔ カーリー ➔ カイル ➔ ヴェルデハイル",
    speedTuningMemo: "ガレオンが最速でバフと盾割り、ジュリーが道中を一撃粉砕。ボス戦ではカーリーが攻撃速度バフと防御無視攻撃を叩き込み、カイルの最大体力比例で一瞬で倒します。",
    requirementsMemo: "純5リアムを持っていない人向けの代表的高速テンプレ！調合・星3のカーリー（火ハイエレメンタル）の防御無視火力が非常に強力で、リアムなしでも30秒台周回が可能です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-dragons-abyss-no-liam-twins",
    name: "ドラゴン深淵Hard 【リアム不要・双子連撃】ブメチャク＆カイル軸",
    dungeon: "ドラゴンダンジョン (深淵Hard)",
    dungeonCategory: "ドラゴン",
    averageTime: "約42秒",
    successRate: "99%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・全体ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "サブリナ", attribute: "水", role: "水ブーメラン・防御弱化＆被ダメ増デバフ", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "シャイナ", attribute: "火", role: "火チャクラム・ゲージ下げ＆全体縦割り", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "カイル", attribute: "水", role: "ボス特効最大体力比例アタッカー", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "強化剥がし＆持続縦割り・ゲージ下げ", runes: "迅速+集中 (速度/体力/的中55%+)", isLeader: false }
    ],
    turnOrder: "ローレン ➔ サブリナ ➔ シャイナ ➔ カイル ➔ ヴェルデハイル",
    speedTuningMemo: "ローレンが剥がしと盾割り。サブリナとシャイナの協力攻撃で免疫タワーのゲージを削りつつ手数を稼ぎ、カイルの一撃でボスを沈めます。",
    requirementsMemo: "リアム不要！ブーメラン＆チャクラムの同時攻撃により免疫クリスタルが動く前にゲージを制圧できるため、ルーンの敷居が低くオート勝率が極めて高い安定編成です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-necro-abyss-seren",
    name: "死ダン深淵Hard 【最速】セレン＆アビゲイル軸 (最速テンプレ)",
    dungeon: "死のダンジョン (深淵Hard)",
    dungeonCategory: "死のダンジョン",
    averageTime: "約30秒",
    successRate: "99%",
    members: [
      { name: "アビゲイル", attribute: "水", role: "攻撃リーダー・多段8連撃バリア剥がし (L)", runes: "暴走+反撃 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "セレン", attribute: "闇", role: "多段連撃・持続・盾割り・回復阻害 (2A)", runes: "暴走+反撃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "アスター", attribute: "火", role: "多段攻撃・全体＆ボス削り", runes: "吸血+反撃 または 暴走+反撃", isLeader: false },
      { name: "シャーマン", attribute: "光", role: "ボス特効最大体力比例フィニッシャー (核)", runes: "激怒+刃 (クリダメ200%+)", isLeader: false }
    ],
    turnOrder: "アビゲイル ➔ ラオーク ➔ セレン ➔ アスター ➔ シャーマン",
    speedTuningMemo: "フランを抜いて攻撃に特化した最速テンプレ。アビゲイルが初手でシールドを剥がし、ラオークとセレンが盾割りと多段攻撃、最後にシャーマンが動いてボスを一瞬で消し飛ばします。",
    requirementsMemo: "【最速30秒切り狙い】アタッカー陣のクリ率は最低85%以上（100%推奨）。シャーマンは激怒ルーン＋高クリダメ必須。全員に反撃ルーンを積むとバリア破壊がさらに安定します。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-necro-abyss-speed",
    name: "死ダン深淵Hard 高速多段＆シャーマン軸 (安定バランス型)",
    dungeon: "死のダンジョン (深淵Hard)",
    dungeonCategory: "死のダンジョン",
    averageTime: "約40秒",
    successRate: "99%",
    members: [
      { name: "アビゲイル", attribute: "水", role: "攻撃リーダー・多段バリア割り (L)", runes: "暴走+反撃 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "シャーマン", attribute: "光", role: "ボス特効最大体力比例 (核)", runes: "激怒+刃 または 暴走 (クリダメ型)", isLeader: false },
      { name: "アスター", attribute: "火", role: "多段攻撃・道中削り", runes: "吸血+反撃 または 暴走+反撃", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・回復", runes: "暴走+反撃 (速度/体力/体力)", isLeader: false }
    ],
    turnOrder: "フラン ➔ アビゲイル ➔ ラオーク ➔ アスター ➔ シャーマン",
    speedTuningMemo: "【行動順が最重要】①フラン(バフ) → ②アビゲイル(バリア剥がし) → ③ラオーク(連携・縦割り) → ④アスター(バリア破壊完了) → ⑤シャーマン(ボスへ特効大打撃)。全員の戦闘速度169以上目安。",
    requirementsMemo: "ボスのソウルバリアを手数で割ってからシャーマンのスキル2を入れること。ゲージ操作無効のため暴走・反撃ルーンが極めて有効。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-necro-abyss-twins",
    name: "死ダン深淵Hard 【双子連撃型】ブメチャク多段パ",
    dungeon: "死のダンジョン (深淵Hard)",
    dungeonCategory: "死のダンジョン",
    averageTime: "約40秒",
    successRate: "98%",
    members: [
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・安定回復 (L)", runes: "暴走+反撃 (速度/体力/体力)", isLeader: true },
      { name: "サブリナ", attribute: "水", role: "水ブーメラン・防御弱化＆被ダメ増デバフ", runes: "暴走+刃 または 猛攻+刃", isLeader: false },
      { name: "シャイナ", attribute: "火", role: "火チャクラム・全体スタン＆縦割り", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "タリア", attribute: "水", role: "水チャクラム・ボス特効高火力アタッカー", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃でブメチャクを連れて追撃", runes: "暴走+刃", isLeader: false }
    ],
    turnOrder: "フラン ➔ サブリナ ➔ シャイナ ➔ タリア ➔ ラオーク",
    speedTuningMemo: "フラン最速で剣バフ。サブリナとシャイナが協力攻撃でシールドを割りつつ縦割りを入れ、タリアが超火力で削る。",
    requirementsMemo: "ブーメランとチャクラムの同時攻撃特性により、毎ターン手数が倍増してボスのベール破壊がオートで極めて安定します。アビゲイルを持っていない場合にもおすすめ。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-necro-abyss-f2p-colleen",
    name: "死ダン深淵/12階 【完全無課金F2P】カリン＆ルーカシャ安定パ",
    dungeon: "死のダンジョン (深淵Hard)",
    dungeonCategory: "死のダンジョン",
    averageTime: "約52秒",
    successRate: "99%",
    members: [
      { name: "カリン", attribute: "火", role: "攻撃バフ・回復・回復阻害 (L)", runes: "反撃+反撃+元気 (速度/体力/防御)", isLeader: true },
      { name: "ローレン", attribute: "光", role: "多段攻撃＆盾割り (剥がし補助)", runes: "迅速+反撃 または 暴走+反撃", isLeader: false },
      { name: "ルーカシャ", attribute: "火", role: "多段連撃＆高火力アタッカー (2A)", runes: "猛攻+刃 または 暴走+刃", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "シャーマン", attribute: "光", role: "ボス特効フィニッシャー (2A)", runes: "激怒+刃 (クリダメ型)", isLeader: false }
    ],
    turnOrder: "カリン ➔ ローレン ➔ ルーカシャ ➔ ラオーク ➔ シャーマン",
    speedTuningMemo: "カリンが初手で攻撃バフ＋回復。ローレンとルーカシャでシールドを剥がして盾割りを入れ、ラオークの連携からシャーマンの特攻でトドメ。",
    requirementsMemo: "ガチャ産星4不要！星2（カリン）・星3（ローレン、ルーカシャ、ラオーク、シャーマン）だけで組める超安全設計。カリンの回復阻害がボスの自己回復を完全に封じます。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-spiritual-abyss",
    name: "精霊深淵Hard 火属性ジーク速攻パ",
    dungeon: "精霊のダンジョン (深淵Hard)",
    dungeonCategory: "精霊",
    averageTime: "約35秒",
    successRate: "97%",
    members: [
      { name: "ジーク", attribute: "火", role: "攻撃＆クリ率バフ (開幕最速) (L)", runes: "迅速+意志 (速度最速)", isLeader: true },
      { name: "シャイナ", attribute: "火", role: "全体防御弱化・スタン", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "アスター", attribute: "火", role: "高火力単体アタッカー", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・ターン短縮", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ヴェルデハイル", attribute: "火", role: "ゲージ回し・ダメ押し", runes: "暴走+反撃 (クリ率100%)", isLeader: false }
    ],
    turnOrder: "ジーク ➔ シャイナ ➔ アスター ➔ ラオーク ➔ ヴェルデハイル",
    speedTuningMemo: "ジークを初手最速で動かし「バフ掛け」。味方の行動前にクリ率UP状態を作ることでボスのクリ率半減パッシブを相殺する。",
    requirementsMemo: "ボスは強化効果1つにつきクリ率5%UP＋パッシブで味方クリ率半減。4番クリ率ルーンやジークのクリバフで確実にクリティカルを出すのが鉄則。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-spiritual-abyss-berenice",
    name: "精霊深淵Hard ベレニス＆ライリー軸 (超安定・耐久クリバフ型)",
    dungeon: "精霊のダンジョン (深淵Hard)",
    dungeonCategory: "精霊",
    averageTime: "約48秒",
    successRate: "99%",
    members: [
      { name: "ベレニス", attribute: "火", role: "全体クリ率UP・速度UP・シールド付与 (L)", runes: "迅速+意志 (速度/体力/体力)", isLeader: true },
      { name: "ライリー", attribute: "風", role: "調合純5・全体免疫・攻撃バフ・トーテム回復", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "カルカノ", attribute: "火", role: "毎ターン自動盾割りパッシブ＆狙撃", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "アスター", attribute: "火", role: "高火力単体アタッカー・ボス特攻", runes: "吸血+反撃 または 激怒+刃", isLeader: false }
    ],
    turnOrder: "ベレニス ➔ ライリー ➔ カルカノ ➔ ラオーク ➔ アスター",
    speedTuningMemo: "ベレニス最速でクリ率UP＋シールドを展開。ライリーが免疫と攻撃バフを重ね、ボスのクリ半減デバフを完全に無効化。カルカノの自動盾割りからアタッカーが安全に削ります。",
    requirementsMemo: "精霊のボスのギミック（強化効果数に応じたステータス強化・クリ率半減）を、ベレニスのクリ率バフとライリーの多重バフで完全に攻略する高安定編成です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-spiritual-abyss-f2p",
    name: "精霊深淵Hard 【完全無課金F2P】ジーク＆カリン火属性パ (星2・星3のみ)",
    dungeon: "精霊のダンジョン (深淵Hard)",
    dungeonCategory: "精霊",
    averageTime: "約55秒",
    successRate: "98%",
    members: [
      { name: "ジーク", attribute: "火", role: "攻撃＆クリ率バフ (開幕最速) (L)", runes: "迅速+集中 (速度最速)", isLeader: true },
      { name: "カリン", attribute: "火", role: "攻撃バフ・回復・回復阻害", runes: "反撃+反撃+元気 (速度/体力/防御)", isLeader: false },
      { name: "スペクトラ", attribute: "火", role: "ボス特攻最大体力比例・ゲージ下げ (2A)", runes: "迅速+刃 (速度/クリダメ/体力)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ヴェルデハイル", attribute: "火", role: "ゲージ回し・ダメ押し", runes: "暴走+反撃 (クリ率100%必須)", isLeader: false }
    ],
    turnOrder: "ジーク ➔ カリン ➔ スペクトラ ➔ ラオーク ➔ ヴェルデハイル",
    speedTuningMemo: "ジークが初手でクリ率バフ＋剣バフをかけ、カリンが回復と攻撃バフを維持。ラオークの連携とスペクトラの特攻でボスを削り、ヴェルデハイルでターンを連続獲得します。",
    requirementsMemo: "ガチャ産星4・純5モンスター一切不要！火属性のみで統一しているため、被ダメージを抑えつつ属性有利（クリ率+15%）を得られます。全員のクリ率を最低70%（ジークバフ込み100%）に調整してください。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-steel-fortress",
    name: "鋼鉄のダンジョン 強化阻害安定パ",
    dungeon: "鋼鉄のダンジョン",
    dungeonCategory: "鋼鉄",
    averageTime: "約45秒",
    successRate: "99%",
    members: [
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫 (L)", runes: "迅速+集中 (速度/体力/体力)", isLeader: true },
      { name: "ジンク", attribute: "闇", role: "全体強化阻害・攻撃デバフ", runes: "絶望+集中 (速度/防御/防御・的中50%+)", isLeader: false },
      { name: "リンリン", attribute: "火", role: "強化効果阻害・火力", runes: "猛攻+集中 (的中高め)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "縦割り・ゲージ下げ", runes: "迅速+集中 (的中45%+)", isLeader: false },
      { name: "ブランディア", attribute: "火", role: "デバフ比例超火力トドメ", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ ローレン ➔ ジンク ➔ リンリン ➔ ブランディア",
    speedTuningMemo: "ジンク・リンリンにボスの行動前に「強化効果阻害」を入れさせる。効果的中を最低50%以上確保。",
    requirementsMemo: "ボスがシールドを張る前に強化効果阻害を入れることが全て。阻害さえ入れば事故はほぼ起きない。ブランディアの代わりにクローやクロー2次覚醒でも代用可。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-steel-fortress-agrios",
    name: "鋼鉄のダンジョン 【超高速】アグリオス＆テオン軸 (最速25秒テンプレ)",
    dungeon: "鋼鉄のダンジョン",
    dungeonCategory: "鋼鉄",
    averageTime: "約25秒",
    successRate: "98%",
    members: [
      { name: "ルシェン", attribute: "風", role: "攻撃リーダー・wave1/3切断一掃 (L)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "テオン", attribute: "光", role: "リモーション・攻撃バフ付与", runes: "迅速+闘志 (速度調整)", isLeader: false },
      { name: "ジンク", attribute: "闇", role: "全体強化効果阻害・攻撃力低下 (2A)", runes: "迅速+集中 (的中60%+)", isLeader: false },
      { name: "アグリオス", attribute: "水", role: "強化効果阻害＆ボス大打撃", runes: "猛攻+集中 または 激怒 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ブランディア", attribute: "火", role: "弱化効果比例・超特大一撃フィニッシャー", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ルシェン ➔ テオン ➔ ジンク ➔ アグリオス ➔ ブランディア",
    speedTuningMemo: "道中はルシェンの切断で瞬殺。ボス戦ではジンクとアグリオスが即座に強化効果阻害とデバフを入れ、テオンのリモーションを受けたブランディアが数十万ダメージを一撃で叩き込みます。",
    requirementsMemo: "最速20秒台を叩き出す上級者向けテンプレ。ボスのシールド発動を強化阻害で完全封鎖し、デバフを4つ以上乗せた状態でブランディアのスキル3を叩き込むのがコツです。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-steel-fortress-f2p",
    name: "鋼鉄のダンジョン 【完全無課金F2P】ジンク＆クロー軸 (純5不要)",
    dungeon: "鋼鉄のダンジョン",
    dungeonCategory: "鋼鉄",
    averageTime: "約48秒",
    successRate: "99%",
    members: [
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・持続回復 (L)", runes: "迅速+集中 (速度/体力/体力)", isLeader: true },
      { name: "ローレン", attribute: "光", role: "盾割り・強化剥がし・ゲージ下げ", runes: "迅速+集中 (速度/体力/的中50%+)", isLeader: false },
      { name: "ジンク", attribute: "闇", role: "全体強化阻害・攻撃弱化 (2A)", runes: "絶望+集中 または 迅速 (速度/防御/防御・的中50%+)", isLeader: false },
      { name: "リンリン", attribute: "火", role: "多段強化阻害・剥がし保険", runes: "猛攻+集中 (的中50%+)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "烙印・弱化比例大ダメージフィニッシャー (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ ローレン ➔ ジンク ➔ リンリン ➔ クロー",
    speedTuningMemo: "フラン最速で剣バフ。ローレンが盾割りを入れ、ジンクとリンリンのW強化阻害でボスのシールド獲得を100%阻止。弱化が重なったボスにクローが「傷口ほじくり返す」で大ダメージを与えます。",
    requirementsMemo: "純5（ブランディア等）を一切使わず、古代コインや秘密ダンジョン、2次覚醒で揃うモンスターのみで構成。W阻害（ジンク＋リンリン）により事故率がほぼ0%の安心仕様です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-steel-fortress-no-brandia-lushen",
    name: "鋼鉄のダンジョン 【ブランディア不要・道中切断】ルシェン＆クロー即殺軸",
    dungeon: "鋼鉄のダンジョン",
    dungeonCategory: "鋼鉄",
    averageTime: "約32秒",
    successRate: "98%",
    members: [
      { name: "ルシェン", attribute: "風", role: "攻撃リーダー・切断で道中wave1/3を即殺 (L)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "ジンク", attribute: "闇", role: "最速全体強化効果阻害・攻撃力低下 (2A)", runes: "迅速+集中 (的中60%+)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "盾割り・剥がし・ゲージ管理", runes: "迅速+集中 (速度/的中50%+)", isLeader: false },
      { name: "テオン", attribute: "光", role: "リモーションでクローへ即時ターン譲渡", runes: "迅速+闘志 (速度調整)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "弱化効果比例・超特大一撃フィニッシャー (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ルシェン ➔ ジンク ➔ ローレン ➔ テオン ➔ クロー",
    speedTuningMemo: "道中はルシェンの切断で瞬殺。ボス戦ではジンクが強化阻害、ローレンが盾割りを入れ、テオンのリモーションを受けたクローが「傷口ほじくり返す」で一撃十数万ダメージを叩き込みます。",
    requirementsMemo: "純5ブランディアなしでの最速級テンプレ！クローの火力ルーン（激怒＋高クリダメ）をしっかり仕上げることで、ブランディア同等の秒速周回を実現できます。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-steel-fortress-no-brandia-roaq",
    name: "鋼鉄のダンジョン 【ブランディア不要・高回転】ラオーク＆クロー協力攻撃軸",
    dungeon: "鋼鉄のダンジョン",
    dungeonCategory: "鋼鉄",
    averageTime: "約40秒",
    successRate: "99%",
    members: [
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・持続回復 (L)", runes: "迅速+集中 (速度/体力/体力)", isLeader: true },
      { name: "ローレン", attribute: "光", role: "盾割り・強化剥がし・ゲージ下げ", runes: "迅速+集中 (速度/体力/的中50%+)", isLeader: false },
      { name: "ジンク", attribute: "闇", role: "全体強化阻害・攻撃力低下 (2A)", runes: "絶望+集中 または 迅速 (的中50%+)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃でジンク阻害＆クロー追撃を連続発動 (2A)", runes: "暴走+反撃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "烙印・弱化比例大ダメージフィニッシャー (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ ローレン ➔ ジンク ➔ ラオーク ➔ クロー",
    speedTuningMemo: "フランの剣バフからローレンが盾割り。ジンクの強化阻害が入った後、ラオークの協力攻撃がジンクとクローを連れて連続攻撃。強化阻害を切らさずクローのスキル回転を極限まで早めます。",
    requirementsMemo: "純5モンスター完全不要！秘密ダンジョンと2次覚醒だけで組める超高安定パ。ラオークの協力攻撃により阻害デバフの付与確率とクローの攻撃回数が跳ね上がります。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt-shaina-twins",
    name: "審判のダンジョン 【最速25秒】シャイナ＆ブメチャク＋ジーク・ジュリー速攻パ",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約25秒 (24〜30秒)",
    successRate: "99%",
    members: [
      { name: "シャイナ", attribute: "火", role: "ダンジョン攻撃力33%UP (L)・全体スタン・防御弱化・ブメチャク連携", runes: "闘志+闘志+闘志 または 激怒/暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "ジュリー", attribute: "水", role: "道中WAVE一掃（シャッフルで道中1・3をワンパン）・ボス多段削り", runes: "激怒+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃・クリ率70%+)", isLeader: false },
      { name: "サブリナ", attribute: "水", role: "ブーメラン協力攻撃・与ダメUP＆被ダメ軽減パッシブ・盾割り", runes: "闘志+闘志+闘志 または 激怒/猛攻/保護+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "タリア", attribute: "水", role: "単体超特大火力フィニッシャー（スキル3体力低下特効）・ボス瞬殺担当", runes: "激怒+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃・クリ率70%+)", isLeader: false },
      { name: "ジーク", attribute: "火", role: "最速全体バッファー（開幕遠吠えで攻撃力50%UP＆クリ率30%UP付与）・闘志枠", runes: "闘志+闘志+闘志 または 迅速+闘志 / 闘志+保護 (最速・速度/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ジーク ➔ ジュリー ➔ シャイナ ➔ サブリナ ➔ タリア",
    speedTuningMemo: "【最速行動順が周回の絶対条件！】\n① ジーク（味方最速）：開幕スキル3「遠吠え」で味方全体の攻撃力50%UP＆クリティカル率30%UPを即座に付与。\n② ジュリー（ジーク直後）：ジークの攻撃＆クリバフが乗った状態でスキル3「シャッフル（体力満タン時）」を放ち、WAVE1およびWAVE3の道中クリスタル・雑魚敵を一撃確殺（ワンパン）で瞬殺突破。\n③ シャイナ：中ボス（WAVE2）および審判のボス（WAVE4）開幕で防御弱化を付与しつつ、サブリナを同時攻撃へ引っ張る。\n④ サブリナ：防御弱化を重ねつつパッシブ効果で味方全体の与ダメージを跳ね上げる。\n⑤ タリア：最後尾からサブリナと共にスキル3を叩き込み、ボスの残体力を一瞬で消し飛ばす。",
    requirementsMemo: "【審判のダンジョン屈指の最速25秒テンプレ周回パ】\n\n◆ ギミック解説と勝利の方程式：\n審判のボスはゲージ減少を受けると反撃ゲージが増加する厄介なパッシブを持っていますが、この編成はゲージ減少に頼るのではなく、ジークの強力なバフを受けたブメチャク（シャイナ・サブリナ・タリア）の圧倒的な瞬間連続多段火力で「ボスの反撃ゲージが溜まる前（ボスが1回も行動する前）」に叩き潰す速攻構成です。\n\n◆ ルーン・ステータス重要チェックポイント：\n1. ジークのクリ率バフ（+30%）によるルーン恩恵：ジークが常にクリバフを供給するため、ジュリー・タリア・シャイナ・サブリナのクリティカル率は「70%以上」確保するだけで戦闘中は100%確定クリティカルとなります！クリ率に振るステータスを攻撃力・クリダメ・速度に回せるのが最大の強みです。\n2. ジュリーの道中ワンパン火力：WAVE1・3の敵をジュリーのシャッフルで確実に全滅させることが最重要です。ジークのバフがあるため素撃ちより遥かに敷居は下がりますが、アーティファクトで「水属性への与ダメUP」「スキル3クリダメUP」「体力満タン時クリダメUP」を厳選してください。\n3. 「闘志ルーン」の大量採用：ジーク、シャイナ、サブリナのルーンに「闘志ルーン」を積極的に採用（計4〜6セット以上推奨）することで、パーティ全体の攻撃力が劇的に跳ね上がり、ジュリーの道中ワンパンやタリアのボス瞬殺が極めて簡単になります。\n4. シャイナのダンジョン攻撃力33%UPリーダー：シャイナの強力なダンジョン攻撃33%UPリーダースキルにより、ジュリーの道中ワンパン火力、およびブメチャク（シャイナ・サブリナ・タリア）の対ボス瞬殺火力が飛躍的に底上げされます。\n\n━━━━━━━━━━━━━━━━━━━━\n⚠️【ボス戦で全滅する場合の5大原因と即効対策チェックリスト】\n① 【防御弱化（盾割り）の抵抗落ち】：シャイナやサブリナの縦割りをボスに抵抗されると火力が1/3に激減し削り切れません。シャイナとサブリナの効果的中を必ず「45%〜55%以上」確保してください。\n② 【保護（シールド）ルーンの導入★超おすすめ即効対策】：ジークまたはサブリナに「保護ルーン」を1セット装備させてください！ボスの全体反撃や通常攻撃をシールドで受け止められるようになり、紙耐久アタッカーが蒸発する事故を劇的に防げます。\n③ 【ボスの速度比例ダメージカット（最大70%軽減）】：審判ボスは「相手（味方）との速度差に応じて最大70%のダメージをカット」します。味方の速度が遅いと削り切れません。パーティ全体の速度を+70〜+90以上（ジークは+110〜+130の最速）に引き上げてください。\n④ 【ジュリーのスキル2暴発によるボスの即時ターン獲得】：ジュリーのスキル2「千切り」には攻撃ゲージ減少効果があるため、ボス開幕でスキル3ではなくスキル2を撃つと、ボスの反撃ゲージパッシブが発動して即座にターンを奪われます。WAVE2中ボスを速攻で倒してスキル温存するか、ジュリーの攻撃速度を調整してください。\n⑤ 【タリアのフィニッシュ火力不足】：ボスのHPが半分以下になった瞬間にタリアのスキル3で消し飛ばすため、タリアは「激怒＋刃」（攻撃+1500以上、クリダメ200%以上、クリ率70%）にし、味方に闘志ルーンを4〜6セット積んで火力を最大化してください。\n⑥ 【アーティファクトの耐久補強】：各キャラに「光属性からの被ダメ減少」や「受けるダメージ軽減」を積むとボスの反撃を安定して耐えられます。",
    targetMemo: "ボス直撃ターゲット設定（ボス集中攻撃でOK）。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt",
    name: "審判のダンジョン 高回転ヴェルデパ",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約50秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%)", isLeader: true },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・縦割り", runes: "暴走+反撃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ヴィゴル", attribute: "水", role: "速度バフ・回復・盾割り", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・回復", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "イェン", attribute: "風", role: "連続行動・持続ダメ削り", runes: "暴走+刃 (速度/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ ヴィゴル ➔ ラオーク ➔ イェン ➔ ヴェルデハイル",
    speedTuningMemo: "フラン・ヴィゴルでバフと盾割りを入れ、アタッカーが攻撃した後にヴェルデハイルでゲージを巻き戻す。",
    requirementsMemo: "ボスはゲージ下げを受けると反撃ゲージを増加させるため、ローレンなどの「ゲージ下げキャラ」はNG。持続ダメージや多段攻撃、速度バフで手数を稼ぐ。",
    targetMemo: "左クリスタル ➔ ボス の順にターゲット設定すると安定度UP。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt-speed",
    name: "審判のダンジョン 【高速】クリーピー＆クロー軸 (速度バフ強奪型)",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約36秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "クリーピー", attribute: "水", role: "ボスの速度バフ強奪＆持続付与・味方加速", runes: "迅速+反撃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "ヴィゴル", attribute: "水", role: "味方全体速度バフ・回復・盾割り (2A)", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+反撃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "烙印付与・弱化効果比例特大ダメージ (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ヴィゴル ➔ クリーピー ➔ ラオーク ➔ クロー ➔ ヴェルデハイル",
    speedTuningMemo: "ヴィゴルの速度バフからクリーピーがボスの速度バフを奪い取り、味方全体の行動速度を極限まで加速。ラオークの協力攻撃で手数を稼ぎつつ、クローの特大ダメージで一気に削り落とします。",
    requirementsMemo: "ボスの厄介な強化効果をクリーピーのパッシブで奪い取ることで、ボスの回転力を奪い味方のターン数を倍増させる高速型。クローの火力ルーンが重要です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt-jultan",
    name: "審判のダンジョン ジュルタン＆カリン軸 (闇デコイ反射・超安定型)",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約58秒",
    successRate: "99%",
    members: [
      { name: "カリン", attribute: "火", role: "攻撃バフ・回復・回復阻害 (L)", runes: "反撃+反撃+元気 (速度/体力/防御)", isLeader: true },
      { name: "ジュルタン", attribute: "闇", role: "光ボスの攻撃を受け止める闇デコイ・反射＆盾割り (2A)", runes: "元気+元気+反撃 (体力特化/速度)", isLeader: false },
      { name: "フラン", attribute: "光", role: "攻撃バフ・免疫・手厚い回復", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ヴェルデハイル", attribute: "火", role: "ゲージ回し・全体回転", runes: "暴走+反撃 (クリ率100%)", isLeader: false }
    ],
    turnOrder: "フラン ➔ カリン ➔ ジュルタン ➔ ラオーク ➔ ヴェルデハイル",
    speedTuningMemo: "フランとカリンのWサポートで免疫と攻撃バフを常時維持。光属性の審判ボスは属性優先でジュルタンを狙うため、被弾時の反射ダメージと盾割りで安全かつ自動的にボスを削ります。",
    requirementsMemo: "ルーン事故が絶対に起きない初心者〜中級者向け超安定設計！ジュルタンの体力をできるだけ高く盛り、カリンの回復阻害でボスの自己回復を阻止するのがポイントです。",
    targetMemo: "左クリスタル ➔ ボス の順にターゲット設定するとさらに安定します。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt-plan-a",
    name: "審判のダンジョン クロー導入型 (イカル入替・50秒切り)",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約45秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・全体ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "セレン", attribute: "闇", role: "多段連撃・持続・盾割り・回復阻害 (2A)", runes: "暴走+反撃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+反撃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "弱化比例特大火力フィニッシャー・烙印 (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "エルガー", attribute: "闇", role: "開幕攻撃＆吸血バフ・デバフ付与", runes: "猛攻+刃 または 闘志", isLeader: false }
    ],
    turnOrder: "エルガー ➔ セレン ➔ ラオーク ➔ クロー ➔ ヴェルデハイル",
    speedTuningMemo: "エルガー最速で開幕バフ展開。セレンが多段攻撃で盾割り・持続・回復阻害を付与。ラオークの協力攻撃でさらに手数を重ね、デバフ山盛りのボスへクローのスキル3を叩き込みます。",
    requirementsMemo: "【イカルをクローに変えるだけの即効型】セレンとエルガーが付与する弱化効果（盾割り・持続・回復阻害・攻撃弱化）の数に応じて、クローのスキル3（傷口ほじくり）が特大ダメージに化けます。クローの激怒ルーンのクリダメと攻撃力を優先的に強化してください。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-punishers-crypt-plan-b",
    name: "審判のダンジョン セレン＆クロー加速型 (ヴィゴル速度バフ軸)",
    dungeon: "審判のダンジョン",
    dungeonCategory: "審判",
    averageTime: "約40秒",
    successRate: "98%",
    members: [
      { name: "ヴェルデハイル", attribute: "火", role: "速度リーダー・全体ゲージ回し (L)", runes: "暴走+反撃 (クリ率100%必須)", isLeader: true },
      { name: "ヴィゴル", attribute: "水", role: "味方全体速度バフ・回復・盾割り (2A)", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "セレン", attribute: "闇", role: "多段連撃・持続・回復阻害・盾割り (2A)", runes: "暴走+反撃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃・防御弱化 (2A)", runes: "暴走+反撃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "クロー", attribute: "闇", role: "烙印付与・弱化効果比例特大ダメージ (2A)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ヴィゴル ➔ セレン ➔ ラオーク ➔ クロー ➔ ヴェルデハイル",
    speedTuningMemo: "ヴィゴル最速で全体速度バフ。セレンが先手で多段デバフを蓄積し、ラオーク協力攻撃からクローのスキル3でボスのHPを一気に刈り取ります。",
    requirementsMemo: "【セレンとクローを活かした40秒切り構成】ヴィゴルの全体速度バフでボスの割り込みを阻止し、味方の行動回数を激増させます。セレンの多段デバフとクローの弱化比例火力が完璧に噛み合い、40秒前後の高速安定周回が可能です。",
    targetMemo: "ボス直撃ターゲット設定。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },

  // -------------------------------------------------------------
  // 7. タルタロスの迷宮 (Tartarus' Labyrinth) 4大ボス安定攻略パーティ
  // -------------------------------------------------------------
  // 7-1. 水の守護者 レオス (Leos) - 計5編成
  {
    id: "preset-party-tartaros-leos-taranis-hraesvelg",
    name: "【タルタロス迷宮・レオス(水)】タラニス＆ライリー・フレスベルグ 手持ち最適化パ (ジュリー入替・Hard/Hell超安定)",
    dungeon: "タルタロスの迷宮 (レオス・水)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分40秒〜2分",
    successRate: "99%",
    members: [
      { name: "タラニス", attribute: "風", role: "ギルバト防御44%UP (L)・全体防御バフ＋万が一の蘇生保険＋自己復活 (ジュリー枠)", runes: "守護+守護+意志 または 暴走+意志 (速度/防御/防御 防御+1400以上)", isLeader: true },
      { name: "ライリー", attribute: "風", role: "毎ターン全体免疫＋弱化解除＋攻撃バフ＋全体回復 (氷結・スキル延長完全遮断)", runes: "暴走+意志 または 迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "フレスベルグ", attribute: "風", role: "全体速度バフ＋攻撃バフ＋持続回復＋単体烙印 (味方加速＆ライリーの回転UP)", runes: "迅速+刃 または 暴走+刃 (速度/クリダメ/攻撃 または 攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "シュタルク", attribute: "風", role: "風属性単体高火力アタッカー (有利属性＋攻撃バフ・烙印でルーン＆ボス粉砕)", runes: "激怒+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: false },
      { name: "ダリオン", attribute: "光", role: "【味方被ダメ20%軽減】パッシブ常時被ダメカット＋スキル1確定盾割り＋スキル2剣折り (代用: ローレン)", runes: "反撃+元気+元気 (体力/体力/防御)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ フレスベルグ ➔ ダリオン ➔ タラニス ➔ シュタルク",
    speedTuningMemo: "ライリー最速で免疫を展開。フレスベルグがスキル3で全体速度バフ＋攻撃バフ＋持続回復を付与し、味方全員の回転率を大幅に向上させます。ダリオンが盾割りを入れ、タラニスの防御バフで守りを固め、シュタルクが一撃必殺の打点を叩き込みます。",
    requirementsMemo: "【なぜジュリーをタラニスに変えるとHard/Hellで勝てるのか？】\n① ジュリーの弱点克服：ジュリーは道中WAVEの殲滅役であり、全体攻撃を受けるレオス戦では体力が減ってスキル3の火力が半減してしまいます。また水属性のため、左右のルーン処理も遅れがちです。\n② タラニスの圧倒的防御バフ＆蘇生：ジュリーを「タラニス」に入れ替えることで、全員が有利な風属性（＋光ダリオン）となり、被ダメージ大幅減＋クリ率+15%ボーナスが常時発動。さらにタラニスの全体防御バフとダリオンの被ダメ20%カットが合わさり、レオスの攻撃がほとんど痛くなくなります。\n③ 万が一の即死事故を完全ゼロ化：誰かが凍結されて集中攻撃を受けても、タラニスがスキル3で即座に蘇生。タラニス自身もパッシブで自動復活するため、全滅事故が完全に防げます。\n④ フレスベルグの加速シナジー：フレスベルグの全体速度バフにより、ライリーのターンが超高速で回り、トーテムが常に満タンになります！",
    targetMemo: "【最重要】：左右に出現するルーン（特に凍結ルーン・激怒ルーン）が出現したら最優先でタップして破壊！シュタルクやフレスベルグの単体攻撃で即座に破壊したあと、ボス本体を集中攻撃。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-leos-riley-fran-dual",
    name: "【タルタロス迷宮・レオス(水)】ライリー＆フラン 二重免疫改善パ (ジュリー➔フラン入替・凍結完全封殺)",
    dungeon: "タルタロスの迷宮 (レオス・水)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分45秒",
    successRate: "99%",
    members: [
      { name: "フレスベルグ", attribute: "風", role: "ギルバト攻撃33%UP (L)・全体速度バフ＋攻撃バフ＋持続回復＋単体烙印", runes: "迅速+刃 または 暴走+刃 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "ライリー", attribute: "風", role: "毎ターン全体免疫＋弱化解除＋攻撃バフ＋全体回復 (メイン免疫)", runes: "暴走+意志 または 迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "フラン", attribute: "光", role: "【ジュリー枠に入替】全体2ターン免疫＋攻撃バフ＋全体回復・スキル1剣折り (サブ免疫)", runes: "迅速+意志 または 迅速+元気 (速度/体力/体力 速度+90以上)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "単体確定盾割り＋速度低下＋ゲージ下げ＋左右ルーンの強化剥がし", runes: "迅速+集中 (速度/体力/的中)", isLeader: false },
      { name: "シュタルク", attribute: "風", role: "風属性メインアタッカー (ルーン即殺＆ボス撃破)", runes: "激怒+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ フラン ➔ ローレン ➔ フレスベルグ ➔ シュタルク",
    speedTuningMemo: "ライリーとフランを高速化（速度+90〜110）。ローレンが左右のルーンのゲージを下げて行動を阻止し、フレスベルグの加速からシュタルクが粉砕します。",
    requirementsMemo: "【現在のパーティからジュリーをフランに変えるだけの最速改善案！】\n・レオスで負ける最大の理由は「ライリー1体だけだと、レオスのスキル延長を受けて免疫が切れた瞬間に全員が凍結されること」です。\n・ジュリーを「フラン（古代コインで入手可能）」に変えるだけで【ライリー＋フランの二重免疫体制】となり、オートでも免疫が100%途切れません！\n・ローレンの剥がしとゲージ下げで左右のフォーカスルーンを完封できるため、Hard/Hellでも極めて安全にクリアできます。",
    targetMemo: "左右のルーンが出現したら最優先でローレンの盾割り＋シュタルクの単体攻撃で即座に破壊。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-leos-immune-f2p",
    name: "【タルタロス迷宮・レオス(水)】デルフォイ＆フラン 二重免疫安定パ (完全事故防止)",
    dungeon: "タルタロスの迷宮 (レオス・水)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分30秒〜2分 (安定クリア最優先)",
    successRate: "99%",
    members: [
      { name: "デルフォイ", attribute: "風", role: "風防御40%UP (L)・全体解除＋2T免疫＋回復・スキル延長", runes: "迅速+意志 または 暴走+元気 (速度/体力/体力)", isLeader: true },
      { name: "フラン", attribute: "光", role: "全体2T免疫＋攻撃バフ＋全体回復・スキル1剣折り", runes: "迅速+意志 または 迅速+元気 (速度/体力/体力 速度+90以上)", isLeader: false },
      { name: "ルル", attribute: "水", role: "全体解除＋免疫＋持続回復 (デルフォイと二重免疫維持)", runes: "迅速+元気 または 暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "風パンダ", attribute: "風", role: "高耐久・反撃・防御バフ・持続削り (ボス削り役)", runes: "暴走+守護 または 守護+守護+意志 (速度/防御/防御)", isLeader: false },
      { name: "アカムアミール", attribute: "風", role: "有利属性アタッカー・弱化比例大砲 (全体削り・高耐久)", runes: "猛攻+刃 または 激怒+刃 (速度/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ デルフォイ ➔ ルル ➔ 風パンダ ➔ アカムアミール",
    speedTuningMemo: "フラン最速（速度+90〜110）、デルフォイをその直後（速度+80〜100）に動かして開幕から味方全体に免疫を維持。ルルはフラン・デルフォイの直後に動き、デバフ即時解除と免疫の隙間を完全に埋めるトリプルサポート体制にします。",
    requirementsMemo: "【レオス攻略の最重要鉄則：免疫を切らさない！】\n・レオスは「絶対零度」で全体を凍結させ、「凍結の息」でスキル延長＆氷結を付与してきますが、免疫状態であればすべて100%無効化できます。\n・フラン＋デルフォイ＋ルルの3体体制（トリプル免疫・解除）にすることで、オートでも免疫が途切れる瞬間がなくなり、事故率がほぼゼロになります。\n・【ルーンの注意点】レオスの凍結ルーンで暴走ルーンが無効化されることがあるため、迅速や元気・守護・意志などステータス重視のルーン構成が極めて安定します。\n・【代用モンスター】\nデルフォイ ➔ 火アーク(ヴェラジュエル)、アメリア、トリアーナ\n風パンダ ➔ 風ドリアード(メリア)、チャウンスン(風天舞姫)、エラドリエル\nアカムアミール ➔ ルシェン、風神獣僧(リテッシュ)、風キャノンガール、風ホムンクルス",
    targetMemo: "【フォーカスルーン最優先】戦闘中に出現する左右のルーン（特に凍結ルーン・激怒ルーン）はボスの攻撃を凶悪化させるため、出現したら最優先でタップして破壊してください。ルーン破壊後はボス本体を集中攻撃。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-leos-wind-bruiser",
    name: "【タルタロス迷宮・レオス(水)】風パンダ＆チャウンスン 風属性耐久反撃パ (ルーン封印耐性)",
    dungeon: "タルタロスの迷宮 (レオス・水)",
    dungeonCategory: "タルタロス",
    averageTime: "約2分",
    successRate: "98%",
    members: [
      { name: "風パンダ", attribute: "風", role: "ギルバト防御44%UP (L)・反撃＋防御バフ＋持続削り", runes: "守護+守護+意志 (速度/防御/防御 防御+1400以上)", isLeader: true },
      { name: "デルフォイ", attribute: "風", role: "全体解除＋2T免疫＋回復＋スキル延長", runes: "迅速+意志 (速度/体力/防御)", isLeader: false },
      { name: "チャウンスン", attribute: "風", role: "体力ゲージ合わせ回復＋攻撃バフ＋全体回復", runes: "暴走+元気 または 迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "フラン", attribute: "光", role: "免疫＋攻撃バフ＋回復＋剣折り", runes: "迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "メリア", attribute: "風", role: "持続ダメージばら撒き＋持続延長＋ゲージ下げ毒殺", runes: "絶望+集中 または 迅速+元気 (速度/体力/的中)", isLeader: false }
    ],
    turnOrder: "デルフォイ ➔ フラン ➔ チャウンスン ➔ メリア ➔ 風パンダ",
    speedTuningMemo: "デルフォイ・フランで先手を取って免疫を張り、チャウンスンで体力を満タン維持。メリアの持続ダメージでレオスの体力を削っていきます。",
    requirementsMemo: "【風属性統一による圧倒的耐久】\n・水属性ボスに対して全員有利属性となるため、被ダメージ大幅減少＋ミス発生＋クリ率+15%ボーナスが常時働きます。\n・レオスの凍結ルーンで暴走ルーンが無効化されてもステータス負けしないよう、守護・元気・意志などのステータス補正ルーンを厚めに積むのが隠れたコツです。",
    targetMemo: "左右のルーンが出現したら先に処理し、その後ボス本体を攻撃。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // 7-2. 火の守護者 コト (Koto) - 計2編成
  {
    id: "preset-party-tartaros-koto-atkbreak-f2p",
    name: "【タルタロス迷宮・コト(火)】セオマルス＆ヴィゴル・カリン 剣折り超耐久パ (即死回避)",
    dungeon: "タルタロスの迷宮 (コト・火)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分40秒〜2分10秒",
    successRate: "99%",
    members: [
      { name: "セオマルス", attribute: "水", role: "全属性クリ率24%UP (L)・粘るで即死回避・単体盾割り＋高火力", runes: "暴走+刃 または 猛攻+刃 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "カリン", attribute: "火", role: "【コト特効】スキル1確定2連剣折り(攻撃弱化)＋全体回復/攻撃バフ", runes: "反撃+元気+元気 (速度/体力/防御 的中40%+)", isLeader: false },
      { name: "ヴィゴル", attribute: "水", role: "全体回復＋速度バフ＋クリ被弾軽減バフ＋3連盾割り", runes: "迅速+元気 または 暴走+元気 (速度/体力/体力 体力+25000以上)", isLeader: false },
      { name: "エマ", attribute: "水", role: "防御力バフ＋全体シールド付与＋回復 (焦熱地獄の被ダメ半減)", runes: "迅速+元気 または 暴走+元気 (速度/体力/体力)", isLeader: false },
      { name: "コベール", attribute: "水", role: "隠密で被ダメ50%軽減＋防御無視超特大火力 (ボス削り役)", runes: "激怒+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ヴィゴル ➔ カリン ➔ エマ ➔ セオマルス ➔ コベール",
    speedTuningMemo: "ヴィゴルとカリンが先手を取り、開幕からコトに「攻撃力弱化（剣折り）」と「防御弱化（盾割り）」を付与。エマの防御バフを事前に張ることで、激怒全体攻撃の被ダメージを極限まで抑えます。",
    requirementsMemo: "【コト攻略の最重要鉄則：攻撃力弱化（剣折り）を絶対に切らさない！】\n・コトの「焦熱地獄」は攻撃力弱化（剣折り）が入っていればダメージが半分以下になり、さらにエマの防御バフやヴィゴルのクリ被弾軽減バフが重なれば、味方全員が耐えきれます。\n・カリンに「反撃ルーン」を積んでおくと、コトの攻撃に対してスキル1で即座に攻撃力弱化を上書きできるため非常に安定します。\n・セオマルスはパッシブ「粘る」があるため、万が一の最大激怒でも絶対に倒されず、最後の削り役として完璧です。\n・【代用モンスター】\nコベール ➔ チャウ(水ドラゴンナイト)、水パンダ、アナベル、タリア(水チャクラム)\nエマ ➔ ルル(二次覚醒)、フラン、バステト、アベリオ(水ドルイド)\nカリン ➔ コリーン(星2だが優秀)、火パンダ(雄飛)",
    targetMemo: "【破壊ルーン・反撃ルーン最優先】戦闘中に出現する破壊ルーン・反撃ルーンを最優先で破壊。カリンの剣折りをボスに常時維持しつつ本体を攻撃。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-koto-chow-bastet",
    name: "【タルタロス迷宮・コト(火)】チャウ＆バステト 水属性鉄壁耐久パ (自己再生・被ダメ最小化)",
    dungeon: "タルタロスの迷宮 (コト・火)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分30秒",
    successRate: "99%",
    members: [
      { name: "チャウ", attribute: "水", role: "ギルバト体力44%UP (L)・毎ターン自力回復＋弱化解除・粘り強さSSS", runes: "暴走+果報 または 吸血+元気 (速度/クリダメ/体力 または 体力/クリダメ/体力)", isLeader: true },
      { name: "バステト", attribute: "水", role: "攻撃バフ＋全体シールド＋ゲージUP・スキル2で剣折り/盾割り", runes: "迅速+意志 (速度/体力/体力 速度+110以上)", isLeader: false },
      { name: "アナベル", attribute: "水", role: "全体解除＋全体ヒール＋3ターン全体防御弱化", runes: "暴走+元気 (速度/攻撃/体力)", isLeader: false },
      { name: "カリン", attribute: "火", role: "確定2連剣折り＋全体回復＋攻撃バフ", runes: "反撃+反撃+元気 (速度/体力/防御)", isLeader: false },
      { name: "セオマルス", attribute: "水", role: "高火力アタッカー＋盾割り＋粘るパッシブ", runes: "暴走+刃 (速度/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "バステト ➔ カリン ➔ アナベル ➔ セオマルス ➔ チャウ",
    speedTuningMemo: "バステトのシールドと攻撃バフを開幕展開し、カリンとバステトのダブル剣折りでコトを完全に骨抜きにします。",
    requirementsMemo: "【純5水属性モンスターによる圧倒的安定感】\n・チャウは自身のターンごとにデバフ解除と回復を行うため、長期戦になっても絶対に倒れません。\n・バステトのシールドとカリンの剣折りにより、焦熱地獄の直撃を受けてもHPゲージがほとんど削れません。",
    targetMemo: "ルーンが出現したら速やかに単体攻撃で撃破し、コト本体を叩きます。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // 7-3. 風の守護者 ギエス (Guilles) - 計2編成
  {
    id: "preset-party-tartaros-guilles-healblock-f2p",
    name: "【タルタロス迷宮・ギエス(風)】テサリオン＆カリン・火パンダ 回復阻害完封パ (HP吸収阻止)",
    dungeon: "タルタロスの迷宮 (ギエス・風)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分40秒〜2分10秒",
    successRate: "99%",
    members: [
      { name: "テサリオン", attribute: "火", role: "全属性効果抵抗41%UP (L)・デバフ比例追加ダメ・スキル2盾割り", runes: "暴走+刃 または 猛攻+刃 (速度/クリダメ/攻撃 または 速度/体力/攻撃)", isLeader: true },
      { name: "カリン", attribute: "火", role: "【ギエス特効】スキル2回復阻害(回復不可)付与！＋スキル1剣折り＋回復", runes: "反撃+元気+元気 または 迅速+集中 (速度/体力/防御 的中45%+)", isLeader: false },
      { name: "火パンダ", attribute: "火", role: "調合星5・多段デバフ(回復不可・剣折り・盾割り)＋全体持続回復/解除", runes: "守護+守護+元気 または 暴走+守護 (防御/防御/体力)", isLeader: false },
      { name: "フラン", attribute: "光", role: "全体免疫＋攻撃バフ＋回復＋攻撃弱化", runes: "迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "ラオーク", attribute: "火", role: "協力攻撃でカリン/火パンダを誘発し回復阻害と盾割りを常時更新", runes: "暴走+刃 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ カリン ➔ 火パンダ ➔ テサリオン ➔ ラオーク",
    speedTuningMemo: "フランが最速で免疫を展開。カリンがギエスにスキル2で回復阻害を入れ、火パンダがスキル3でデバフを重ねます。ラオークの協力攻撃でカリンが呼ばれると回復阻害や剣折りが即座に再付与されます。",
    requirementsMemo: "【ギエス攻略の最重要鉄則：回復阻害（回復不可）を切らさない！】\n・ギエスは攻撃時に大回復してくるため、回復阻害が入っていないと削ったHPがすべて元通りになってしまいます。カリンと火パンダの2枚体制で回復不可を維持すれば、ギエスのHP吸収を完全無効化できます。\n・全員火属性（＋光フラン）で編成することで、ギエスの風属性攻撃に対して被ダメージ激減＆強打・ミス発生となり、耐久面が極めて安全になります。\n・【代用モンスター】\nテサリオン ➔ カルカノ(火スナイパー)、ヴェルデハイル、火ヘルハウンド(ジーク)\n火パンダ ➔ ヴェラジュエル(火アーク)、シファ(火九尾の狐: 回復阻害持ち)、スカー(火オオカミ人間)\nラオーク ➔ ブランディア(火極地女王)、火ホムンクルス、ケン(火シャドウクロー)",
    targetMemo: "【吸血ルーン・絶望ルーン最優先】吸血ルーンや絶望ルーンが出現したら最優先で破壊。ボスに回復不可デバフを維持しながら集中攻撃。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-guilles-carcano-brandia",
    name: "【タルタロス迷宮・ギエス(風)】カルカノ＆ヴェラジュエル 高火力即殺パ (持続免疫＆防御無視)",
    dungeon: "タルタロスの迷宮 (ギエス・風)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分15秒",
    successRate: "99%",
    members: [
      { name: "カルカノ", attribute: "火", role: "ギルバト速度24%UP (L)・毎ターン確定盾割り・隠密で被ダメ半減＆超高火力", runes: "激怒+意志 または 暴走+意志 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "ヴェラジュエル", attribute: "火", role: "全体解除＋3ターン免疫＋攻撃ゲージアップ", runes: "暴走+意志 (速度/防御/防御)", isLeader: false },
      { name: "カリン", attribute: "火", role: "回復不可＋攻撃弱化＋回復＋攻撃バフ", runes: "反撃+元気+集中 (速度/体力/防御)", isLeader: false },
      { name: "火パンダ", attribute: "火", role: "回復不可・盾割り・持続回復・反撃", runes: "暴走+守護 (防御/防御/体力)", isLeader: false },
      { name: "ブランディア", attribute: "火", role: "弱化数比例の核弾頭スキル3でギエスのHPを一撃で消し去る", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ヴェラジュエル ➔ カリン ➔ 火パンダ ➔ カルカノ ➔ ブランディア",
    speedTuningMemo: "ヴェラジュエルの3ターン免疫でギエスの咆哮デバフを遮断。カリンの回復阻害と火パンダの多段デバフが入った瞬間、ブランディアのスキル3を叩き込みます。",
    requirementsMemo: "【免疫維持と圧倒的瞬間火力】\n・ヴェラジュエルの3T免疫でボスのデバフを寄せ付けません。\n・カリンの回復不可が入った状態でブランディアがスキル3を撃てば、ボスのHPを一気に消し飛ばすことができます。",
    targetMemo: "ルーンが出たらカルカノ等の単体攻撃で即座に破壊し、ボスを集中砲火。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // 7-4. 迷宮の主 タルタロス (Tartarus) - 計2編成
  {
    id: "preset-party-tartaros-boss-revive-f2p",
    name: "【タルタロス迷宮・タルタロス(主)】フラン＆ブリアン・ルル 蘇生＋二重免疫パ (事故率0%完全安定)",
    dungeon: "タルタロスの迷宮 (タルタロス・主)",
    dungeonCategory: "タルタロス",
    averageTime: "約2分30秒〜3分 (確実な生還・クリア)",
    successRate: "99%",
    members: [
      { name: "フラン", attribute: "光", role: "攻撃速度10%UP (L)・全体2T免疫＋攻撃バフ＋全体回復・スキル1剣折り", runes: "迅速+元気 (速度/体力/体力 速度+90以上)", isLeader: true },
      { name: "ブリアン", attribute: "風", role: "【タルタロス最強の保険】味方全員の体力を均等化して蘇生！・スキル2全体剣折り", runes: "絶望+元気 または 元気+元気+元気 (体力/体力/体力 体力+30000以上)", isLeader: false },
      { name: "ルル", attribute: "水", role: "全体解除＋免疫＋持続回復 (フランと合わせて二重免疫を維持)", runes: "迅速+元気 または 暴走+元気 (速度/体力/体力)", isLeader: false },
      { name: "ローレン", attribute: "光", role: "単体確定盾割り＋速度デバフ＋ゲージダウン＋強化剥がし (右腕シールド解除)", runes: "迅速+集中 (速度/体力/体力 的中45%+)", isLeader: false },
      { name: "水ホムンクルス", attribute: "水", role: "全体持続ダメージ＋割合削りアタッカー (ボス本体と腕を安全に削る)", runes: "絶望+集中 または 猛攻+刃 (速度/体力/攻撃)", isLeader: false }
    ],
    turnOrder: "フラン ➔ ローレン ➔ ルル ➔ 水ホムンクルス ➔ ブリアン",
    speedTuningMemo: "フランとルルを高速化（速度+80〜100）し、タルタロスのブレスが来る前に必ず免疫を張ります。ブリアンは鈍足高耐久（体力35000〜40000）にしておき、味方が落とされた瞬間にスキル3で即座に全員満タン近くまで回復しながら蘇生します。",
    requirementsMemo: "【タルタロス攻略の最重要鉄則：中ボス3体を倒してから挑むこと】\n・レオス、コト、ギエスを倒すとボスのパッシブ強化が解除され、難易度が劇的に下がります。必ず中ボス撃破後に挑戦してください（Hard/Hell共通）。\n・【腕のターゲット優先順位】\n① 左腕（崩壊の手）：攻撃ゲージ満タンで即死級の壊滅攻撃を放つため、最優先で左腕を破壊！\n② 右腕（創造の手）：ボスに強力なシールドを張るため、ローレンで剥がすか破壊。\n③ 本体：腕を落としたらボス本体にローレンの盾割りを入れ、水ホムの持続や通常攻撃で一気に削ります。\n・【蘇生役ブリアンの安心感】\nタルタロス戦はどれだけ対策してもボスの暴走や集中攻撃で1体落ちることがあります。ブリアン（またはトリアーナ）がいることで、味方が倒れても即座に体力を平準化して復活させ、何事もなかったかのように立て直せます。\n・【代用モンスター】\nブリアン ➔ トリアーナ(風ハープ: 即死回避パッシブ＋免疫回復)、エラドリエル(風アーク)、イオヌ(光エピキオン司祭)、ミシェル(二次覚醒)\n水ホムンクルス ➔ アカムアミール、セオマルス、風ドリアード(メリア)、イエロメ\nローレン ➔ 火パンダ(雄飛: 調合星5・盾割り＋弱化解除＋持続回復で超優秀)",
    targetMemo: "【ターゲット順序】：左腕（崩壊の手）最優先 ➔ 右腕（創造の手） ➔ ボス本体。左腕を常に注視してゲージが溜まる前に落とすのが最大のコツです。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-boss-triana-melia",
    name: "【タルタロス迷宮・タルタロス(主)】トリアーナ＆メリア・火パンダ 即死回避持続パ (オート安定)",
    dungeon: "タルタロスの迷宮 (タルタロス・主)",
    dungeonCategory: "タルタロス",
    averageTime: "約2分",
    successRate: "99%",
    members: [
      { name: "トリアーナ", attribute: "風", role: "迷宮用抵抗33%UP (L)・味方即死を完全無効化＋即ターン獲得・解除免疫", runes: "暴走+意志 (速度/体力/体力 体力+25000以上)", isLeader: true },
      { name: "フラン", attribute: "光", role: "全体免疫＋攻撃バフ＋回復＋剣折り", runes: "迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "火パンダ", attribute: "火", role: "調合星5・全体持続回復＋弱化解除＋多段盾割り・剣折り・反撃", runes: "守護+守護+元気 (防御/防御/体力)", isLeader: false },
      { name: "メリア", attribute: "風", role: "毎ターン持続ダメージ＋持続延長＋ゲージダウンで本体と腕を素早く削る", runes: "絶望+集中 (速度/体力/的中)", isLeader: false },
      { name: "エマ", attribute: "水", role: "防御力バフ＋全体シールド＋強化剥がし＋ヒール", runes: "暴走+元気 (速度/体力/体力)", isLeader: false }
    ],
    turnOrder: "フラン ➔ エマ ➔ トリアーナ ➔ 火パンダ ➔ メリア",
    speedTuningMemo: "フランとエマで免疫・防御バフ・シールドを展開。トリアーナのパッシブで即死事故を未然に防止します。",
    requirementsMemo: "【トリアーナの即死耐性パッシブが最強】\n・トリアーナのパッシブがあるため、万が一左腕の即死攻撃が飛んできても味方が倒れず耐えられます。\n・火パンダとエマの防御バフ＋シールド＋持続回復が常に回り続け、メリアの持続ダメージでタルタロス本体と腕を安全確実に溶かします。",
    targetMemo: "左腕（崩壊の手） ➔ 右腕 ➔ 本体の順にターゲット。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // -------------------------------------------------------------
  // 7-5. 【ユーザー手持ち直結】迷宮の主 タルタロス (Tartarus) - 計2編成
  // -------------------------------------------------------------
  {
    id: "preset-party-tartaros-boss-bale-taranis-himmel",
    name: "【タルタロス迷宮・タルタロス(主)】バーレイグ＆タラニス・ライリー・ヒンメル・ダリオン 超鉄壁パ (手持ち直結・被ダメ40%減＆蘇生・知識特大砲)",
    dungeon: "タルタロスの迷宮 (タルタロス・主)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分50秒〜2分30秒",
    successRate: "99%",
    members: [
      { name: "バーレイグ", attribute: "火", role: "ギルバト攻撃44%UP (L) または ヒンメル / 知識5「雷神降臨」で左腕・本体を一撃粉砕", runes: "激怒+意志 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "タラニス", attribute: "風", role: "全体防御バフ＋味方蘇生(即死事故完全ゼロ)＋自己自動復活パッシブ＋挑発", runes: "暴走+意志 または 守護+守護+意志 (速度/防御/防御 防御+1400以上)", isLeader: false },
      { name: "ライリー", attribute: "風", role: "毎ターン全体ヒール＋攻撃バフ＋免疫＋弱化解除 (タルタロスのブレス完全遮断)", runes: "暴走+意志 または 迅速+元気 (速度/体力/体力 速度+90以上)", isLeader: false },
      { name: "ヒンメル", attribute: "水", role: "【味方被ダメ20%カット＆ボス特効2倍火力】全体防御バフ＋ボス特効強烈打点", runes: "激怒+刃 または 猛攻+刃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "ダリオン", attribute: "光", role: "【味方被ダメ20%カット】パッシブ常時被ダメ軽減＋確定盾割り＋攻撃弱化(剣折り)", runes: "元気+元気+反撃 または 守護+元気+反撃 (体力/体力/防御 体力+25000以上)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ ダリオン ➔ タラニス ➔ ヒンメル ➔ バーレイグ",
    speedTuningMemo: "ライリー最速（速度+90〜110）で毎ターン全体免疫と攻撃バフを供給。ダリオンが先手で左腕またはボスに盾割りと剣折りを付与。タラニスとヒンメルの防御バフが重なり、味方に大量のバフが付くことでバーレイグの知識が一瞬で5溜まり、雷神降臨を叩き込みます。",
    requirementsMemo: "【奇跡のシナジー：被ダメージ最大40%カット＋防御バフの超鉄壁】\n・ダリオンのパッシブ（味方被ダメ20%軽減）とヒンメルのパッシブ（自分以外の味方被ダメ20%軽減）が重複し、さらにタラニス＆ヒンメルの全体防御バフが合わさるため、タルタロスの激しいブレスや左腕の攻撃を受けても被ダメージが激減します！\n・ライリーが毎ターン免疫と回復を供給するため、スタンや持続ダメージも完全にシャットアウト。\n・万が一の集中攻撃で誰かが落とされても、タラニスがスキル3で即座に蘇生。タラニス自身もパッシブで自動復活するため、全滅事故の可能性が完全にゼロになります。\n・バーレイグは味方のバフ（ライリーの攻撃バフ＋免疫、タラニスの防御バフ、ヒンメルの防御バフ）で毎ターン知識が高速で溜まり、圧倒的な単体火力を連打できます。\n・【代用・調整】リーダーはバーレイグ（ギルバト攻撃44%UP）またはヒンメル。ルーンがまだ発展途上の場合はタラニス（防御44%UP）をリーダーにするとさらにカチカチになります。",
    targetMemo: "【ターゲット順序】：左腕（崩壊の手）最優先 ➔ 右腕（創造の手） ➔ ボス本体。ダリオンの盾割りが入った左腕にバーレイグの雷神降臨を当てて即座に破壊するのが最大のコツです。",
    isFavorite: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "preset-party-tartaros-boss-taranis-riley-auto",
    name: "【タルタロス迷宮・タルタロス(主)】タラニス＆ライリー・ヒンメル・ダリオン フル耐久オートパ (完全放置・安全クリア)",
    dungeon: "タルタロスの迷宮 (タルタロス・主)",
    dungeonCategory: "タルタロス",
    averageTime: "約2分30秒",
    successRate: "99%",
    members: [
      { name: "タラニス", attribute: "風", role: "ギルバト防御44%UP (L)・全体防御バフ＋味方蘇生＋自己復活", runes: "守護+守護+意志 (速度/防御/防御)", isLeader: true },
      { name: "ライリー", attribute: "風", role: "毎ターン全体免疫＋攻撃バフ＋全体回復 (デバフ完全遮断)", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "ヒンメル", attribute: "水", role: "被ダメ20%軽減パッシブ＋全体防御バフ＋ボス特効2倍火力", runes: "激怒+刃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "ダリオン", attribute: "光", role: "被ダメ20%軽減パッシブ＋スキル1確定盾割り＋スキル2剣折り", runes: "反撃+元気+元気 (体力/体力/防御)", isLeader: false },
      { name: "バーレイグ", attribute: "火", role: "知識5特大火力フィニッシャー (代用: フラン / ローレン)", runes: "猛攻+刃 または 激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ ダリオン ➔ タラニス ➔ ヒンメル ➔ バーレイグ",
    speedTuningMemo: "タラニスの防御44%UPリーダーにより、全員の防御力が底上げされ、二重被ダメカットと相まってオートでも絶対に事故りません。",
    requirementsMemo: "【完全放置・オート周回用鉄壁構成】\n・タラニス(L)の防御44%UP＋ヒンメル＆ダリオンの被ダメ各20%カットにより、タルタロス戦屈指の超耐久を実現。\n・ライリーのオート性能が極めて高く、毎ターン味方を全快させながら免疫を維持し続けます。",
    targetMemo: "左腕 ➔ 右腕 ➔ 本体の順にターゲット指定（オート放置可）。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // -------------------------------------------------------------
  // 7-6. 【ユーザー手持ち活用】水の守護者 レオス (Leos)
  // -------------------------------------------------------------
  {
    id: "preset-party-tartaros-leos-riley-taranis",
    name: "【タルタロス迷宮・レオス(水)】ライリー＆タラニス・ダリオン 風属性鉄壁免疫パ (手持ち活用・氷結完封)",
    dungeon: "タルタロスの迷宮 (レオス・水)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分50秒",
    successRate: "99%",
    members: [
      { name: "タラニス", attribute: "風", role: "ギルバト防御44%UP (L)・全体防御バフ＋万が一の蘇生保険 (有利属性)", runes: "守護+守護+意志 (速度/防御/防御)", isLeader: true },
      { name: "ライリー", attribute: "風", role: "【レオス特効】毎ターン全体免疫＋弱化解除＋攻撃バフ＋回復 (氷結完全無効)", runes: "暴走+意志 または 迅速+元気 (速度/体力/体力)", isLeader: false },
      { name: "ダリオン", attribute: "光", role: "味方被ダメ20%軽減＋スキル1確定盾割り＋スキル2剣折り", runes: "反撃+元気+元気 (体力/体力/防御)", isLeader: false },
      { name: "ヒンメル", attribute: "水", role: "味方被ダメ20%軽減＋全体防御バフ＋ボス特効2倍火力", runes: "激怒+刃 (速度/クリダメ/攻撃)", isLeader: false },
      { name: "バーレイグ", attribute: "火", role: "知識5特大単体火力 (代用: 風パンダ / アカムアミール / ルシェン)", runes: "猛攻+刃 または 激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ ダリオン ➔ タラニス ➔ ヒンメル ➔ バーレイグ",
    speedTuningMemo: "ライリーが最速で毎ターン全体免疫を展開し、レオスの「絶対零度」や「凍結の息」を完全にシャットアウト。",
    requirementsMemo: "【手持ちモンスターでレオスを完封！】\n・ライリーとタラニスはレオスに対して有利な風属性！ライリーの毎ターン免疫によりレオスの凍結・スキル延長を100%遮断します。\n・ダリオンとヒンメルの二重被ダメカット＋タラニスの防御バフでレオスの全体攻撃のダメージが劇的に低下します。\n・アタッカー枠はバーレイグでも十分高打点を出せます（調合の風イフリートやルシェンがいれば差し替えてもOK）。",
    targetMemo: "左右のルーン（凍結ルーン等）が出現したら最優先で破壊し、その後ボス本体を攻撃。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // -------------------------------------------------------------
  // 7-7. 【ユーザー手持ち活用】火の守護者 コト (Koto)
  // -------------------------------------------------------------
  {
    id: "preset-party-tartaros-koto-himmel-darion",
    name: "【タルタロス迷宮・コト(火)】ヒンメル＆ダリオン 二重被ダメ軽減耐久パ (手持ち活用・焦熱地獄耐え)",
    dungeon: "タルタロスの迷宮 (コト・火)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分45秒",
    successRate: "99%",
    members: [
      { name: "ヒンメル", attribute: "水", role: "水属性有利・ボス特効2倍火力＋味方被ダメ20%軽減＋全体防御バフ (核)", runes: "激怒+刃 または 猛攻+刃 (速度/クリダメ/攻撃)", isLeader: true },
      { name: "ダリオン", attribute: "光", role: "【コト特効】味方被ダメ20%軽減＋スキル2剣折り(攻撃弱化)で焦熱地獄の被ダメ半減！", runes: "反撃+元気+元気 (体力/体力/防御)", isLeader: false },
      { name: "ライリー", attribute: "風", role: "毎ターン全体回復＋攻撃バフ＋免疫 (持続ダメージ解除)", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "タラニス", attribute: "風", role: "全体防御バフ＋万が一の蘇生保険＋自己復活", runes: "守護+守護+意志 (速度/防御/防御)", isLeader: false },
      { name: "バーレイグ", attribute: "火", role: "高火力雷神降臨 (代用: カリン / セオマルス / ヴィゴル)", runes: "激怒+刃 (攻撃/クリダメ/攻撃)", isLeader: false }
    ],
    turnOrder: "ダリオン ➔ ライリー ➔ タラニス ➔ ヒンメル ➔ バーレイグ",
    speedTuningMemo: "ダリオンがコトにスキル2で「攻撃力弱化（剣折り）」を素早く付与。ヒンメルが水属性の有利ボーナスを活かしてボスに大ダメージを与えます。",
    requirementsMemo: "【ヒンメル＆ダリオンの二重被ダメカットで焦熱地獄を完封】\n・ダリオンのスキル2「攻撃力弱化（剣折り）」が入っていればコトの火力は半減します。\n・さらにダリオンとヒンメルのパッシブで味方全体の被ダメが約40%カットされ、焦熱地獄でも即死しません。\n・水属性のヒンメルがボス特効2倍の攻撃で安全にコトを削り切ります。",
    targetMemo: "破壊ルーン・反撃ルーンが出現したら先に処理し、コト本体を攻撃。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  },

  // -------------------------------------------------------------
  // 7-8. 【ユーザー手持ち活用】風の守護者 ギエス (Guilles)
  // -------------------------------------------------------------
  {
    id: "preset-party-tartaros-guilles-bale-riley",
    name: "【タルタロス迷宮・ギエス(風)】バーレイグ＆ライリー・ダリオン 知識砲撃パ (手持ち活用・ギエス一撃破)",
    dungeon: "タルタロスの迷宮 (ギエス・風)",
    dungeonCategory: "タルタロス",
    averageTime: "約1分20秒",
    successRate: "99%",
    members: [
      { name: "バーレイグ", attribute: "火", role: "ギルバト攻撃44%UP (L)・火属性有利！知識5「雷神降臨」でギエスに超大ダメージ", runes: "激怒+意志 または 猛攻+刃 (攻撃/クリダメ/攻撃)", isLeader: true },
      { name: "カリン", attribute: "火", role: "【ギエス特効】スキル2回復阻害(回復不可)でHP吸収完全阻止＋スキル1剣折り＋攻撃バフ", runes: "反撃+元気+元気 (速度/体力/防御)", isLeader: false },
      { name: "ライリー", attribute: "風", role: "毎ターン全体免疫＋攻撃バフ＋回復 (バーレイグの知識蓄積に貢献)", runes: "暴走+意志 (速度/体力/体力)", isLeader: false },
      { name: "ダリオン", attribute: "光", role: "味方被ダメ20%軽減＋確定盾割り＋攻撃弱化(剣折り)", runes: "反撃+元気+元気 (体力/体力/防御)", isLeader: false },
      { name: "タラニス", attribute: "風", role: "全体防御バフ＋蘇生保険＋自己復活 (代用: ヒンメル / 火パンダ)", runes: "守護+守護+意志 (速度/防御/防御)", isLeader: false }
    ],
    turnOrder: "ライリー ➔ ダリオン ➔ カリン ➔ タラニス ➔ バーレイグ",
    speedTuningMemo: "ライリーとタラニスでバフを展開（バーレイグの知識が一気に蓄積）。カリンが回復不可を付与し、ダリオンの盾割りが乗ったギエスにバーレイグが雷神降臨を直撃させます。",
    requirementsMemo: "【火属性バーレイグの知識超火力でギエスを瞬殺！】\n・ギエスは風属性のため、火属性のバーレイグにとって完全な有利属性（クリ率+15%ボーナス・被ダメ減少）。\n・カリン（星2・入手容易）のスキル2で回復阻害を入れておけば、ギエスのHP吸収をシャットアウト可能。\n・ライリーとタラニスのバフでバーレイグの知識が毎ターン自動で5溜まるため、雷神降臨の圧倒的な瞬間火力でギエスのHPを一瞬で消し飛ばせます。",
    targetMemo: "吸血ルーン・絶望ルーンが出現したら速やかに破壊し、ギエス本体に雷神降臨を叩き込みます。",
    isFavorite: false,
    updatedAt: new Date().toISOString()
  }
];

// 2. 状態管理
let monsters = [];
let parties = [];
let activeTab = 'all'; // 'all', 'guild', 'cairos', 'form'
let cairosSubtab = 'party'; // 'party', 'monsters'
let attributeFilter = 'all'; // 'all', '火', '水', '風', '光', '闇'
let dungeonFilter = 'all'; // 'all', 'タルタロス', '巨人', 'ドラゴン', '死のダンジョン', '精霊', '鋼鉄', '審判'
let searchQuery = '';
let currentEditId = null;
let currentPartyEditId = null;
let currentPartyDetailId = null;

// 3. セレクターキャッシュ
const elements = {
  navListItems: document.querySelectorAll('.nav-item'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  searchFilterArea: document.getElementById('search-filter-area'),
  searchInput: document.getElementById('search-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  attrBtns: document.querySelectorAll('.attr-btn'),
  
  monsterListAll: document.getElementById('monster-list-all'),
  monsterListGuild: document.getElementById('monster-list-guild'),
  monsterListCairos: document.getElementById('monster-list-cairos'),
  
  monsterCount: document.getElementById('monster-count'),
  guildCount: document.getElementById('guild-count'),
  cairosCount: document.getElementById('cairos-count'),
  
  btnResetPreset: document.getElementById('btn-reset-preset'),
  toastContainer: document.getElementById('toast-container'),
  
  // モンスターフォーム
  monsterForm: document.getElementById('monster-form'),
  formTitle: document.getElementById('form-title'),
  formId: document.getElementById('form-monster-id'),
  formName: document.getElementById('form-name'),
  formAttribute: document.getElementById('form-attribute'),
  formStars: document.getElementById('form-stars'),
  formRole: document.getElementById('form-role'),
  formRunes: document.getElementById('form-runes'),
  formGuildMemo: document.getElementById('form-guild'),
  formCairosMemo: document.getElementById('form-cairos'),
  formGeneralMemo: document.getElementById('form-general'),
  formFavorite: document.getElementById('form-favorite'),
  btnCancelForm: document.getElementById('btn-cancel-form'),
  
  // モンスター詳細モーダル
  detailModal: document.getElementById('detail-modal'),
  modalClose: document.getElementById('modal-close'),
  modalAttrBadge: document.getElementById('modal-attr-badge'),
  modalMonsterName: document.getElementById('modal-monster-name'),
  modalMonsterStars: document.getElementById('modal-monster-stars'),
  modalRole: document.getElementById('modal-role'),
  modalRunes: document.getElementById('modal-runes'),
  modalGuildMemo: document.getElementById('modal-guild-memo'),
  modalCairosMemo: document.getElementById('modal-cairos-memo'),
  modalGeneralMemo: document.getElementById('modal-general-memo'),
  modalBtnDelete: document.getElementById('modal-btn-delete'),
  modalBtnEdit: document.getElementById('modal-btn-edit'),
  
  modalSectionGuild: document.getElementById('modal-section-guild'),
  modalSectionCairos: document.getElementById('modal-section-cairos'),
  modalSectionGeneral: document.getElementById('modal-section-general'),

  // カイロス周回パーティ関連
  btnSubnavParty: document.getElementById('btn-subnav-party'),
  btnSubnavMonsters: document.getElementById('btn-subnav-monsters'),
  cairosSubpaneParty: document.getElementById('cairos-subpane-party'),
  cairosSubpaneMonsters: document.getElementById('cairos-subpane-monsters'),
  partyCount: document.getElementById('party-count'),
  partyListCairos: document.getElementById('party-list-cairos'),
  btnAddParty: document.getElementById('btn-add-party'),
  dungeonFilterArea: document.getElementById('dungeon-filter-area'),
  dungeonBtns: document.querySelectorAll('.dungeon-btn'),

  // パーティ詳細モーダル
  partyDetailModal: document.getElementById('party-detail-modal'),
  partyModalClose: document.getElementById('party-modal-close'),
  modalPartyDungeon: document.getElementById('modal-party-dungeon'),
  modalPartyTime: document.getElementById('modal-party-time'),
  modalPartyRate: document.getElementById('modal-party-rate'),
  modalPartyName: document.getElementById('modal-party-name'),
  modalPartyMembers: document.getElementById('modal-party-members'),
  modalSectionPartyTurn: document.getElementById('modal-section-party-turn'),
  modalPartyTurnOrder: document.getElementById('modal-party-turn-order'),
  modalSectionPartySpeed: document.getElementById('modal-section-party-speed'),
  modalPartySpeedMemo: document.getElementById('modal-party-speed-memo'),
  modalSectionPartyReq: document.getElementById('modal-section-party-req'),
  modalPartyReqMemo: document.getElementById('modal-party-req-memo'),
  modalSectionPartyTarget: document.getElementById('modal-section-party-target'),
  modalPartyTargetMemo: document.getElementById('modal-party-target-memo'),
  modalPartyBtnDelete: document.getElementById('modal-party-btn-delete'),
  modalPartyBtnEdit: document.getElementById('modal-party-btn-edit'),

  // パーティフォームモーダル
  partyFormModal: document.getElementById('party-form-modal'),
  partyFormTitle: document.getElementById('party-form-title'),
  partyFormClose: document.getElementById('party-form-close'),
  partyForm: document.getElementById('party-form'),
  formPartyId: document.getElementById('form-party-id'),
  formPartyName: document.getElementById('form-party-name'),
  formPartyDungeon: document.getElementById('form-party-dungeon'),
  formPartyTime: document.getElementById('form-party-time'),
  formPartyRate: document.getElementById('form-party-rate'),
  formPartyFavorite: document.getElementById('form-party-favorite'),
  formPartyTurn: document.getElementById('form-party-turn'),
  formPartySpeed: document.getElementById('form-party-speed'),
  formPartyReq: document.getElementById('form-party-req'),
  formPartyTarget: document.getElementById('form-party-target'),
  btnPartyFormCancel: document.getElementById('btn-party-form-cancel'),

  // データ同期・保存関連
  btnOpenSync: document.getElementById('btn-open-sync'),
  syncModal: document.getElementById('sync-modal'),
  syncModalClose: document.getElementById('sync-modal-close'),
  syncCountMonsters: document.getElementById('sync-count-monsters'),
  syncCountParties: document.getElementById('sync-count-parties'),
  btnCopySyncCode: document.getElementById('btn-copy-sync-code'),
  btnDownloadBackup: document.getElementById('btn-download-backup'),
  syncInputCode: document.getElementById('sync-input-code'),
  btnApplySyncReplace: document.getElementById('btn-apply-sync-replace'),
  btnApplySyncMerge: document.getElementById('btn-apply-sync-merge'),
  syncFileInput: document.getElementById('sync-file-input'),
  btnTriggerFileInput: document.getElementById('btn-trigger-file-input'),

  // タルタロスの迷宮 クイックバナー
  bannerGoTartaros: document.getElementById('banner-go-tartaros')
};

// 4. アプリ起動処理
window.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

// アプリの初期化
function initApp() {
  // モンスターデータのロード
  const localData = localStorage.getItem('summoners_war_manager_data');
  if (localData) {
    try {
      monsters = JSON.parse(localData);

      // PRESET_MONSTERSの全モンスターをチェックして未登録なら自動追加
      PRESET_MONSTERS.forEach(preset => {
        if (!monsters.some(m => m.id === preset.id)) {
          monsters.push(preset);
          saveToLocalStorage();
        }
      });

      // シャイナのリーダースキル更新パッチ（的中 ➔ 攻撃力33%UP）
      const curShaina = monsters.find(m => m.id === "preset-fire-shaina" || m.name.includes("シャイナ"));
      if (curShaina && curShaina.role && curShaina.role.includes("的中")) {
        const newShaina = PRESET_MONSTERS.find(m => m.id === "preset-fire-shaina");
        if (newShaina) {
          curShaina.role = newShaina.role;
          curShaina.cairosMemo = newShaina.cairosMemo;
          curShaina.generalMemo = newShaina.generalMemo;
          saveToLocalStorage();
        }
      }
    } catch (e) {
      console.error('Failed to parse local storage data, resetting with presets', e);
      monsters = [...PRESET_MONSTERS];
      saveToLocalStorage();
    }
  } else {
    monsters = [...PRESET_MONSTERS];
    saveToLocalStorage();
  }

  // パーティデータのロード
  const localPartyData = localStorage.getItem('summoners_war_party_data');
  if (localPartyData) {
    try {
      parties = JSON.parse(localPartyData);

      // 新パーティ（ヒンメル軸、ルシェン軸など）への自動マイグレーション
      let updated = false;

      // 1. ヒンメル軸パーティの追加
      if (!parties.some(p => p.id === "preset-party-giants-abyss-himmel")) {
        const himmelParty = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-himmel");
        if (himmelParty) {
          parties.unshift(himmelParty);
          updated = true;
        }
      } else {
        // 既存ヒンメル軸の攻略ヒント・メモを最新化
        const curHimmel = parties.find(p => p.id === "preset-party-giants-abyss-himmel");
        const newHimmel = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-himmel");
        if (curHimmel && newHimmel && curHimmel.requirementsMemo !== newHimmel.requirementsMemo) {
          curHimmel.requirementsMemo = newHimmel.requirementsMemo;
          curHimmel.speedTuningMemo = newHimmel.speedTuningMemo;
          curHimmel.averageTime = newHimmel.averageTime;
          curHimmel.turnOrder = newHimmel.turnOrder;
          updated = true;
        }
      }

      // 1.5. アカムアミール＆ヒンメル軸パーティの追加（1分切り安定型）
      if (!parties.some(p => p.id === "preset-party-giants-abyss-amir-himmel")) {
        const amirHimmelParty = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-amir-himmel");
        if (amirHimmelParty) {
          const himmelIdx = parties.findIndex(p => p.id === "preset-party-giants-abyss-himmel");
          if (himmelIdx !== -1) {
            parties.splice(himmelIdx + 1, 0, amirHimmelParty);
          } else {
            parties.unshift(amirHimmelParty);
          }
          updated = true;
        }
      }

      // 2. ルシェン＆シャーマン軸パーティの追加
      if (!parties.some(p => p.id === "preset-party-giants-abyss-lushen-shaman")) {
        const lushenParty = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-lushen-shaman");
        if (lushenParty) {
          parties.splice(2, 0, lushenParty);
          updated = true;
        }
      }

      // 3. アカムアミール軸パーティの追加
      if (!parties.some(p => p.id === "preset-party-giants-abyss-f2p-amir")) {
        const amirParty = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-f2p-amir");
        if (amirParty) {
          parties.splice(2, 0, amirParty);
          updated = true;
        }
      }

      // 4. 旧テシャールパーティがあればジュリー＆リン軸に置換
      const tesharIdx = parties.findIndex(p => p.id === "preset-party-giants-abyss-speed" && (p.name.includes("テシャール") || (p.members && p.members.some(m => m.name.includes("テシャール")))));
      if (tesharIdx !== -1) {
        const speedParty = PRESET_PARTIES.find(p => p.id === "preset-party-giants-abyss-speed");
        if (speedParty) {
          parties[tesharIdx] = speedParty;
          updated = true;
        }
      }

      // 5. 死ダン新パーティ（セレン最速パ、双子パ、カリンF2Pパ）の追加
      if (!parties.some(p => p.id === "preset-party-necro-abyss-seren")) {
        const serenParty = PRESET_PARTIES.find(p => p.id === "preset-party-necro-abyss-seren");
        if (serenParty) {
          parties.push(serenParty);
          updated = true;
        }
      }
      if (!parties.some(p => p.id === "preset-party-necro-abyss-twins")) {
        const twinsParty = PRESET_PARTIES.find(p => p.id === "preset-party-necro-abyss-twins");
        if (twinsParty) {
          parties.push(twinsParty);
          updated = true;
        }
      }
      if (!parties.some(p => p.id === "preset-party-necro-abyss-f2p-colleen")) {
        const colleenParty = PRESET_PARTIES.find(p => p.id === "preset-party-necro-abyss-f2p-colleen");
        if (colleenParty) {
          parties.push(colleenParty);
          updated = true;
        }
      }

      // 5.5. 審判ダンジョン最速25秒パ（シャイナ＆ブメチャク＋ジーク・ジュリー速攻パ）の追加
      if (!parties.some(p => p.id === "preset-party-punishers-crypt-shaina-twins")) {
        const shainaParty = PRESET_PARTIES.find(p => p.id === "preset-party-punishers-crypt-shaina-twins");
        if (shainaParty) {
          const firstPunisherIdx = parties.findIndex(p => p.dungeonCategory === '審判' || (p.dungeon && p.dungeon.includes('審判')));
          if (firstPunisherIdx !== -1) {
            parties.splice(firstPunisherIdx, 0, shainaParty);
          } else {
            parties.unshift(shainaParty);
          }
          updated = true;
        }
      }

      // 5.8. タルタロスの迷宮 4大ボス攻略パーティ（計13編成・手持ち直結型含む）の追加・最新化
      PRESET_PARTIES.filter(p => p.dungeonCategory === 'タルタロス').forEach(preset => {
        const curIdx = parties.findIndex(p => p.id === preset.id);
        if (curIdx === -1) {
          parties.push(preset);
          updated = true;
        } else {
          if (parties[curIdx].requirementsMemo !== preset.requirementsMemo) {
            parties[curIdx].requirementsMemo = preset.requirementsMemo;
            parties[curIdx].speedTuningMemo = preset.speedTuningMemo;
            parties[curIdx].targetMemo = preset.targetMemo;
            parties[curIdx].turnOrder = preset.turnOrder;
            parties[curIdx].members = preset.members;
            updated = true;
          }
        }
      });

      // 6. 全ダンジョンの追加プリセット（ドラゴン、精霊、鋼鉄、審判など）の自動同期
      PRESET_PARTIES.forEach(preset => {
        if (!parties.some(p => p.id === preset.id)) {
          parties.push(preset);
          updated = true;
        }
      });

      // 7. フリルレアのリーダースキル・スキル誤記の自動修正（既存LocalStorageデータへのパッチ）
      parties.forEach(p => {
        if (p.members && Array.isArray(p.members)) {
          p.members.forEach(m => {
            if (m.name === 'フリルレア') {
              if (m.isLeader) {
                m.isLeader = false;
                updated = true;
              }
              if (m.role && (m.role.includes('全体盾割り') || m.role.includes('攻撃弱化') || m.role.includes('速度リーダー') || m.role.includes('攻撃バフ'))) {
                if (m.role.includes('LSなし')) {
                  m.role = '最速単体盾割り (ボス戦縦割り・LSなし)';
                } else if (m.role.includes('必須')) {
                  m.role = '最速単体盾割り (ボス開幕確定縦割り・的中45%+必須)';
                } else if (m.role.includes('的中45%+')) {
                  m.role = '最速単体盾割り (ボス開幕確定縦割り・的中45%+)';
                } else {
                  m.role = '最速単体盾割り (ボス開幕確定縦割り)';
                }
                updated = true;
              }
            }
          });
          // ヒンメル軸の場合、ルシェンをリーダーに設定
          if (p.id === 'preset-party-giants-abyss-himmel') {
            const lushen = p.members.find(m => m.name === 'ルシェン');
            if (lushen && !lushen.isLeader) {
              lushen.isLeader = true;
              lushen.role = "ダンジョン攻撃力33%UP (L)・切断で道中殲滅";
              updated = true;
            }
          }

          // 審判のダンジョン シャイナ軸パーティのリーダースキル・攻略メモの最新化
          if (p.id === 'preset-party-punishers-crypt-shaina-twins') {
            const shaina = p.members.find(m => m.name === 'シャイナ');
            if (shaina && shaina.role && shaina.role.includes('的中')) {
              shaina.role = "ダンジョン攻撃力33%UP (L)・全体スタン・防御弱化・ブメチャク連携";
              updated = true;
            }
            const presetShainaParty = PRESET_PARTIES.find(pr => pr.id === 'preset-party-punishers-crypt-shaina-twins');
            if (presetShainaParty) {
              if (p.requirementsMemo !== presetShainaParty.requirementsMemo) {
                p.requirementsMemo = presetShainaParty.requirementsMemo;
                updated = true;
              }
              const sieq = p.members.find(m => m.name === 'ジーク');
              if (sieq && presetShainaParty.members[4] && sieq.runes !== presetShainaParty.members[4].runes) {
                sieq.runes = presetShainaParty.members[4].runes;
                updated = true;
              }
              const sabrina = p.members.find(m => m.name === 'サブリナ');
              if (sabrina && presetShainaParty.members[2] && sabrina.runes !== presetShainaParty.members[2].runes) {
                sabrina.runes = presetShainaParty.members[2].runes;
                updated = true;
              }
            }
          }
        }
      });

      if (updated) {
        savePartiesToLocalStorage();
      }
    } catch (e) {
      console.error('Failed to parse party data, resetting with presets', e);
      parties = [...PRESET_PARTIES];
      savePartiesToLocalStorage();
    }
  } else {
    parties = [...PRESET_PARTIES];
    savePartiesToLocalStorage();
    showToast('カイロス周回パーティ初期データを読み込みました！');
  }
  
  sortMonsters();
  sortParties();
  renderAll();
}

function sortParties() {
  parties.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

function savePartiesToLocalStorage() {
  localStorage.setItem('summoners_war_party_data', JSON.stringify(parties));
}

// データのソート (お気に入り優先、その中で最終更新の新しい順)
function sortMonsters() {
  monsters.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

function saveToLocalStorage() {
  localStorage.setItem('summoners_war_manager_data', JSON.stringify(monsters));
}

// トースト通知を表示
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🛡️</span><span>${escapeHtml(message)}</span>`;
  elements.toastContainer.appendChild(toast);
  
  // 3秒後に削除
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// HTMLエスケープ処理 (XSS対策)
function escapeHtml(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[&<>"']/g, function(match) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[match];
  });
}

// 5. UI描画ロジック
function renderAll() {
  renderMonsterList('all', elements.monsterListAll, elements.monsterCount);
  renderMonsterList('guild', elements.monsterListGuild, elements.guildCount);
  renderMonsterList('cairos', elements.monsterListCairos, elements.cairosCount);
  renderParties();
}

// リストの描画
function renderMonsterList(type, containerElement, countElement) {
  containerElement.innerHTML = '';
  
  // フィルタリング処理
  const filtered = monsters.filter(monster => {
    // 1. 属性フィルター
    if (attributeFilter !== 'all' && monster.attribute !== attributeFilter) {
      return false;
    }
    
    // 2. タブごとの特化フィルター
    if (type === 'guild' && (!monster.guildMemo || monster.guildMemo.trim() === '')) {
      return false;
    }
    if (type === 'cairos' && (!monster.cairosMemo || monster.cairosMemo.trim() === '')) {
      return false;
    }
    
    // 3. 検索キーワードフィルター
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = monster.name.toLowerCase().includes(q);
      const roleMatch = (monster.role || '').toLowerCase().includes(q);
      const guildMatch = (monster.guildMemo || '').toLowerCase().includes(q);
      const cairosMatch = (monster.cairosMemo || '').toLowerCase().includes(q);
      const generalMatch = (monster.generalMemo || '').toLowerCase().includes(q);
      const runeMatch = (monster.recommendedRunes || '').toLowerCase().includes(q);
      
      return nameMatch || roleMatch || guildMatch || cairosMatch || generalMatch || runeMatch;
    }
    
    return true;
  });
  
  // 件数表示
  countElement.textContent = filtered.length;
  
  if (filtered.length === 0) {
    containerElement.appendChild(createEmptyState());
    return;
  }
  
  // カードを生成して挿入
  filtered.forEach(monster => {
    containerElement.appendChild(createMonsterCard(monster));
  });
}

// 空状態のUIを生成
function createEmptyState() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <div class="empty-icon">📂</div>
    <p>該当するモンスターが見つかりませんでした。</p>
  `;
  return div;
}

// モンスターカードHTMLを生成
function createMonsterCard(monster) {
  const card = document.createElement('div');
  card.className = `monster-card attr-${monster.attribute}`;
  card.dataset.id = monster.id;
  
  // ギルド/カイロスメモが存在するかのインジケータ判定
  const hasGuild = monster.guildMemo && monster.guildMemo.trim() !== '';
  const hasCairos = monster.cairosMemo && monster.cairosMemo.trim() !== '';
  const hasGeneral = monster.generalMemo && monster.generalMemo.trim() !== '';
  
  // 星の表示
  const starString = '★'.repeat(parseInt(monster.stars || 5));
  
  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">
        <span class="card-name">${escapeHtml(monster.name)}</span>
        <span class="card-stars">${starString}</span>
      </div>
      <span class="attr-badge attr-${monster.attribute}">${monster.attribute}</span>
    </div>
    <div class="card-body">
      <div class="card-role">${escapeHtml(monster.role || '役割未設定')}</div>
      ${monster.recommendedRunes ? `<div class="card-runes">${escapeHtml(monster.recommendedRunes)}</div>` : ''}
    </div>
    <div class="card-footer">
      <div class="card-indicators">
        <span class="indicator-icon ${hasGuild ? '' : 'inactive'}" title="ギルド対策あり">🛡️</span>
        <span class="indicator-icon ${hasCairos ? '' : 'inactive'}" title="カイロス周回メモあり">🐉</span>
        <span class="indicator-icon ${hasGeneral ? '' : 'inactive'}" title="全般メモあり">📝</span>
      </div>
      <div class="favorite-btn ${monster.isFavorite ? 'active' : ''}" data-fav-id="${monster.id}">★</div>
    </div>
  `;
  
  // カード全体のクリックイベント（詳細モーダル起動）
  card.addEventListener('click', (e) => {
    // お気に入りボタンのクリック時は詳細を開かないようにする
    if (e.target.classList.contains('favorite-btn')) {
      return;
    }
    openDetailModal(monster.id);
  });
  
  // お気に入りトグルイベント
  const favBtn = card.querySelector('.favorite-btn');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(monster.id);
  });
  
  return card;
}

// お気に入りのトグル
function toggleFavorite(id) {
  const monster = monsters.find(m => m.id === id);
  if (monster) {
    monster.isFavorite = !monster.isFavorite;
    monster.updatedAt = new Date().toISOString();
    sortMonsters();
    saveToLocalStorage();
    renderAll();
    showToast(monster.isFavorite ? `${monster.name} をお気に入りに登録しました` : `${monster.name} のお気に入りを解除しました`);
  }
}

// -----------------------------------------------------------------------------
// 5-2. カイロス周回パーティ 描画・操作ロジック
// -----------------------------------------------------------------------------

// 周回パーティ一覧の描画
function renderParties() {
  if (!elements.partyListCairos) return;
  elements.partyListCairos.innerHTML = '';

  const filtered = parties.filter(party => {
    // 1. ダンジョン別フィルター
    if (dungeonFilter !== 'all') {
      const matchCategory = party.dungeonCategory === dungeonFilter;
      const matchDungeonName = (party.dungeon || '').includes(dungeonFilter);
      if (!matchCategory && !matchDungeonName) {
        return false;
      }
    }

    // 2. 検索キーワードフィルター
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = (party.name || '').toLowerCase().includes(q);
      const dungeonMatch = (party.dungeon || '').toLowerCase().includes(q);
      const turnMatch = (party.turnOrder || '').toLowerCase().includes(q);
      const speedMatch = (party.speedTuningMemo || '').toLowerCase().includes(q);
      const reqMatch = (party.requirementsMemo || '').toLowerCase().includes(q);
      const targetMatch = (party.targetMemo || '').toLowerCase().includes(q);
      const memberMatch = party.members && party.members.some(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.role || '').toLowerCase().includes(q) ||
        (m.runes || '').toLowerCase().includes(q)
      );

      return nameMatch || dungeonMatch || turnMatch || speedMatch || reqMatch || targetMatch || memberMatch;
    }

    return true;
  });

  if (elements.partyCount) {
    elements.partyCount.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    elements.partyListCairos.appendChild(createPartyEmptyState());
    return;
  }

  filtered.forEach(party => {
    elements.partyListCairos.appendChild(createPartyCard(party));
  });
}

// パーティ空状態UI
function createPartyEmptyState() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  const hasFilter = (searchQuery && searchQuery.trim() !== '') || dungeonFilter !== 'all';

  if (hasFilter) {
    div.innerHTML = `
      <div class="empty-icon">🔍</div>
      <p style="font-weight: 600; color: #fff; margin-bottom: 6px;">条件に一致する周回パーティがありません</p>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">
        ${searchQuery ? `検索ワード: 「${escapeHtml(searchQuery)}」 ` : ''}
        ${dungeonFilter !== 'all' ? `ダンジョン: 「${escapeHtml(dungeonFilter)}」` : ''} で絞り込み中です。
      </p>
      <button class="btn btn-primary btn-sm" id="btn-reset-party-filters" style="margin-bottom: 10px;">
        🔄 検索・絞り込みをすべて解除して全件表示
      </button>
    `;
    setTimeout(() => {
      const btnReset = div.querySelector('#btn-reset-party-filters');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          elements.searchInput.value = '';
          searchQuery = '';
          elements.btnClearSearch.style.display = 'none';
          dungeonFilter = 'all';
          if (elements.dungeonBtns) {
            elements.dungeonBtns.forEach(b => {
              if (b.dataset.dungeon === 'all') b.classList.add('active');
              else b.classList.remove('active');
            });
          }
          renderParties();
          showToast('検索・絞り込みを解除し、全パーティを表示しました');
        });
      }
    }, 0);
  } else {
    div.innerHTML = `
      <div class="empty-icon">⚔️</div>
      <p>登録されている周回パーティがありません。</p>
      <button class="btn btn-primary" onclick="openPartyForm()" style="margin-top: 8px;">＋ 新規パーティを作成</button>
    `;
  }
  return div;
}

// パーティカードHTML生成
function createPartyCard(party) {
  const card = document.createElement('div');
  card.className = `party-card dungeon-${party.dungeonCategory || 'other'}`;
  card.dataset.id = party.id;

  const hasAnyLeaderFlag = (party.members || []).some(member => typeof member.isLeader === 'boolean');

  // メンバー5体のチップHTML
  const membersHtml = (party.members || []).map((m, idx) => {
    const isLeader = hasAnyLeaderFlag ? Boolean(m.isLeader) : (idx === 0);
    const attr = m.attribute || '風';
    return `
      <div class="party-member-chip" title="${escapeHtml(m.name)} (${escapeHtml(attr)}) - ${escapeHtml(m.role || '')}">
        <div class="party-chip-icon attr-${attr}">
          ${escapeHtml(attr)}
          ${isLeader ? '<span class="party-chip-leader-crown" title="リーダー">👑</span>' : ''}
        </div>
        <span class="party-chip-name">${escapeHtml(m.name || '未設定')}</span>
        <span class="party-chip-role">${escapeHtml(m.role || '')}</span>
      </div>
    `;
  }).join('');

  // 行動順フロー
  const turnOrderHtml = party.turnOrder ? `
    <div class="party-turn-order">
      <span class="turn-label">⚡ 順</span>
      <span class="turn-sequence">${escapeHtml(party.turnOrder)}</span>
    </div>
  ` : '';

  // メモプレビュー
  const notePreview = party.speedTuningMemo || party.requirementsMemo || party.targetMemo || '';

  card.innerHTML = `
    <div class="party-header">
      <div class="party-title-wrap">
        <div class="party-tags-row">
          <span class="party-dungeon-badge bg-${party.dungeonCategory || 'other'}">${escapeHtml(party.dungeon || 'ダンジョン')}</span>
          ${party.averageTime ? `<span class="party-meta-pill">⏱️ ${escapeHtml(party.averageTime)}</span>` : ''}
          ${party.successRate ? `<span class="party-meta-pill winrate">🏆 ${escapeHtml(party.successRate)}</span>` : ''}
        </div>
        <h3 class="party-name">${escapeHtml(party.name)}</h3>
      </div>
      <div class="favorite-btn ${party.isFavorite ? 'active' : ''}" data-party-fav-id="${party.id}">★</div>
    </div>

    <!-- 5体モンスター行 -->
    <div class="party-monsters-row">
      ${membersHtml}
    </div>

    <!-- 推奨行動順 -->
    ${turnOrderHtml}

    <!-- 要件・速度調整メモプレビュー -->
    ${notePreview ? `<div class="party-notes-preview">📝 ${escapeHtml(notePreview)}</div>` : ''}

    <div class="party-footer">
      <span class="party-updated">${party.members ? `${party.members.length}体編成` : ''}</span>
      <span class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">詳細・編集 ❯</span>
    </div>
  `;

  // カードクリックで詳細モーダル表示
  card.addEventListener('click', (e) => {
    if (e.target.closest('.favorite-btn')) return;
    openPartyDetailModal(party.id);
  });

  // お気に入りトグル
  const favBtn = card.querySelector('.favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePartyFavorite(party.id);
    });
  }

  return card;
}

// パーティお気に入りトグル
function togglePartyFavorite(id) {
  const party = parties.find(p => p.id === id);
  if (party) {
    party.isFavorite = !party.isFavorite;
    party.updatedAt = new Date().toISOString();
    sortParties();
    savePartiesToLocalStorage();
    renderParties();
    showToast(party.isFavorite ? `「${party.name}」をお気に入りに登録しました` : `「${party.name}」のお気に入りを解除しました`);
  }
}

// パーティ詳細モーダルを開く
function openPartyDetailModal(id) {
  const party = parties.find(p => p.id === id);
  if (!party) return;

  currentPartyDetailId = id;

  elements.modalPartyDungeon.textContent = party.dungeon || 'ダンジョン';
  elements.modalPartyDungeon.className = `party-dungeon-badge bg-${party.dungeonCategory || 'other'}`;
  elements.modalPartyTime.textContent = party.averageTime ? `⏱️ ${party.averageTime}` : '⏱️ 目安なし';
  elements.modalPartyRate.textContent = party.successRate ? `🏆 ${party.successRate}` : '🏆 勝率未設定';
  elements.modalPartyName.textContent = party.name;

  // メンバー5体カード描画
  elements.modalPartyMembers.innerHTML = '';
  const hasAnyLeaderFlagModal = (party.members || []).some(member => typeof member.isLeader === 'boolean');
  (party.members || []).forEach((m, idx) => {
    const isLeader = hasAnyLeaderFlagModal ? Boolean(m.isLeader) : (idx === 0);
    const attr = m.attribute || '風';
    const memberCard = document.createElement('div');
    memberCard.className = `party-modal-member-card ${isLeader ? 'is-leader' : ''}`;
    memberCard.innerHTML = `
      <div class="modal-member-info">
        <div class="party-chip-icon attr-${attr}" style="width: 32px; height: 32px; font-size: 0.7rem;">
          ${escapeHtml(attr)}
        </div>
        <div>
          <div class="modal-member-name">
            ${escapeHtml(m.name || `モンスター ${idx + 1}`)}
            ${isLeader ? '<span class="badge-leader">LEADER</span>' : ''}
          </div>
          <div class="modal-member-role">${escapeHtml(m.role || '役割未設定')}</div>
        </div>
      </div>
      <div class="modal-member-runes">${escapeHtml(m.runes || 'ルーン未指定')}</div>
    `;
    elements.modalPartyMembers.appendChild(memberCard);
  });

  // 行動順
  if (party.turnOrder && party.turnOrder.trim()) {
    elements.modalPartyTurnOrder.textContent = party.turnOrder;
    elements.modalSectionPartyTurn.style.display = 'block';
  } else {
    elements.modalSectionPartyTurn.style.display = 'none';
  }

  // 速度調整メモ
  if (party.speedTuningMemo && party.speedTuningMemo.trim()) {
    elements.modalPartySpeedMemo.textContent = party.speedTuningMemo;
    elements.modalSectionPartySpeed.style.display = 'block';
  } else {
    elements.modalSectionPartySpeed.style.display = 'none';
  }

  // 周回要件
  if (party.requirementsMemo && party.requirementsMemo.trim()) {
    elements.modalPartyReqMemo.textContent = party.requirementsMemo;
    elements.modalSectionPartyReq.style.display = 'block';
  } else {
    elements.modalSectionPartyReq.style.display = 'none';
  }

  // ターゲット・立ち回り
  if (party.targetMemo && party.targetMemo.trim()) {
    elements.modalPartyTargetMemo.textContent = party.targetMemo;
    elements.modalSectionPartyTarget.style.display = 'block';
  } else {
    elements.modalSectionPartyTarget.style.display = 'none';
  }

  elements.partyDetailModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePartyDetailModal() {
  elements.partyDetailModal.style.display = 'none';
  document.body.style.overflow = '';
}

// パーティ編集フォームを開く
function openPartyForm(id = null) {
  currentPartyEditId = id;
  const isEdit = Boolean(id);

  elements.partyForm.reset();
  document.getElementById('error-party-name').style.display = 'none';
  elements.formPartyName.classList.remove('error');

  if (isEdit) {
    const party = parties.find(p => p.id === id);
    if (!party) return;

    elements.partyFormTitle.textContent = '周回パーティを編集';
    elements.formPartyId.value = party.id;
    elements.formPartyName.value = party.name || '';
    elements.formPartyDungeon.value = party.dungeon || '巨人ダンジョン (深淵Hard)';
    elements.formPartyTime.value = party.averageTime || '';
    elements.formPartyRate.value = party.successRate || '';
    elements.formPartyFavorite.checked = party.isFavorite || false;
    elements.formPartyTurn.value = party.turnOrder || '';
    elements.formPartySpeed.value = party.speedTuningMemo || '';
    elements.formPartyReq.value = party.requirementsMemo || '';
    elements.formPartyTarget.value = party.targetMemo || '';

    // メンバー1〜5
    (party.members || []).forEach((m, idx) => {
      const num = idx + 1;
      if (num <= 5) {
        const nameInput = document.getElementById(`form-m${num}-name`);
        const attrSelect = document.getElementById(`form-m${num}-attr`);
        const roleInput = document.getElementById(`form-m${num}-role`);
        const runesInput = document.getElementById(`form-m${num}-runes`);
        if (nameInput) nameInput.value = m.name || '';
        if (attrSelect) attrSelect.value = m.attribute || '風';
        if (roleInput) roleInput.value = m.role || '';
        if (runesInput) runesInput.value = m.runes || '';
      }
    });
  } else {
    elements.partyFormTitle.textContent = '周回パーティ新規登録';
    elements.formPartyId.value = '';
    elements.formPartyDungeon.value = '巨人ダンジョン (深淵Hard)';
  }

  elements.partyFormModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePartyForm() {
  elements.partyFormModal.style.display = 'none';
  document.body.style.overflow = '';
}

// パーティフォーム送信処理
function handlePartyFormSubmit(e) {
  e.preventDefault();
  const partyName = elements.formPartyName.value.trim();

  if (!partyName) {
    document.getElementById('error-party-name').style.display = 'block';
    elements.formPartyName.classList.add('error');
    elements.formPartyName.focus();
    return;
  }

  const dungeon = elements.formPartyDungeon.value;
  let dungeonCategory = 'other';
  if (dungeon.includes('巨人')) dungeonCategory = '巨人';
  else if (dungeon.includes('ドラゴン')) dungeonCategory = 'ドラゴン';
  else if (dungeon.includes('死のダンジョン')) dungeonCategory = '死のダンジョン';
  else if (dungeon.includes('精霊')) dungeonCategory = '精霊';
  else if (dungeon.includes('鋼鉄')) dungeonCategory = '鋼鉄';
  else if (dungeon.includes('審判')) dungeonCategory = '審判';
  else if (dungeon.includes('タルタロス') || dungeon.includes('迷宮')) dungeonCategory = 'タルタロス';

  // メンバー5体の収集
  const members = [];
  for (let i = 1; i <= 5; i++) {
    const name = (document.getElementById(`form-m${i}-name`).value || '').trim();
    const attr = document.getElementById(`form-m${i}-attr`).value;
    const role = (document.getElementById(`form-m${i}-role`).value || '').trim();
    const runes = (document.getElementById(`form-m${i}-runes`).value || '').trim();

    if (name) {
      members.push({
        name: name,
        attribute: attr,
        role: role,
        runes: runes,
        isLeader: i === 1
      });
    }
  }

  const id = elements.formPartyId.value;
  const partyData = {
    name: partyName,
    dungeon: dungeon,
    dungeonCategory: dungeonCategory,
    averageTime: elements.formPartyTime.value.trim(),
    successRate: elements.formPartyRate.value.trim(),
    isFavorite: elements.formPartyFavorite.checked,
    members: members,
    turnOrder: elements.formPartyTurn.value.trim(),
    speedTuningMemo: elements.formPartySpeed.value.trim(),
    requirementsMemo: elements.formPartyReq.value.trim(),
    targetMemo: elements.formPartyTarget.value.trim(),
    updatedAt: new Date().toISOString()
  };

  if (id) {
    const index = parties.findIndex(p => p.id === id);
    if (index !== -1) {
      partyData.id = id;
      parties[index] = partyData;
      showToast(`「${partyName}」を更新しました！`);
    }
  } else {
    partyData.id = 'party-' + Date.now();
    parties.push(partyData);
    showToast(`「${partyName}」を登録しました！`);
  }

  sortParties();
  savePartiesToLocalStorage();
  renderParties();
  closePartyForm();

  // 詳細モーダルが開いていた場合は最新データで再表示
  if (currentPartyDetailId && id === currentPartyDetailId) {
    openPartyDetailModal(id);
  }
}

// カイロス内サブタブの切り替え
function switchCairosSubtab(subtab) {
  cairosSubtab = subtab;

  if (subtab === 'party') {
    elements.btnSubnavParty.classList.add('active');
    elements.btnSubnavMonsters.classList.remove('active');
    elements.cairosSubpaneParty.style.display = 'block';
    elements.cairosSubpaneMonsters.style.display = 'none';
    elements.dungeonFilterArea.style.display = 'flex';
    if (elements.btnAddParty) elements.btnAddParty.style.display = 'inline-flex';
    renderParties();
  } else {
    elements.btnSubnavParty.classList.remove('active');
    elements.btnSubnavMonsters.classList.add('active');
    elements.cairosSubpaneParty.style.display = 'none';
    elements.cairosSubpaneMonsters.style.display = 'block';
    elements.dungeonFilterArea.style.display = 'none';
    if (elements.btnAddParty) elements.btnAddParty.style.display = 'none';
    renderMonsterList('cairos', elements.monsterListCairos, elements.cairosCount);
  }
}

// 6. モーダル（詳細）制御
function openDetailModal(id) {
  const monster = monsters.find(m => m.id === id);
  if (!monster) return;
  
  currentEditId = id;
  
  // バッジとテキストの設定
  elements.modalAttrBadge.textContent = monster.attribute;
  elements.modalAttrBadge.className = `monster-attr-badge attr-${monster.attribute}`;
  elements.modalMonsterName.textContent = monster.name;
  elements.modalMonsterStars.textContent = '★'.repeat(parseInt(monster.stars || 5));
  
  elements.modalRole.textContent = monster.role || '未登録';
  elements.modalRunes.textContent = monster.recommendedRunes || '未登録';
  
  // ギルド戦メモ
  if (monster.guildMemo && monster.guildMemo.trim() !== '') {
    elements.modalGuildMemo.textContent = monster.guildMemo;
    elements.modalSectionGuild.style.display = 'block';
  } else {
    elements.modalSectionGuild.style.display = 'none';
  }
  
  // カイロスメモ
  if (monster.cairosMemo && monster.cairosMemo.trim() !== '') {
    elements.modalCairosMemo.textContent = monster.cairosMemo;
    elements.modalSectionCairos.style.display = 'block';
  } else {
    elements.modalSectionCairos.style.display = 'none';
  }
  
  // 一般メモ
  if (monster.generalMemo && monster.generalMemo.trim() !== '') {
    elements.modalGeneralMemo.textContent = monster.generalMemo;
    elements.modalSectionGeneral.style.display = 'block';
  } else {
    elements.modalSectionGeneral.style.display = 'none';
  }
  
  // モーダルを表示
  elements.detailModal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // 背面のスクロールを防止
}

function closeDetailModal() {
  elements.detailModal.style.display = 'none';
  document.body.style.overflow = '';
}

// 7. フォーム制御 (登録・編集)
function openFormForEdit(id) {
  const monster = monsters.find(m => m.id === id);
  if (!monster) return;
  
  elements.formTitle.textContent = 'モンスター情報を編集';
  elements.formId.value = monster.id;
  elements.formName.value = monster.name;
  elements.formAttribute.value = monster.attribute;
  elements.formStars.value = monster.stars;
  elements.formRole.value = monster.role || '';
  elements.formRunes.value = monster.recommendedRunes || '';
  elements.formGuildMemo.value = monster.guildMemo || '';
  elements.formCairosMemo.value = monster.cairosMemo || '';
  elements.formGeneralMemo.value = monster.generalMemo || '';
  elements.formFavorite.checked = monster.isFavorite || false;
  
  // タブをフォームに切り替える
  switchTab('form');
  closeDetailModal();
}

function resetForm() {
  elements.monsterForm.reset();
  elements.formId.value = '';
  elements.formTitle.textContent = '新規モンスター登録';
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
  elements.formName.classList.remove('error');
  elements.formAttribute.classList.remove('error');
}

// 8. イベントリスナーの設定
function setupEventListeners() {
  // ナビゲーションタブ切り替え
  elements.navListItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.tab;
      switchTab(tabId);
    });
  });
  
  // 属性フィルターボタンのクリック
  elements.attrBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.attrBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      attributeFilter = btn.dataset.attr;
      renderAll();
    });
  });
  
  // リアルタイム検索
  elements.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim() !== '') {
      elements.btnClearSearch.style.display = 'flex';
    } else {
      elements.btnClearSearch.style.display = 'none';
    }
    renderAll();
  });
  
  // 検索クリアボタン
  elements.btnClearSearch.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchQuery = '';
    elements.btnClearSearch.style.display = 'none';
    renderAll();
  });
  
  // モーダル閉じる
  elements.modalClose.addEventListener('click', closeDetailModal);
  elements.detailModal.addEventListener('click', (e) => {
    if (e.target === elements.detailModal) {
      closeDetailModal();
    }
  });
  
  // モーダル編集ボタン
  elements.modalBtnEdit.addEventListener('click', () => {
    if (currentEditId) {
      openFormForEdit(currentEditId);
    }
  });
  
  // モーダル削除ボタン
  elements.modalBtnDelete.addEventListener('click', () => {
    if (currentEditId) {
      const monster = monsters.find(m => m.id === currentEditId);
      if (monster && confirm(`本当に「${monster.name}」を削除しますか？`)) {
        monsters = monsters.filter(m => m.id !== currentEditId);
        saveToLocalStorage();
        renderAll();
        closeDetailModal();
        showToast('モンスターを削除しました。');
      }
    }
  });
  
  // フォームキャンセルボタン
  elements.btnCancelForm.addEventListener('click', () => {
    resetForm();
    switchTab('all');
  });
  
  // フォーム送信
  elements.monsterForm.addEventListener('submit', handleFormSubmit);

  // カイロス内サブタブ切り替え
  if (elements.btnSubnavParty) {
    elements.btnSubnavParty.addEventListener('click', () => switchCairosSubtab('party'));
  }
  if (elements.btnSubnavMonsters) {
    elements.btnSubnavMonsters.addEventListener('click', () => switchCairosSubtab('monsters'));
  }

  // ダンジョン別フィルターボタン
  if (elements.dungeonBtns) {
    elements.dungeonBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.dungeonBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        dungeonFilter = btn.dataset.dungeon;
        renderParties();
      });
    });
  }

  // パーティ追加ボタン
  if (elements.btnAddParty) {
    elements.btnAddParty.addEventListener('click', () => openPartyForm());
  }

  // パーティ詳細モーダル閉じる
  if (elements.partyModalClose) {
    elements.partyModalClose.addEventListener('click', closePartyDetailModal);
  }
  if (elements.partyDetailModal) {
    elements.partyDetailModal.addEventListener('click', (e) => {
      if (e.target === elements.partyDetailModal) closePartyDetailModal();
    });
  }

  // パーティ詳細モーダル内 編集ボタン
  if (elements.modalPartyBtnEdit) {
    elements.modalPartyBtnEdit.addEventListener('click', () => {
      if (currentPartyDetailId) {
        const idToEdit = currentPartyDetailId;
        closePartyDetailModal();
        openPartyForm(idToEdit);
      }
    });
  }

  // パーティ詳細モーダル内 削除ボタン
  if (elements.modalPartyBtnDelete) {
    elements.modalPartyBtnDelete.addEventListener('click', () => {
      if (currentPartyDetailId) {
        const party = parties.find(p => p.id === currentPartyDetailId);
        if (party && confirm(`本当に周回パーティ「${party.name}」を削除しますか？`)) {
          parties = parties.filter(p => p.id !== currentPartyDetailId);
          savePartiesToLocalStorage();
          renderParties();
          closePartyDetailModal();
          showToast(`「${party.name}」を削除しました。`);
        }
      }
    });
  }

  // パーティフォームモーダル閉じる・キャンセル
  if (elements.partyFormClose) {
    elements.partyFormClose.addEventListener('click', closePartyForm);
  }
  if (elements.btnPartyFormCancel) {
    elements.btnPartyFormCancel.addEventListener('click', closePartyForm);
  }
  if (elements.partyFormModal) {
    elements.partyFormModal.addEventListener('click', (e) => {
      if (e.target === elements.partyFormModal) closePartyForm();
    });
  }

  // パーティフォーム送信
  if (elements.partyForm) {
    elements.partyForm.addEventListener('submit', handlePartyFormSubmit);
  }
  
  // プリセットデータへのリセットボタン（モンスター＆パーティ両方を初期化）
  elements.btnResetPreset.addEventListener('click', () => {
    if (confirm('登録したモンスターメモおよび周回パーティを初期プリセットに戻しますか？\n(自分で作成・編集したデータはすべてリセットされます)')) {
      localStorage.removeItem('summoners_war_manager_data');
      localStorage.removeItem('summoners_war_party_data');
      initApp();
      showToast('全データを初期プリセットにリセットしました');
      switchTab('all');
    }
  });

  // データ同期モーダル関連イベント
  if (elements.btnOpenSync) {
    elements.btnOpenSync.addEventListener('click', openSyncModal);
  }
  if (elements.syncModalClose) {
    elements.syncModalClose.addEventListener('click', closeSyncModal);
  }
  if (elements.syncModal) {
    elements.syncModal.addEventListener('click', (e) => {
      if (e.target === elements.syncModal) closeSyncModal();
    });
  }
  if (elements.btnCopySyncCode) {
    elements.btnCopySyncCode.addEventListener('click', handleCopySyncCode);
  }
  if (elements.btnDownloadBackup) {
    elements.btnDownloadBackup.addEventListener('click', handleDownloadBackup);
  }
  if (elements.btnApplySyncReplace) {
    elements.btnApplySyncReplace.addEventListener('click', () => handleApplySyncFromText('replace'));
  }
  if (elements.btnApplySyncMerge) {
    elements.btnApplySyncMerge.addEventListener('click', () => handleApplySyncFromText('merge'));
  }
  if (elements.btnTriggerFileInput && elements.syncFileInput) {
    elements.btnTriggerFileInput.addEventListener('click', () => elements.syncFileInput.click());
    elements.syncFileInput.addEventListener('change', handleSyncFileSelect);
  }

  // ギルド戦タブ内のタルタロス迷宮クイックバナー
  if (elements.bannerGoTartaros) {
    elements.bannerGoTartaros.addEventListener('click', () => {
      switchTab('cairos');
      switchCairosSubtab('party');
      if (elements.dungeonBtns) {
        elements.dungeonBtns.forEach(btn => {
          if (btn.dataset.dungeon === 'タルタロス') {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
      dungeonFilter = 'タルタロス';
      renderParties();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// タブ切り替え制御
function switchTab(tabId) {
  activeTab = tabId;
  
  // ナビゲーションバーのアクティブクラス更新
  elements.navListItems.forEach(item => {
    if (item.dataset.tab === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // コンテンツペインのアクティブ更新
  elements.tabPanes.forEach(pane => {
    if (pane.id === `tab-content-${tabId}`) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
  
  // 検索・フィルターエリアは、「すべて」「ギルド戦」「カイロス」タブの時だけ表示する
  if (tabId === 'form') {
    elements.searchFilterArea.style.display = 'none';
  } else {
    elements.searchFilterArea.style.display = 'flex';
  }
  
  // フォームタブに遷移する際は、新規追加ならフォームをクリアする
  if (tabId === 'form' && !elements.formId.value) {
    resetForm();
  }

  // カイロスタブを開いたときはサブタブ状態を同期
  if (tabId === 'cairos') {
    switchCairosSubtab(cairosSubtab);
  }
  
  // リストの最描画
  renderAll();
}

// フォーム送信の処理
function handleFormSubmit(e) {
  e.preventDefault();
  clearErrors();
  
  // バリデーション
  const name = elements.formName.value.trim();
  const attribute = elements.formAttribute.value;
  const stars = elements.formStars.value;
  
  let hasError = false;
  
  if (!name) {
    document.getElementById('error-name').style.display = 'block';
    elements.formName.classList.add('error');
    hasError = true;
  }
  
  if (!attribute) {
    document.getElementById('error-attribute').style.display = 'block';
    elements.formAttribute.classList.add('error');
    hasError = true;
  }
  
  if (hasError) {
    // 最初の入力エラーにフォーカス
    if (!name) {
      elements.formName.focus();
    } else if (!attribute) {
      elements.formAttribute.focus();
    }
    return;
  }
  
  const id = elements.formId.value;
  const monsterData = {
    name: name,
    attribute: attribute,
    stars: parseInt(stars),
    role: elements.formRole.value.trim() || '役割未設定',
    recommendedRunes: elements.formRunes.value.trim(),
    guildMemo: elements.formGuildMemo.value.trim(),
    cairosMemo: elements.formCairosMemo.value.trim(),
    generalMemo: elements.formGeneralMemo.value.trim(),
    isFavorite: elements.formFavorite.checked,
    updatedAt: new Date().toISOString()
  };
  
  if (id) {
    // 編集更新
    const index = monsters.findIndex(m => m.id === id);
    if (index !== -1) {
      monsterData.id = id;
      monsters[index] = monsterData;
      showToast(`${name} の情報を更新しました！`);
    }
  } else {
    // 新規登録
    monsterData.id = 'monster-' + Date.now();
    monsters.push(monsterData);
    showToast(`${name} を登録しました！`);
  }
  
  // 保存とリスト更新
  sortMonsters();
  saveToLocalStorage();
  resetForm();
  switchTab('all');
}

// ==========================================
// データ同期・バックアップ機能 (PC・スマホ同期)
// ==========================================

// 同期モーダルを開く
function openSyncModal() {
  if (!elements.syncModal) return;
  // 現在のデータ件数を反映
  if (elements.syncCountMonsters) elements.syncCountMonsters.textContent = `${monsters.length}体`;
  if (elements.syncCountParties) elements.syncCountParties.textContent = `${parties.length}編成`;
  if (elements.syncInputCode) elements.syncInputCode.value = '';
  
  elements.syncModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 同期モーダルを閉じる
function closeSyncModal() {
  if (!elements.syncModal) return;
  elements.syncModal.style.display = 'none';
  document.body.style.overflow = '';
}

// データをBase64エンコード付き同期コードに変換 (UTF-8対応)
function generateSyncCode() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    monsters: monsters,
    parties: parties
  };
  const jsonStr = JSON.stringify(payload);
  // UTF-8対応のBase64エンコード
  const base64Str = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
  return `SWDATA:${base64Str}`;
}

// 同期コードをクリップボードにコピー
async function handleCopySyncCode() {
  const syncCode = generateSyncCode();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(syncCode);
      showToast('📋 同期コードをコピーしました！LINEやメモでスマホに送ってください');
    } else {
      copyToClipboardFallback(syncCode);
    }
  } catch (err) {
    copyToClipboardFallback(syncCode);
  }
}

// クリップボードコピーのフォールバック
function copyToClipboardFallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('📋 同期コードをコピーしました！');
  } catch (e) {
    prompt('以下のコードをすべてコピーしてください:', text);
  }
  document.body.removeChild(ta);
}

// JSONファイルとしてダウンロード保存
function handleDownloadBackup() {
  const payload = {
    appName: "SummonersWar_Manager",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    monstersCount: monsters.length,
    partiesCount: parties.length,
    monsters: monsters,
    parties: parties
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const filename = `sw_manager_backup_${y}${m}${d}.json`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast(`💾 「${filename}」を保存しました`);
}

// 同期コードまたはJSONテキストの解析
function parseSyncPayload(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    throw new Error('同期データが入力されていません');
  }
  const trimmed = rawInput.trim();
  let jsonStr = '';

  if (trimmed.startsWith('SWDATA:')) {
    const base64Str = trimmed.slice(7);
    try {
      jsonStr = decodeURIComponent(atob(base64Str).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      throw new Error('同期コードの復号に失敗しました。コードが欠けていないか確認してください');
    }
  } else if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    jsonStr = trimmed;
  } else {
    try {
      jsonStr = decodeURIComponent(atob(trimmed).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      throw new Error('コードの形式が認識できません。正しくコピーされているかご確認ください');
    }
  }

  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('データ形式が不正です（JSON解析エラー）');
  }

  if (!data || (!Array.isArray(data.monsters) && !Array.isArray(data.parties))) {
    throw new Error('モンスターまたはパーティの有効なデータが見つかりません');
  }

  return {
    monsters: Array.isArray(data.monsters) ? data.monsters : [],
    parties: Array.isArray(data.parties) ? data.parties : []
  };
}

// データの反映実行 (mode: 'replace' または 'merge')
function applySyncData(payload, mode = 'replace') {
  if (mode === 'replace') {
    const confirmMsg = `同期を実行すると、現在の端末のデータが上書きされます。\nよろしいですか？\n\n【読み込むデータ】\n・モンスター: ${payload.monsters.length}体\n・周回パーティ: ${payload.parties.length}編成`;
    if (confirm(confirmMsg)) {
      monsters = payload.monsters;
      parties = payload.parties;
      saveToLocalStorage();
      savePartiesToLocalStorage();
      sortMonsters();
      sortParties();
      renderAll();
      closeSyncModal();
      showToast(`⚡ 同期完了！（モンスター${monsters.length}体 / パーティ${parties.length}編成）`);
    }
  } else if (mode === 'merge') {
    // マージ（既存にないIDや名称は追加、既存にあるものは更新）
    let mAdded = 0, mUpdated = 0;
    payload.monsters.forEach(newM => {
      const idx = monsters.findIndex(m => m.id === newM.id || (m.name === newM.name && m.attribute === newM.attribute));
      if (idx !== -1) {
        monsters[idx] = newM;
        mUpdated++;
      } else {
        monsters.push(newM);
        mAdded++;
      }
    });

    let pAdded = 0, pUpdated = 0;
    payload.parties.forEach(newP => {
      const idx = parties.findIndex(p => p.id === newP.id || (p.name === newP.name && p.dungeon === newP.dungeon));
      if (idx !== -1) {
        parties[idx] = newP;
        pUpdated++;
      } else {
        parties.push(newP);
        pAdded++;
      }
    });

    saveToLocalStorage();
    savePartiesToLocalStorage();
    sortMonsters();
    sortParties();
    renderAll();
    closeSyncModal();
    showToast(`🔀 統合完了！（追加: モンスター${mAdded}/パーティ${pAdded}、更新: モンスター${mUpdated}/パーティ${pUpdated}）`);
  }
}

// テキストエリアからの同期実行
function handleApplySyncFromText(mode) {
  const code = (elements.syncInputCode.value || '').trim();
  if (!code) {
    alert('同期コードをテキストエリアに貼り付けてください。');
    if (elements.syncInputCode) elements.syncInputCode.focus();
    return;
  }
  try {
    const payload = parseSyncPayload(code);
    applySyncData(payload, mode);
  } catch (err) {
    alert(`同期エラー: ${err.message}`);
  }
}

// バックアップファイル選択時のハンドラ
function handleSyncFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const payload = parseSyncPayload(content);
      applySyncData(payload, 'replace');
    } catch (err) {
      alert(`ファイル読み込みエラー: ${err.message}`);
    } finally {
      if (elements.syncFileInput) elements.syncFileInput.value = '';
    }
  };
  reader.readAsText(file, 'UTF-8');
}


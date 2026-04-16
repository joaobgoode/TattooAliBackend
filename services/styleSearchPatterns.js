/**
 * Expansão de busca por estilo: o catálogo no banco está majoritariamente em inglês,
 * enquanto usuários (e chips antigos) podem usar termos em português.
 * Retorna padrões para ILIKE (já com %).
 */

function normalizeAliasKey(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

/**
 * Aliases: chave normalizada (sem acento, minúscula) → fragmentos que existem nos nomes em inglês no banco.
 * Mantido alinhado à lista atual da tabela Styles.
 */
const STYLE_QUERY_ALIASES = {
  realismo: ['Realism', 'Color Realism', 'Black and Grey', 'Portrait'],
  realism: ['Realism', 'Color Realism'],
  aquarela: ['Watercolor'],
  watercolor: ['Watercolor'],
  japones: ['Japanese', 'Irezumi'],
  japanese: ['Japanese', 'Irezumi'],
  irezumi: ['Irezumi', 'Japanese'],
  neotrad: ['Neo Traditional'],
  neotradicional: ['Neo Traditional'],
  'neo tradicional': ['Neo Traditional'],
  pontilhismo: ['Dotwork'],
  dotwork: ['Dotwork'],
  geometrico: ['Geometric'],
  minimalista: ['Minimalist'],
  minimalist: ['Minimalist'],
  tradicional: ['Traditional'],
  traditional: ['Traditional'],
  'old school': ['Old School'],
  'new school': ['New School'],
  tribal: ['Tribal', 'Polynesian', 'Maori', 'Celtic'],
  maori: ['Maori'],
  polinesio: ['Polynesian'],
  polynesian: ['Polynesian'],
  celta: ['Celtic'],
  celtic: ['Celtic'],
  floral: ['Floral'],
  blackwork: ['Blackwork'],
  'fine line': ['Fine Line'],
  fineline: ['Fine Line'],
  'trash polka': ['Trash Polka'],
  cartoon: ['Cartoon'],
  mandala: ['Mandala'],
  chicano: ['Chicano'],
  biomecanico: ['Biomechanical'],
  biomechanical: ['Biomechanical'],
  surrealismo: ['Surrealism'],
  surrealism: ['Surrealism'],
  'dark art': ['Dark Art'],
  dark: ['Dark Art'],
  ornamental: ['Ornamental'],
  illustrative: ['Illustrative'],
  illustrativo: ['Illustrative'],
  sketch: ['Sketch'],
  gothic: ['Gothic'],
  'pin up': ['Pin-up'],
  pinup: ['Pin-up'],
  '3d': ['3D'],
  abstract: ['Abstract'],
  abstrato: ['Abstract'],
  anime: ['Anime'],
  ignorant: ['Ignorant Style'],
  linework: ['Linework'],
  lettering: ['Lettering', 'Script'],
  script: ['Script', 'Lettering'],
  surreal: ['Surrealism'],
};

/**
 * @param {string} term token ou frase curta (um chip ou uma palavra da busca)
 * @returns {string[]} padrões distintos para ILIKE
 */
function styleNameILikePatterns(term) {
  const raw = String(term || '').trim();
  if (!raw) return [];

  const patterns = new Set();
  patterns.add(`%${raw}%`);

  const key = normalizeAliasKey(raw);
  const extras = STYLE_QUERY_ALIASES[key];
  if (extras) {
    for (const fragment of extras) {
      patterns.add(`%${fragment}%`);
    }
  }

  return [...patterns];
}

/**
 * Junta padrões de estilo para todos os tokens da query (busca por texto).
 */
function stylePatternsForSearchQuery(term) {
  const tokens = String(term).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const set = new Set();
  for (const tkn of tokens) {
    for (const p of styleNameILikePatterns(tkn)) {
      set.add(p);
    }
  }
  return [...set];
}

module.exports = {
  normalizeAliasKey,
  styleNameILikePatterns,
  stylePatternsForSearchQuery,
};

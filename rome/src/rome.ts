// --- Helper registre (anti-doublons) ----------------------------------------
type Dict<T extends string> = { readonly [K in T]: K };

export function makeRegistry<T extends readonly string[]>(
  items: T,
  kind: string
): Dict<T[number]> {
  const seen = new Set<string>();
  for (const k of items) {
    if (seen.has(k)) throw new Error(`[Rome] duplicate ${kind}: ${k}`);
    seen.add(k);
  }
  return Object.freeze(items.reduce((acc, k) => ((acc as any)[k] = k, acc), {} as Dict<T[number]>));
}

// --- Routes ------------------------------------------------------------------
export const routes = makeRegistry(
  [
    "HOME",
    "LOGIN",
    "REGISTER",
    "DASHBOARD",
    "PROFILE",
    "RANKING",
    "SALON",
    "DUEL",
    "RETRO_GAMING"
  ] as const,
  "route"
);

export const routePaths: Record<keyof typeof routes, string> = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/u/:username",
  RANKING: "/ranking",
  SALON: "/salon",
  DUEL: "/duel",
  RETRO_GAMING: "/retro"
};

// --- API (REST) --------------------------------------------------------------
const apiMap: Record<string, string> = {
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  USER_ME: "/users/me",
  MATCH_CREATE: "/matches",
  MATCH_LIST: "/matches",
  MATCH_CHAT: "/matches/:id/chat",
  EVIDENCE_UPLOAD: "/evidence/upload"
};

export const apiRest = makeRegistry(
  [
    "AUTH_LOGIN",
    "AUTH_LOGOUT",
    "AUTH_REFRESH",
    "USER_ME",
    "MATCH_CREATE",
    "MATCH_LIST",
    "MATCH_CHAT",
    "EVIDENCE_UPLOAD"
  ] as const,
  "api"
);

export const api = {
  rest: apiRest,
  url(name: keyof typeof apiRest | keyof typeof apiMap) {
    return apiMap[name as string];
  }
} as const;


// --- Entities / Events / Files ----------------------------------------------
export const entities = makeRegistry(
  [
    "USER",
    "MATCH",
    "MATCH_EVIDENCE",
    "MATCH_CHAT_MESSAGE",
    "MEDIA",
    "REMATCH_PROPOSAL"
  ] as const,
  "entity"
);

export const events = makeRegistry(
  [
    "USER_SIGNED_IN",
    "USER_SIGNED_OUT",
    "MATCH_CREATED",
    "MATCH_UPDATED",
    "MATCH_CHAT_MESSAGE",
    "EVIDENCE_ADDED"
  ] as const,
  "event"
);

export const files = makeRegistry(
  [
    "AVATAR_IMAGE",
    "MATCH_SCREENSHOT",
    "MATCH_VIDEO",
    "DOC_TERMS",
    "DOC_PRIVACY"
  ] as const,
  "file"
);

export const fileGlobs: Record<keyof typeof files, string> = {
  AVATAR_IMAGE: "uploads/avatars/**",
  MATCH_SCREENSHOT: "uploads/matches/screens/**",
  MATCH_VIDEO: "uploads/matches/videos/**",
  DOC_TERMS: "public/docs/terms.*",
  DOC_PRIVACY: "public/docs/privacy.*"
};

// --- Tags style "Blizzard" ---------------------------------------------------
export const tags = {
  linePrefix: "//@tags:",
  parse(line: string): string[] {
    if (!line.startsWith(this.linePrefix)) return [];
    return line
      .slice(this.linePrefix.length)
      .split(/\s+/)
      .filter(t => t.startsWith("#"));
  }
} as const;

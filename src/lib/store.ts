import fs from "node:fs";
import path from "node:path";

import type { AppData } from "@/lib/types";

function resolveDataDir() {
  const configuredDir = process.env.APP_DATA_DIR;
  if (configuredDir) {
    return configuredDir;
  }

  const repoRootDataDir = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "..",
    "..",
    "data",
  );
  if (
    process.cwd().includes(`${path.sep}.next${path.sep}standalone`) &&
    fs.existsSync(repoRootDataDir)
  ) {
    return repoRootDataDir;
  }

  const cwdDataDir = path.join(/* turbopackIgnore: true */ process.cwd(), "data");
  if (fs.existsSync(cwdDataDir)) {
    return cwdDataDir;
  }

  if (fs.existsSync(repoRootDataDir)) {
    return repoRootDataDir;
  }

  return cwdDataDir;
}

const dataDir = resolveDataDir();
const dataFile = path.join(dataDir, "app-data.json");

const emptyData: AppData = {
  users: [],
  sessions: [],
  loginCodes: [],
  habits: [],
  habitCompletions: [],
  habitLapses: [],
  focusSessions: [],
  blockedDomains: [],
  subscriptions: [],
  extensionTokens: [],
  analyticsEvents: [],
  emailLogs: [],
};

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(emptyData, null, 2));
  }
}

export function readStore(): AppData {
  ensureStore();
  const raw = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(raw) as AppData;
}

export function writeStore(data: AppData) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export function mutateStore<T>(mutator: (data: AppData) => T): T {
  const data = readStore();
  const result = mutator(data);
  writeStore(data);
  return result;
}

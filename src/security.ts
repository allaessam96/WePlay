const PASSWORD_HASH_ALGORITHM = "PBKDF2";
const PASSWORD_HASH_DIGEST = "SHA-256";
const PASSWORD_HASH_ITERATIONS = 210_000;
const PASSWORD_HASH_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

const encoder = new TextEncoder();

const bytesToBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes));

const base64ToBytes = (value: string) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const derivePasswordHash = async (
  password: string,
  salt: Uint8Array,
  iterations: number,
) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    PASSWORD_HASH_ALGORITHM,
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: PASSWORD_HASH_ALGORITHM,
      hash: PASSWORD_HASH_DIGEST,
      iterations,
      salt,
    },
    key,
    PASSWORD_HASH_BYTES * 8,
  );

  return new Uint8Array(bits);
};

export const createPasswordHash = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES));
  const hash = await derivePasswordHash(
    password,
    salt,
    PASSWORD_HASH_ITERATIONS,
  );

  return [
    "pbkdf2-sha256",
    PASSWORD_HASH_ITERATIONS,
    bytesToBase64(salt),
    bytesToBase64(hash),
  ].join("$");
};

export const verifyPassword = async (
  password: string,
  encodedHash: string,
) => {
  const [algorithm, iterationsText, saltText, expectedHashText] =
    encodedHash.split("$");
  const iterations = Number(iterationsText);

  if (
    algorithm !== "pbkdf2-sha256" ||
    !Number.isSafeInteger(iterations) ||
    iterations < PASSWORD_HASH_ITERATIONS ||
    !saltText ||
    !expectedHashText
  ) {
    return false;
  }

  try {
    const salt = base64ToBytes(saltText);
    const expectedHash = base64ToBytes(expectedHashText);
    const actualHash = await derivePasswordHash(password, salt, iterations);

    if (actualHash.length !== expectedHash.length) {
      return false;
    }

    let difference = 0;
    for (let index = 0; index < actualHash.length; index += 1) {
      difference |= actualHash[index] ^ expectedHash[index];
    }

    return difference === 0;
  } catch {
    return false;
  }
};

export const normalizeHttpUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:/i.test(trimmed)) {
    throw new Error("Unsupported URL protocol");
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const parsed = new URL(candidate);

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Unsupported URL protocol");
  }

  return parsed.toString();
};

export const isSafeHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const isSafeImageSource = (value: string) => {
  if (value.startsWith("PRESET_ICON:")) {
    return true;
  }

  if (/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(value)) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

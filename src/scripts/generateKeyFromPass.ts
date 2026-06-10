// 1. Get or create salt for user
function getOrCreateSalt() {
  let saltString = localStorage.getItem('db_salt');
  if (!saltString) {
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    saltString = btoa(String.fromCharCode(...saltBytes));
    localStorage.setItem('db_salt', saltString);
  }
  return new Uint8Array(
    atob(saltString)
      .split('')
      .map((c) => c.charCodeAt(0)),
  );
}

// 2. Generate secure 32-byte key from user password
async function deriveKeyFromPassword(password: string) {
  const salt = getOrCreateSalt();
  const encoder = new TextEncoder();

  // Convert text password to base CryptoKey
  const baseKey = await window.crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey']);

  // Strengthen password with 100 000 PBKDF2 iterations
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256, // Required size: 256 bits = 32 bytes
  );

  return new Uint8Array(derivedBits);
}

export { deriveKeyFromPassword };

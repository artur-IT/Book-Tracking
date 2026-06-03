import { vi } from 'vitest';

// Fake Dexie in tests — no IndexedDB import work on mount/login.
vi.mock('../database/db');

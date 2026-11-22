import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { LocalProject } from '@/types/project';

interface UtsavDB extends DBSchema {
  projects: {
    key: string;
    value: LocalProject;
    indexes: { 'by-date': number; 'by-category': string };
  };
}

const DB_NAME = 'utsav_studio_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<UtsavDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB<UtsavDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-date', 'lastModified');
          projectStore.createIndex('by-category', 'category');
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllLocalProjects(): Promise<LocalProject[]> {
  const db = await getDB();
  if (!db) return [];
  const projects = await db.getAllFromIndex('projects', 'by-date');
  return projects.reverse(); // Newest first
}

export async function getLocalProjectById(id: string): Promise<LocalProject | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('projects', id);
}

export async function saveLocalProject(project: LocalProject): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available in server context');
  await db.put('projects', {
    ...project,
    lastModified: Date.now(),
  });
  return project.id;
}

export async function deleteLocalProject(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('projects', id);
}

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { LocalProject } from '@/types/project';
import { UserUploadedImage } from '@/types/editor';
import { VideoProject, StoredAudioTrack } from '@/types/videoEditor';

interface UtsavDB extends DBSchema {
  projects: {
    key: string;
    value: LocalProject;
    indexes: { 'by-date': number; 'by-category': string };
  };
  uploads: {
    key: string;
    value: UserUploadedImage;
    indexes: { 'by-date': number };
  };
  audio_tracks: {
    key: string;
    value: StoredAudioTrack;
    indexes: { 'by-date': number };
  };
  video_projects: {
    key: string;
    value: VideoProject;
    indexes: { 'by-date': number; 'by-category': string };
  };
}

const DB_NAME = 'utsav_studio_db';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<UtsavDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB<UtsavDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-date', 'lastModified');
          projectStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('uploads')) {
          const uploadStore = db.createObjectStore('uploads', { keyPath: 'id' });
          uploadStore.createIndex('by-date', 'createdAt');
        }
        if (!db.objectStoreNames.contains('audio_tracks')) {
          const audioStore = db.createObjectStore('audio_tracks', { keyPath: 'id' });
          audioStore.createIndex('by-date', 'createdAt');
        }
        if (!db.objectStoreNames.contains('video_projects')) {
          const videoStore = db.createObjectStore('video_projects', { keyPath: 'id' });
          videoStore.createIndex('by-date', 'lastModified');
          videoStore.createIndex('by-category', 'category');
        }
      },
    });
  }
  return dbPromise;
}

// Card Project storage operations
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

// User uploaded images operations
export async function getAllUploadedImages(): Promise<UserUploadedImage[]> {
  const db = await getDB();
  if (!db) return [];
  const uploads = await db.getAllFromIndex('uploads', 'by-date');
  return uploads.reverse(); // Newest first
}

export async function saveUploadedImage(image: UserUploadedImage): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available in server context');
  await db.put('uploads', image);
  return image.id;
}

export async function deleteUploadedImage(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('uploads', id);
}

// Audio Tracks operations
export async function getAllAudioTracks(): Promise<StoredAudioTrack[]> {
  const db = await getDB();
  if (!db) return [];
  const tracks = await db.getAllFromIndex('audio_tracks', 'by-date');
  return tracks.reverse();
}

export async function saveAudioTrack(track: StoredAudioTrack): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available in server context');
  await db.put('audio_tracks', track);
  return track.id;
}

export async function getAudioTrackById(id: string): Promise<StoredAudioTrack | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('audio_tracks', id);
}

export async function deleteAudioTrack(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('audio_tracks', id);
}

// Video Projects operations
export async function getAllVideoProjects(): Promise<VideoProject[]> {
  const db = await getDB();
  if (!db) return [];
  const projects = await db.getAllFromIndex('video_projects', 'by-date');
  return projects.reverse();
}

export async function getVideoProjectById(id: string): Promise<VideoProject | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('video_projects', id);
}

export async function saveVideoProject(project: VideoProject): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available in server context');
  await db.put('video_projects', {
    ...project,
    lastModified: Date.now(),
  });
  return project.id;
}

export async function deleteVideoProject(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('video_projects', id);
}

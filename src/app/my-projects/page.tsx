'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { getAllLocalProjects, deleteLocalProject } from '@/lib/storage/db';
import { LocalProject } from '@/types/project';
import {
  FolderHeart,
  PlusCircle,
  Clock,
  Trash2,
  Edit,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const stored = await getAllLocalProjects();
        setProjects(stored);
      } catch (err) {
        console.error('Error fetching local projects:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this locally saved invitation?')) {
      await deleteLocalProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="py-12 bg-ivory-50 min-h-screen">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300/70 mb-2 tracking-wider uppercase">
              Local Browser Vault • सुरक्षित प्रोजेक्ट्स
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-royal-950">
              My Saved Invitations
            </h1>
            <p className="font-hindi text-magenta-700 text-lg">
              आपके डिवाइस पर सुरक्षित रूप से सहेजे गए निमंत्रण
            </p>
          </div>

          <Button href="/templates" variant="gold" size="md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Invitation
          </Button>
        </div>

        {/* Local Storage Privacy Guarantee Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-white border border-gold-200/80 shadow-sm flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs text-stone-600 leading-relaxed">
            <p className="font-bold text-sm text-royal-950 mb-0.5">
              Zero-Signup Local Storage (IndexedDB)
            </p>
            <p>
              Your invitation drafts and custom text are saved directly inside this browser&apos;s internal database. We never ask you to register or hand over your phone number, and your files never touch external servers.
            </p>
          </div>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-stone-500 font-medium">Loading your saved designs...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-gold-200/80 p-5 shadow-card-warm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-magenta-700 bg-magenta-50 px-2.5 py-0.5 rounded-full">
                      {proj.type === 'video' ? 'Video Reel' : 'Card Design'}
                    </span>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-royal-950 mb-1 line-clamp-1">
                    {proj.title}
                  </h2>

                  <div className="flex items-center text-xs text-stone-500 mt-2">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>Last modified: {new Date(proj.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={`/card-editor?template=${proj.templateId || ''}`}
                    className="inline-flex items-center text-xs font-bold text-royal-900 hover:text-magenta-700"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Continue Editing
                  </Link>

                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    Free / Local
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gold-200/70 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto text-gold-700 mb-4">
              <FolderHeart className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-royal-950 mb-2">
              No Saved Projects Yet
            </h2>
            <p className="font-hindi text-magenta-700 text-sm mb-4">
              आपने अभी तक कोई निमंत्रण पत्र सहेजा नहीं है
            </p>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Pick any celebration template or open a blank canvas to begin customizing. Your work will automatically be accessible right here on this device.
            </p>

            <Button href="/templates" variant="gold" size="md">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Templates Gallery
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

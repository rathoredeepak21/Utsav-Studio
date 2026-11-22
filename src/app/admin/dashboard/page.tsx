'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { SAMPLE_TEMPLATES } from '@/lib/constants/templates';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Database,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Upload,
  PlusCircle,
  Settings,
  LogOut,
  FolderHeart,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'media' | 'settings'>('templates');

  const totalTemplates = SAMPLE_TEMPLATES.length;
  const weddingCount = SAMPLE_TEMPLATES.filter((t) => t.category === 'wedding').length;
  const birthdayCount = SAMPLE_TEMPLATES.filter((t) => t.category === 'birthday').length;
  const videoCount = SAMPLE_TEMPLATES.filter((t) => t.type === 'video').length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-10">
      <Container>
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold text-royal-950">
                Utsav Studio Admin
              </span>
              <Badge variant="gold">Admin Console</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Catalog management, Cloudinary asset uploads & system diagnostics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button href="/" variant="outline" size="sm">
              View Public Website
            </Button>
            <Button href="/admin/login" variant="ghost" size="sm" className="text-rose-700 hover:bg-rose-50">
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* System Integration Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Supabase Status */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start space-x-3">
            <div className={`p-2 rounded-xl ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm text-stone-900">Supabase Database & Auth</h4>
                <Badge variant={isSupabaseConfigured ? 'success' : 'neutral'}>
                  {isSupabaseConfigured ? 'Connected' : 'Pending Env Setup'}
                </Badge>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isSupabaseConfigured
                  ? 'Authenticated client initialized with environment keys.'
                  : 'Add NEXT_PUBLIC_SUPABASE_URL & ANON_KEY to .env.local to activate.'}
              </p>
            </div>
          </div>

          {/* Cloudinary Status */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm text-stone-900">Cloudinary Media CDN</h4>
                <Badge variant="neutral">Config Ready</Badge>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Cloudinary environment variables prepared in .env.example for template asset hosting.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 uppercase font-semibold">Total Catalog</p>
            <p className="text-3xl font-serif font-bold text-royal-950 mt-1">{totalTemplates}</p>
            <p className="text-[11px] text-stone-400 mt-1">Free templates live</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 uppercase font-semibold">Wedding Cards</p>
            <p className="text-3xl font-serif font-bold text-magenta-700 mt-1">{weddingCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Vivah & ceremonies</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 uppercase font-semibold">Birthday Cards</p>
            <p className="text-3xl font-serif font-bold text-purple-700 mt-1">{birthdayCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Kids & adult designs</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 uppercase font-semibold">Video Reels</p>
            <p className="text-3xl font-serif font-bold text-gold-600 mt-1">{videoCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">In-browser animations</p>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-royal-950">
                Template Catalog
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage, preview, and update invitation templates.
              </p>
            </div>

            <Button href="/card-editor" variant="gold" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add New Template
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Template</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Format</th>
                  <th className="py-3 px-4 font-semibold">Languages</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <tr key={tmpl.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{tmpl.name || tmpl.title}</div>
                      {(tmpl.nameHindi || tmpl.titleHindi) && (
                        <div className="font-hindi text-[11px] text-stone-500">{tmpl.nameHindi || tmpl.titleHindi}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-600">{tmpl.category}</td>
                    <td className="py-3.5 px-4 uppercase text-stone-600 font-semibold">{tmpl.type}</td>
                    <td className="py-3.5 px-4 text-stone-600">{tmpl.languageSupport.join(', ')}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        Active Free
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={tmpl.type === 'video' ? `/video-editor?template=${tmpl.id}` : `/card-editor?template=${tmpl.id}`}
                        className="text-magenta-700 hover:text-royal-950 font-semibold mr-3"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}

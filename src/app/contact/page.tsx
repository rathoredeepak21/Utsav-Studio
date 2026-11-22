'use client';

import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Template Suggestion',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-ivory-50 min-h-screen">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="Get In Touch"
          badgeHindi="संपर्क करें"
          title="We'd Love to Hear From You"
          titleHindi="सुझाव, प्रतिक्रिया अथवा सहायता के लिए लिखें"
          subtitle="Have a template request, feedback, or need help? Reach out to the Utsav Studio team."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-royal-950 to-magenta-950 text-white p-8 rounded-3xl border border-gold-500/30 shadow-royal-glow/20 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-gold-300 mb-2">
                Utsav Studio
              </h3>
              <p className="font-hindi text-sm text-stone-300 mb-6">
                हर खुशी का डिजिटल निमंत्रण
              </p>

              <div className="space-y-4 text-sm text-stone-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>support@utsavstudio.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-royal-800/80 text-xs text-stone-400">
              <p>Response time: Usually within 24-48 hours.</p>
              <p className="text-gold-400 font-hindi mt-1">आपकी प्रतिक्रिया हमारे लिए अमूल्य है।</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-gold-200/80 shadow-card-warm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-royal-950">
                  Thank You for Writing to Us!
                </h3>
                <p className="font-hindi text-magenta-700 text-sm">
                  आपका संदेश प्राप्त हो गया है। हम जल्द ही उत्तर देंगे।
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Template Suggestion', message: '' });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-royal-950 mb-1">
                    Your Name (आपका नाम)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                    placeholder="e.g. Rajesh Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-950 mb-1">
                    Email Address (ईमेल)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                    placeholder="e.g. rajesh@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-950 mb-1">
                    Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <option value="Template Suggestion">Request a Specific Template / Ritual</option>
                    <option value="Bug Report">Technical Issue / Bug Report</option>
                    <option value="Feedback">Appreciation & General Feedback</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-950 mb-1">
                    Message (संदेश)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                    placeholder="Tell us what you need or share your ideas..."
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message (संदेश भेजें)
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

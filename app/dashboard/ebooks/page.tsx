'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, PlusCircle, Download, Pencil, Trash2 } from 'lucide-react';

// Phase 3 placeholder data — replaced by real API calls in Phase 3
const SAMPLE_EBOOKS = [
  {
    id: '1',
    title: "The Creator's Playbook",
    template: 'minimal',
    status: 'draft',
    created_at: '2026-03-10',
    updated_at: '2026-03-10',
  },
  {
    id: '2',
    title: 'My First Course Guide',
    template: 'workbook',
    status: 'draft',
    created_at: '2026-03-08',
    updated_at: '2026-03-08',
  },
];

export default function EbooksPage() {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Ebooks"
        subtitle="All your ebooks in one place."
      />

      <div className="flex-1 px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {SAMPLE_EBOOKS.length} ebook{SAMPLE_EBOOKS.length !== 1 ? 's' : ''} (sample data)
          </p>
          {/* Phase 3: opens text-input editor */}
          <Button size="sm" className="gap-2" disabled>
            <PlusCircle className="w-4 h-4" />
            New Ebook
          </Button>
        </div>

        {/* Ebook list */}
        <div className="space-y-3 mb-8">
          {SAMPLE_EBOOKS.map((book) => (
            <Card key={book.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                  <FileText className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    <span className="capitalize">{book.template}</span> template · Updated {book.updated_at}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full capitalize hidden sm:inline-block">
                  {book.status}
                </span>
                <Button size="sm" variant="ghost" disabled title="Edit (Phase 3)">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" disabled title="Export PDF (Phase 3)">
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" disabled title="Delete (Phase 3)">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Phase 3 text input placeholder ──────────────────────────── */}
        <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center bg-indigo-50/40">
          <PlusCircle className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-1">
            Text Input Editor — Coming in Phase 3
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Paste any text here and CreatorLab.ink will parse it into chapters,
            headings, and bullets. Then export as a beautifully formatted PDF.
          </p>

          {/* Textarea stub */}
          <textarea
            disabled
            placeholder="Paste your text here… (available in Phase 3)"
            className="mt-5 w-full max-w-2xl mx-auto block resize-none rounded-xl border border-indigo-100 bg-white/60 px-4 py-3 text-sm text-gray-400 placeholder:text-gray-300 focus:outline-none cursor-not-allowed"
            rows={6}
          />

          <Button className="mt-4" size="md" disabled>
            Generate Ebook (Phase 3)
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

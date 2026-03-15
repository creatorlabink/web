import type { Ebook } from '@/types';

export type TemplateName = Ebook['template'];

export interface TemplateTheme {
  name: string;
  cardClass: string;
  headerClass: string;
  sectionBorderClass: string;
  titleClass: string;
  subtitleClass: string;
  bodyClass: string;
  bulletClass: string;
  quoteClass: string;
  calloutClass: string;
  dividerClass: string;
}

export const TEMPLATE_THEMES: Record<TemplateName, TemplateTheme> = {
  minimal: {
    name: 'Minimal',
    cardClass: 'bg-white border-gray-200',
    headerClass: 'bg-indigo-600 text-white',
    sectionBorderClass: 'border-indigo-500',
    titleClass: 'text-gray-900',
    subtitleClass: 'text-gray-700',
    bodyClass: 'text-gray-700',
    bulletClass: 'bg-indigo-500',
    quoteClass: 'border-indigo-500 bg-indigo-50 text-indigo-800',
    calloutClass: 'bg-amber-50 border-amber-200 text-amber-800',
    dividerClass: 'border-gray-200',
  },
  business: {
    name: 'Business',
    cardClass: 'bg-white border-slate-300',
    headerClass: 'bg-teal-700 text-white',
    sectionBorderClass: 'border-teal-600',
    titleClass: 'text-slate-900',
    subtitleClass: 'text-slate-700',
    bodyClass: 'text-slate-700',
    bulletClass: 'bg-teal-600',
    quoteClass: 'border-teal-600 bg-cyan-50 text-teal-900',
    calloutClass: 'bg-teal-50 border-teal-200 text-teal-900',
    dividerClass: 'border-slate-300',
  },
  workbook: {
    name: 'Workbook',
    cardClass: 'bg-white border-violet-200',
    headerClass: 'bg-violet-700 text-white',
    sectionBorderClass: 'border-violet-600',
    titleClass: 'text-violet-950',
    subtitleClass: 'text-violet-800',
    bodyClass: 'text-violet-900',
    bulletClass: 'bg-violet-600',
    quoteClass: 'border-violet-600 bg-violet-50 text-violet-900',
    calloutClass: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    dividerClass: 'border-violet-200',
  },
};

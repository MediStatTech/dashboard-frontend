type StatusLang = 'ua' | 'en';

const LABELS: Record<string, { ua: string; en: string }> = {
  ok:       { ua: 'нормально', en: 'normal' },
  warning:  { ua: 'увага',     en: 'warning' },
  critical: { ua: 'критично',  en: 'critical' },
};

export function statusBadgeClasses(status: string): string {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-700';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700';
    case 'ok':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function statusRowClasses(status: string): string {
  if (status === 'critical') {
    return 'bg-red-50/70 hover:bg-red-100/70';
  }
  return 'hover:bg-green-50/50';
}

export function statusDotClass(status: string): string {
  switch (status) {
    case 'critical':
      return 'bg-red-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'ok':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
}

export function statusLabel(status: string, lang: StatusLang): string {
  return LABELS[status]?.[lang] ?? status;
}

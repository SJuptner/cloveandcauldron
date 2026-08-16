export const STRINGS = {
  en: {
    title: 'The Long Road',
    subtitle: '3rd c. BCE → today · simultaneous independent states shown across five regional lanes',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset',
    events: 'events',
    flagNote:
      '* marks states founded under Mongol rule that later Turkicized (e.g. the Golden Horde, Chagatai Khanate) — shown here for continuity, not classified as Turkic in origin.',
    sidebarTitle: 'Chronicle Index',
    searchPlaceholder: 'Search…',
  },
  tr: {
    title: 'Uzun Yol',
    subtitle: 'MÖ 3. yüzyıl → günümüz · aynı anda var olan bağımsız devletler beş coğrafi şeritte gösterilir',
    zoomIn: 'Yakınlaş',
    zoomOut: 'Uzaklaş',
    reset: 'Sıfırla',
    events: 'olay',
    flagNote:
      '* işareti, Moğol yönetimi altında kurulup sonradan Türkleşen devletleri gösterir (Altın Orda, Çağatay Hanlığı gibi) — süreklilik için gösterilmiştir, köken olarak Türk sayılmaz.',
    sidebarTitle: 'Kronik İndeksi',
    searchPlaceholder: 'Ara…',
  },
} as const;

export type Lang = keyof typeof STRINGS;

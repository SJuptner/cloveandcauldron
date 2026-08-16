import TimelineExplorer from '@/components/timeline/TimelineExplorer';

export const metadata = {
  title: 'The Long Road | Clove & Cauldron',
  description: 'An interactive timeline of Turkic history, 3rd c. BCE to today, across five regional lanes.',
  alternates: { canonical: '/the-long-road' },
};

export default function TheLongRoadPage() {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[75px] sm:top-[85px]">
      <TimelineExplorer />
    </div>
  );
}

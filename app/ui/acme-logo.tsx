import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg] mr-2 flex-shrink-0" />
      <p className="text-2xl whitespace-nowrap">茶馆记账后台</p>
    </div>
  );
}

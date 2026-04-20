import { Search } from 'lucide-react';

export default function HubSearch({ value, onChange }) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9CA3AF]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search campaign or influencer..."
        className="w-full pl-[34px] pr-3 py-2 text-[13px] border border-[#745CB4]/20 rounded-lg bg-[#1A112C] text-white focus:outline-none focus:border-[#C1B6FD]/40"
      />
    </div>
  );
}


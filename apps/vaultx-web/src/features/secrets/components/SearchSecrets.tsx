import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function SearchSecrets() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search secrets..."
        className="pl-10 border-gray-800 focus:border-indigo-500 bg-black"
      />
    </div>
  );
}

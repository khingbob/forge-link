import { LayoutDashboard, Plus, Factory, Link, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'new-search';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  companyName: string;
}

export function Navbar({ activeTab, onTabChange, companyName }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-secondary">
            <Link size={13} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">ForgeLink</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <NavTab label="Dashboard" icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
          <NavTab label="New Search" icon={Plus} active={activeTab === 'new-search'} onClick={() => onTabChange('new-search')} />
        </div>

        {/* Company chip */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Factory size={13} />
          <span className="font-medium text-foreground">{companyName}</span>
        </div>
      </div>
    </nav>
  );
}

function NavTab({ label, icon: Icon, active, onClick }: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
        active
          ? 'bg-secondary text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

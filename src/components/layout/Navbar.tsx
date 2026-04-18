import { LayoutDashboard, Plus, Factory, Link, LucideIcon } from 'lucide-react';

type Tab = 'dashboard' | 'new-search';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  companyName: string;
}

export function Navbar({ activeTab, onTabChange, companyName }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 bg-amber-500 rounded-md">
            <Link size={14} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-50">ForgeLink</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <NavTab
            label="Dashboard"
            icon={LayoutDashboard}
            active={activeTab === 'dashboard'}
            onClick={() => onTabChange('dashboard')}
          />
          <NavTab
            label="New Search"
            icon={Plus}
            active={activeTab === 'new-search'}
            onClick={() => onTabChange('new-search')}
          />
        </div>

        {/* Company chip */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Factory size={13} className="text-zinc-500" />
          <span className="font-medium text-zinc-300">{companyName}</span>
        </div>
      </div>
    </nav>
  );
}

interface NavTabProps {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

function NavTab({ label, icon: Icon, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer
        ${active
          ? 'bg-zinc-800 text-zinc-50'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
        }
      `}
    >
      <Icon size={13} className={active ? 'text-amber-400' : ''} />
      {label}
    </button>
  );
}

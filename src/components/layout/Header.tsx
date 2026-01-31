type View = 'form' | 'list';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">Crack Classifier</h1>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">Crack Documentation</p>
          </div>
        </div>
        <nav className="relative flex rounded-xl bg-gray-100 p-0.5 sm:p-1">
          {/* Sliding white background */}
          <div
            className={`absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              currentView === 'form' ? 'left-0.5 sm:left-1' : 'left-[calc(50%+1px)] sm:left-[calc(50%+2px)]'
            }`}
          />
          <button
            onClick={() => onViewChange('form')}
            className={`relative z-[1] flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-2.5 sm:px-3.5 text-xs sm:text-sm font-medium transition-colors duration-200 min-h-[44px] active:scale-95 ${
              currentView === 'form'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className={`h-4 w-4 transition-transform duration-200 ${currentView === 'form' ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`relative z-[1] flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-2.5 sm:px-3.5 text-xs sm:text-sm font-medium transition-colors duration-200 min-h-[44px] active:scale-95 ${
              currentView === 'list'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className={`h-4 w-4 transition-transform duration-200 ${currentView === 'list' ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Records
          </button>
        </nav>
      </div>
    </header>
  );
}

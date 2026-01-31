import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { CrackForm } from './components/crack-form/CrackForm';
import { CrackList } from './components/crack-list/CrackList';

type View = 'form' | 'list';

function App() {
  const [currentView, setCurrentView] = useState<View>('form');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <Container>
        {currentView === 'form' ? (
          <CrackForm />
        ) : (
          <CrackList onGoToForm={() => setCurrentView('form')} />
        )}
      </Container>
    </div>
  );
}

export default App;

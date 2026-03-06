import { QueryProvider } from './providers';
import { AppRouter } from './router';

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;

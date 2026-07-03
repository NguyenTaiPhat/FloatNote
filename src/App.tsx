import { HashRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@shared/ErrorBoundary';
import { ToastContainer } from '@shared/Toast';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import FavoritesPage from '@/pages/FavoritesPage';
import ArchivedPage from '@/pages/ArchivedPage';
import WidgetPage from '@/pages/WidgetPage';
import EdgeDockPage from '@/pages/EdgeDockPage';
import GraphPage from '@/pages/GraphPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
    return (
        <ErrorBoundary>
            <ToastContainer />
            <HashRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/archived" element={<ArchivedPage />} />
                        <Route path="/graph" element={<GraphPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                    <Route path="/widget/:type" element={<WidgetPage />} />
                    <Route path="/edge-dock" element={<EdgeDockPage />} />
                </Routes>
            </HashRouter>
        </ErrorBoundary>
    );
}

export default App;

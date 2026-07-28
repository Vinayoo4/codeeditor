import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PartiesListPage } from './modules/parties/PartiesListPage';
import { NewPartyPage } from './modules/parties/NewPartyPage';
import { PartyDetailPage } from './modules/parties/PartyDetailPage';
import { Party } from './modules/parties/types';

function PartiesListWrapper() {
  const navigate = useNavigate();
  return (
    <PartiesListPage
      onNavigateToDetail={(id) => navigate(`/parties/${id}`)}
      onNavigateToNew={() => navigate('/parties/new')}
      onOpenSaleLink={() => {}}
      onOpenExpenseLink={() => {}}
    />
  );
}

function NewPartyWrapper() {
  const navigate = useNavigate();
  return (
    <NewPartyPage
      onBack={() => navigate('/parties')}
      onPartyCreated={(party: Party) => navigate(`/parties/${party.id}`)}
    />
  );
}

function PartyDetailWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/parties" />;

  return (
    <PartyDetailPage
      partyId={id}
      onBack={() => navigate('/parties')}
      onOpenSaleLink={() => {}}
      onOpenExpenseLink={() => {}}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Routes>
          <Route path="/parties" element={<PartiesListWrapper />} />
          <Route path="/parties/new" element={<NewPartyWrapper />} />
          <Route path="/parties/:id" element={<PartyDetailWrapper />} />
          <Route path="/" element={<Navigate to="/parties" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

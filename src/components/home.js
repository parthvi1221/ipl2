import React, { useState } from 'react';
import './style.css';


// PlayerForm Component (for creating/editing players)
const PlayerForm = ({ onSubmit, existingPlayer, isEditing, cancelEdit }) => {
  const [name, setName] = useState(existingPlayer?.name || '');
  const [role, setRole] = useState(existingPlayer?.role || 'Batsman');
  const [isCaptain, setIsCaptain] = useState(existingPlayer?.isCaptain || false);
  const [isViceCaptain, setIsViceCaptain] = useState(existingPlayer?.isViceCaptain || false);
  const [team, setTeam] = useState(existingPlayer?.team || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, role, isCaptain, isViceCaptain, team }, isEditing);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player Name"
        required
        disabled={isEditing}  // Disable name editing when updating an existing player
      />
      
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All Rounder">All Rounder</option>
        <option value="WK">WK</option>
      </select>

      <label>
        Captain:
        <input type="checkbox" checked={isCaptain} onChange={() => setIsCaptain(!isCaptain)} />
      </label>

      <label>
        Vice-Captain:
        <input type="checkbox" checked={isViceCaptain} onChange={() => setIsViceCaptain(!isViceCaptain)} />
      </label>

      <input
        type="text"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Team Name"
        required
      />

      <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
      {isEditing && <button type="button" onClick={cancelEdit}>Cancel</button>}
    </form>
  );
};

// PlayerList Component (to display players)
const PlayerList = ({ players, onEdit }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.name}>
          {player.name} - {player.role} - {player.team} {player.isCaptain ? '(Captain)' : ''} {player.isViceCaptain ? '(Vice-Captain)' : ''}
          <button onClick={() => onEdit(player)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

// Filter Component
const PlayerFilter = ({ onFilter }) => {
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [isCaptain, setIsCaptain] = useState(false);
  const [isViceCaptain, setIsViceCaptain] = useState(false);

  const applyFilter = () => {
    onFilter({ role, team, isCaptain, isViceCaptain });
  };

  return (
    <div>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">All Roles</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All Rounder">All Rounder</option>
        <option value="WK">WK</option>
      </select>

      <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team" />

      <label>
        Captain:
        <input type="checkbox" checked={isCaptain} onChange={() => setIsCaptain(!isCaptain)} />
      </label>

      <label>
        Vice-Captain:
        <input type="checkbox" checked={isViceCaptain} onChange={() => setIsViceCaptain(!isViceCaptain)} />
      </label>

      <button onClick={applyFilter}>Apply Filter</button>
    </div>
  );
};

// Main App Component
const Ipl = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const addOrUpdatePlayer = (player, isEditing) => {
    // Check if team already has a captain and vice-captain
    const teamPlayers = players.filter((p) => p.team === player.team && p.name !== player.name);
    const hasCaptain = teamPlayers.some((p) => p.isCaptain);
    const hasViceCaptain = teamPlayers.some((p) => p.isViceCaptain);

    if (player.isCaptain && hasCaptain) {
      alert('This team already has a captain.');
      return;
    }

    if (player.isViceCaptain && hasViceCaptain) {
      alert('This team already has a vice-captain.');
      return;
    }

    if (isEditing) {
      setPlayers(players.map((p) => (p.name === player.name ? player : p)));
    } else {
      setPlayers([...players, player]);
    }
    setEditingPlayer(null); // Reset after editing
  };

  const filterPlayers = (filterCriteria) => {
    let filtered = players;

    if (filterCriteria.role) {
      filtered = filtered.filter((p) => p.role === filterCriteria.role);
    }

    if (filterCriteria.team) {
      filtered = filtered.filter((p) => p.team === filterCriteria.team);
    }

    if (filterCriteria.isCaptain) {
      filtered = filtered.filter((p) => p.isCaptain);
    }

    if (filterCriteria.isViceCaptain) {
      filtered = filtered.filter((p) => p.isViceCaptain);
    }

    setFilteredPlayers(filtered);
  };

  const editPlayer = (player) => {
    setEditingPlayer(player);
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
  };

  return (
    <div>
      <h1>Player Management</h1>
      <PlayerForm
        onSubmit={addOrUpdatePlayer}
        existingPlayer={editingPlayer}
        isEditing={!!editingPlayer}
        cancelEdit={cancelEdit}
      />
      <PlayerFilter onFilter={filterPlayers} />
      <PlayerList players={filteredPlayers.length > 0 ? filteredPlayers : players} onEdit={editPlayer} />
    </div>
  );
};

export default Ipl;

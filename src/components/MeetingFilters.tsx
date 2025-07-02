import React from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';

interface MeetingFiltersProps {
  filters: {
    date: string;
    status: string;
    participant: string;
    sort: string;
  };
  onChange: (filters: MeetingFiltersProps['filters']) => void;
  onReset: () => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({ filters, onChange, onReset }) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
      <TextField
        label="Data"
        type="date"
        value={filters.date}
        onChange={e => onChange({ ...filters, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        select
        label="Status"
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        style={{ minWidth: 120 }}
      >
        <MenuItem value="">Wszystkie</MenuItem>
        <MenuItem value="scheduled">Zaplanowane</MenuItem>
        <MenuItem value="canceled">Odwołane</MenuItem>
      </TextField>
      <TextField
        label="Uczestnik (email)"
        value={filters.participant}
        onChange={e => onChange({ ...filters, participant: e.target.value })}
      />
      <TextField
        select
        label="Sortuj po"
        value={filters.sort}
        onChange={e => onChange({ ...filters, sort: e.target.value })}
        style={{ minWidth: 120 }}
      >
        <MenuItem value="date">Data</MenuItem>
        <MenuItem value="title">Tytuł</MenuItem>
      </TextField>
      <Button variant="outlined" color="secondary" onClick={onReset}>Wyczyść</Button>
    </Box>
  );
};

export default MeetingFilters; 
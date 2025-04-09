import { render, screen, fireEvent } from '@testing-library/react';
import TimeZoneSelector from './TimeZoneSelector';
import { getAvailableTimezones } from '../services/timeService';

// Mock the timeService
jest.mock('../services/timeService', () => ({
  getAvailableTimezones: jest.fn().mockReturnValue([
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' }
  ])
}));

describe('TimeZoneSelector Component', () => {
  const mockAddClock = jest.fn();
  
  beforeEach(() => {
    mockAddClock.mockClear();
  });
  
  test('renders with default props', () => {
    render(<TimeZoneSelector onAddClock={mockAddClock} />);
    
    // Check if the component renders
    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();
    
    // Check if the Add Clock button is rendered
    const addButton = screen.getByText('Add Clock');
    expect(addButton).toBeInTheDocument();
    
    // Check if the timezone service was called
    expect(getAvailableTimezones).toHaveBeenCalled();
  });
  
  test('adds a clock when button is clicked', () => {
    render(<TimeZoneSelector onAddClock={mockAddClock} />);
    
    // Click the Add Clock button
    const addButton = screen.getByText('Add Clock');
    fireEvent.click(addButton);
    
    // Check if the onAddClock callback was called with the default timezone
    expect(mockAddClock).toHaveBeenCalledWith('UTC', 'UTC (GMT+0)');
  });
  
  test('changes timezone when dropdown is changed', () => {
    render(<TimeZoneSelector onAddClock={mockAddClock} />);
    
    // Select a different timezone
    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: 'America/New_York' } });
    
    // Click the Add Clock button
    const addButton = screen.getByText('Add Clock');
    fireEvent.click(addButton);
    
    // Check if the onAddClock callback was called with the selected timezone
    expect(mockAddClock).toHaveBeenCalledWith('America/New_York', 'New York (GMT-5)');
  });
  
  test('toggles advanced mode when button is clicked', () => {
    render(<TimeZoneSelector onAddClock={mockAddClock} />);
    
    // Initially, advanced mode should be off
    expect(screen.queryByPlaceholderText('Search timezones...')).not.toBeInTheDocument();
    
    // Click the Advanced button
    const advancedButton = screen.getByText('Advanced');
    fireEvent.click(advancedButton);
    
    // Now, the search input should be visible
    expect(screen.getByPlaceholderText('Search timezones...')).toBeInTheDocument();
    
    // The button text should change to "Simple"
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});

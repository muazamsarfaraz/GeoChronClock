import { render, screen, fireEvent } from '@testing-library/react';
import ClockCollection from './ClockCollection';

// Mock the AnalogClock component
jest.mock('./AnalogClock', () => {
  return function MockAnalogClock({ timezone, label }) {
    return (
      <div data-testid="mock-analog-clock">
        <div>Timezone: {timezone}</div>
        <div>Label: {label}</div>
      </div>
    );
  };
});

describe('ClockCollection Component', () => {
  const mockClocks = [
    { id: 1, timezone: 'UTC', label: 'UTC' },
    { id: 2, timezone: 'America/New_York', label: 'New York' }
  ];
  
  const mockRemoveClock = jest.fn();
  
  beforeEach(() => {
    mockRemoveClock.mockClear();
  });
  
  test('renders with clocks', () => {
    render(<ClockCollection clocks={mockClocks} onRemoveClock={mockRemoveClock} />);
    
    // Check if the component renders
    const title = screen.getByText('Custom Clocks');
    expect(title).toBeInTheDocument();
    
    // Check if all clocks are rendered
    const clockElements = screen.getAllByTestId('mock-analog-clock');
    expect(clockElements).toHaveLength(2);
    
    // Check if the clock labels are rendered
    expect(screen.getByText('Timezone: UTC')).toBeInTheDocument();
    expect(screen.getByText('Timezone: America/New_York')).toBeInTheDocument();
  });
  
  test('renders empty state when no clocks', () => {
    render(<ClockCollection clocks={[]} onRemoveClock={mockRemoveClock} />);
    
    // Check if the empty state message is rendered
    const emptyMessage = screen.getByText('No custom clocks added. Use the timezone selector to add clocks.');
    expect(emptyMessage).toBeInTheDocument();
    
    // Check that no clocks are rendered
    const clockElements = screen.queryAllByTestId('mock-analog-clock');
    expect(clockElements).toHaveLength(0);
  });
  
  test('calls onRemoveClock when remove button is clicked', () => {
    render(<ClockCollection clocks={mockClocks} onRemoveClock={mockRemoveClock} />);
    
    // Find all remove buttons
    const removeButtons = screen.getAllByTitle('Remove Clock');
    expect(removeButtons).toHaveLength(2);
    
    // Click the first remove button
    fireEvent.click(removeButtons[0]);
    
    // Check if the onRemoveClock callback was called with the correct clock ID
    expect(mockRemoveClock).toHaveBeenCalledWith(1);
  });
  
  test('changes layout when layout buttons are clicked', () => {
    render(<ClockCollection clocks={mockClocks} onRemoveClock={mockRemoveClock} />);
    
    // Initially, the layout should be grid
    const clocksContainer = screen.getByClassName('clocks-container');
    expect(clocksContainer).toHaveClass('grid');
    
    // Click the carousel layout button
    const carouselButton = screen.getByTitle('Carousel Layout');
    fireEvent.click(carouselButton);
    
    // Now, the layout should be carousel
    expect(clocksContainer).toHaveClass('carousel');
    
    // Click the grid layout button
    const gridButton = screen.getByTitle('Grid Layout');
    fireEvent.click(gridButton);
    
    // Now, the layout should be grid again
    expect(clocksContainer).toHaveClass('grid');
  });
});

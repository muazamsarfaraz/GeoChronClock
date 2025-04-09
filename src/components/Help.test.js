import { render, screen, fireEvent } from '@testing-library/react';
import Help from './Help';

describe('Help Component', () => {
  test('renders help button', () => {
    render(<Help />);
    
    // Check if the help button is rendered
    const helpButton = screen.getByTitle('Help');
    expect(helpButton).toBeInTheDocument();
    
    // Help panel should not be visible initially
    const helpPanel = screen.queryByText('GeoChronClock Help');
    expect(helpPanel).not.toBeInTheDocument();
  });
  
  test('opens help panel when button is clicked', () => {
    render(<Help />);
    
    // Click the help button
    const helpButton = screen.getByTitle('Help');
    fireEvent.click(helpButton);
    
    // Help panel should now be visible
    const helpPanel = screen.getByText('GeoChronClock Help');
    expect(helpPanel).toBeInTheDocument();
    
    // Overview section should be visible by default
    const overviewTitle = screen.getByText('Welcome to GeoChronClock');
    expect(overviewTitle).toBeInTheDocument();
  });
  
  test('closes help panel when close button is clicked', () => {
    render(<Help />);
    
    // Open the help panel
    const helpButton = screen.getByTitle('Help');
    fireEvent.click(helpButton);
    
    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    
    // Help panel should now be hidden
    const helpPanel = screen.queryByText('GeoChronClock Help');
    expect(helpPanel).not.toBeInTheDocument();
  });
  
  test('changes section when navigation buttons are clicked', () => {
    render(<Help />);
    
    // Open the help panel
    const helpButton = screen.getByTitle('Help');
    fireEvent.click(helpButton);
    
    // Initially, the overview section should be visible
    expect(screen.getByText('Welcome to GeoChronClock')).toBeInTheDocument();
    
    // Click the "World Map" navigation button
    const mapButton = screen.getByRole('button', { name: 'World Map' });
    fireEvent.click(mapButton);
    
    // Now, the world map section should be visible
    expect(screen.getByText('World Map with Day/Night Gradient')).toBeInTheDocument();
    
    // The overview section should no longer be visible
    expect(screen.queryByText('Welcome to GeoChronClock')).not.toBeInTheDocument();
    
    // Click the "City Pins" navigation button
    const citiesButton = screen.getByRole('button', { name: 'City Pins' });
    fireEvent.click(citiesButton);
    
    // Now, the city pins section should be visible
    expect(screen.getByText('Major City Time Pins')).toBeInTheDocument();
  });
});

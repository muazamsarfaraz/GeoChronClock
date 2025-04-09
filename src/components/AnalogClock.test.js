import { render, screen } from '@testing-library/react';
import AnalogClock from './AnalogClock';

// Mock moment-timezone to provide consistent time for testing
jest.mock('moment-timezone', () => {
  const mockMoment = jest.requireActual('moment-timezone');
  
  // Create a fixed test date: 2023-01-01 10:30:45
  const fixedDate = new Date(2023, 0, 1, 10, 30, 45);
  
  return {
    ...mockMoment,
    tz: jest.fn().mockImplementation((timezone) => {
      return {
        hours: () => 10,
        minutes: () => 30,
        seconds: () => 45,
        format: (format) => {
          if (format === 'HH:mm:ss') return '10:30:45';
          if (format === 'Z') return '+00:00';
          return '';
        }
      };
    })
  };
});

describe('AnalogClock Component', () => {
  test('renders with default props', () => {
    render(<AnalogClock />);
    
    // Check if the clock face is rendered
    const clockFace = document.querySelector('.clock-face');
    expect(clockFace).toBeInTheDocument();
    
    // Check if the clock hands are rendered
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');
    
    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(secondHand).toBeInTheDocument();
    
    // Check if the label is rendered
    const label = screen.getByText('UTC');
    expect(label).toBeInTheDocument();
    
    // Check if the digital time is rendered
    const digitalTime = screen.getByText('10:30:45');
    expect(digitalTime).toBeInTheDocument();
  });
  
  test('renders with custom props', () => {
    render(
      <AnalogClock 
        timezone="America/New_York" 
        label="New York" 
        size="large"
        theme="dark"
        showSeconds={false}
      />
    );
    
    // Check if the custom label is rendered
    const label = screen.getByText('New York');
    expect(label).toBeInTheDocument();
    
    // Check if the clock has the correct size class
    const clock = document.querySelector('.analog-clock');
    expect(clock).toHaveClass('large');
    
    // Check if the clock has the correct theme class
    expect(clock).toHaveClass('dark');
    
    // Check if the second hand is not rendered when showSeconds is false
    const secondHand = document.querySelector('.second-hand');
    expect(secondHand).not.toBeInTheDocument();
  });
  
  test('renders with showDigitalTime=false', () => {
    render(<AnalogClock showDigitalTime={false} />);
    
    // Check if the digital time is not rendered
    const digitalTime = screen.queryByText('10:30:45');
    expect(digitalTime).not.toBeInTheDocument();
  });
});

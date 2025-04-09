import { render, screen, fireEvent, act } from '@testing-library/react';
import Notification from './Notification';

// Mock timers
jest.useFakeTimers();

describe('Notification Component', () => {
  test('renders with default props', () => {
    render(<Notification message="Test notification" show={true} />);
    
    // Check if the notification is rendered
    const notification = screen.getByText('Test notification');
    expect(notification).toBeInTheDocument();
    
    // Check if the notification has the default info type
    const notificationElement = notification.closest('.notification');
    expect(notificationElement).toHaveClass('info');
  });
  
  test('renders with custom type', () => {
    render(<Notification message="Success message" type="success" show={true} />);
    
    // Check if the notification has the success type
    const notification = screen.getByText('Success message');
    const notificationElement = notification.closest('.notification');
    expect(notificationElement).toHaveClass('success');
  });
  
  test('does not render when show is false', () => {
    render(<Notification message="Hidden notification" show={false} />);
    
    // Check if the notification is not rendered
    const notification = screen.queryByText('Hidden notification');
    expect(notification).not.toBeInTheDocument();
  });
  
  test('closes after duration', () => {
    const mockOnClose = jest.fn();
    render(
      <Notification 
        message="Auto-close notification" 
        show={true} 
        duration={1000}
        onClose={mockOnClose}
      />
    );
    
    // Check if the notification is initially rendered
    expect(screen.getByText('Auto-close notification')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Wait for the animation to complete
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('closes when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <Notification 
        message="Closable notification" 
        show={true}
        onClose={mockOnClose}
      />
    );
    
    // Find and click the close button
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // Wait for the animation to complete
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});

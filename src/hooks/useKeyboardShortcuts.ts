import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      action: () => navigate('/'),
      description: 'Go to Dashboard'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => navigate('/club-talk'),
      description: 'Go to Club Talk'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => navigate('/groups'),
      description: 'Go to Groups'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => navigate('/events'),
      description: 'Go to Events'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // Try to click the global search button
        const globalSearchButton = document.querySelector('[data-global-search]') as HTMLElement;
        if (globalSearchButton) {
          globalSearchButton.click();
          return;
        }
        
        // Fallback to focus on search input if available
        const searchInput = document.getElementById('global-search') || 
                           document.getElementById('event-search') || 
                           document.getElementById('group-search');
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Global Search'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        // Trigger create event or group based on current page
        const path = window.location.pathname;
        if (path.includes('/events')) {
          const createButton = document.querySelector('[data-create="event"]') as HTMLElement;
          if (createButton) createButton.click();
        } else if (path.includes('/groups')) {
          const createButton = document.querySelector('[data-create="group"]') as HTMLElement;
          if (createButton) createButton.click();
        }
      },
      description: 'Create New (Event/Group)'
    },
    {
      key: '/',
      action: () => {
        const searchInput = document.getElementById('global-search') || 
                           document.getElementById('event-search') || 
                           document.getElementById('group-search');
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Quick Search'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals or dialogs
        const closeButtons = document.querySelectorAll('[data-dialog-close]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
        
        // Blur any focused inputs
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      },
      description: 'Close Modal/Blur Input'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Allow Escape key to still work
        if (event.key !== 'Escape') {
          return;
        }
      }

      const matchingShortcut = shortcuts.find(shortcut => 
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey
      );

      if (matchingShortcut) {
        event.preventDefault();
        if (typeof matchingShortcut.action === 'function') {
          matchingShortcut.action();
        } else {
          (matchingShortcut.action as any)(event);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return { shortcuts };
}

// Hook to show keyboard shortcuts help
export function useKeyboardShortcutsHelp() {
  const { shortcuts } = useKeyboardShortcuts();

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  return {
    shortcuts: shortcuts.map(shortcut => ({
      keys: formatShortcut(shortcut),
      description: shortcut.description
    }))
  };
}
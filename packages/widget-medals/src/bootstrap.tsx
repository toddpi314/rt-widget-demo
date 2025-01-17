import React from 'react';
import MedalsWidget from './MedalsWidget';
import { logger } from './utils/logger';

logger.log('Bootstrap module loaded');

// Re-export the component with proper initialization
const Widget = (props: any) => {
    logger.log('Widget bootstrap rendering with props:', props);
    try {
        const element = React.createElement(MedalsWidget, props);
        logger.log('Created element:', {
            type: element.type,
            props: element.props
        });
        return element;
    } catch (error) {
        logger.error('Error creating widget element:', error);
        throw error;
    }
};

// Mount function for federation
const mount = (container: HTMLElement, props: any) => {
    logger.log('Mount function called with props:', props);
    logger.log('Container:', container);
    logger.log('React available:', !!React);
    logger.log('ReactDOM available:', !!(window as any).ReactDOM);
    
    try {
        const ReactDOM = (window as any).ReactDOM;
        if (!ReactDOM) {
            throw new Error('ReactDOM not found on window');
        }

        logger.log('Creating root');
        const root = ReactDOM.createRoot(container);
        logger.log('Root created');

        logger.log('Creating widget element');
        const element = React.createElement(Widget, props);
        logger.log('Element created');

        logger.log('Rendering widget');
        root.render(element);
        logger.log('Widget rendered');

        return () => {
            logger.log('Unmounting widget');
            root.unmount();
        };
    } catch (error) {
        logger.error('Error mounting widget:', error);
        logger.error('Error details:', {
            error,
            container: !!container,
            containerType: container?.constructor?.name,
            containerHTML: container?.outerHTML,
            React: !!React,
            ReactDOM: !!(window as any).ReactDOM,
            props
        });
        throw error;
    }
};

// Export for federation
export { mount, Widget, MedalsWidget }; 
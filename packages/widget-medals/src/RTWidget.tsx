import React from 'react';

export interface RTWidgetProps {
    title?: string;
    children?: React.ReactNode;
}

const RTWidget: React.FC<RTWidgetProps> = ({ title, children }) => {
    return (
        <div className="rt-widget">
            {title && <h2 className="rt-widget-title">{title}</h2>}
            <div className="rt-widget-content">
                {children}
            </div>
        </div>
    );
};

export default RTWidget; 
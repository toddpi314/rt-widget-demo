import React from 'react';

export interface MedalsWidgetProps {
    title?: string;
    children?: React.ReactNode;
}

const MedalsWidget: React.FC<MedalsWidgetProps> = ({ title, children }) => {
    return (
        <div className="rt-widget" data-testid="rt-widget">
            {title && <h2 className="rt-widget-title">{title}</h2>}
            <div className="rt-widget-content">
                {children}
            </div>
        </div>
    );
};

export default MedalsWidget; 
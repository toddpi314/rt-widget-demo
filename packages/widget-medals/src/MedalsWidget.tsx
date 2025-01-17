import React from 'react';
import { createPortal } from 'react-dom';

export type MedalsSortType = 'total' | 'gold' | 'silver' | 'bronze';

export interface MedalsWidgetProps {
    element_id: string;
    title?: string;
    children?: React.ReactNode;
    sort?: MedalsSortType;
}

const MedalsWidget: React.FC<MedalsWidgetProps> = ({ element_id, title, children, sort = 'gold' }) => {
    const content = typeof children === 'string' ? (
        <div dangerouslySetInnerHTML={{ __html: children }} />
    ) : children;

    const widgetContent = (
        <div 
            className="rt-widget" 
            data-testid="rt-widget" 
            data-sort={sort}
            style={{ border: '2px solid red' }}
        >
            {title && <h2 className="rt-widget-title">{title}</h2>}
            <div className="rt-widget-content">
                {content}
            </div>
        </div>
    );

    const targetElement = document.getElementById(element_id);
    if (targetElement) {
        return createPortal(widgetContent, targetElement);
    }

    return widgetContent;
};

export default MedalsWidget;
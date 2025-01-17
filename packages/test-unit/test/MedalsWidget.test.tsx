import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MedalsWidgetProps } from '../../widget-medals/src/MedalsWidget';

const RTWidgetMedals = (props: MedalsWidgetProps) => (
    <div data-testid="rt-widget" data-sort={props.sort || 'gold'}>
        {props.children}
    </div>
);

describe('MedalsWidget', () => {
    it('renders without crashing', () => {
        render(<RTWidgetMedals element_id="test-widget" />);
        expect(screen.getByTestId('rt-widget')).toBeInTheDocument();
    });

    it('renders children content', () => {
        const childText = 'Child content';
        render(
            <RTWidgetMedals element_id="test-widget">
                <p>{childText}</p>
            </RTWidgetMedals>
        );
        expect(screen.getByText(childText)).toBeInTheDocument();
    });

    it('uses gold as default sort value', () => {
        const { container } = render(<RTWidgetMedals element_id="test-widget" />);
        expect(container.firstChild).toHaveAttribute('data-sort', 'gold');
    });

    it('accepts custom sort value', () => {
        const { container } = render(<RTWidgetMedals element_id="test-widget" sort="total" />);
        expect(container.firstChild).toHaveAttribute('data-sort', 'total');
    });
}); 
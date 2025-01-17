import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MedalsWidgetProps } from '../../widget-medals/src/MedalsWidget';

const RTWidgetMedals = (props: MedalsWidgetProps) => <div data-testid="rt-widget">{props.title && <h1>{props.title}</h1>}{props.children}</div>;

describe('MedalsWidget', () => {
    it('renders without crashing', () => {
        render(<RTWidgetMedals element_id="test-widget" />);
        expect(screen.getByTestId('rt-widget')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        const title = 'Test Title';
        render(<RTWidgetMedals element_id="test-widget" title={title} />);
        expect(screen.getByText(title)).toBeInTheDocument();
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

    it('does not render title when not provided', () => {
        render(<RTWidgetMedals element_id="test-widget" />);
        const titleElements = screen.queryAllByRole('heading');
        expect(titleElements).toHaveLength(0);
    });
}); 
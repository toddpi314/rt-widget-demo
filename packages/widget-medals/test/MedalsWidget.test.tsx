import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedalsWidget from '../src/MedalsWidget';

describe('MedalsWidget', () => {
    it('renders without crashing', () => {
        render(<MedalsWidget />);
        expect(screen.getByTestId('rt-widget')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        const title = 'Test Title';
        render(<MedalsWidget title={title} />);
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('renders children content', () => {
        const childText = 'Child content';
        render(
            <MedalsWidget>
                <p>{childText}</p>
            </MedalsWidget>
        );
        expect(screen.getByText(childText)).toBeInTheDocument();
    });

    it('does not render title when not provided', () => {
        render(<MedalsWidget />);
        const titleElements = screen.queryAllByRole('heading');
        expect(titleElements).toHaveLength(0);
    });
}); 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedalsWidget from '../../widget-medals/src/MedalsWidget';
import { useMedalData } from '../../widget-medals/src/hooks/useMedalData';
import { useFlagData } from '../../widget-medals/src/hooks/useFlagData';

// Mock the hooks
jest.mock('../../widget-medals/src/hooks/useMedalData');
jest.mock('../../widget-medals/src/hooks/useFlagData');

const mockMedalData = [
    { code: 'USA', gold: 9, silver: 7, bronze: 12, flagKey: 'usa' },
    { code: 'NOR', gold: 11, silver: 5, bronze: 10, flagKey: 'nor' },
    { code: 'RUS', gold: 13, silver: 11, bronze: 9, flagKey: 'rus' },
    { code: 'NED', gold: 8, silver: 7, bronze: 9, flagKey: 'ned' },
    { code: 'FRA', gold: 4, silver: 4, bronze: 7, flagKey: 'fra' },
    { code: 'SWE', gold: 2, silver: 7, bronze: 6, flagKey: 'swe' },
    { code: 'ITA', gold: 0, silver: 2, bronze: 6, flagKey: 'ita' },
    { code: 'CAN', gold: 10, silver: 10, bronze: 5, flagKey: 'can' },
    { code: 'SUI', gold: 6, silver: 3, bronze: 2, flagKey: 'sui' },
    { code: 'BLR', gold: 5, silver: 0, bronze: 1, flagKey: 'blr' },
    { code: 'GER', gold: 8, silver: 6, bronze: 5, flagKey: 'ger' },
    { code: 'AUT', gold: 4, silver: 8, bronze: 5, flagKey: 'aut' },
    { code: 'CHN', gold: 3, silver: 4, bronze: 2, flagKey: 'chn' }
].map(item => ({ ...item, flagKey: item.code.toLowerCase() }));

const mockFlagUrl = 'http://example.com/flags/';

describe('MedalsWidget', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Sort data by gold medals first
        const sortedData = [...mockMedalData].sort((a, b) => {
            if (b.gold !== a.gold) return b.gold - a.gold;
            if (b.silver !== a.silver) return b.silver - a.silver;
            return b.bronze - a.bronze;
        });

        // Mock useMedalData implementation
        (useMedalData as jest.Mock).mockReturnValue({
            data: sortedData.slice(0, 10), // Only show top 10 as per the component's behavior
            toggleSort: jest.fn(),
            sortField: 'gold',
            sortOrder: 'desc'
        });

        // Mock useFlagData implementation
        (useFlagData as jest.Mock).mockReturnValue({
            getFlagAssetUrl: (key: string) => `${mockFlagUrl}${key}.png`
        });
    });

    it('renders the widget with default sort (gold)', () => {
        render(<MedalsWidget element_id="test-widget" />);

        // Check title
        expect(screen.getByText('MEDAL COUNT')).toBeInTheDocument();

        // Check if countries are rendered in correct order (top 3 by gold)
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(11); // Header + 10 data rows

        // Check first country row (RUS - most gold medals)
        const firstRow = rows[1];
        expect(firstRow).toHaveTextContent('RUS');
        expect(firstRow).toHaveTextContent('13'); // gold
        expect(firstRow).toHaveTextContent('11'); // silver
        expect(firstRow).toHaveTextContent('9');  // bronze
        expect(firstRow).toHaveTextContent('33'); // total

        // Check flag images
        const flags = screen.getAllByRole('img');
        expect(flags).toHaveLength(10); // Top 10 countries
        expect(flags[0]).toHaveAttribute('src', `${mockFlagUrl}rus.png`);
    });

    it('handles sorting when clicking medal headers', () => {
        const mockToggleSort = jest.fn();
        (useMedalData as jest.Mock).mockReturnValue({
            data: mockMedalData.slice(0, 10),
            toggleSort: mockToggleSort,
            sortField: 'gold',
            sortOrder: 'desc'
        });

        render(<MedalsWidget element_id="test-widget" />);

        // Find and click the silver medal header
        const headers = screen.getAllByRole('columnheader');
        fireEvent.click(headers[3]); // Silver header (index 3: empty, country, gold, silver)

        // Check if toggleSort was called with correct argument
        expect(mockToggleSort).toHaveBeenCalledWith('silver');
    });

    it('updates display when sort field changes', () => {
        // First render with gold sort
        const { rerender } = render(<MedalsWidget element_id="test-widget" />);

        // Verify initial sort indicator and order (RUS should be first with most gold)
        const goldHeader = screen.getAllByRole('columnheader')[2];
        expect(goldHeader).toHaveStyle({ borderTop: '2px solid #999' });
        expect(screen.getAllByRole('row')[1]).toHaveTextContent('RUS');

        // Sort data by silver medals
        const silverSortedData = [...mockMedalData].sort((a, b) => {
            if (b.silver !== a.silver) return b.silver - a.silver;
            if (b.gold !== a.gold) return b.gold - a.gold;
            return b.bronze - a.bronze;
        });

        // Update mock to simulate sort change to silver
        (useMedalData as jest.Mock).mockReturnValue({
            data: silverSortedData.slice(0, 10),
            toggleSort: jest.fn(),
            sortField: 'silver',
            sortOrder: 'desc'
        });

        // Rerender the component
        rerender(<MedalsWidget element_id="test-widget" />);

        // Verify sort indicator moved to silver column and RUS still first (most silver)
        const silverHeader = screen.getAllByRole('columnheader')[3];
        expect(silverHeader).toHaveStyle({ borderTop: '2px solid #999' });
        expect(screen.getAllByRole('row')[1]).toHaveTextContent('RUS'); // RUS has most silver medals
    });

    it('renders total column with emphasis', () => {
        render(<MedalsWidget element_id="test-widget" />);

        // Check total header styling
        const totalHeader = screen.getByText('Total').closest('th');
        expect(totalHeader).toBeInTheDocument();
        expect(totalHeader).toHaveStyle({ color: '#666' });

        // Check total values styling
        const totalValues = screen.getAllByRole('cell').filter(cell => {
            const content = cell.textContent || '';
            // Find cells that contain only numbers and are total values (sum of medals)
            return /^\d+$/.test(content) && 
                   cell.querySelector('strong') !== null; // Total values are wrapped in <strong>
        });
        
        expect(totalValues).toHaveLength(10); // One total for each country shown
        totalValues.forEach(value => {
            expect(value).toHaveStyle({ color: '#666' });
        });
    });

    it('handles empty data gracefully', () => {
        (useMedalData as jest.Mock).mockReturnValue({
            data: [],
            toggleSort: jest.fn(),
            sortField: 'gold',
            sortOrder: 'desc'
        });

        render(<MedalsWidget element_id="test-widget" />);

        // Should still render the table structure
        expect(screen.getByText('MEDAL COUNT')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
        
        // But no data rows
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(1); // Just the header row
    });

    it('renders with custom sort prop', () => {
        // Mock useMedalData to return the custom sort field
        (useMedalData as jest.Mock).mockReturnValue({
            data: mockMedalData.slice(0, 10),
            toggleSort: jest.fn(),
            sortField: 'total',
            sortOrder: 'desc'
        });

        render(<MedalsWidget element_id="test-widget" sort="total" />);
        
        // Verify the sort attribute is set
        const widget = screen.getByTestId('rt-widget');
        expect(widget).toHaveAttribute('data-sort', 'total');
    });

    it('displays correct order and values when sorting by gold', () => {
        // Update mock data to match the image exactly
        const imageData = [
            { code: 'RUS', gold: 13, silver: 11, bronze: 9, flagKey: 'rus' },
            { code: 'NOR', gold: 11, silver: 5, bronze: 10, flagKey: 'nor' },
            { code: 'CAN', gold: 10, silver: 10, bronze: 5, flagKey: 'can' },
            { code: 'USA', gold: 9, silver: 7, bronze: 12, flagKey: 'usa' },
            { code: 'NED', gold: 8, silver: 7, bronze: 9, flagKey: 'ned' },
            { code: 'GER', gold: 8, silver: 6, bronze: 5, flagKey: 'ger' },
            { code: 'SUI', gold: 6, silver: 3, bronze: 2, flagKey: 'sui' },
            { code: 'BLR', gold: 5, silver: 0, bronze: 1, flagKey: 'blr' },
            { code: 'AUT', gold: 4, silver: 8, bronze: 5, flagKey: 'aut' },
            { code: 'FRA', gold: 4, silver: 4, bronze: 7, flagKey: 'fra' }
        ].map(item => ({ ...item, flagKey: item.code.toLowerCase() }));

        // Mock with exact data
        (useMedalData as jest.Mock).mockReturnValue({
            data: imageData,
            toggleSort: jest.fn(),
            sortField: 'gold',
            sortOrder: 'desc'
        });

        render(<MedalsWidget element_id="test-widget" />);

        // Get all rows including header
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(11); // Header + 10 data rows

        // Define expected data for each row
        const expectedData = [
            { pos: '1', country: 'RUS', gold: '13', silver: '11', bronze: '9', total: '33' },
            { pos: '2', country: 'NOR', gold: '11', silver: '5', bronze: '10', total: '26' },
            { pos: '3', country: 'CAN', gold: '10', silver: '10', bronze: '5', total: '25' },
            { pos: '4', country: 'USA', gold: '9', silver: '7', bronze: '12', total: '28' },
            { pos: '5', country: 'NED', gold: '8', silver: '7', bronze: '9', total: '24' },
            { pos: '6', country: 'GER', gold: '8', silver: '6', bronze: '5', total: '19' },
            { pos: '7', country: 'SUI', gold: '6', silver: '3', bronze: '2', total: '11' },
            { pos: '8', country: 'BLR', gold: '5', silver: '0', bronze: '1', total: '6' },
            { pos: '9', country: 'AUT', gold: '4', silver: '8', bronze: '5', total: '17' },
            { pos: '10', country: 'FRA', gold: '4', silver: '4', bronze: '7', total: '15' }
        ];

        // Check each row's content and order
        expectedData.forEach((expected, index) => {
            const row = rows[index + 1]; // +1 to skip header row
            const cells = row.querySelectorAll('td');
            
            // Check position
            expect(cells[0]).toHaveTextContent(expected.pos);
            
            // Check country code
            expect(cells[1]).toHaveTextContent(expected.country);
            
            // Check medal counts
            expect(cells[2]).toHaveTextContent(expected.gold);
            expect(cells[3]).toHaveTextContent(expected.silver);
            expect(cells[4]).toHaveTextContent(expected.bronze);
            expect(cells[5]).toHaveTextContent(expected.total);
        });

        // Verify tiebreaker cases specifically
        const allRows = screen.getAllByRole('row');
        
        // Case 1: NED vs GER (same gold, different total)
        const nedRow = allRows[5];  // 5th row (1-based index)
        const gerRow = allRows[6];  // 6th row
        expect(nedRow).toHaveTextContent('NED');
        expect(gerRow).toHaveTextContent('GER');
        
        // Case 2: AUT vs FRA (same gold, different silver)
        const autRow = allRows[9];  // 9th row
        const fraRow = allRows[10]; // 10th row
        expect(autRow).toHaveTextContent('AUT');
        expect(fraRow).toHaveTextContent('FRA');
    });
}); 
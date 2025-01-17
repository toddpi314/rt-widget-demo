import React from 'react';
import { SortField } from '../hooks/useMedalData';
import { commonHeaderStyle, medalCircleStyle, colors } from '../styles';

interface MedalHeaderProps {
    type: SortField;
    color: string;
    sortField: SortField;
    onSort: (type: SortField) => void;
}

export const MedalHeader: React.FC<MedalHeaderProps> = ({ type, color, sortField, onSort }) => (
    <th 
        onClick={() => onSort(type)}
        style={{
            ...commonHeaderStyle,
            borderTop: sortField === type ? `2px solid ${colors.text}` : 'none'
        }}
    >
        <span style={{
            ...medalCircleStyle,
            backgroundColor: color
        }}/>
    </th>
); 
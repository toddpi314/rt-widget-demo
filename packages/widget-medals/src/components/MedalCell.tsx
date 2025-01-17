import React from 'react';
import { commonCellStyle } from './styles';

interface MedalCellProps {
    content: React.ReactNode;
    additionalStyle?: React.CSSProperties;
}

export const MedalCell: React.FC<MedalCellProps> = ({ content, additionalStyle = {} }) => (
    <td style={{ 
        ...commonCellStyle,
        padding: '0 8px',
        textAlign: 'center',
        ...additionalStyle
    }}>
        {content}
    </td>
); 
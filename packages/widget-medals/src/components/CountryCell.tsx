import React from 'react';
import { commonCellStyle } from '../styles';

interface CountryCellProps {
    code: string;
    flagUrl: string;
}

export const CountryCell: React.FC<CountryCellProps> = ({ code, flagUrl }) => (
    <td style={{ 
        ...commonCellStyle,
        padding: '0 8px',
        whiteSpace: 'nowrap'
    }}>
        <img 
            src={flagUrl} 
            alt={`${code} flag`}
            style={{
                width: '24px',
                height: '18px',
                marginRight: '8px',
                verticalAlign: 'middle',
                display: 'inline-block'
            }}
        /> 
        <span style={{ verticalAlign: 'middle' }}>{code}</span>
    </td>
); 
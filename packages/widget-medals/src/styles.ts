// Color constants
export const colors = {
    text: '#999',
    textEmphasis: '#666',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
} as const;

// Shared styles
export const commonCellStyle = {
    color: colors.text,
    verticalAlign: 'middle', 
    height: '25px',
    lineHeight: '25px'
};

export const commonHeaderStyle = {
    color: colors.text,
    whiteSpace: 'nowrap' as const,
    height: '30px'
};

export const medalCircleStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '50%'
};

export const totalStyle = {
    color: colors.textEmphasis
}; 
import React from 'react';
import { createPortal } from 'react-dom';
import { SortField, useMedalData } from './hooks/useMedalData';

export interface MedalsWidgetProps {
    element_id: string;
    children?: React.ReactNode;
    sort?: SortField;
}

const MedalsWidget: React.FC<MedalsWidgetProps> = ({ element_id, children, sort = 'gold' }) => {
    const { data, toggleSort, sortField } = useMedalData();

    const getFlagUrl = (flagKey: string) => {
        return `/assets/flags/${flagKey}.png`;
    };

    const widgetContent = (
        <div 
            className="rt-widget" 
            data-testid="rt-widget" 
            data-sort={sort}
        >
            <div className="rt-widget-content">
                <table className="medals-table">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th 
                                onClick={() => toggleSort('gold')}
                                style={{
                                    borderTop: sortField === 'gold' ? '2px solid #FFD700' : 'none',
                                    color: '#FFD700'
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FFD700'
                                }}/>
                            </th>
                            <th 
                                onClick={() => toggleSort('silver')}
                                style={{
                                    borderTop: sortField === 'silver' ? '2px solid #C0C0C0' : 'none',
                                    color: '#C0C0C0'
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#C0C0C0'
                                }}/>
                            </th>
                            <th 
                                onClick={() => toggleSort('bronze')}
                                style={{
                                    borderTop: sortField === 'bronze' ? '2px solid #CD7F32' : 'none',
                                    color: '#CD7F32'
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#CD7F32'
                                }}/>
                            </th>
                            <th 
                                onClick={() => toggleSort('total')}
                                style={{
                                    borderTop: sortField === 'total' ? '2px solid #000' : 'none'
                                }}
                            >
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((country, index) => (
                            <tr key={country.code}>
                                <td>
                                    {index + 1}. 
                                    <img 
                                        src={getFlagUrl(country.flagKey)} 
                                        alt={`${country.code} flag`}
                                        style={{
                                            width: '20px',
                                            height: '15px',
                                            marginRight: '5px',
                                            verticalAlign: 'middle'
                                        }}
                                    /> 
                                    {country.code}
                                </td>
                                <td>{country.gold}</td>
                                <td>{country.silver}</td>
                                <td>{country.bronze}</td>
                                <td><strong>{country.gold + country.silver + country.bronze}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {children && (
                    <div className="widget-children">
                        {typeof children === 'string' ? (
                            <div dangerouslySetInnerHTML={{ __html: children }} />
                        ) : children}
                    </div>
                )}
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
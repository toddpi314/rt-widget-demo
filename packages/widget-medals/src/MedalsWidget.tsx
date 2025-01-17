import React from 'react';
import { createPortal } from 'react-dom';
import { SortField, useMedalData } from './hooks/useMedalData';
import { useFlagData} from './hooks/useFlagData'

export interface MedalsWidgetProps {
    element_id: string;
    children?: React.ReactNode;
    sort?: SortField;
}

const MedalsWidget: React.FC<MedalsWidgetProps> = ({ element_id, children, sort = 'gold' }) => {
    const { data, toggleSort, sortField } = useMedalData();
    const { getFlagAssetUrl } = useFlagData();

    const widgetContent = (
        <div 
            className="rt-widget" 
            data-testid="rt-widget" 
            data-sort={sort}
        >
            <div className="rt-widget-content">
                <h2 style={{ 
                    textAlign: 'left',
                    margin: '10px 0',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: '#666'
                }}>
                    MEDAL COUNT
                </h2>
                <table className="medals-table" style={{ 
                    tableLayout: 'fixed', 
                    width: '100%', 
                    minWidth: '350px',
                    borderCollapse: 'collapse' 
                }}>
                    <colgroup>
                        <col style={{ width: '40px' }} /> {/* Index column - fixed */}
                        <col /> {/* Country column - flexible */}
                        <col style={{ width: '45px' }} /> {/* Gold medal column - fixed */}
                        <col style={{ width: '45px' }} /> {/* Silver medal column - fixed */}
                        <col style={{ width: '45px' }} /> {/* Bronze medal column - fixed */}
                        <col style={{ width: '60px' }} /> {/* Total column - fixed */}
                    </colgroup>
                    <thead>
                        <tr>
                            <th style={{ color: '#666', height: '30px' }}></th>
                            <th style={{ color: '#666', height: '30px' }}></th>
                            <th 
                                onClick={() => toggleSort('gold')}
                                style={{
                                    borderTop: sortField === 'gold' ? '2px solid #666' : 'none',
                                    color: '#666',
                                    whiteSpace: 'nowrap',
                                    height: '30px'
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
                                    borderTop: sortField === 'silver' ? '2px solid #666' : 'none',
                                    color: '#666',
                                    whiteSpace: 'nowrap',
                                    height: '30px'
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
                                    borderTop: sortField === 'bronze' ? '2px solid #666' : 'none',
                                    color: '#666',
                                    whiteSpace: 'nowrap',
                                    height: '30px'
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
                                    borderTop: sortField === 'total' ? '2px solid #666' : 'none',
                                    whiteSpace: 'nowrap',
                                    color: '#666',
                                    height: '30px'
                                }}
                            >
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ 
                        borderTop: '3px solid #666',
                        display: 'table-row-group' 
                    }}>
                        {data.map((country, index) => (
                            <tr key={country.code} style={{ 
                                height: '25px',
                                borderBottom: '1px solid #ccc'
                            }}>
                                <td style={{ 
                                    textAlign: 'center', 
                                    color: '#666', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}>{index + 1}</td>
                                <td style={{ 
                                    padding: '0 8px', 
                                    whiteSpace: 'nowrap', 
                                    color: '#666', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}>
                                    <img 
                                        src={getFlagAssetUrl(country.flagKey)} 
                                        alt={`${country.code} flag`}
                                        style={{
                                            width: '24px',
                                            height: '18px',
                                            marginRight: '8px',
                                            verticalAlign: 'middle',
                                            display: 'inline-block'
                                        }}
                                    /> 
                                    <span style={{ verticalAlign: 'middle' }}>{country.code}</span>
                                </td>
                                <td style={{ 
                                    padding: '0 8px', 
                                    textAlign: 'center', 
                                    color: '#666', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}>{country.gold}</td>
                                <td style={{ 
                                    padding: '0 8px', 
                                    textAlign: 'center', 
                                    color: '#666', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}>{country.silver}</td>
                                <td style={{ 
                                    padding: '0 8px', 
                                    textAlign: 'center', 
                                    color: '#666', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}>{country.bronze}</td>
                                <td style={{ 
                                    padding: '0 8px', 
                                    textAlign: 'center', 
                                    verticalAlign: 'middle',
                                    height: '25px',
                                    lineHeight: '25px'
                                }}><strong>{country.gold + country.silver + country.bronze}</strong></td>
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
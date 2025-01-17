/**
 * Medal Widget Component
 * 
 * This component renders an Olympic-style medal count table showing countries' gold, silver,
 * and bronze medal totals. It supports sorting by medal type and can be rendered either
 * directly or via a portal to a specified DOM element.
 * 
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { SortField, useMedalData } from './hooks/useMedalData';
import { useFlagData} from './hooks/useFlagData';
import { MedalHeader } from './components/MedalHeader';
import { MedalCell } from './components/MedalCell';
import { CountryCell } from './components/CountryCell';
import { commonHeaderStyle, totalStyle, colors } from './styles';

export interface MedalsWidgetProps {
    element_id: string;
    children?: React.ReactNode;
    sort?: SortField;
}

const MedalsWidget: React.FC<MedalsWidgetProps> = ({ element_id, children, sort = 'gold' }) => {
    const { data, toggleSort, sortField, sortOrder } = useMedalData({ initialSort: sort });
    const { getFlagAssetUrl } = useFlagData();

    const widgetContent = (
        <div 
            className="rt-widget" 
            data-testid="rt-widget" 
            data-sort={sortField}
            data-sort-order={sortOrder}
        >
            <div className="rt-widget-content">
                <h2 style={{ 
                    textAlign: 'left',
                    margin: '10px 0',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: colors.text
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
                        <col style={{ width: '40px' }} />
                        <col />
                        <col style={{ width: '45px' }} />
                        <col style={{ width: '45px' }} />
                        <col style={{ width: '45px' }} />
                        <col style={{ width: '60px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th style={commonHeaderStyle}></th>
                            <th style={commonHeaderStyle}></th>
                            <MedalHeader type="gold" color={colors.gold} sortField={sortField} onSort={toggleSort} />
                            <MedalHeader type="silver" color={colors.silver} sortField={sortField} onSort={toggleSort} />
                            <MedalHeader type="bronze" color={colors.bronze} sortField={sortField} onSort={toggleSort} />
                            <th 
                                onClick={() => toggleSort('total')}
                                style={{
                                    ...commonHeaderStyle,
                                    ...totalStyle,
                                    borderTop: sortField === 'total' ? `2px solid ${colors.textEmphasis}` : 'none'
                                }}
                            >
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ 
                        borderTop: `3px solid ${colors.text}`,
                        display: 'table-row-group' 
                    }}>
                        {data.map((country, index) => (
                            <tr key={country.code} style={{ 
                                height: '25px',
                                borderBottom: `1px solid ${colors.text}`
                            }}>
                                <MedalCell content={index + 1} additionalStyle={{ padding: 0 }} />
                                <CountryCell code={country.code} flagUrl={getFlagAssetUrl(country.flagKey)} />
                                <MedalCell content={country.gold} />
                                <MedalCell content={country.silver} />
                                <MedalCell content={country.bronze} />
                                <MedalCell 
                                    content={<strong>{country.gold + country.silver + country.bronze}</strong>}
                                    additionalStyle={totalStyle}
                                />
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
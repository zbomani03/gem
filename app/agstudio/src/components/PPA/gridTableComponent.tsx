import styles from "./grid.module.scss";
import * as React from "react";
import {GKButton, GKCollapse, GKCompletedState, GKIcon, GKIconName, GKLoading, GKLoadingPlaceholder, GKLoadingState, GKLoadingType, GKTable} from "@gkernel/ux-components";
import {IResultObjectUI, ITreatmentObject, numericDateUseValue} from "@agstudio/services/lib/models/warehouseAPIService";
import {FormattedMessage, FormattedNumber, IntlShape, injectIntl, FormattedDate, FormattedTime} from "react-intl";

const GridTableComponent = (
    props: {
        treatmentResults?: ITreatmentObject,
        dimensionValue?: string,
        metric: string,
        unitOfMeasure: string,
        isLoading: boolean,
        sort: (treatmentResults: ITreatmentObject, column: string, dimensionValue?: string) => void,
        toggleChildren: (dimensionValue: string) => void,
        toggleAllChildren: (showChildren: boolean) => void,
        intl: IntlShape
    }
) => {

    const formattedDimension = (value: any) => {
        if (!props.treatmentResults || !isDimensionNumeric) {
            return value;
        }
        if (props.treatmentResults.Dimension.DataUse === "Date") {
            return value ? <FormattedDate value={value} timeZone="utc"/> : <FormattedMessage id="common.unknown"/>;
        }
        if (props.treatmentResults.Dimension.DataUse === "Time" || props.treatmentResults.Dimension.DataUse === "TimeStamp") {
            return <FormattedTime value={value}/>;
        }
        return <FormattedNumber value={value}/>;
    };

    let superMin: any = "";
    let superMax: any = "";
    let isDimensionNumeric: boolean = false;

    if (props.treatmentResults && props.treatmentResults.Results.length) {
        superMax = props.treatmentResults.Results.map((item: IResultObjectUI) => (item.Stats.Max)).reduce((a: number, b: number) => (Math.max(a, b)));
        superMin = props.treatmentResults.Results.map((item: IResultObjectUI) => (item.Stats.Min)).reduce((a: number, b: number) => (Math.min(a, b)));
        isDimensionNumeric = numericDateUseValue.indexOf(props.treatmentResults.Dimension.DataUse) !== -1;
    }

    const renderToggleAllChildren = () => {
        if (props.treatmentResults && props.treatmentResults.Results.some(item => Boolean(item.ChildResults))) {
            const isAllChildrenOpen = props.treatmentResults.Results.every(item => Boolean(item.showChildren));
            return (<GKButton data-qa="ppa-expand-collapse-all-button"
                              className="btn-icon"
                              color="primary"
                              size="sm"
                              tooltip={props.intl.formatMessage({id: isAllChildrenOpen ? "label.collapseAll" : "label.expandAll"})}
                              onClick={() => {
                                  props.toggleAllChildren(!isAllChildrenOpen);
                              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    {
                        isAllChildrenOpen ?
                            [
                                <path key={1} opacity=".87" fill="none" d="M24 0v24H0V0h24z"/>,
                                <path key={2}
                                      fill="#fff"
                                      d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/>
                            ]
                            :
                            [
                                <path key={1} fill="none" d="M0 0h24v24H0V0z"/>,
                                <path key={2}
                                      fill="#fff"
                                      d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
                            ]
                    }
                </svg>
            </GKButton>);
        }
        return null;
    };

    const renderSortIcon = (columnName: string): any => {
        if (props.treatmentResults && props.treatmentResults.Dimension.SortColumn === columnName) {
            return (<GKIcon name={props.treatmentResults.Dimension.SortDirection === "desc" ? GKIconName.ArrowDropDown : GKIconName.ArrowDropUp}/>);
        }
        return null;
    };

    const sortColumn = (columnName: string) => {
        props.treatmentResults && props.sort(props.treatmentResults, columnName, props.dimensionValue);
    };

    const sortCursor = () => props.treatmentResults ? "cursor-pointer align-middle" : "align-middle";

    const outerBoxPlotBadge = (item: IResultObjectUI): string => ((item.Stats.Max - item.Stats.Min) * 100 / (superMax - superMin) < 15 ? -38 : 0).toString();

    const innerBoxPlotBadge = (item: IResultObjectUI): string => ((item.Stats.HighMid - item.Stats.LowMid) * 100 / (superMax - superMin) < 15 ? -38 : 0).toString();

    // Grid's render functions

    const renderData = () => {
        if (!props.isLoading && props.treatmentResults && props.treatmentResults.Results.length) {
            return props.treatmentResults.Results.map((item: IResultObjectUI) =>
                [
                    <tr key={item.DimensionValue}>
                        <td className="align-middle">
                            {
                                item.ChildResults &&
                                <GKButton data-qa="ppa-expand-collapse-button" color="primary" size="sm"
                                          icon={item.showChildren ? GKIconName.KeyboardArrowUp : GKIconName.KeyboardArrowDown}
                                          tooltip={`${props.intl.formatMessage({
                                              id: item.showChildren ? "common.hide" : "common.show"
                                          })} ${item.DimensionValue}'s ${props.intl.formatMessage({
                                              id: "label.performanceBy"
                                          }).toLowerCase()} ${item.ChildResults.Dimension.Name}`
                                          }
                                          onClick={() => {
                                              props.toggleChildren(item.DimensionValue);
                                          }}/>
                            }
                        </td>
                        <td className="align-middle">
                            <div className="text-center d-flex w-100">{isDimensionNumeric && <span className="flex-grow-1"/>} {formattedDimension(item.DimensionValue)}</div>
                        </td>
                        <td className="align-middle v-border">
                            <div className="position-relative">
                                <div className={[styles.boxPlotChart, styles.boxPlotChartOutside].join(" ")} style={{
                                    width: Math.round((item.Stats.Max - item.Stats.Min) * 100 / (superMax - superMin)) + "%",
                                    left: Math.round((item.Stats.Min - superMin) * 100 / (superMax - superMin)) + "%"
                                }}>
                                    <span style={{left: outerBoxPlotBadge(item) + "px"}} className="badge badge-pill">
                                        <FormattedNumber value={item.Stats.Min} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                    </span>
                                    <span style={{right: outerBoxPlotBadge(item) + "px"}} className="badge badge-pill">
                                            <FormattedNumber value={item.Stats.Max} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                    </span>
                                </div>
                                <div className={[styles.boxPlotChart, styles.boxPlotChartInside].join(" ")} style={{
                                    width: Math.round((item.Stats.HighMid - item.Stats.LowMid) * 100 / (superMax - superMin)) + "%",
                                    left: Math.round((item.Stats.LowMid - superMin) * 100 / (superMax - superMin)) + "%"
                                }}>
                                    <span style={{left: innerBoxPlotBadge(item) + "px"}} className="badge badge-pill">
                                        <FormattedNumber value={item.Stats.LowMid} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                    </span>
                                    <div className={styles.boxPlotChartMean}/>
                                    <span style={{right: innerBoxPlotBadge(item) + "px"}} className="badge badge-pill">
                                        <FormattedNumber value={item.Stats.HighMid} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td className="align-middle v-border">
                            <h4 className="m-0">
                                <FormattedNumber value={item.Stats.Mean} minimumFractionDigits={2} maximumFractionDigits={2}/>
                            </h4>
                            <span>avg {props.unitOfMeasure}</span>
                        </td>
                        <td className="align-middle v-border">
                            <b>
                                <FormattedNumber value={item.Stats.NumberOfAcres} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                <FormattedMessage id={item.Stats.NumberOfAcres > 1 ? "common.multipleAcres" : "common.oneAcre"}/>
                            </b>
                            <br/>
                            <FormattedNumber value={item.Stats.NumberOfCropZones}/>
                            <FormattedMessage id={(item.Stats.NumberOfCropZones > 1) ? "common.multipleCropZones" : "common.oneCropZone"}/>
                        </td>
                    </tr>,
                    item.ChildResults &&
                    <tr key={item.DimensionValue + "children"} className="bg-secondary">
                        <td colSpan={5} className="p-0">
                            <GKCollapse isOpen={item.showChildren} className={styles.collapse}>
                                <GridTableComponent isLoading={props.isLoading}
                                                    sort={props.sort}
                                                    toggleChildren={props.toggleChildren}
                                                    toggleAllChildren={props.toggleAllChildren}
                                                    unitOfMeasure={props.unitOfMeasure}
                                                    metric={props.metric}
                                                    dimensionValue={item.DimensionValue}
                                                    treatmentResults={item.ChildResults}
                                                    intl={props.intl}/>
                            </GKCollapse>
                        </td>
                    </tr>
                ]
            )
        }
        return renderEmptyOrLoading();
    };

    const renderEmptyOrLoading = () => {
        return (
            <tr className={styles.noHover}>
                <td/>
                <td/>
                <td className="align-middle text-center v-border">
                    {
                        props.isLoading ?
                            <GKLoading isLoading={true} type={GKLoadingType.Spinner} inline={true}/> : <span><FormattedMessage id={"common.noPerformanceData"}/></span>
                    }
                </td>
                <td className="v-border"/>
                <td className="v-border"/>
            </tr>
        )
    };

    const renderPlaceholder = () => {
        return [0, 1, 2].map((row: number) =>
            <tr key={row}>
                {
                    ([0, 1, 2, 3, 4]).map((column: number) =>
                        <td key={column} className={(column <= 1 ? "" : "v-border ") + "align-middle text-center"}>
                            <GKLoading isLoading={false}>
                                <GKLoadingState><GKLoadingPlaceholder className="w-100"/></GKLoadingState>
                                <GKCompletedState><GKLoadingPlaceholder className={styles.loadingPlaceholderStill + " w-100"}/></GKCompletedState>
                            </GKLoading>
                        </td>
                    )
                }
            </tr>
        )
    };

    return (
        <GKTable responsive={true} className={styles.table + " table-white-bg table-striped table-hover w-100 mb-0"}>
            <thead>
            <tr className="th-row-main">
                <th style={{width: "55px"}}>{renderToggleAllChildren()}</th>
                <th data-qa="ppa-dimension-column"
                    style={{width: "150px"}}
                    className={`${sortCursor()} ${(isDimensionNumeric ? "" : "text-left ")}`}
                    onClick={() => {
                        sortColumn("DimensionValue")
                    }}>
                    {props.treatmentResults ?
                        props.treatmentResults.Dimension.Name :
                        props.intl.formatMessage({id: "common.oneDimension"})} {renderSortIcon("DimensionValue")}
                </th>
                <th className="v-border align-middle">
                    <div className="text-center d-flex w-100">
                        <span><FormattedNumber value={superMin} minimumFractionDigits={2} maximumFractionDigits={2}/></span>
                        <span className="flex-grow-1"><FormattedMessage id="common.performanceRange"/></span>
                        <span><FormattedNumber value={superMax} minimumFractionDigits={2} maximumFractionDigits={2}/></span>
                    </div>
                </th>
                <th data-qa="ppa-mean-column"
                    style={{width: "125px"}}
                    className={`${sortCursor()} v-border`}
                    onClick={() => {
                        sortColumn("Mean")
                    }}>
                    <FormattedMessage id="common.mean"/> {props.treatmentResults && props.metric} {renderSortIcon("Mean")}
                </th>
                <th data-qa="ppa-sample-size-column"
                    style={{width: "140px"}}
                    className={`${sortCursor()} v-border`}
                    onClick={() => {
                        sortColumn("NumberOfAcres")
                    }}>
                    <FormattedMessage id="common.sampleSize"/> {renderSortIcon("NumberOfAcres")}
                </th>
            </tr>
            </thead>
            <tbody>{(props.isLoading || props.treatmentResults) ? renderData() : renderPlaceholder()}</tbody>
        </GKTable>
    );
};

export default injectIntl(GridTableComponent);

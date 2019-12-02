import * as React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import Grid from './GridComponent';
import {IResultObjectUI, ITreatmentObject, numericDateUseValue} from "@agstudio/services/lib/models/warehouseAPIService";
import {FormattedDate, FormattedMessage, FormattedNumber, FormattedTime} from "react-intl";

const styles = StyleSheet.create({
    headerRow: {
        fontSize: 9,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomStyle: 'solid'
    },
    headerCell: {
        fontFamily: 'AvenirBold',
        flexGrow: 1,
        padding: 4,
        alignSelf: 'center'
    },
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center' as any // TODO remove when possible
    },
    row: {
        fontSize: 9,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomStyle: 'solid'
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: 'lightgray'
    },
    cell: {
        flexGrow: 1,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center' as any // TODO remove when possible
    },
    bar: {
        flexGrow: 1,
        height: '10px',
        backgroundColor: '#cccccc',
        position: 'absolute'
    },
    barStDev: {
        height: '10px',
        backgroundColor: '#28a170',
        position: 'absolute'
    },
    meanBar: {
        height: '20px',
        width: '2px',
        border: '0',
        backgroundColor: '#101010',
        position: 'absolute',
        top: -6
    },
    headerText: {
        fontFamily: 'AvenirBold',
    }
});

export default ({metric, unitOfMeasure, results, addLastBorder}: { metric: string, unitOfMeasure: string, results: ITreatmentObject, addLastBorder: boolean }) => {

    const isDimensionNumeric = numericDateUseValue.indexOf(results.Dimension.DataUse) !== -1;
    const textAlign = isDimensionNumeric ? "right" : "left";
    const superMax = results.Results.map(item => (item.Stats.Max)).reduce((a: number, b: number) => (Math.max(a, b)));
    const superMin = results.Results.map(item => (item.Stats.Min)).reduce((a: number, b: number) => (Math.min(a, b)));
    const hasChildren = results.Results.some(r => r.ChildResults && r.ChildResults.Results && r.ChildResults.Results.length >= 1);

    const formattedDimension = (value: any) => {
        if (isDimensionNumeric) {
            if (results.Dimension.DataUse === "Date") {
                return value ? <FormattedDate value={value} timeZone="utc"/> : <FormattedMessage id="common.unknown"/>;
            }
            if (results.Dimension.DataUse === "Time" || results.Dimension.DataUse === "TimeStamp") {
                return <FormattedTime value={value}/>;
            }
            return <FormattedNumber value={value}/>;
        }
        return value;
    };

    const isLastParentRow = (index: number) => addLastBorder && (hasChildren || index === results.Results.length - 1);

    const rowHasChildren = (r: IResultObjectUI) => Boolean(r.ChildResults && r.ChildResults.Results && r.ChildResults.Results.length);

    return (
        <React.Fragment>
            <View fixed={true} wrap={false}>
                <View style={[styles.headerRow, hasChildren ? {borderBottomWidth: 2, borderBottomColor: 'black'} : {borderBottomWidth: 1, borderBottomColor: 'lightgray'}]}>
                    <View style={[styles.headerCell, {width: '20%'}]}><Text style={{textAlign}}>{results.Dimension.Name}</Text></View>
                    <View style={[styles.headerCell, {width: '50%'}]}>
                        <View style={styles.table}>
                            <Text><FormattedNumber value={superMin} minimumFractionDigits={2} maximumFractionDigits={2}/></Text>
                            <Text style={{textAlign: 'center' as any, flexGrow: 1}}><FormattedMessage id="common.performanceRange"/></Text>
                            <Text><FormattedNumber value={superMax} minimumFractionDigits={2} maximumFractionDigits={2}/></Text>
                        </View>
                    </View>
                    <View style={[styles.headerCell, {width: '12%'}]}><Text style={{textAlign: 'right'}}><FormattedMessage id="common.mean"/> {metric}</Text></View>
                    <View style={[styles.headerCell, {width: '18%'}]}><Text style={{textAlign: 'right'}}><FormattedMessage id="common.sampleSize"/></Text></View>
                </View>
            </View>
            {results.Results.map((r, index) =>
                <View wrap={Boolean(rowHasChildren(r) && r.ChildResults.Results.length >= 12)} key={r.DimensionValue}>
                    <View fixed={true} wrap={false}>
                        <View style={[styles.row, isLastParentRow(index) ? {borderBottomWidth: 2, borderBottomColor: 'black'} : {
                            borderBottomWidth: 1,
                            borderBottomColor: 'lightgray'
                        }]}>
                            <View style={[styles.cell, {width: '20%', textAlign}, styles.rightBorder]}>
                                <Text>{formattedDimension(r.DimensionValue)}</Text>
                            </View>
                            <View style={[styles.cell, {width: '50%', textAlign: 'center' as any, padding: "4 24"}, styles.rightBorder]}>
                                <View style={[styles.cell, {position: 'relative'}]}>
                                    <View style={[styles.bar as any,
                                        {
                                            width: Math.round((r.Stats.Max - r.Stats.Min) * 100 / (superMax - superMin)) + "%",
                                            left: Math.round((r.Stats.Min - superMin) * 100 / (superMax - superMin)) + "%"
                                        }]}>
                                        <View style={{position: 'absolute', left: -24, padding: "1 2", width: 24}}>
                                            <Text style={{fontSize: 7, textAlign: 'right'}}>
                                                <FormattedNumber value={r.Stats.Min} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                            </Text>
                                        </View>
                                        <View style={{position: 'absolute', right: -24, padding: "1 2", width: 24}}>
                                            <Text style={{fontSize: 7, textAlign: 'left'}}>
                                                <FormattedNumber value={r.Stats.Max} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.barStDev as any,
                                        {
                                            width: Math.round((r.Stats.HighMid - r.Stats.LowMid) * 100 / (superMax - superMin)) + "%",
                                            left: Math.round((r.Stats.LowMid - superMin) * 100 / (superMax - superMin)) + "%"
                                        }]}>
                                        <View style={[styles.meanBar, {left: '50%' as any}]}/>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cell, {width: '12%', textAlign: 'right'}, styles.rightBorder]}>
                                <Text style={[styles.headerText, {fontSize: 14}]}>
                                    <FormattedNumber value={r.Stats.Mean} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                </Text>
                                <Text>{unitOfMeasure}</Text>
                            </View>
                            <View style={[styles.cell, {width: '18%', textAlign: 'right'}]}>
                                <Text style={styles.headerText}>
                                    <FormattedNumber value={r.Stats.NumberOfAcres} minimumFractionDigits={2} maximumFractionDigits={2}/>
                                    &nbsp;
                                    <FormattedMessage id={r.Stats.NumberOfAcres > 1 ? "common.multipleAcres" : "common.oneAcre"}/>
                                </Text>
                                <Text>
                                    <FormattedNumber value={r.Stats.NumberOfCropZones}/>
                                    &nbsp;
                                    <FormattedMessage id={(r.Stats.NumberOfCropZones > 1) ? "common.multipleCropZones" : "common.oneCropZone"}/>
                                </Text>
                            </View>
                        </View>
                    </View>
                    {rowHasChildren(r) && <Grid metric={metric} unitOfMeasure={unitOfMeasure} results={r.ChildResults} addLastBorder={index !== results.Results.length - 1}/>}
                </View>
            )}
        </React.Fragment>
    );
};

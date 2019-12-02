import { StyleSheet, Text, View } from '@react-pdf/renderer';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IPdfAPIDisplayFilters } from "@agstudio/services/lib/models/pdfAPIService";

const styles = StyleSheet.create({
    container: {
        fontSize: 9,
        paddingBottom: 4
    },
    headerTextTitle: {
        fontFamily: 'AvenirBold'
    },
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 8
    },
    cell: {
        flexGrow: 1,
        padding: 4
    }
});

export default ({ filters }: { filters: IPdfAPIDisplayFilters }) => (
    <View style={styles.container} fixed={true} wrap={false}>
        {/*Domain*/}
        <View style={{ backgroundColor: '#777777', padding: 4 }}>
            <Text fixed style={{ textAlign: 'left', color: '#fff', fontFamily: 'AvenirBold' }}>
                <FormattedMessage id="common.domain" />
            </Text>
        </View>
        <View style={[styles.table]}>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.company" />:
                    </Text> {filters.Company}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.territory" />:
                    </Text> {filters.Territory}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.location" />:
                    </Text> {filters.Location}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.grower" />:
                    </Text> {filters.Grower}
                </Text>
            </View>
        </View>
        {/*Filters*/}
        <View style={{ backgroundColor: '#777777', padding: 4 }}>
            <Text fixed style={{ textAlign: 'left', color: '#fff', fontSize: 9, fontFamily: 'AvenirBold' }}>
                <FormattedMessage id="common.filters" />
            </Text>
        </View>
        <View style={[styles.table]}>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.commodity" />:
                    </Text> {filters.Commodity}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.cropYears" />:
                    </Text> {filters.CropYears}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.previousCrop" />:
                    </Text> {filters.PreviousCrop}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.irrigation" />:
                    </Text> {filters.Irrigation}
                </Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.traits" />:
                    </Text> {filters.Traits}
                </Text>
            </View>
            <View style={[styles.cell, { width: '75%' }]}>
                <Text>
                    <Text style={styles.headerTextTitle}>
                        <FormattedMessage id="label.products" />:
                    </Text> {filters.Products}
                </Text>
            </View>
        </View>
        {/*Dimensions*/}
        <View style={{ backgroundColor: '#777777', padding: 4 }}>
            <Text fixed style={{ textAlign: 'left', color: '#fff', fontSize: 9, fontFamily: 'AvenirBold' }}>
                <FormattedMessage id="common.multipleDimensions" />
            </Text>
        </View>
        <View style={[styles.table]}>
            <View style={[styles.cell, { width: '100%' }]}>
                <Text>{filters.Dimensions}</Text>
            </View>
        </View>
    </View>
);

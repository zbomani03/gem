import * as React from 'react';
import {StyleSheet, View, Text} from '@react-pdf/renderer';
import {FormattedDate, FormattedTime, IntlShape, injectIntl} from "react-intl";

const styles = StyleSheet.create({
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 8,
        padding: 4,
        backgroundColor: '#1BB24B',
        color:'#fff'
    }
});

export default injectIntl(({timestamp, intl} : {timestamp: Date, intl: IntlShape}) => (
    <View fixed={true} wrap={false} style={{position: 'absolute', bottom: 0, left: 20, width: '100%', paddingBottom: 24, paddingTop: 3, backgroundColor: '#fff'}}>
        <View style={[styles.footerContainer]}>
            <Text fixed style={{textAlign: 'left', width: '25%'}}>
                <FormattedDate value={timestamp}/> - <FormattedTime value={timestamp} timeZoneName={"short"}/>
            </Text>
            <Text fixed style={{textAlign: 'center' as any, width: '50%'}}>© {timestamp.getFullYear().toString()} Granular, Inc.</Text>
            <Text fixed
                  style={{textAlign: 'right', width: '25%'}}
                  render={({pageNumber, totalPages}) => (`${intl.formatMessage({id: "common.page"})} ${pageNumber} ${intl.formatMessage({id: "common.of"})} ${totalPages}`)}/>
        </View>
    </View>
));

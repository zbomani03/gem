import * as React from 'react';
import {Page, Document, Font, StyleSheet} from '@react-pdf/renderer';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Grid from './GridComponent';
import Filter from './FilterComponent';
import {IntlProvider} from "react-intl";
import locale from '../helpers/setupLocale';

// Register Fonts
const absolutePath = __dirname.replace("/components", "");
Font.register({family: 'Avenir', src: (absolutePath + '/assets/36C4B6_2_0.ttf').toString()});
Font.register({family: 'AvenirBold', src: (absolutePath + '/assets/36C4B6_6_0.ttf').toString()});

// Create styles
const styles = StyleSheet.create({
    pageContainer: {
        paddingLeft:20,
        paddingTop:24,
        paddingRight:20,
        paddingBottom:44,
        fontFamily: 'Avenir'
    }
});

export default (details) => (
    <Document>
        <IntlProvider locale={details.Meta.Language} messages={locale.messages[details.Meta.Language] as any} textComponent={React.Fragment}>
            <Page size="LETTER" style={styles.pageContainer}>
                <Header logo={details.Logo}/>
                <Filter filters={details.Filters}/>
                <Grid metric={details.Results.Metric}
                      unitOfMeasure={details.Results.UnitOfMeasure}
                      results={details.Results.TreatmentResults}
                      addLastBorder={details.Results.TreatmentResults.Results.some(r => r.ChildResults && r.ChildResults.Results && r.ChildResults.Results.length)}/>
                <Footer timestamp={new Date(details.Meta.TimeStamp)} />
            </Page>
        </IntlProvider>
    </Document>
);

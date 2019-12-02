import * as React from "react";
import {
    GKButton,
    GKFormGroup,
    GKLabel,
    GKInput,
    GKFormFeedback
} from "@gkernel/ux-components";
import {ErrorMessage, Field, Form, Formik, FormikValues} from "formik";
import * as Yup from 'yup';
import {IDomainStore} from "./reduxReducer";
import {FormattedMessage, IntlShape, injectIntl} from "react-intl";
import {useState} from "react";
// @ts-ignore
import Component from '@reach/component-component';
import {useEffect} from "react";
import {IAgStudioService, ICompanyObject, IGrowerObject, ILocationObject, ITerritoryObject} from "@agstudio/services/lib/models/agstudioAPIService";

const DomainComponent = (
    props: {
        domainRequired?: string,
        callback?: () => void,
        agstudioAPIService: IAgStudioService,
        domain: IDomainStore,
        saveDomain: (values: any, state: any, callback?: () => void) => void,
        intl: IntlShape
    }
) => {

    interface IYupSchema {
        company: Yup.StringSchema;
        territory?: Yup.StringSchema;
        location?: Yup.StringSchema;
        grower?: Yup.StringSchema;
    }

    const {agstudioAPIService} = props;

    const validationLevel = props.domainRequired === "grower" ? 3 : (props.domainRequired === "location" ? 2 : (props.domainRequired === "territory" ? 1 : 0));
    let yupSchema: IYupSchema = {
        company: Yup.string().required(props.intl.formatMessage({id: "validation.required"}))
    };
    if (validationLevel >= 1) {
        yupSchema.territory = Yup.string().required(props.intl.formatMessage({id: "validation.required"}));
    }
    if (validationLevel >= 2) {
        yupSchema.location = Yup.string().required(props.intl.formatMessage({id: "validation.required"}));
    }
    if (validationLevel === 3) {
        yupSchema.grower = Yup.string().required(props.intl.formatMessage({id: "validation.required"}));
    }

    // Initial implementation, save the available values into state
    const [companies, setCompanies] = useState(props.domain.companies.list);
    // Do only when the domain in the redux store are empty
    useEffect(() => {
        if (companies.length === 0) {
            agstudioAPIService.loadCompanies().then(results => {
                setCompanies(results)
            }, () => {
            });
        }
    });
    const [territories, setTerritories] = useState(props.domain.territories.list);
    const [locations, setLocations] = useState(props.domain.locations.list);
    const [growers, setGrowers] = useState(props.domain.growers.list);

    // state properties for UI purposes
    const [territoriesIsLoading, setTerritoriesIsLoading] = useState(false);
    const [locationsIsLoading, setLocationsIsLoading] = useState(false);
    const [growersIsLoading, setGrowersIsLoading] = useState(false);

    // Business Logic for the cascading loadings... (It will be triggered multiple times, need to be performant)
    function onChange({prevProps, props}: any): void {

        // Select the company in case there is only one option
        if (companies.length === 1 && !prevProps.values.company && !props.values.company) {
            props.setFieldValue("company", companies[0].Key);
        }
        if (props.values.company !== prevProps.values.company) {

            setTerritories([]);
            props.setFieldValue("territory", "");

            if (props.values.company) {
                setTerritoriesIsLoading(true);
                agstudioAPIService.loadTerritories(props.values.company).then(results => {
                    setTerritories(results);
                    setTerritoriesIsLoading(false);
                    // Select the territory in case there is only one option
                    if (results.length === 1) {
                        props.setFieldValue("territory", results[0].Key);
                    }
                }, () => {
                });
            }

        }
        if (props.values.territory !== prevProps.values.territory) {

            setLocations([]);
            props.setFieldValue("location", "");

            if (props.values.territory) {
                setLocationsIsLoading(true);
                agstudioAPIService.loadLocations(props.values.territory).then(results => {
                    setLocations(results);
                    setLocationsIsLoading(false);
                    // Select the location in case there is only one option
                    if (results.length === 1) {
                        props.setFieldValue("location", results[0].Key);
                    }
                }, () => {
                });
            }

        }
        if (props.values.location !== prevProps.values.location) {

            setGrowers([]);
            props.setFieldValue("grower", "");

            if (props.values.location) {
                setGrowersIsLoading(true);
                agstudioAPIService.loadGrowers(props.values.location).then(results => {
                    setGrowers(results);
                    setGrowersIsLoading(false);
                    // Select the grower in case there is only one option
                    if (results.length === 1) {
                        props.setFieldValue("grower", results[0].Key);
                    }
                }, () => {
                });
            }

        }
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                // Initial implementation, save the selected values into Formik
                company: props.domain.companies.selected,
                territory: props.domain.territories.selected,
                location: props.domain.locations.selected,
                grower: props.domain.growers.selected
            }}
            validationSchema={Yup.object().shape(yupSchema)}
            onSubmit={(values) => {
                props.saveDomain(values, {companies, territories, locations, growers}, props.callback);
            }}
            onReset={() => {
                if (props.callback) {
                    props.callback();
                }
            }}
            render={(formikBag) => (
                <Form>
                    <Component values={formikBag.values} setFieldValue={formikBag.setFieldValue} didUpdate={onChange}/>
                    <GKFormGroup>
                        <GKLabel className="d-block" htmlFor="company"><FormattedMessage id="label.company"/></GKLabel>
                        <Field name="company" render={({field}: FormikValues) => (
                            <GKInput data-qa="app-domain-company-input" {...field}
                                     invalid={Boolean(formikBag.touched.company && formikBag.errors.company)}
                                     type="select">
                                {companies.length !== 1 && <option value="">{props.intl.formatMessage(
                                    {id: companies.length === 0 ? "common.loading" : "common.selectOne"}
                                )}</option>}
                                {companies.map((item: ICompanyObject) =>
                                    <option key={item.Key} value={item.Key}>{item.Name}</option>
                                )}
                            </GKInput>
                        )}/>
                        <ErrorMessage name="company">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <GKFormGroup>
                        <GKLabel className="d-block" htmlFor="territory"><FormattedMessage id="label.territory"/></GKLabel>
                        <Field name="territory" render={({field}: FormikValues) => (
                            <GKInput data-qa="app-domain-territory-input" {...field}
                                     invalid={Boolean(formikBag.touched.territory && formikBag.errors.territory)}
                                     type="select">
                                {
                                    territories.length !== 1 &&
                                    <option value="">{props.intl.formatMessage(
                                        {id: territoriesIsLoading ? "common.loading" : (validationLevel > 0 ? "common.selectOne" : "common.allTerritories")}
                                    )}</option>
                                }
                                {territories.map((item: ITerritoryObject) =>
                                    <option key={item.Key} value={item.Key}>{item.Name}</option>
                                )}
                            </GKInput>
                        )}/>
                        <ErrorMessage name="territory">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <GKFormGroup>
                        <GKLabel className="d-block" htmlFor="location"><FormattedMessage id="label.location"/></GKLabel>
                        <Field name="location" render={({field}: FormikValues) => (
                            <GKInput data-qa="app-domain-location-input" {...field}
                                     invalid={Boolean(formikBag.touched.location && formikBag.errors.location)}
                                     type="select">
                                {
                                    locations.length !== 1 &&
                                    <option value="">{props.intl.formatMessage(
                                        {id: locationsIsLoading ? "common.loading" : (validationLevel > 1 ? "common.selectOne" : "common.allLocations")}
                                    )}</option>
                                }
                                {locations.map((item: ILocationObject) =>
                                    <option key={item.Key} value={item.Key}>{item.Name}</option>
                                )}
                            </GKInput>
                        )}/>
                        <ErrorMessage name="location">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <GKFormGroup>
                        <GKLabel className="d-block" htmlFor="grower"><FormattedMessage id="label.grower"/></GKLabel>
                        <Field name="grower" render={({field}: FormikValues) => (
                            <GKInput data-qa="app-domain-grower-input" {...field}
                                     invalid={Boolean(formikBag.touched.grower && formikBag.errors.grower)}
                                     type="select">
                                {
                                    growers.length !== 1 &&
                                    <option value="">
                                        {props.intl.formatMessage(
                                            {id: growersIsLoading ? "common.loading" : (validationLevel > 2 ? "common.selectOne" : "common.allGrowers")}
                                        )}
                                    </option>
                                }
                                {growers.map((item: IGrowerObject) =>
                                    <option key={item.Key} value={item.Key}>{item.Name}</option>
                                )}
                            </GKInput>
                        )}/>
                        <ErrorMessage name="grower">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <GKFormGroup className="pt-4 text-center">
                        {
                            props.callback &&
                            <GKButton data-qa="app-domain-cancel-button" className="mr-1" type="reset" color="primary" outline={true}>
                                <FormattedMessage id="label.cancel"/>
                            </GKButton>
                        }
                        <GKButton data-qa="app-domain-apply-button" className="ml-1" type="submit" color="primary">
                            <FormattedMessage id="label.apply"/>
                        </GKButton>
                    </GKFormGroup>
                </Form>
            )}
        />
    );
};

export default injectIntl(DomainComponent);

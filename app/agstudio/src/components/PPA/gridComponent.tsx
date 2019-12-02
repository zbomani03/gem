import styles from "./grid.module.scss";
import React, {useState} from "react";
import {
    Row,
    Col,
    GKCard,
    GKCardBody,
    Container,
    GKCardHeader,
    GKButton,
    GKModal,
    GKModalHeader,
    GKModalBody,
    GKModalFooter,
    GKLoadingType,
    GKLoading,
    GKLabel,
    GKFormFeedback,
    GKMenuButton,
    GKFormGroup,
    GKRadio,
    GKInput,
    GKMenuItem,
    GKIconName,
    GKCollapse,
    GKIcon
} from "@gkernel/ux-components";
import {ErrorMessage, Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import uniq from "lodash/uniq";
import * as Yup from 'yup';
import cn from 'classnames';
import GridTableComponent from "./gridTableComponent";
import {FormattedMessage, IntlShape, injectIntl} from "react-intl";
import {IPdfAPIDisplayFilters, IPdfAPIService} from "@agstudio/services/lib/models/pdfAPIService";
import {IPPADimensionsStore} from "./dimensionsReducer";
import {IPPAFiltersStore} from "./filtersReducer";
import {IPPAGridStore} from "./gridReducer";
import {IEmailInfo, ITreatmentObject, IWarehouseAPIService} from "@agstudio/services/lib/models/warehouseAPIService";
import blobDownload from "@agstudio/web/lib/helpers/blobDownload";
import locale from '@agstudio/web/lib/helpers/setupLocale';
import {buildDisplayFilters, buildWarehouseFilters} from "../../helpers/dataTransforming";
import {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";

const GridComponent = (props: {
    warehouseAPIService: IWarehouseAPIService,
    pdfAPIService: IPdfAPIService,
    domain: IDomainStore,
    filters: IPPAFiltersStore,
    dimensions: IPPADimensionsStore,
    displayFilters: IPdfAPIDisplayFilters,
    sort: (treatmentResults: ITreatmentObject, column: string, dimensionValue?: string) => void,
    grid: IPPAGridStore,
    toggleChildren: (dimensionValue: string) => void,
    toggleAllChildren: (showChildren: boolean) => void,
    isFilterEditing: boolean,
    intl: IntlShape
}) => {

    interface IEmailForm {
        to: string;
        recipients: string[];
        email: string;
        subject: string;
        fileType: string;
        notes: string;
    }

    const [showModal, setShowModal] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [emailFormStatus, setEmailFormStatus] = useState("edit");

    const disableAction = Boolean(props.grid.isLoading || !props.grid.results || !props.grid.results.TreatmentResults.Results.length);
    const emailFormSchema = Yup.object().shape({
        to: Yup.string(),
        recipients: Yup.array().when('to', {
            is: val => val,
            // This is to make it INVALID because there is still values in the to field
            then: Yup.array().min(9999999999, props.intl.formatMessage({id: "validation.emailFormat"})),
            // Proceed to the normal validation in case to is empty
            otherwise: Yup.array().min(1, props.intl.formatMessage({id: "validation.minEmailValRequired"}))
        }),
        email: Yup.string().email(),
        subject: Yup.string().required(props.intl.formatMessage({id: "validation.required"})),
        fileType: Yup.string(),
        notes: Yup.string()
    });

    // Create new chips from 'To' value when enter key is pressed or form is submitted, format as array, and set into formik 'recipients' object
    const createChips = (e: React.KeyboardEvent | React.MouseEvent, fBag: FormikProps<IEmailForm>): void => {
        if ((e.nativeEvent.type === "keypress" && (e.nativeEvent as KeyboardEvent).key === "Enter") || e.type === "click") {

            if (e.nativeEvent.type === "keypress") {
                e.preventDefault();
            }

            const validEmails: string[] = [];
            const invalidEmails: string[] = [];

            // Remove spaces, split with comma and semicolon delimeters, and remove empty values
            fBag.values.to.replace(/\s/g, '').split(/[;,]/).filter(val => val).forEach(email => {
                try {
                    validEmails.push(Yup.reach(emailFormSchema, 'email').validateSync(email).toString());
                } catch (e) {
                    invalidEmails.push(email);
                }
            });

            fBag.setFieldTouched("recipients");
            fBag.setFieldValue('recipients', uniq(fBag.values.recipients.concat(validEmails)));
            fBag.setFieldValue('to', invalidEmails.join("; "));

            if (e.type === "click") {
                fBag.validateForm().then(() => {
                    fBag.submitForm();
                });
            } else {
                // When new chips are created, scroll to bottom of chip wrapper to ensure the last chip added is visible
                const chipWrapper = document.getElementById('chipWrapper');
                if (chipWrapper) {
                    setTimeout(() => {
                        chipWrapper.scrollTop = chipWrapper.scrollHeight
                    }, 100);
                }
            }

        }
    };

    const sendEmail = (formValues: any) => {

        setEmailFormStatus("inProgress");

        const emailInfo: IEmailInfo = {
            SendTo: formValues.recipients,
            Subject: formValues.subject,
            Body: formValues.notes,
        };

        props.warehouseAPIService.emailFile(
            buildWarehouseFilters(props.domain, props.filters, props.dimensions),
            buildDisplayFilters(props.displayFilters, props.dimensions),
            locale.language,
            formValues.fileType,
            emailInfo,
            "ProductAnalyzerReport"
        ).then(() => {
            setEmailFormStatus("finished");
            setTimeout(() => {
                setShowEmailForm(false);
            }, 3000);
        }, () => {
            // Close the email collapse and defer the error to the notification system
            setShowEmailForm(false);
        });
    };

    const handleDownloadFileDidClick = (type: string) => {

        setShowModal(true);

        // Call the API and hide modal when finish
        const servicePromise = type === "pdf" ? props.pdfAPIService.exportPDF(
            buildWarehouseFilters(props.domain, props.filters, props.dimensions),
            buildDisplayFilters(props.displayFilters, props.dimensions),
            locale.language
        ) : props.warehouseAPIService.exportCSV(
            buildWarehouseFilters(props.domain, props.filters, props.dimensions),
            buildDisplayFilters(props.displayFilters, props.dimensions),
            locale.language
        );
        servicePromise.then((blob: any) => {
            blobDownload(blob, "report." + type);
        }, () => {
        }).finally(() => {
            setShowModal(false)
        });

    };

    const renderEmailProgress = () => (
        <div className="m-4">
            <GKLoading isLoading={true} type={GKLoadingType.Spinner} style={{height: 100}}/>
            <div className="text-center">
                <GKButton data-qa="ppa-email-keep-email-button" className="ml-1" type="button" color="primary"
                          onClick={() => {
                              setShowEmailForm(false);
                          }}>
                    <FormattedMessage id="label.keepItInBackground"/>
                </GKButton>
            </div>
        </div>
    );

    const renderEmailConfirmation = () => (
        <div className={cn(styles.emailConfirmation, "m-4")}>
            <GKIcon className="mr-2" name={GKIconName.CheckCircleOutline}/>
            <h4 className="m-0"><FormattedMessage id="common.emailSent"/></h4>
        </div>
    );

    const renderEmailForm = () => (
        <Formik
            initialValues={{
                to: '',
                recipients: [],
                email: '',
                subject: props.intl.formatMessage({id: "value.emailSubject"}),
                fileType: 'PDF',
                notes: ''
            }}
            validationSchema={emailFormSchema}
            onSubmit={sendEmail}
            onReset={() => {
                setShowEmailForm(false);
            }}
            render={(fBag: FormikProps<IEmailForm>) => (
                <Form className={cn(styles.emailForm, "m-4")}>
                    <h5 className="mt-2"><FormattedMessage id="common.emailReport"/></h5>
                    <GKFormGroup>
                        <GKLabel htmlFor="to"><FormattedMessage id="label.mailto"/></GKLabel>
                        <Field name="to" render={({field}: FieldProps<IEmailForm>) => (
                            <GKInput
                                data-qa="ppa-email-to-input"
                                {...field}
                                invalid={Boolean((fBag.touched.recipients && fBag.errors.recipients) || (fBag.touched.to && fBag.errors.to))}
                                type="textarea"
                                onKeyPress={(e: React.KeyboardEvent) => createChips(e, fBag)}
                            />
                        )}/>
                        <ErrorMessage name="recipients">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <div className={styles.chipWrapper} id="chipWrapper" data-qa="ppa-email-chip-container">
                        {fBag.values.recipients.map((recipient, index) => {
                            return (
                                <span key={index} className={cn(styles.badge, "py-2 pr-2 pl-3")}>
                                    {recipient}
                                    <GKButton
                                        color="transparent"
                                        icon={GKIconName.Clear}
                                        data-index={index}
                                        size="sm"
                                        onClick={() => {
                                            let addresses = fBag.values.recipients;
                                            addresses.splice(index, 1);
                                            fBag.setFieldValue('recipients', addresses);
                                        }}/>
                                </span>
                            )
                        })}
                    </div>
                    <GKFormGroup>
                        <GKLabel htmlFor="subject"><FormattedMessage id="label.subject"/></GKLabel>
                        <Field name="subject" render={({field}: FieldProps<IEmailForm>) => (
                            <GKInput data-qa="ppa-email-subject-input" {...field}
                                     invalid={Boolean(fBag.touched.subject && fBag.errors.subject)} type="text"/>
                        )}/>
                        <ErrorMessage name="subject">
                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                        </ErrorMessage>
                    </GKFormGroup>
                    <GKFormGroup>
                        <GKRadio name="fileType" id="pdf" data-qa="ppa-email-fileType-pdf-radio"
                                 checked={fBag.values.fileType === "PDF"}
                                 inline value="pdf" onChange={() => fBag.setFieldValue('fileType', 'PDF')}
                                 label={props.intl.formatMessage({id: "label.pdf"})}/>
                        <GKRadio name="fileType" id="csv" data-qa="ppa-email-fileType-csv-radio"
                                 checked={fBag.values.fileType === "CSV"}
                                 inline value="csv" onChange={() => fBag.setFieldValue('fileType', 'CSV')}
                                 label={props.intl.formatMessage({id: "label.csv"})}/>
                    </GKFormGroup>
                    <GKFormGroup>
                        <GKLabel htmlFor="notes"><FormattedMessage id="label.notes"/></GKLabel>
                        <Field name="notes" render={({field}: FieldProps<IEmailForm>) => (
                            <GKInput data-qa="ppa-email-notes-input" {...field} type="textarea"/>
                        )}/>
                    </GKFormGroup>
                    <div className="text-right">
                        <GKButton
                            data-qa="ppa-email-cancel-button"
                            className="mr-1"
                            color="primary"
                            type="reset"
                            outline={true}>
                            <FormattedMessage id="label.cancel"/>
                        </GKButton>
                        <GKButton data-qa="ppa-email-send-button" className="ml-1" type="button" color="primary"
                                  onClick={(e: React.MouseEvent) => createChips(e, fBag)}>
                            <FormattedMessage id="label.send"/>
                        </GKButton>
                    </div>
                </Form>
            )}
        />
    );

    return (
        <Container className={styles.grid}>
            <Row>
                <Col xs={{size: 12}}>
                    <GKCard className={cn(styles.card, props.isFilterEditing && styles.disable)}>
                        <GKCardHeader className="text-right">
                            <GKMenuButton data-qa="ppa-download-button" color="primary" disabled={disableAction}
                                          text={<FormattedMessage id="label.download"/>}>
                                <GKMenuItem data-qa="ppa-download-pdf-button"
                                            onSelect={() => handleDownloadFileDidClick("pdf")}>
                                    <FormattedMessage id="label.pdf"/>
                                </GKMenuItem>
                                <GKMenuItem data-qa="ppa-download-csv-button"
                                            onSelect={() => handleDownloadFileDidClick("csv")}>
                                    <FormattedMessage id="label.csv"/>
                                </GKMenuItem>
                            </GKMenuButton>
                            <GKButton disabled={disableAction || showEmailForm} data-qa="ppa-email-button"
                                      color="primary" className="ml-2"
                                      onClick={() => {
                                          setEmailFormStatus("edit");
                                          setShowEmailForm(true);
                                      }}>
                                <FormattedMessage id="label.email"/>
                            </GKButton>
                        </GKCardHeader>
                        <GKCollapse isOpen={showEmailForm} className={styles.collapse}>
                            {emailFormStatus === "edit" ? renderEmailForm() : (emailFormStatus === "inProgress" ? renderEmailProgress() : renderEmailConfirmation())}
                        </GKCollapse>
                        <GKCardBody>
                            <GridTableComponent isLoading={props.grid.isLoading} sort={props.sort}
                                                toggleChildren={props.toggleChildren}
                                                toggleAllChildren={props.toggleAllChildren}
                                                unitOfMeasure={props.grid.results ? props.grid.results.UnitOfMeasure : ""}
                                                metric={props.grid.results ? props.grid.results.Metric : ""}
                                                treatmentResults={props.grid.results ? props.grid.results.TreatmentResults : undefined}/>
                        </GKCardBody>
                    </GKCard>
                </Col>
            </Row>
            <GKModal isOpen={showModal} centered={true}>
                <GKModalHeader><FormattedMessage id="common.downloadInProgress"/></GKModalHeader>
                <GKModalBody>
                    <GKLoading isLoading={true} type={GKLoadingType.Spinner} style={{height: 100}}/>
                </GKModalBody>
                <GKModalFooter>
                    <GKButton data-qa="ppa-keep-download-button" color="primary" onClick={() =>
                        setShowModal(false)
                    }>
                        <FormattedMessage id="label.keepItInBackground"/>
                    </GKButton>
                </GKModalFooter>
            </GKModal>
        </Container>
    )
};

export default injectIntl(GridComponent);

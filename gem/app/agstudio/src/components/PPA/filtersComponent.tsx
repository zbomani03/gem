import styles from "./filters.module.scss";
import * as React from "react";
import {
    Col,
    Container,
    GKAlert,
    GKButton,
    GKCard,
    GKCardBody,
    GKCheckbox,
    GKFormFeedback,
    GKFormGroup,
    GKHighlightText,
    GKIcon,
    GKIconName,
    GKInput,
    GKLabel,
    Row
} from "@gkernel/ux-components";
import {ErrorMessage, Field, FieldArray, Form, Formik, FormikProps, FormikValues} from "formik";
import * as Yup from 'yup';
import {
    IAgStudioService,
    IManufacturerObject,
    IProductFlatObject
} from "@agstudio/services/lib/models/agstudioAPIService";
import {ICropYearObject} from "@agstudio/services/lib/models/agstudioAPIService";
import {IPdfAPIDisplayFilters} from "@agstudio/services/lib/models/pdfAPIService";
import uniqBy from "lodash/uniqBy";
import flattenDeep from "lodash/flattenDeep";
import Dimensions from "./dimensions";
import {IPPAFiltersStore} from "./filtersReducer";
import {FormattedMessage, injectIntl, IntlShape} from "react-intl";
import {useEffect, useState} from "react";
// @ts-ignore
import Component from '@reach/component-component';
import {IFeatureFlagsStore} from "@agstudio/web/lib/components/featureFlagsReducer";

interface IManufacturerObjectUI extends IManufacturerObject {
    expanded?: boolean;
}

const FiltersComponent = (props: {
    featureFlags: IFeatureFlagsStore,
    filters: IPPAFiltersStore,
    agstudioAPIService: IAgStudioService,
    domainKey: string,
    displayFilters: IPdfAPIDisplayFilters,
    isFilterEditing: boolean,
    setIsFilterEditing: (value: boolean) => void,
    saveFilters: (values: any, state: any) => void,
    intl: IntlShape
}) => {

    const hasTraitsFlag = props.featureFlags.appa_traits && props.featureFlags.appa_traits.enabled;

    const {domainKey, agstudioAPIService} = props;

    const [resetFormik, setResetFormik] = useState(false);

    const [commodities, setCommodities] = useState(props.filters.commodities.list);
    const [cropYearsOptions, setCropYearsOptions] = useState(props.filters.cropYears.list);
    const [previousCrops, setPreviousCrops] = useState(props.filters.previousCrops.list);
    const [traitsOptions, setTraitsOptions] = useState(props.filters.traits.list);
    const [productsOptions, setProductsOptions] = useState(props.filters.products.list.map(m => ({...m, expanded: false} as IManufacturerObjectUI)));
    const [irrigationOptions, setIrrigationOptions] = useState(props.filters.irrigation.list);

    const [commoditiesIsLoading, setCommoditiesIsLoading] = useState(false);
    const [cropYearsOptionsIsLoading, setCropYearsOptionsIsLoading] = useState(false);
    const [previousCropsIsLoading, setPreviousCropsIsLoading] = useState(false);
    const [traitsOptionsIsLoading, setTraitsOptionsIsLoading] = useState(false);
    const [productsIsLoading, setProductsIsLoading] = useState(false);

    useEffect(() => {
        if (!props.filters.filtersDomainKey || domainKey !== props.filters.filtersDomainKey) {

            setResetFormik(true);

            setCommoditiesIsLoading(true);
            agstudioAPIService.loadCommodities(domainKey).then(results => {
                setCommodities(results);
                setCommoditiesIsLoading(false);
            }, () => {
                setCommoditiesIsLoading(false);
            });

            setCropYearsOptionsIsLoading(true);
            agstudioAPIService.loadCropYears().then(results => {
                setCropYearsOptions(results);
                setCropYearsOptionsIsLoading(false);
            }, () => {
                setCropYearsOptionsIsLoading(false);
            });

            if (hasTraitsFlag) {
                setTraitsOptionsIsLoading(true);
                agstudioAPIService.loadTraits().then(results => {
                    setTraitsOptions(results);
                    setTraitsOptionsIsLoading(false);
                }, () => {
                    setTraitsOptionsIsLoading(false);
                });
            }

        } else {
            if (props.isFilterEditing) {
                console.log("edge");
            }
        }
    }, [agstudioAPIService, domainKey, props.filters.filtersDomainKey, props.isFilterEditing, hasTraitsFlag]);

    // Business Logic for the cascading loadings... (It will be triggered multiple times, need to be performant)
    function onChange({prevProps, props}: any): void {
        if (props.resetFormik !== prevProps.resetFormik && props.resetFormik) {
            props.setFieldValue("commodity", "");
            props.setFieldValue("cropYears", []);
            props.setResetFormik(false);
        }
        if (props.values.commodity !== prevProps.values.commodity) {
            loadProducts(prevProps, props);
        }
        if (props.values.cropYears.length !== prevProps.values.cropYears.length) {
            loadPreviousCrops(prevProps, props);
            loadProducts(prevProps, props);
        }
        if (props.values.traits !== prevProps.values.traits) {
            loadProducts(prevProps, props);
        }
    }

    function loadProducts(prevProps: any, props: any): void {
        // Reset
        setProductsOptions([]);
        props.setFieldValue("products", []);
        if (props.values.commodity && props.values.cropYears.length) {
            setProductsIsLoading(true);
            const selectedCommodity = commodities.filter(item => item.CommodityKey === props.values.commodity)[0];
            agstudioAPIService.loadProducts(domainKey, selectedCommodity.CropKey, props.values.cropYears, props.values.traits).then(results => {
                setProductsOptions(normalizeProducts(results));
                setProductsIsLoading(false);
            }, () => {
            });
        }
    }

    function loadPreviousCrops(prevProps: any, props: any): void {
        // Reset
        setPreviousCrops([]);
        props.setFieldValue("previousCrop", "");
        if (props.values.cropYears.length) {
            setPreviousCropsIsLoading(true);
            agstudioAPIService.loadPreviousCrops(domainKey, props.values.cropYears).then(results => {
                setPreviousCrops(results);
                setPreviousCropsIsLoading(false);
            }, () => {
            });
        }
    }

    // Normalize the products, this should be removed when the API return the the list as it should
    function normalizeProducts(products: IProductFlatObject[]): IManufacturerObjectUI[] {
        return uniqBy(products, "ManufacturerKey").map((product: IProductFlatObject) => {
            return {
                ManufacturerKey: product.ManufacturerKey,
                ManufacturerName: product.ManufacturerName,
                Products: products.filter((p: IProductFlatObject) => product.ManufacturerKey === p.ManufacturerKey).map(p => ({
                    ProductKey: p.ProductKey,
                    ProductName: p.ProductName
                }))
            };
        });
    }

    const renderForm = (formikBag: FormikProps<any>) => (
        <Form>
            <Component resetFormik={resetFormik}
                       setResetFormik={setResetFormik}
                       values={formikBag.values}
                       setFieldValue={formikBag.setFieldValue}
                       didUpdate={onChange}/>
            <GKCardBody className="pt-0">
                <Row>
                    <Col className="p-3 d-flex flex-column" xs="12" md="6">
                        <GKFormGroup>
                            <GKLabel className="d-block" htmlFor="commodity"><FormattedMessage id="label.commodity"/></GKLabel>
                            <Field name="commodity" render={({field}: FormikValues) => (
                                <GKInput data-qa="ppa-commodity-input" {...field}
                                         invalid={Boolean(formikBag.touched.commodity && formikBag.errors.commodity)} type="select">
                                    <option value="">
                                        {props.intl.formatMessage({id: commoditiesIsLoading ? "common.loading" : "common.selectOne"})}
                                    </option>
                                    {commodities.map(item => <option key={item.CommodityKey} value={item.CommodityKey}>{item.DisplayName}</option>)}
                                </GKInput>
                            )}/>
                            <ErrorMessage name="commodity">
                                {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                            </ErrorMessage>
                        </GKFormGroup>
                        <div data-qa="ppa-crop-years-container">
                            <GKFormGroup className="mb-0">
                                <GKLabel className="d-block" htmlFor="cropYears"><FormattedMessage id="label.cropYears"/></GKLabel>
                            </GKFormGroup>
                            <FieldArray name="cropYears" render={arrayHelpers => (
                                <div>
                                    {cropYearsOptionsIsLoading ?
                                        <FormattedMessage id="common.loading"/> : cropYearsOptions.map((item: ICropYearObject) => (
                                            <GKCheckbox key={item.Name} label={item.Name} inline={true}
                                                        checked={formikBag.values.cropYears.includes(item.Name)}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                arrayHelpers.push(item.Name);
                                                            } else {
                                                                arrayHelpers.remove(formikBag.values.cropYears.indexOf(item.Name));
                                                            }
                                                        }}
                                            />
                                        ))}
                                </div>
                            )}/>
                            <ErrorMessage name="cropYears">
                                {msg => <GKFormFeedback className={styles.feedbackStill}>{msg}</GKFormFeedback>}
                            </ErrorMessage>
                        </div>
                        <div className="flex-grow-1"/>
                        <GKFormGroup>
                            <GKLabel className="d-block" htmlFor="previousCrop"><FormattedMessage id="label.previousCrop"/></GKLabel>
                            <Field name="previousCrop" render={({field}: FormikValues) => (
                                <GKInput data-qa="ppa-previous-crop-input" {...field} type="select">
                                    <option value="">
                                        {props.intl.formatMessage({id: previousCropsIsLoading ? "common.loading" : "common.allPreviousCrops"})}
                                    </option>
                                    {previousCrops.map(item => <option key={item.CropKey} value={item.CropKey}>{item.CropName}</option>)}
                                </GKInput>
                            )}/>
                        </GKFormGroup>
                        <GKFormGroup>
                            <GKLabel className="d-block" htmlFor="irrigation"><FormattedMessage id="label.irrigation"/></GKLabel>
                            <Field name="irrigation" render={({field}: FormikValues) => (
                                <GKInput data-qa="ppa-irrigation-input" {...field} type="select">
                                    {irrigationOptions.map(item => <option key={item} value={item}>{item}</option>)}
                                </GKInput>
                            )}/>
                        </GKFormGroup>
                        {
                            hasTraitsFlag &&
                            <GKFormGroup className="mb-0">
                                <div className={"d-flex justify-content-between align-items-end mb-2"}>
                                    <GKLabel data-qa="ppa-traits-text" className="d-block m-0" htmlFor="traits"><FormattedMessage id="label.traits"/></GKLabel>
                                    <GKButton data-qa="ppa-clear-all-traits-button"
                                              color="primary"
                                              outline={true}
                                              size={"sm"}
                                              type={"button"}
                                              onClick={() => {
                                                  formikBag.setFieldValue("traits", [])
                                              }}>
                                        <FormattedMessage id="label.clearAll"/>
                                    </GKButton>
                                </div>
                                <Field name="traits" render={({field}: FormikValues) => (
                                    <GKInput data-qa="ppa-traits-input" {...field} type="select" multiple={true} onChange={(e) => {
                                        formikBag.setFieldValue("traits", Array.from((e.target as any).options).filter((o: any) => o.selected).map((o: any) => o.value));
                                    }}>
                                        {traitsOptionsIsLoading && <option>{props.intl.formatMessage({id: "common.loading"})}</option>}
                                        {traitsOptions.map(item => <option key={item.GMOTraitCode} value={item.GMOTraitCode}>{item.Name}</option>)}
                                    </GKInput>
                                )}/>
                            </GKFormGroup>
                        }
                    </Col>
                    <Col className="p-3" xs="12" md="6">
                        <div>
                            <GKFormGroup className="mb-0">
                                <GKLabel className="d-block" htmlFor="products"><FormattedMessage id="label.products"/></GKLabel>
                            </GKFormGroup>
                            <GKFormGroup>
                                <Field name="productSearch" render={({field}: FormikValues) => (
                                    <div className="gk-input-icon-left flex-grow-1">
                                        <span className="gi search"/>
                                        <GKInput data-qa="ppa-product-search-input"
                                                 {...field}
                                                 placeholder={props.intl.formatMessage({id: "common.search"})}
                                                 type="text"/>
                                    </div>
                                )}/>
                            </GKFormGroup>
                            <GKFormGroup className="d-flex">
                                <GKButton data-qa="ppa-collapse-all-products-button"
                                          color="primary"
                                          outline={true}
                                          size={"sm"}
                                          type={"button"}
                                          onClick={() => {
                                              setProductsOptions(productsOptions.map(m => ({...m, expanded: false})))
                                          }}>
                                    <FormattedMessage id="label.collapseAll"/>
                                </GKButton>
                                <GKButton data-qa="ppa-expand-all-products-button"
                                          className="ml-1"
                                          color="primary"
                                          size={"sm"}
                                          type={"button"}
                                          onClick={() => {
                                              setProductsOptions(productsOptions.map(m => ({...m, expanded: true})))
                                          }}>
                                    <FormattedMessage id="label.expandAll"/>
                                </GKButton>
                                <div className="flex-grow-1"/>
                                <GKButton data-qa="ppa-clear-all-products-button"
                                          color="primary"
                                          outline={true}
                                          size={"sm"}
                                          type={"button"}
                                          onClick={() => {
                                              formikBag.setFieldValue("products", [])
                                          }}>
                                    <FormattedMessage id="label.clearAll"/>
                                </GKButton>
                                <GKButton data-qa="ppa-select-all-products-button"
                                          className="ml-1"
                                          color="primary"
                                          size={"sm"}
                                          type={"button"}
                                          onClick={() => {
                                              formikBag.setFieldValue("products", flattenDeep(productsOptions.map(
                                                  m => [
                                                      m.Products.map(p => p.ProductKey)
                                                  ]
                                              )))
                                          }}>
                                    <FormattedMessage id="label.selectAll"/>
                                </GKButton>
                            </GKFormGroup>
                            <FieldArray name="products" render={arrayHelpers => (
                                <div className={styles.productsTreeContainer} data-qa="ppa-products-container">
                                    {productsIsLoading && props.intl.formatMessage({id: "common.loading"})}
                                    {
                                        productsOptions.filter(
                                            m => formikBag.values.productSearch ? (
                                                m.ManufacturerName.toLowerCase().indexOf(formikBag.values.productSearch.toLowerCase()) !== -1
                                                ||
                                                m.Products.some(
                                                    p => p.ProductName.toLowerCase().indexOf(formikBag.values.productSearch.toLowerCase()) !== -1
                                                )
                                            ) : m
                                        ).map(m => (
                                            <div key={m.ManufacturerKey}>
                                                <div className="d-flex align-items-center">
                                                    <GKButton data-qa="ppa-toggle-product-button"
                                                              disabled={Boolean(formikBag.values.productSearch)}
                                                              className={styles.productsTreeButton + " d-block pb-2"}
                                                              onClick={() => {
                                                                  setProductsOptions(productsOptions.map(mOptions => {
                                                                      if (mOptions.ManufacturerKey === m.ManufacturerKey) {
                                                                          mOptions.expanded = !mOptions.expanded;
                                                                      }
                                                                      return mOptions;
                                                                  }))
                                                              }}><GKIcon
                                                        name={m.expanded ? GKIconName.KeyboardArrowDown : GKIconName.KeyboardArrowRight}/></GKButton>
                                                    <GKCheckbox inline={true}
                                                                label={<GKHighlightText match={formikBag.values.productSearch}>{m.ManufacturerName}</GKHighlightText>}
                                                                checked={m.Products.every(p => formikBag.values.products.includes(p.ProductKey))}
                                                                indeterminate={
                                                                    !m.Products.every(
                                                                        p => formikBag.values.products.includes(p.ProductKey)
                                                                    ) && m.Products.some(
                                                                        p => formikBag.values.products.includes(p.ProductKey)
                                                                    )
                                                                }
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        formikBag.setFieldValue("products", formikBag.values.products.concat(
                                                                            m.Products.map(
                                                                                po => po.ProductKey
                                                                            ).filter(
                                                                                p => formikBag.values.products.indexOf(p) === -1
                                                                            )
                                                                        ));
                                                                    } else {
                                                                        formikBag.setFieldValue("products", formikBag.values.products.filter(
                                                                            (p: any) => m.Products.map(po => po.ProductKey).indexOf(p) === -1)
                                                                        );
                                                                    }
                                                                }}
                                                    />
                                                </div>
                                                <div className={(m.expanded || formikBag.values.productSearch ? "d-block" : "d-none") + " ml-5"}>
                                                    {
                                                        m.Products.filter(
                                                            p => formikBag.values.productSearch ?
                                                                p.ProductName.toLowerCase().indexOf(formikBag.values.productSearch.toLowerCase()) !== -1 : p
                                                        ).map(
                                                            p =>
                                                                <GKCheckbox key={p.ProductKey}
                                                                            label={<GKHighlightText match={formikBag.values.productSearch}>{p.ProductName}</GKHighlightText>}
                                                                            checked={formikBag.values.products.includes(p.ProductKey)}
                                                                            onChange={e => {
                                                                                if (e.target.checked) {
                                                                                    arrayHelpers.push(p.ProductKey);
                                                                                } else {
                                                                                    arrayHelpers.remove(formikBag.values.products.indexOf(p.ProductKey));
                                                                                }
                                                                            }}
                                                                />
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}/>
                        </div>
                    </Col>
                </Row>
            </GKCardBody>
            <GKCardBody>
                <Row>
                    <Col xs="12" className="text-center">
                        <GKButton data-qa="ppa-cancel-filters-button"
                                  className="mr-1"
                                  type="reset"
                                  color="primary"
                                  outline={true}
                                  disabled={props.filters.filtersDomainKey !== domainKey}>
                            <FormattedMessage id="label.cancel"/>
                        </GKButton>
                        <GKButton data-qa="ppa-apply-filters-button" className="ml-1" type="submit" color="primary">
                            <FormattedMessage id="label.apply"/>
                        </GKButton>
                    </Col>
                </Row>
            </GKCardBody>
        </Form>
    );

    return (
        <Container fluid={true} className={props.isFilterEditing ? styles.editMode : ""}>
            <Row className="header-row justify-content-center">
                <Col className={styles.filtersContainer + " col-12"}>
                    {!props.isFilterEditing || !domainKey || commoditiesIsLoading || commodities.length ? null :
                        <GKAlert color="warning" className="mt-4"><FormattedMessage id="common.noCommodities"/></GKAlert>}
                    <GKCard className="p-0">
                        <div className={styles.readonlyFilters} data-qa="ppa-readonly-filter-button" onClick={() => {
                            props.setIsFilterEditing(true)
                        }}>
                            <GKCardBody>
                                <Row>
                                    <Col className="p-3" xs="12" md="6">
                                        <b><FormattedMessage id="label.commodity"/>:</b> {props.displayFilters.Commodity} <br/>
                                        <b><FormattedMessage id="label.cropYears"/>:</b> {props.displayFilters.CropYears} <br/>
                                        <b><FormattedMessage id="label.previousCrop"/>:</b> {props.displayFilters.PreviousCrop} <br/>
                                        <b><FormattedMessage id="label.irrigation"/>:</b> {props.displayFilters.Irrigation} <br/>
                                        {hasTraitsFlag && <><b><FormattedMessage id="label.traits"/>:</b> {props.displayFilters.Traits} <br/></>}
                                    </Col>
                                    <Col className="p-3" xs="12" md="6"><b><FormattedMessage id="label.products"/>:</b> {props.displayFilters.Products}</Col>
                                </Row>
                                <Row>
                                    <Col rowSpan={3} className="text-center"><span className="text-primary"><FormattedMessage id="label.edit"/></span></Col>
                                </Row>
                            </GKCardBody>
                        </div>
                        <div className={styles.editFilters}>
                            <Formik
                                initialValues={{
                                    // Initial implementation, save the selected values into Formik
                                    commodity: props.filters.commodities.selected,
                                    cropYears: props.filters.cropYears.selected,
                                    previousCrop: props.filters.previousCrops.selected,
                                    traits: props.filters.traits.selected,
                                    products: props.filters.products.selected,
                                    irrigation: props.filters.irrigation.selected,
                                    productSearch: ""
                                }}
                                validationSchema={Yup.object().shape({
                                    commodity: Yup.string().required(props.intl.formatMessage({id: "validation.required"})),
                                    cropYears: Yup.array().min(1, props.intl.formatMessage({id: "validation.required"}))
                                })}
                                onSubmit={(values, formikBag) => {
                                    props.setIsFilterEditing(false);
                                    formikBag.setFieldValue("productSearch", "");
                                    props.saveFilters(values, {commodities, cropYearsOptions, previousCrops, traitsOptions, productsOptions, irrigationOptions});
                                }}
                                onReset={(values, formikBag) => {

                                    // Load options from Redux and switch to read-only mode
                                    setCommodities(props.filters.commodities.list);
                                    setCropYearsOptions(props.filters.cropYears.list);
                                    setPreviousCrops(props.filters.previousCrops.list);
                                    setProductsOptions(props.filters.products.list);
                                    setTraitsOptions(props.filters.traits.list);
                                    setIrrigationOptions(props.filters.irrigation.list);
                                    formikBag.setFieldValue("commodity", props.filters.commodities.selected);
                                    formikBag.setFieldValue("cropYears", props.filters.cropYears.selected);
                                    formikBag.setFieldValue("previousCrop", props.filters.previousCrops.selected);
                                    formikBag.setFieldValue("traits", props.filters.traits.selected);
                                    formikBag.setFieldValue("products", props.filters.products.selected);
                                    formikBag.setFieldValue("irrigation", props.filters.irrigation.selected);
                                    formikBag.setFieldValue("productSearch", "");

                                    props.setIsFilterEditing(false);

                                }}
                                render={renderForm}
                            />
                        </div>
                    </GKCard>
                </Col>
                <Col className="col-12">
                    <Dimensions isFilterEditing={props.isFilterEditing}/>
                </Col>
            </Row>
        </Container>
    );
};

export default injectIntl(FiltersComponent);

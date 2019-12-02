import styles from "./productSearch.module.scss";
import * as React from "react";
import {
    GKCard,
    GKCardHeader,
    GKCardBody,
    GKCardFooter,
    GKButton,
    GKForm,
    GKInput,
    GKFormGroup,
    GKLoading,
    GKLoadingType,
    GKIconName, GKLabel, GKRadio, GKAutoComplete, Row, Col, GKModalHeader, GKModalBody, GKModalFooter, GKModal, GKTable
} from "@gkernel/ux-components";
import {useState} from "react";
import cn from 'classnames';
import {FormattedMessage, injectIntl, IntlShape} from "react-intl";
import {useEffect} from "react";
import {IAgStudioService, IManufacturer, IProductLotRow, IProductRowObject} from "@agstudio/services/lib/models/agstudioAPIService";
import {IBaseDataService} from "@agstudio/services/lib/models/basedataAPIService";
import EmptyState from "./EmptyState";
import resourceSubTypes, {hasGlobalSearch} from "./resourceSubTypes";

const ProductSearch = (
    props: {
        agstudioAPIService: IAgStudioService,
        basedataAPIService: IBaseDataService,
        isGlobal: boolean,
        subType: number,
        cropName?: string,
        cropKey?: string,
        USDACropKey?: string,
        intl: IntlShape,
        addProduct: (p: IProductRowObject) => void,
        setShowSearch: (n: number) => void
    }
) => {

    function useDebounce(value: any, delay: number) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(
            () => {
                const handler = setTimeout(() => {
                    setDebouncedValue(value);
                }, delay);
                return () => {
                    clearTimeout(handler);
                };
            },
            [value, delay]
        );
        return debouncedValue;
    }

    const [isLoadingManufacturers, setIsLoadingManufacturers] = useState<boolean>(true);
    const [manufacturerOptions, setManufacturerOptions] = useState<IManufacturer[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [manufacturer, setManufacturer] = useState<IManufacturer | undefined>(undefined);
    const [productKey, setProductKey] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<IProductRowObject[]>([]);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [detailsProduct, setDetailsProduct] = useState<IProductRowObject | undefined>(undefined);
    const [detailsProductLot, setDetailsProductLot] = useState<IProductLotRow | undefined>(undefined);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const loadDefaultProductLot = () => {
        if (productKey) {
            setShowDetails(true);
            props.basedataAPIService.loadDefaultProductLot(props.subType, productKey).then(pl => {
                setDetailsProduct(searchResults.filter(p => p.Key === productKey)[0]);
                setDetailsProductLot(pl);
            }, () => {
            })
        }
    };

    const search = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const hideModal = () => {
        setShowDetails(false);
        setTimeout(() => {
            setDetailsProduct(undefined);
            setDetailsProductLot(undefined);
        }, 200);
    };

    const renderSearchButton = () => (
        <>
            <p className={"text-center mt-5 text-secondary"}><FormattedMessage id="common.productsSearchTitle"/><br/><FormattedMessage id="common.globalSearchText"/></p>
            <p className={"text-center"}>
                <GKButton className={cn(styles.whiteButton, "align-self-center")}
                          color="primary"
                          data-qa="rl-open-global-search-button"
                          outline={true}
                          icon={GKIconName.Search}
                          onClick={() => props.setShowSearch(2)}
                >
                    <FormattedMessage id="common.search"/>
                </GKButton>
            </p>
        </>
    );

    const renderSearchResults = () => {
        if (debouncedSearchQuery.length < 3) {
            return null;
        }
        if (searchResults.length) {
            return <>
                {searchResults.map(p => (
                    <li className={styles.lotItem} key={p.Key}>
                        <GKLabel className={cn(styles.lotCard, 'm-0')}>
                            <GKRadio name="searchResultItem" className={cn(styles.lotRadio, 'm-0')} data-qa="rl-lot-radio-input" checked={p.Key === productKey} onChange={() => {
                                setProductKey(p.Key)
                            }}/>
                            <div className={cn(styles.productName, 'pl-2')}>{p.Name}</div>
                            <div className={cn(styles.lightGryLabel, 'text-right', 'pl-2')}>{p.Manufacturer.Name}</div>
                        </GKLabel>
                    </li>
                ))}
                {!props.isGlobal && hasGlobalSearch(props.subType) && renderSearchButton()}
            </>
        }
        return <>
            <EmptyState className={styles.emptyStateBox} title={props.intl.formatMessage({id: "emptyState.noProducts.title"})}
                        titleClass={"text-danger"}
                        text={props.intl.formatMessage({id: "emptyState.noProducts.text"})}/>
            {!props.isGlobal && hasGlobalSearch(props.subType) && renderSearchButton()}
        </>;
    };

    const renderProductDetails = (p: IProductRowObject, pl: IProductLotRow) => {
        switch (resourceSubTypes(props.subType)) {
            case "Fertilizer":
                return <>
                    <p className={"m-0"}><span className={"text-secondary"}>Manufacturer:</span> {p.Manufacturer.Name}</p>
                    <p className={"m-0"}><span className={"text-secondary"}>Category:</span> {p.ProductCategory.Name}</p>
                    <p className={"m-0"}><span className={"text-secondary"}>Form:</span> {p.ProductForm}</p>
                    <fieldset className={"border p-2 mt-3"}>
                        <legend className={"w-auto"}>Units</legend>
                        <p className={"m-0"}><span className={"text-secondary"}>Application Rate Unit:</span> {pl.AppRateUnit}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Transfer Unit:</span> {pl.TransferUnit}</p>
                        <p className={"m-0 mb-3"}><span className={"text-secondary"}>Purchase Unit:</span> {pl.PurchaseUnit}</p>
                    </fieldset>
                    <fieldset className={"border mt-3"}>
                        <legend className={"w-auto ml-2"}>Nutrients</legend>
                        <GKTable striped={true} className={"mb-0"}>
                            <thead>
                            <tr>
                                <th className={"text-left"}>Name</th>
                                <th>Analysis</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pl.NutrientAnalyses.map(n =>
                                <tr key={n.Nutrient.NutrientSymbol}>
                                    <td className={"text-left"}>{n.Nutrient.NutrientSymbol}</td>
                                    <td>{n.Analysis}</td>
                                </tr>
                            )}
                            </tbody>
                        </GKTable>
                    </fieldset>
                </>;
            case "Chemical" || "Amendment":
                return <>
                    <p className={"m-0"}><span className={"text-secondary"}>Manufacturer:</span> {p.Manufacturer.Name}</p>
                    <p className={"m-0"}><span className={"text-secondary"}>Category:</span> {p.ProductCategory.Name}</p>
                    <p className={"m-0"}><span className={"text-secondary"}>Form:</span> {p.ProductForm}</p>
                    <fieldset className={"border p-2 mt-3"}>
                        <legend className={"w-auto"}>Units</legend>
                        <p className={"m-0"}><span className={"text-secondary"}>Application Rate Unit:</span> {pl.AppRateUnit}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Transfer Unit:</span> {pl.TransferUnit}</p>
                        <p className={"m-0 mb-3"}><span className={"text-secondary"}>Purchase Unit:</span> {pl.PurchaseUnit}</p>
                    </fieldset>
                    <fieldset className={"border p-2 mt-3"}>
                        <legend className={"w-auto"}>EPA</legend>
                        <p className={"m-0"}><span className={"text-secondary"}>EPA Reg. #:</span> {p.EPARegistrationID}</p>
                        <p className={"m-0 mb-3"}><span className={"text-secondary"}>Use is Restricted:</span> {p.IsRestrictedUse ? "Yes" : "No"}</p>
                    </fieldset>
                </>;
            case "Seed":
                return (
                    <>
                        <p className={"m-0"}><span className={"text-secondary"}>Manufacturer:</span> {p.Manufacturer.Name}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Crop:</span> {props.cropName}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Default Rate:</span> {pl.DefaultRate}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Rate Unit:</span> {pl.AppRateUnit}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Purchase Unit:</span> {pl.PurchaseUnit}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Conversion:</span> {pl.PurchaseDensity}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>CRM:</span> {p.CRM}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>GDD to Silk:</span> {p.GDDSilk}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>GDD to Maturity:</span> {p.GDDMaturity}</p>
                        <p className={"m-0"}><span className={"text-secondary"}>Crop Heat Units:</span> {p.CropHeatingUnits}</p>
                        {p.GMOTraits &&
                        <fieldset className={"border mt-3"}>
                            <legend className={"w-auto ml-2"}>GMO Traits</legend>
                            <GKTable striped={true} className={"mb-0"}>
                                <tbody>
                                {p.GMOTraits.length && p.GMOTraits.map(t =>
                                    <tr key={t.GMOTraitCode}>
                                        <td className={"text-left"}>{t.Name}</td>
                                    </tr>
                                )}
                                </tbody>
                            </GKTable>
                        </fieldset>}
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {

        if (props.isGlobal) {
            props.basedataAPIService.loadManufacturers(props.subType).then(results => {
                setManufacturerOptions(results.Results.map(m => ({Name: m, Key: "N/A"})));
                setIsLoadingManufacturers(false);
            }, () => {
                setIsLoadingManufacturers(false);
            });
        } else {
            props.agstudioAPIService.loadManufacturers(props.subType).then(results => {
                setManufacturerOptions(results);
                setIsLoadingManufacturers(false);
            }, () => {
                setIsLoadingManufacturers(false);
            });
        }
    }, [props.isGlobal, props.basedataAPIService, props.agstudioAPIService, props.subType]);

    useEffect(() => {
        setSearchResults([]);
        if (debouncedSearchQuery) {
            if (debouncedSearchQuery.length >= 3) {
                setIsSearching(true);
                if (props.isGlobal) {
                    props.basedataAPIService.searchProducts(
                        props.subType,
                        debouncedSearchQuery,
                        props.USDACropKey,
                        manufacturer && manufacturer.Name
                    ).then(results => {
                        setSearchResults(results.Results);
                        setIsSearching(false);
                    }, () => {
                        setIsSearching(false);
                    });
                } else {
                    props.agstudioAPIService.searchProducts(
                        props.subType,
                        debouncedSearchQuery,
                        props.cropKey,
                        manufacturer && manufacturer.Key
                    ).then(results => {
                        setSearchResults(results);
                        setIsSearching(false);
                    }, () => {
                        setIsSearching(false);
                    });
                }
            }
        }
    }, [props.isGlobal, props.basedataAPIService, props.agstudioAPIService, props.subType, props.cropKey, props.USDACropKey, manufacturer, debouncedSearchQuery]);

    return (
        <>
            <GKCard className={cn(styles.productSearch, props.isGlobal ? styles.global : "", styles.modActive)}>
                <GKCardHeader className={styles.gsHeader}>
                    <h5><FormattedMessage id={!props.isGlobal ? "common.databaseSearch" : "common.globalSearch"}/></h5>
                    <GKButton data-qa="rl-search-close-button" color="transparent" icon={GKIconName.Clear} onClick={() => props.setShowSearch(0)}/>
                </GKCardHeader>
                <GKCardBody className={styles.gsBody}>
                    <Row className={"pb-2"}>
                        <Col xs="6">
                            <span className={cn(styles.formLabel, "mt-2")}><FormattedMessage id="label.type"/>: {resourceSubTypes(props.subType)}</span>
                        </Col>
                        <Col xs="6">
                            {props.cropName && <span className={cn(styles.formLabel)}><FormattedMessage id="label.crop"/>: {props.cropName}</span>}
                        </Col>
                    </Row>
                    <GKForm>
                        <GKFormGroup>
                            <span className={cn(styles.formLabel, 'mb-2')}><FormattedMessage id="label.manufacturer"/>:</span>
                            <GKAutoComplete data-qa="rl-search-manufacturer-input"
                                            selectedItem={manufacturer}
                                            isLoading={isLoadingManufacturers}
                                            icon={GKIconName.Search}
                                            data={manufacturerOptions}
                                            filterFunction={(m: IManufacturer, filter: string) => m.Name.toLowerCase().indexOf(filter.toLowerCase()) >= 0}
                                            itemTemplate={(m: IManufacturer) => m.Name}
                                            itemToString={(m: IManufacturer) => m.Name}
                                            onSelection={(m: IManufacturer) => setManufacturer(m)}
                            />
                        </GKFormGroup>
                        <GKFormGroup>
                            <span className={cn(styles.formLabel, 'mb-2')}><FormattedMessage id="label.nameContains"/>:</span>
                            <div className="gk-input-icon-left">
                                <span className={cn('gi search')}/>
                                <GKInput data-qa="rl-search-name-input" type="text" value={searchQuery} onChange={search}/>
                            </div>
                        </GKFormGroup>
                    </GKForm>
                    {
                        isSearching ?
                            <GKLoading isLoading={true} spinnerProps={{inverse: true}} type={GKLoadingType.Spinner} className={cn(styles.spinner, 'mt-5')}/> :
                            renderSearchResults()
                    }
                </GKCardBody>
                <GKCardFooter className={styles.gsFooter}>
                    {props.isGlobal &&
                    <GKButton className={cn("mr-2", styles.whiteButton)}
                              data-qa="rl-search-view-details-button"
                              outline={true}
                              disabled={!productKey}
                              onClick={loadDefaultProductLot}
                    >
                        <FormattedMessage id="label.viewDetails"/>
                    </GKButton>
                    }
                    <GKButton disabled={!productKey} onClick={() => props.addProduct(searchResults.filter(p => p.Key === productKey)[0])}>
                        <FormattedMessage id="common.addProduct"/>
                    </GKButton>
                </GKCardFooter>
            </GKCard>
            <GKModal isOpen={showDetails} centered={true} toggle={hideModal}>
                <GKModalHeader>{detailsProduct ? detailsProduct.Name : <FormattedMessage id="common.loading"/>}</GKModalHeader>
                <GKModalBody>
                    {
                        detailsProduct && detailsProductLot ?
                            renderProductDetails(detailsProduct, detailsProductLot) :
                            <GKLoading isLoading={true} type={GKLoadingType.Spinner} style={{height: 100}}/>
                    }
                </GKModalBody>
                <GKModalFooter>
                    <GKButton data-qa="ppa-keep-download-button" color="primary" onClick={hideModal}>
                        <FormattedMessage id="common.ok"/>
                    </GKButton>
                </GKModalFooter>
            </GKModal>
        </>
    );
};

export default injectIntl(ProductSearch);

import * as React from "react";
import {
    Col,
    Container,
    GKIcon,
    GKIconName,
    GKButton,
    GKMenuButton,
    GKMenuItem,
    Row,
    GKLoading,
    GKLoadingType, GKModalFooter, GKAlert, GKModalHeader, GKModalBody, GKModal, GKCardBody, GKCard, GKSelect
} from "@gkernel/ux-components";
import {useState, useEffect, useMemo} from "react";
import cn from 'classnames';
import styles from "./rl.module.scss";
import {FormattedMessage, injectIntl, IntlShape} from "react-intl";
import UnlinkedCard from './UnlinkedCard';
import ActionPanel, {IProductKeyValue} from './ActionPanel';
import EmptyState from './EmptyState';
import {IAgStudioService, IGrowerCropsObject, IProductLotsObject, IUnlinkedProductObject} from "@agstudio/services/lib/models/agstudioAPIService";
import {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";
import resourceSubTypes from "./resourceSubTypes";
import {IBaseDataService} from "@agstudio/services/lib/models/basedataAPIService";

export interface IUnlinkedProductObjectUI extends IUnlinkedProductObject {
    linkedTo?: string;
    linkId?: string;
    productLots?: IProductLotsObject[];
    modifiedCropName?: string;
    modifiedResourceSubType?: number;
}

export interface IModalObject {
    show: boolean;
    header: string;
    body: JSX.Element[];
    footer: JSX.Element[];
}

const currentYear = new Date().getFullYear();

const RLComponent = (props: { basedataAPIService: IBaseDataService, agstudioAPIService: IAgStudioService, domain: IDomainStore, intl: IntlShape }) => {

    const sortByOptions = useMemo(() => ([
        {
            key: 'SourceName',
            label: props.intl.formatMessage({id: "label.name"}),
            order: 'asc'
        },
        {
            key: 'UnlinkCount',
            label: props.intl.formatMessage({id: "label.occurrences"}),
            order: 'desc'
        },
        {
            key: 'FirstSeenTime',
            label: props.intl.formatMessage({id: "label.firstSeen"}),
            order: 'asc'
        },
        {
            key: 'LastSeenTime',
            label: props.intl.formatMessage({id: "label.lastSeen"}),
            order: 'desc'
        }
    ]), [props.intl]);

    const [cropYear, setCropYear] = useState(new Date().getFullYear());
    const [forceReload, setForceReload] = useState<number>(Math.random());
    const [unlinkedProducts, setUnlinkedProducts] = useState<IUnlinkedProductObjectUI[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
    const [growerCrops, setGrowerCrops] = useState<IGrowerCropsObject[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLinking, setIsLinking] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<any>(sortByOptions[0]);
    const [filterBySubType, setFilterBySubType] = useState<number>(0);
    const [filterByCrop, setFilterByCrop] = useState<string>("");
    const [filterBySource, setFilterBySource] = useState<string>("");
    const [modal, setModal] = useState<IModalObject>({show: false, header: '', body: [], footer: []});

    const hasModifiedProducts = (): boolean => unlinkedProducts.filter(p => (p.modifiedCropName || p.modifiedResourceSubType || p.linkedTo)).length > 0;

    const getLinkedProducts = (): IUnlinkedProductObjectUI[] => unlinkedProducts.filter(p => p.linkedTo);

    const filterBy = (setState: any, newState: any, upProp: string): void => {
        setState(newState);
        if (selectedProductId && newState && (unlinkedProducts.filter(up => up.FieldOpXRefId === selectedProductId)[0] as any)[upProp] !== newState) {
            setSelectedProductId(undefined);
        }
    };

    const selectProduct = (product: IUnlinkedProductObjectUI, currentProductId: any): void => {
        // Reset the ActionPanel first. Empty string will eval to falsy BUT will not render the empty state. This is kinda quirky for now...
        setSelectedProductId("");
        // Trigger the actual selection on the next event loop
        setTimeout(() => setSelectedProductId(product.FieldOpXRefId === currentProductId ? undefined : product.FieldOpXRefId), 0);
    };

    const modifyProduct = (productId: string, pProps: IProductKeyValue[]): void => {
        setUnlinkedProducts(unlinkedProducts.map(up => {
            if (up.FieldOpXRefId === productId) {
                pProps.forEach(p => {
                    (up as any)[p.key] = p.value;
                });
            }
            return up;
        }));
    };

    const save = () => {
        const linkedProducts = getLinkedProducts();
        setModal({
            show: true,
            header: props.intl.formatMessage({id: linkedProducts.length > 1 ? "label.saveLinks" : "label.saveLink"}),
            body: [
                <>
                    <FormattedMessage id="confirmation.linking"/>:
                    <div className={cn(styles.toBeLinked, 'mt-2')}>
                        <ul className={cn(styles.confirmationLinkList, 'p-2 mt-2 mb-2')}>
                            {
                                linkedProducts.map(p =>
                                    <li className={cn(styles.greenText, styles.confirmationLinks)} key={p.FieldOpXRefId}>
                                        {p.SourceName}<GKIcon className={styles.linkArrow} name={GKIconName.KeyboardArrowRight}/>{p.linkedTo}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </>
            ],
            footer: [
                <GKButton data-qa="rl-rl-save-links-cancel-button" color="primary" outline={true} onClick={hideModal}>
                    <FormattedMessage id="label.cancel"/>
                </GKButton>,
                <GKButton data-qa="rl-rl-save-links-button" color="primary" onClick={() => {

                    setSelectedProductId(undefined);
                    setIsLinking(true);

                    props.agstudioAPIService.submitLinkedResource(linkedProducts.map(p => ({
                        LinkId: p.linkId,
                        FieldOpXRefId: p.FieldOpXRefId,
                        ResourceSubType: (p.modifiedResourceSubType || p.ResourceSubType)
                    }))).then(() => {
                        setShowSuccess(true);
                        hideModal();
                        setIsLinking(false);
                        setForceReload(Math.random());
                    }, () => {
                        hideModal();
                        setIsLinking(false);
                        setForceReload(Math.random());
                    });

                }}>
                    <FormattedMessage id="common.ok"/>
                </GKButton>
            ]
        });
    };

    const handleCropYear = (year: number) => {
        if (year !== cropYear) {
            if (hasModifiedProducts()) {
                setModal({
                    show: true,
                    header: props.intl.formatMessage({id: "common.changeCropYear"}),
                    body: [<FormattedMessage id="confirmation.cropChange"/>],
                    footer: [
                        <GKButton data-qa="rl-rl-change-crop-year-back-button" color="primary" outline={true} onClick={hideModal}>
                            <FormattedMessage id="label.back"/>
                        </GKButton>,
                        <GKButton data-qa="rl-rl-change-crop-year-button" color="primary" onClick={() => {
                            setCropYear(year);
                            hideModal();
                        }}>
                            <FormattedMessage id="common.continueTo"/>{` ${year}`}
                        </GKButton>
                    ]
                });
            } else {
                setCropYear(year);
            }
        }
    };

    const hideModal = () => {
        setModal(oldModal => ({...oldModal, show: false}));
    };

    const reset = () => {
        setModal({
            show: true,
            header: props.intl.formatMessage({id: "modal.reset.title"}),
            body: [<><FormattedMessage id="confirmation.resetLinker"/></>],
            footer: [
                <GKButton data-qa="rl-rl-reset-back-button" color="primary" outline={true} onClick={hideModal}>
                    <FormattedMessage id="label.cancel"/>
                </GKButton>,
                <GKButton data-qa="rl-rl-reset-button" color="primary" onClick={() => {
                    setSelectedProductId(undefined);
                    setUnlinkedProducts(unlinkedProducts.map(up => {
                        delete up.modifiedCropName;
                        delete up.modifiedResourceSubType;
                        delete up.linkedTo;
                        delete up.linkId;
                        return up;
                    }));
                    hideModal();
                }}>
                    <FormattedMessage id="common.ok"/>
                </GKButton>
            ]
        });
    };

    const renderEmptyActionPanel = () => {
        const title = props.intl.formatMessage({id: "emptyState.selectProduct.title"});
        const text = `${props.intl.formatMessage({id: "emptyState.selectProduct.text"})}.`;
        return (
            <div className={styles.emptyStateWrapper}>
                <GKCardBody>
                    <EmptyState title={title} text={text}>
                        <GKIcon className={styles.emptyStateIcon} name={GKIconName.Link}/>
                    </EmptyState>
                </GKCardBody>
            </div>
        );
    };

    const renderContent = () => {
        if (unlinkedProducts.length) {
            // data exists. show list...
            return (
                <Row className={styles.linkerBody}>
                    <Col xs="12" md='6' lg='6' className={"p-0"}>
                        <div className={cn(styles.unlinkedList)}>
                            <div className={cn(styles.productList, 'p-3')}>
                                {
                                    unlinkedProducts.filter(up => {
                                        // Edge case to filter by unknown type
                                        if (filterBySubType === -1) return !up.ResourceSubType;
                                        return filterBySubType ? up.ResourceSubType === filterBySubType : true
                                    }).filter(up =>
                                        filterByCrop ? up.CropName === filterByCrop : true
                                    ).filter(up =>
                                        filterBySource ? up.SourceResourceName === filterBySource : true
                                    ).sort((a, b) => {
                                        const order = sortBy.order === 'asc' ? 1 : -1;
                                        return (a as any)[sortBy.key] > (b as any)[sortBy.key] ? order : order * -1;
                                    }).map(p => (
                                            <UnlinkedCard data-qa="rl-unlinked-card"
                                                          key={p.FieldOpXRefId}
                                                          product={p}
                                                          onClick={(p) => selectProduct(p, selectedProductId)}
                                                          isSelected={p.FieldOpXRefId === selectedProductId}
                                            />
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="6" lg="6" className={cn(styles.actionPanel, selectedProductId && styles.modActive)}>
                        {
                            selectedProductId ?
                                <GKCard className={styles.actionPanelCard}>
                                    <ActionPanel agstudioAPIService={props.agstudioAPIService}
                                                 basedataAPIService={props.basedataAPIService}
                                                 growerKey={props.domain.growers.selected}
                                                 cropYear={cropYear}
                                                 crops={growerCrops}
                                                 product={unlinkedProducts.filter(c => c.FieldOpXRefId === selectedProductId)[0]}
                                                 modifyProduct={modifyProduct}
                                                 close={() => setSelectedProductId(undefined)}
                                    />
                                </GKCard> :
                                selectedProductId === undefined ? renderEmptyActionPanel() : <GKCard className={styles.actionPanelCard}/>
                        }
                    </Col>
                </Row>
            );
        } else {
            return (
                <EmptyState title={props.intl.formatMessage({id: "emptyState.noUnlinkedProducts.title"})}
                            text={props.intl.formatMessage({id: "emptyState.noUnlinkedProducts.text"})}>
                    <GKIcon className={styles.emptyStateIcon} name={GKIconName.CheckCircleOutline}/>
                </EmptyState>
            );
        }
    };

    useEffect(() => {

        setIsLoading(true);
        setSelectedProductId(undefined);
        setSortBy(sortByOptions[0]);
        setFilterBySubType(0);
        setFilterByCrop("");
        setFilterBySource("");

        props.agstudioAPIService.loadUnlinkedProducts(props.domain.growers.selected, cropYear).then(results => {
            setUnlinkedProducts(results);
            setIsLoading(false);
        }, () => {
            setUnlinkedProducts([]);
            setIsLoading(false);
        });
        props.agstudioAPIService.loadCropsByGrower(props.domain.growers.selected, cropYear).then(results => {
            setGrowerCrops(results);
        }, () => {
            setGrowerCrops([]);
        });

    }, [props.agstudioAPIService, props.domain.growers.selected, sortByOptions, cropYear, forceReload]);

    return (
        <Container fluid={true} className={styles.resourceLinker}>
            {
                showSuccess &&
                <GKAlert color="success" timeout={5000}>
                    <GKIcon className="mr-2" name={GKIconName.Check}/>
                    <FormattedMessage id="alert.linkingSuccess"/>
                </GKAlert>
            }
            <Row className={cn('justify-content-center', styles.resourceLinkerInner)}>
                <Col className={cn('col-12', styles.wrapperCol)}>
                    <>
                        <div className={styles.linkerHeader}>
                            <Row className={"pt-3"}>
                                <Col xs="12" className={"d-flex"}>
                                    <div className={styles.growerInfo}>
                                        <span className={styles.lightGryLabel}><FormattedMessage id="label.grower"/>:</span>
                                        <h5 className={cn(styles.growerName, 'mb-0')}>
                                            {props.domain.growers.list.filter(g => g.Key === props.domain.growers.selected)[0].Name}
                                        </h5>
                                    </div>
                                    <GKMenuButton data-qa="rl-crop-year-select" className={styles.cropYearPicker} color="link" menuPlacement="bottom-end" text={cropYear}>
                                        {[0, 1, 2, 3, 4].map(diff => (
                                            <GKMenuItem key={diff} onSelect={() => handleCropYear(currentYear - diff)}>
                                                {currentYear - diff}
                                            </GKMenuItem>
                                        ))}
                                    </GKMenuButton>
                                </Col>
                            </Row>
                            <Row className={"py-3"}>
                                <Col xs="6" md='3'>
                                    <span className={styles.lightGryLabel}><FormattedMessage id="label.sortBy"/>:</span>
                                    <GKSelect data-qa="rl-sort-by-input"
                                              data={sortByOptions}
                                              itemToString={(sb: any) => sb.label}
                                              selectedItem={sortBy}
                                              onChange={(sb: any) => setSortBy(sb)}
                                    />
                                </Col>
                                <Col xs="6" md='3'>
                                    <span className={styles.lightGryLabel}><FormattedMessage id="label.filterBy"/> <FormattedMessage id="label.type"/>:</span>
                                    <GKSelect data-qa="rl-filter-by-type-input"
                                              data={[0, -1].concat(Array.from(new Set(unlinkedProducts.filter(up => up.ResourceSubType).map(up => up.ResourceSubType))))}
                                              itemToString={(st: any) => {
                                                  // Edge case to filter by unknown type
                                                  if (st === -1) return props.intl.formatMessage({id: "common.unknown"});
                                                  return st ? resourceSubTypes(st) : props.intl.formatMessage({id: "label.selectAll"})
                                              }}
                                              selectedItem={filterBySubType}
                                              onChange={(cn: any) => filterBy(setFilterBySubType, cn, "ResourceSubType")}
                                    />
                                </Col>
                                <Col xs="6" md='3'>
                                    <span className={styles.lightGryLabel}><FormattedMessage id="label.filterBy"/> <FormattedMessage id="label.crop"/>:</span>
                                    <GKSelect data-qa="rl-filter-by-crop-input"
                                              data={[""].concat(Array.from(new Set(unlinkedProducts.filter(up => up.CropName).map(up => up.CropName))))}
                                              itemToString={(cn: any) => cn || props.intl.formatMessage({id: "label.selectAll"})}
                                              selectedItem={filterByCrop}
                                              onChange={(cn: any) => filterBy(setFilterByCrop, cn, "CropName")}
                                    />
                                </Col>
                                <Col xs="6" md='3'>
                                    <span className={styles.lightGryLabel}><FormattedMessage id="label.filterBy"/> <FormattedMessage id="label.source"/>:</span>
                                    <GKSelect data-qa="rl-filter-by-source-input"
                                              data={[""].concat(Array.from(new Set(unlinkedProducts.filter(up => up.SourceResourceName).map(up => up.SourceResourceName))))}
                                              itemToString={(sn: any) => sn || props.intl.formatMessage({id: "label.selectAll"})}
                                              selectedItem={filterBySource}
                                              onChange={(sn: any) => filterBy(setFilterBySource, sn, "SourceResourceName")}
                                    />
                                </Col>
                            </Row>
                        </div>
                        {isLoading ? <GKLoading isLoading={true} type={GKLoadingType.Spinner} style={{margin: '15% 0'}}/> : renderContent()}
                    </>
                </Col>
            </Row>
            <Row className={styles.linkerFooter}>
                <Col xs="12" className="pr-0">
                    <div className={cn(styles.footerActions, 'p-3')}>
                        <GKButton color="primary" data-qa="rl-rl-reset-open-modal-button" disabled={!hasModifiedProducts()} outline={true} className="mr-2" onClick={reset}>
                            <FormattedMessage id="label.reset"/>
                        </GKButton>
                        <GKButton color="primary" className="ml-2" data-qa="rl-rl-save-links-open-modal-button" disabled={!getLinkedProducts().length} onClick={save}>
                            <FormattedMessage id="label.saveLinks"/>
                        </GKButton>
                    </div>
                </Col>
            </Row>
            <GKModal isOpen={modal.show} centered={true}>
                <GKModalHeader>{modal.header}</GKModalHeader>
                <GKModalBody>
                    {
                        !isLinking ? modal.body.map((child, index) => <span key={index}>{child}</span>) :
                            <EmptyState title={`${props.intl.formatMessage({id: "common.linkingResources"})}...`} className="m-0">
                                <GKLoading isLoading={true} type={GKLoadingType.Spinner} className={styles.spinner}/>
                            </EmptyState>
                    }
                </GKModalBody>
                <GKModalFooter>{modal.footer.map((child, index) => <span key={index}>{child}</span>)}</GKModalFooter>
            </GKModal>
        </Container>
    );

};

export default injectIntl(RLComponent);

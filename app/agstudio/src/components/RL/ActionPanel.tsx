import * as React from "react";
import {
    GKCardHeader,
    GKButton,
    GKIconName,
    GKCardTitle,
    GKCardBody,
    GKLoading,
    GKLoadingType,
    GKCardSubtitle,
    GKForm,
    GKFormGroup,
    GKSelect,
    GKLabel
} from "@gkernel/ux-components";
import cn from 'classnames';
import resourceSubTypes, {requiresCrop, subTypes} from './resourceSubTypes';
import styles from "./actionPanel.module.scss";
import EmptyState from './EmptyState';
import ProductLots from './ProductLots';
import {FormattedMessage, injectIntl, IntlShape} from "react-intl";
import {IUnlinkedProductObjectUI} from "./RLComponent";
import {IAgStudioService, IGrowerCropsObject, IProductLotsObject, IProductRowObject} from "@agstudio/services/lib/models/agstudioAPIService";
import ProductSearch from "./ProductSearch";
import {useState} from "react";
import {useEffect} from "react";
import {IBaseDataService} from "@agstudio/services/lib/models/basedataAPIService";
import {IReduxStore} from "../../rootReducer";
import {connect} from "react-redux";
import {IFeatureFlagsStore} from "@agstudio/web/lib/components/featureFlagsReducer";

export interface IProductKeyValue {
    key: string;
    value: any;
}

const mapStateToProps = (state: IReduxStore) => ({
    featureFlags: state.featureFlags
});

const ActionPanel = (
    props: {
        featureFlags: IFeatureFlagsStore,
        basedataAPIService: IBaseDataService,
        agstudioAPIService: IAgStudioService,
        growerKey: string,
        cropYear: number,
        product: IUnlinkedProductObjectUI,
        crops: IGrowerCropsObject[],
        intl: IntlShape,
        modifyProduct: (productId: string, pProps: IProductKeyValue[]) => void,
        close: () => void
    }
) => {

    const hasProductSearchFlag = props.featureFlags.resource_linker_product_search && props.featureFlags.resource_linker_product_search.enabled;

    const subType = props.product.modifiedResourceSubType || props.product.ResourceSubType;
    const cropName = props.product.modifiedResourceSubType ? props.product.modifiedCropName : props.product.modifiedCropName || props.product.CropName;


    const getCropKey = (keyName: string, cropName?: string) => {
        if (!requiresCrop(subType) || !cropName || !props.crops.filter(c => c.CropName === cropName).length) {
            return false;
        }
        return (props.crops.filter(c => c.CropName === cropName)[0] as any)[keyName];
    };

    const cropKey = getCropKey("CropKey", cropName) || undefined;
    const USDACropKey = getCropKey("USDACropKey", cropName) || undefined;

    const [showSearch, setShowSearch] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productLots, setProductLots] = useState<IProductLotsObject[]>([]);

    const addProduct = (p: IProductRowObject) => {
        setShowSearch(0);
        setIsLoading(true);
        props.agstudioAPIService.addProductLots(props.growerKey, props.cropYear, p).then(pl => {
            props.modifyProduct(props.product.FieldOpXRefId, [
                {key: 'linkId', value: pl.ProductLots[0].ProductLotRow.Key},
                {key: 'linkedTo', value: pl.ProductLots[0].ProductLotRow.Name}
            ]);
            props.agstudioAPIService.loadProductLots(props.growerKey, props.cropYear, subType, cropKey).then(results => {
                setProductLots(results);
                setIsLoading(false);
            }, () => {
                setIsLoading(false);
            });
        }, () => {
            setIsLoading(false);
        })
    };

    const renderResults = () => {
        let component = null;
        if (!subType) {
            component = <EmptyState title={props.intl.formatMessage({id: "emptyState.selectType.title"})}
                                    titleClass={"text-warning"}
                                    text={props.intl.formatMessage({id: "emptyState.selectType.text"})}/>;
        } else {
            if (requiresCrop(subType) && !cropKey) {
                component = <EmptyState title={props.intl.formatMessage({id: "emptyState.selectCrop.title"})}
                                        titleClass={"text-warning"}
                                        text={`${resourceSubTypes(subType)} ${props.intl.formatMessage({id: "emptyState.selectCrop.text"})}`}/>;
            } else {
                if (!productLots.length) {
                    component = <>
                        <EmptyState title={props.intl.formatMessage({id: "emptyState.noProducts.title"})} titleClass={"text-danger"}/>
                        {hasProductSearchFlag && renderSearchButton()}
                    </>;
                } else {
                    component = <>
                        <ProductLots product={props.product} productLots={productLots} modifyProduct={props.modifyProduct}/>
                        {hasProductSearchFlag && renderSearchButton()}
                    </>;
                }
            }
        }
        return component;
    };

    const renderSearchButton = () => (
        <>
            <p className={"text-center mt-5 text-secondary"}><FormattedMessage id="common.productsSearchTitle"/><br/><FormattedMessage id="common.databaseSearchText"/></p>
            <p className={"text-center"}>
                <GKButton className={"align-self-center"}
                          color="primary"
                          data-qa="rl-open-database-search-button"
                          outline={true}
                          icon={GKIconName.Search}
                          onClick={() => setShowSearch(1)}
                >
                    <FormattedMessage id="common.search"/>
                </GKButton>
            </p>
        </>
    );

    const renderCardContent = () => <>
        <GKCardHeader>
            <GKCardTitle>{props.product.SourceName}</GKCardTitle>
            <GKCardSubtitle>
                    <span className={cn(styles.linkedStatus, props.product.linkId && styles.modLinked)}>
                        {
                            props.product.linkId ?
                                `${props.intl.formatMessage({id: "common.linkedTo"})} ${props.product.linkedTo}` :
                                props.intl.formatMessage({id: "common.unlinked"})
                        }
                    </span>
            </GKCardSubtitle>
        </GKCardHeader>
        <GKCardBody className={styles.actionPanelBody}>
            <GKForm>
                <GKFormGroup>
                    <GKLabel><FormattedMessage id="label.type"/>:</GKLabel>
                    <GKSelect data-qa="rl-subtype-select"
                              data={subTypes.map(up => up.id)}
                              itemToString={(st: any) => resourceSubTypes(st)}
                              selectedItem={subType}
                              onChange={(st: any) => {
                                  props.modifyProduct(props.product.FieldOpXRefId, [
                                      {key: 'modifiedResourceSubType', value: st},
                                      {key: 'modifiedCropName', value: undefined},
                                      {key: 'linkId', value: undefined},
                                      {key: 'linkedTo', value: undefined}
                                  ])
                              }}
                              placeholder={props.intl.formatMessage({id: "common.selectType"})}
                    />
                </GKFormGroup>
                {requiresCrop(subType) && <GKFormGroup>
                    <GKLabel><FormattedMessage id="label.crop"/>:</GKLabel>
                    <GKSelect data-qa="rl-crop-select"
                              data={props.crops.map(c => c.CropName)}
                              itemToString={(c: any) => c}
                              selectedItem={cropName}
                              onChange={(c: any) => {
                                  props.modifyProduct(props.product.FieldOpXRefId, [
                                      {key: 'modifiedCropName', value: c},
                                      {key: 'linkId', value: undefined},
                                      {key: 'linkedTo', value: undefined}
                                  ])
                              }}
                              placeholder={props.intl.formatMessage({id: "common.selectCrop"})}
                    />
                </GKFormGroup>}
            </GKForm>
            {isLoading ? <GKLoading isLoading={true} type={GKLoadingType.Spinner} className={cn(styles.spinner, 'mt-5')}/> : renderResults()}
        </GKCardBody>
        {/*{*/}
        {/*    <GKCardFooter className={styles.actionPanelFooter}>*/}
        {/*        <GKButton color="primary" data-qa="rl-view-details-button" className={"mr-2"} outline={true} onClick={props.close}>*/}
        {/*            <FormattedMessage id="label.viewDetails"/>*/}
        {/*        </GKButton>*/}
        {/*        <GKButton color="primary" data-qa="rl-link-product-button" onClick={props.close}>*/}
        {/*            <FormattedMessage id="common.linkProduct"/>*/}
        {/*        </GKButton>*/}
        {/*    </GKCardFooter>*/}
        {/*}*/}
    </>;

    const renderProductSearch = (isGlobal: boolean) => {
        return <ProductSearch isGlobal={isGlobal} agstudioAPIService={props.agstudioAPIService} basedataAPIService={props.basedataAPIService} subType={subType}
                              cropName={cropName} cropKey={cropKey} USDACropKey={USDACropKey} addProduct={addProduct} setShowSearch={(n: number) => setShowSearch(n)}/>
    };

    useEffect(() => {

        let isSubscribed = true;
        if (subType && (cropKey || !requiresCrop(subType))) {
            setIsLoading(true);
            props.agstudioAPIService.loadProductLots(props.growerKey, props.cropYear, subType, cropKey).then(results => {
                if (isSubscribed) {
                    setProductLots(results);
                    setIsLoading(false);
                }
            }, () => {
                if (isSubscribed) {
                    setIsLoading(false);
                }
            });
        }
        return () => {
            isSubscribed = false
        };

    }, [
        props.agstudioAPIService,
        props.growerKey,
        props.cropYear,
        subType,
        cropKey
    ]);

    return <>
        {showSearch === 1 && renderProductSearch(false)}
        {showSearch === 2 && renderProductSearch(true)}
        {renderCardContent()}
    </>
};

export default connect(mapStateToProps)(injectIntl(ActionPanel));

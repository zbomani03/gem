import * as React from "react";
import {GKCard, GKCardHeader, GKCardBody, GKCardTitle} from "@gkernel/ux-components";
import {FormattedMessage, FormattedDate, injectIntl, IntlShape} from "react-intl";
import resourceSubTypes from './resourceSubTypes';
import {IUnlinkedProductObjectUI} from './RLComponent';
import cn from 'classnames';
import styles from "./unlinkedCard.module.scss";

const UnlinkedCard = (
    props: {
        product: IUnlinkedProductObjectUI,
        intl: IntlShape,
        isSelected: boolean,
        onClick: (p: IUnlinkedProductObjectUI) => void
    }
) => {

    const renderCrop = (cropName?: string) => {
        return cropName ? <span className={"text-success"}><b> → </b>{cropName}</span> : <span className={"text-success"}><b> → </b><FormattedMessage id="common.na"/></span>;
    };

    const selectProduct = (): void => {
        props.onClick(props.product);
    };

    const renderLinkStatus = (): string => {
        if (props.product.linkedTo) {
            return `${props.intl.formatMessage({id: "common.linkedTo"})} ${props.product.linkedTo}`;
        }
        return props.intl.formatMessage({id: "common.unlinked"});
    };

    return (
        <GKCard onClick={selectProduct} className={cn(styles.unlinkedCard, props.product.linkId && styles.modLinked, props.isSelected && styles.modSelected)}>
            <GKCardHeader className={styles.unlinkedCardHeader}>
                <GKCardTitle className={cn(styles.productName, 'mb-0', 'mr-3')}>
                    {props.product.SourceName}
                </GKCardTitle>
                <span className={styles.linkedStatus}>
                    {renderLinkStatus()}
                </span>
            </GKCardHeader>
            <GKCardBody className="pb-2">
                <div className={styles.cardInfo}>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.type"/>:
                        </span>
                        {
                            props.product.ResourceSubType ?
                                resourceSubTypes(props.product.ResourceSubType) : <span className={styles.na}><FormattedMessage id="common.unknown"/></span>
                        }
                        {
                            props.product.modifiedResourceSubType && props.product.modifiedResourceSubType !== props.product.ResourceSubType &&
                            <span className={"text-success"}><b> → </b>{resourceSubTypes(props.product.modifiedResourceSubType)}</span>
                        }
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.occurrences"/>:
                        </span>
                        {props.product.UnlinkCount}
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.crop"/>:
                        </span>
                        {props.product.CropName ? props.product.CropName : <span className={styles.na}><FormattedMessage id="common.na"/></span>}
                        {
                            (props.product.modifiedCropName !== props.product.CropName && (props.product.modifiedResourceSubType || props.product.modifiedCropName)) &&
                            renderCrop(props.product.modifiedCropName)
                        }
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.source"/>:
                        </span>
                        {props.product.SourceResourceName}
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.firstSeen"/>:
                        </span>
                        <FormattedDate value={props.product.FirstSeenTime}/>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.lightGryLabel}>
                            <FormattedMessage id="label.lastSeen"/>:
                        </span>
                        <FormattedDate value={props.product.LastSeenTime}/>
                    </div>
                </div>
            </GKCardBody>
        </GKCard>
    )
};

export default injectIntl(UnlinkedCard);

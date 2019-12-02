import * as React from "react";
import {GKRadio, GKLabel} from "@gkernel/ux-components";
import cn from 'classnames';
import styles from "./productLots.module.scss";
import {FormattedMessage, injectIntl, IntlShape} from "react-intl";
import {IUnlinkedProductObjectUI} from "./RLComponent";
import {IProductLotsObject} from "@agstudio/services/lib/models/agstudioAPIService";
import {IProductKeyValue} from "./ActionPanel";


const ProductLots = (
    props: {
        product: IUnlinkedProductObjectUI,
        productLots: IProductLotsObject[],
        intl: IntlShape,
        modifyProduct: (productId: string, pProps: IProductKeyValue[]) => void,
    }
) => (
    <ul className={cn(styles.productLots, 'p-0', 'mt-4')}>
        <li className={styles.lotItem}>
            <GKLabel className={cn(styles.lotCard, 'm-0')}>
                <GKRadio name="lotItem" className={cn(styles.lotRadio, 'm-0')} data-qa="rl-lot-radio-input" checked={!props.product.linkId} onChange={() => {
                    props.modifyProduct(props.product.FieldOpXRefId, [
                        {key: 'linkId', value: undefined},
                        {key: 'linkedTo', value: undefined}
                    ]);
                }}/>
                <div className={cn(styles.productName, 'pl-2')}>
                    <FormattedMessage id="common.unlinked"/>
                </div>
            </GKLabel>
        </li>
        {
            props.productLots.map(pl =>
                pl.ProductLots.map(lot =>
                    <li className={styles.lotItem} key={lot.ProductLotRow.Key}>
                        <GKLabel className={cn(styles.lotCard, props.product.linkId === lot.ProductLotRow.Key && styles.modSelected, 'm-0')}>
                            <GKRadio name="lotItem"
                                     className={cn(styles.lotRadio, 'm-0')}
                                     data-qa="rl-lot-radio-input"
                                     checked={props.product.linkId === lot.ProductLotRow.Key}
                                     onChange={() => {
                                         props.modifyProduct(props.product.FieldOpXRefId, [
                                             {key: 'linkId', value: lot.ProductLotRow.Key},
                                             {key: 'linkedTo', value: lot.ProductLotRow.Name}
                                         ]);
                                     }}/>
                            <div className={cn(styles.productName, 'pl-2')}>{lot.ProductLotRow.Name}</div>
                            <div className={cn(styles.lightGryLabel, "text-right")}>{pl.ProductRow.Name}</div>
                        </GKLabel>
                    </li>
                )
            )
        }
    </ul>
);

export default injectIntl(ProductLots);

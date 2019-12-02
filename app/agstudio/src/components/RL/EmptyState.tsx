import * as React from "react";
import cn from 'classnames';
import styles from "./emptyState.module.scss";
import {GKIcon, GKIconName} from "@gkernel/ux-components";

const EmptyState = (props: { title: string, titleClass?: string, text?: string, className?: string, icon?: string, children?: any }) => {
    return (
        <div className={cn(styles.emptyState, props.className)}>
            {props.icon && <GKIcon className={styles.esIcon} name={(GKIconName as any)[props.icon]}/>}
            <h3 className={props.titleClass || "text-success"}>{props.title}</h3>
            {props.text && <h5>{props.text}</h5>}
            {props.children && <div className="mt-4">{props.children}</div>}
        </div>
    )
};

export default EmptyState;

import styles from "./dimensions.module.scss";
import * as React from "react";
import {Col, GKAlert, GKButton, GKForm, GKFormGroup, GKLabel, GKSelect, GKSelectOption, GKTooltip, Row} from "@gkernel/ux-components";
import {IPPADimensionsStore} from "./dimensionsReducer";
import {IntlShape, FormattedMessage, FormattedNumber, injectIntl} from "react-intl";

const DimensionsComponent = (props: {
    isFilterEditing: boolean,
    dimensions: IPPADimensionsStore,
    selectFirstDimension: (value: any) => void,
    selectSecondDimension: (value: any) => void,
    swapDimensions: () => void, intl: IntlShape
}) => {
    return (
        <GKForm>
            <Row className="justify-content-center mt-4">
                <Col colSpan={3} className="col-auto">
                    {
                        props.isFilterEditing || props.dimensions.firstList.isLoading || props.dimensions.firstList.list.filter(
                            d => d.CropZoneCount && d.CropZoneAcres
                        ).length ? null : <GKAlert color="warning"><FormattedMessage id="common.noDimensions"/></GKAlert>
                    }
                </Col>
            </Row>
            <Row className={(props.isFilterEditing ? styles.disable : "") + " justify-content-center"}>
                <Col className="col-12 col-sm-4 col-md-3 col-lg-2 align-self-end">
                    <GKFormGroup>
                        <GKLabel className="dark-mode"><FormattedMessage id="label.performanceBy"/>:</GKLabel>
                        <GKSelect data-qa="ppa-dimension1-input"
                                  placeholder={props.intl.formatMessage({id: props.dimensions.firstList.isLoading ? "common.loading" : "common.selectOne"})}
                                  onChange={props.selectFirstDimension}>
                            {
                                props.dimensions.firstList.list.length && props.dimensions.firstList.list.map((value) =>
                                    <GKSelectOption disabled={Boolean(value.CropZoneCount === 0 || value.CropZoneAcres === 0)}
                                                    key={value.Name}
                                                    value={value.Name}
                                                    selected={value.Name === props.dimensions.firstList.selected}
                                                    label={value.Name}>
                                        {value.Name}
                                        <br/>
                                        <small className="text-secondary">
                                            <FormattedNumber value={value.CropZoneAcres} minimumFractionDigits={2} maximumFractionDigits={2}/> ac
                                        </small>
                                        <br/>
                                        <small className="text-secondary">
                                            <FormattedNumber value={value.CropZoneCount}/>
                                            <FormattedMessage id={value.CropZoneCount ? "common.multipleCropZones" : "common.oneCropZone"}/>
                                        </small>
                                    </GKSelectOption>
                                )
                            }
                        </GKSelect>
                    </GKFormGroup>
                </Col>
                <Col className="col-12 col-sm-auto align-self-center text-center">
                    <GKButton data-qa="ppa-dimension-swap-button"
                              className="mt-2"
                              id="swap"
                              disabled={!props.dimensions.firstList.selected || !props.dimensions.secondList.selected}
                              size="lg"
                              onClick={props.swapDimensions}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0V0z"/>
                            <path fill="#fff" d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
                        </svg>
                        <GKTooltip target="swap"><FormattedMessage id="label.swapDimensions"/></GKTooltip>
                    </GKButton>
                </Col>
                <Col className="col-12 col-sm-4 col-md-3 col-lg-2 align-self-end">
                    <GKFormGroup>
                        <GKLabel className="dark-mode"><FormattedMessage id="label.andThenBy"/>:</GKLabel>
                        <GKSelect data-qa="ppa-dimension2-input"
                                  placeholder={props.intl.formatMessage({id: props.dimensions.secondList.isLoading ? "common.loading" : "common.selectOne"})}
                                  onChange={props.selectSecondDimension}
                                  disabled={!props.dimensions.firstList.selected}>
                            {
                                props.dimensions.secondList.list.length && props.dimensions.secondList.list.map((value) =>
                                    <GKSelectOption disabled={Boolean(value.CropZoneCount === 0 || value.CropZoneAcres === 0)}
                                                    key={value.Name}
                                                    value={value.Name}
                                                    selected={value.Name === props.dimensions.secondList.selected}
                                                    label={value.Name}>
                                        {value.Name}
                                        <br/>
                                        <small className="text-secondary">
                                            <FormattedNumber value={value.CropZoneAcres} minimumFractionDigits={2} maximumFractionDigits={2}/> ac
                                        </small>
                                        <br/>
                                        <small className="text-secondary">
                                            <FormattedNumber value={value.CropZoneCount}/>
                                            <FormattedMessage id={value.CropZoneCount ? "common.multipleCropZones" : "common.oneCropZone"}/>
                                        </small>
                                    </GKSelectOption>
                                )
                            }
                        </GKSelect>
                    </GKFormGroup>
                </Col>
            </Row>
        </GKForm>
    );
};

export default injectIntl(DimensionsComponent);

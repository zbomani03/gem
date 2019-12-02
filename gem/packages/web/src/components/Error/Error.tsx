import "./error.css";
import * as React from "react";
import {GKButton, GKCard, GKPosition, GKShell, Position} from "@gkernel/ux-components";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

const Error = () => {
    return (
        <GKShell className="alert-danger">
            <GKPosition position={Position.CC}>
                <GKCard className="agstudio-error-card">
                    <div className="mt-2 mb-1">
                        <h1 className="text-danger text-uppercase px-3"><FormattedMessage id="common.oops"/></h1>
                        <h3 className="text-danger px-3"><FormattedMessage id="common.somethingWentWrong"/></h3>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1280 1024" enableBackground="new 0 0 1280 1024">
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M880.2,266.8l-35.6-7.7c-3.5-0.8-7,1.5-7.8,5l-37.5,173.5 c14.1,4.2,30.1,9.4,47.3,
                            15.5l38.6-178.5C886,271.1,883.7,267.6,880.2,266.8L880.2,266.8z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#1A1A1A" d={`M350.1,410C215,380.8,81.8,466.6,52.6,601.7 c-29.2,135.1,56.6,268.3,191.7,297.5c135.1,
                            29.2,268.3-56.6,297.5-191.7C571,572.4,485.2,439.2,350.1,410L350.1,410z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#999999" d={`M329.5,505.4c-82.4-17.8-163.6,34.5-181.4,116.9 c-17.8,82.4,34.5,163.6,116.9,181.4c82.4,
                            17.8,163.6-34.5,181.4-116.9C464.2,604.4,411.9,523.2,329.5,505.4L329.5,505.4z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#851621" d={`M1129.4,661.9c4.3-115.2-290.8-217.8-370.4-235l0,0 c-7.9,75.9-25.5,148.8-55.8,
                            218.7l-107-23.1l-19-4.1l0,0l0,0c-14.9-115.2-100.4-213.8-220.4-239.8c-83.3-18-165.9,2.8-229.1,50.2 l19.2,25.6c56-42,129.3-60.4,203.1-44.5C485.2,
                            439.2,571,572.4,541.8,707.4c-6,27.9-16.5,53.7-30.6,76.9l250,54.1 c0.7-5.1,1.5-10.1,2.6-15.2l0,0c0.1-0.6,0.2-1.2,0.4-1.8C786,720.9,885,657.1,985.4,
                            678.9c53.6,11.6,96.7,45.2,122,89.2l9.7-32.9 L1129.4,661.9L1129.4,661.9z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#333333" d={`M757.9,199.1l-358.5-77.3L314,334.6c7.5-0.3,15.1-0.3,22.8,0.1 c111.2,5,278.7,96.1,259.5,
                            287.9l107,23.1C762.7,508.4,773,360,757.9,199.1L757.9,199.1z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#262626" d={`M408.8,82.3c119.9,11.5,226.4,38.8,349.7,90.1 c14.2,5,13.9,29.8-0.6,
                            26.7l-358.5-77.3C378.6,117.3,383.2,79.9,408.8,82.3L408.8,82.3z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#F54952" d={`M122.1,416.4c-8.1,7.7-7.7,20.3,0.8,16.1 c63.8-50,148.5-72.3,233.9-53.9c120,25.9,205.5,
                            124.6,220.4,239.8l19,4.1C615.4,430.8,448,339.7,336.7,334.7 C250.9,330.9,174.2,367,122.1,416.4L122.1,416.4z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M1202.8,769.1l-70.6-15.3c-10.9-2.4-21.7,4.6-24.1,15.5 c17.6,36.2,23.7,78.3,14.5,
                            120.7l51.7,11.2c10.9,2.4,21.8-4.7,24.2-15.6l20-92.3C1220.8,782.4,1213.7,771.5,1202.8,769.1 L1202.8,769.1z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#F54952" d={`M1129.4,661.9c4.3-115.2-290.8-217.8-370.4-235l0,0 c-7.9,75.9-25.5,148.8-55.8,218.7l99.9,
                            21.6c53.7-39.6,123.4-56.9,193.8-41.7c50.6,10.9,93.9,37,126.4,72.5L1129.4,661.9 L1129.4,661.9z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#F54952" d={`M996.9,625.6C867.1,597.5,739.1,680,711.1,809.8l26.4,5.7 C762.3,700.3,875.9,627.1,991.2,
                            652c35.4,7.6,66.8,23.7,92.6,45.5l17.4-20.6C1072.1,652.3,1036.7,634.2,996.9,625.6L996.9,625.6z`}/>
                            <path fill="#333333" d={`M876,265.9l8.5-39.4c2.7-12.4,9.6-21.4,17.9-27.1c8.5-5.9,18.3-8.5,26.6-8l5.9-27.3 c-14.9-1.9-33.1,2.1-48.2,12.5c-13.7,9.4-25,
                            24-29.3,44l-8.5,39.4L876,265.9L876,265.9z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4EA3A0" d={`M692.9,185.1l-157.4-33.9l-57.6,202 c76.4,43.2,141.2,118.1,141.3,223.4c0,19.7,10.7,28.7,
                            24.4,31.7l9.4,2c13.7,3,31.7,0.7,38-15.8c41.2-106.2,49.7-244.6,41.4-366.3 C731,206.1,720.4,191,692.9,185.1L692.9,185.1z M513.1,
                            146.3l-53.4-11.5c-16.5-3.6-39,2.3-46.7,19.5L361.6,285 c-7.1,17.2,6.3,28,18.8,31.3c21.8,5.8,56,16.2,76.3,25.8L513.1,146.3L513.1,146.3z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#C43341" d={`M744,519.5c-9.4,39.7-24.4,88.1-40.8,126.2l99.9,21.6 c53.7-39.6,123.4-56.9,
                            193.8-41.7c30.5,6.6,58.5,18.7,82.9,35.1C994.3,600.1,821.7,536.3,744,519.5L744,519.5z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#A4EDDC" d={`M664.7,208.7L545.7,183l-48.9,171.2c20.2,11.4,59,38.4,74.5,55.3 c8,8.7,21,28.2,46.9,
                            26.9l91.1-15.2c0.7-2.8,1.2-6.8,1.5-9.4c7.2-54.1-1-120.9-11.6-165.3C694.8,227.6,688.8,213.9,664.7,208.7 L664.7,208.7z M505,
                            174.3l-22.4-4.8c-14.5-3.1-34.2,2-41,17.1l-45,114.7c-3.7,9.1-0.9,16.2,4.3,21c9.4,2.7,41.8,9.6,57.2,14.8 L505,174.3L505,174.3z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#333333" d={`M670,656.2l-123.8-26.8c2.6,25.4,1.2,51.7-4.4,78 c-4.7,21.7-12.1,42.2-21.7,61.1l98.3,
                            21.3c14,3,29.7-5.6,35-19.1l32.6-84.4C691.2,672.8,684,659.3,670,656.2L670,656.2z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M279,739c7.1,1.5,11.6,8.5,10.1,15.7c-1.5,7.1-8.5,11.6-15.7,
                            10.1 c-7.1-1.5-11.6-8.5-10.1-15.7C264.8,742,271.8,737.5,279,739L279,739z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M397.4,662.7c7.1,1.5,11.6,8.5,10.1,15.7 c-1.5,7.1-8.5,11.6-15.7,
                            10.1c-7.1-1.5-11.6-8.5-10.1-15.7C383.3,665.7,390.3,661.2,397.4,662.7L397.4,662.7z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#7A7A7A" d={`M209.4,665.8c12.9-59.6,71.6-97.5,131.3-84.6 c55,11.9,91.4,62.9,86.6,117.5c1.7-4.9,
                            3.1-10,4.3-15.2c16-74.1-31.1-147.2-105.2-163.3c-74.1-16-147.2,31.1-163.3,105.2 c-16,74.1,31.1,147.3,105.2,163.3c0.8,0.2,1.7,0.2,2.5,0.4C224.9,768,
                            198.3,717.3,209.4,665.8z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M308.5,602.4c-28.8-6.2-57.2,12.1-63.4,40.9 c-6.2,28.8,12.1,57.2,40.9,63.4c28.8,6.2,
                            57.2-12.1,63.4-40.9C355.6,637,337.3,608.6,308.5,602.4L308.5,602.4z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M321.1,544.3c7.1,1.5,11.6,8.5,10.1,15.7 c-1.5,7.1-8.5,11.6-15.7,
                            10.1c-7.1-1.5-11.6-8.5-10.1-15.7C306.9,547.3,313.9,542.8,321.1,544.3L321.1,544.3z`}/>
                            <path fillRule="evenodd" clipRule="evenodd" fill="#4D4D4D" d={`M202.6,620.6c7.1,1.5,11.6,8.5,10.1,15.7 c-1.5,7.1-8.5,11.6-15.7,
                            10.1c-7.1-1.5-11.6-8.5-10.1-15.7C188.5,623.6,195.5,619.1,202.6,620.6L202.6,620.6z`}/>
                        </svg>
                        <p className="text-center mt-4">
                            <Link to="/">
                                <GKButton data-qa="error-back-button" color="primary"><FormattedMessage id="label.backToHome"/></GKButton>
                            </Link>
                        </p>
                    </div>
                </GKCard>
            </GKPosition>
        </GKShell>
    );
};

export default Error;

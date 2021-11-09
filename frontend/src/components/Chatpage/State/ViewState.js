import 'antd/dist/antd.css';
import '../../../scss/main.scss';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import Service from "../../../services/service";
import GoogleApiWrapper from "./Map";

function StateModal ({ dialState }) {
    return (
        <div class="state-ctnr">
            {/* <GoogleApiWrapper
                locations={[
                    {
                        name: "北京贵都大酒店",
                        addr: "北京西城区广安门内大街217号"
                    },
                    {
                        name: "北京鹏润国际大酒店",
                        addr: "北京朝阳区霄云路26号"
                    },
                    // {
                    //     name: "瑞尔威连锁饭店(北京西客站店)",
                    //     addr: "北京丰台区莲花池东路116-2号"
                    // }
                ]}
            >
            </GoogleApiWrapper> */}
            <ul className="state-list">
                <li>
                    <span className="material-icons Chat btn">bed</span>
                    {dialState.hotel}
                    
                </li>
                <li>
                    <span className="material-icons Chat btn">museum</span>
                    {dialState.site}
                </li>
                <li>
                    <span className="material-icons Chat btn">restaurant_menu</span>
                    {dialState.rest}
                </li>
                <li>
                    <span className="material-icons Chat btn">subway</span>
                    {dialState.sub[0]}
                    <span className="material-icons Chat btn">arrow_forward</span>
                    {dialState.sub[1]}
                </li>
                <li>
                    <span className="material-icons Chat btn">local_taxi</span>
                    {dialState.taxi[0]}
                    <span className="material-icons Chat btn">arrow_forward</span>
                    {dialState.taxi[1]}
                </li>
            </ul>
        </div>
        
    );
};

const ViewState = () => {
    const [visible, setVisible] = useState(false);
    const [renderCnt, setRenderCnt] = useState(0);
    const [dialState, setDialState] = useState({
        hotel: "",
        site: "",
        rest: "",
        sub: ["", ""],
        taxi: ["", ""]
    });
    // const [locations, setLocations] = useState([]);

    const fetchState = useCallback(async () => {
        Service.getUserState()
        .then((data) => {
            console.log('Response data: ', data);
            var state = data.data;
            if(state.hotel === "") {
                state.hotel = "未定";
            }
            if(state.site === "") {
                state.site = "未定";
            }
            if(state.rest === "") {
                state.rest = "未定";
            }
            if(state.sub[0] === "") {
                state.sub[0] = "未定";
            }
            if(state.sub[1] === "") {
                state.sub[1] = "未定";
            }
            if(state.taxi[0] === "") {
                state.taxi[0] = "未定";
            }
            if(state.taxi[1] === "") {
                state.taxi[1] = "未定";
            }
            setDialState(state);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dialState, setDialState]);

    useEffect(() => {
        fetchState();

        // set locations
        // var temp = [];
        // if(dialState.hotel !== "") {
        //     temp = [...temp, dialState.hotel];
        // }
        // if(dialState.site !== "") {
        //     temp = [...temp, dialState.site];
        // }
        // if(dialState.rest !== "") {
        //     temp = [...temp, dialState.rest];
        // }
        // setLocations(temp);
    }, [renderCnt]);

    return (
        <div>
            <button
                className="info-btn preview-btn"
                onClick={event => {
                    event.preventDefault();
                    setVisible(true);
                    setRenderCnt((renderCnt) => renderCnt + 1);
                }}
            >
                <span className="material-icons Chat btn">
                preview
                </span>
                <span>
                檢視
                </span>
            </button>
            <Modal
                className="info-modal"
                centered={true}
                width={800}
                bodyStyle={{
                    padding: "20px",
                    height: "500px",
                    
                }}
                title={"您目前的對話進度"}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
                footer={null}
            >
                <StateModal dialState={dialState}/>
            </Modal>
        </div>
    );
};

export default ViewState;
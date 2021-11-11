import 'antd/dist/antd.css';
import '../../../scss/main.scss';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import Service from "../../../services/service";
import GoogleApiWrapper from "./Map";
import LoadingSpinner from "../LoadingSpinner";

function StateModal ({ dialState, locations }) {
    // console.log("in stateModal, locations", locations);
    // console.log("loactions length", locations.length);

    var noContent = true;
    var cond1 = (dialState.hotel.name !== "" || dialState.rest.name !== "" || dialState.site.name !== "");
    var cond2 = (dialState.sub[0] !== "" || dialState.sub[1] !== "" || dialState.taxi[0] !== "" || dialState.taxi[0] !== "");
    if(cond1 || cond2) {
        noContent = false;
    }

    if(noContent) {
        return (
            <div className="info-card">
                <p>目前還沒有任何結果哦！</p>
            </div>
        );
    }
    return (
        <div class="state-ctnr">
            {/* <GoogleApiWrapper
                locations={locations}
            >
            </GoogleApiWrapper> */}
            <ul className="state-list">
                <li>
                    <span className="material-icons Chat btn">bed</span>
                    {dialState.hotel.name}
                    
                </li>
                <li>
                    <span className="material-icons Chat btn">museum</span>
                    {dialState.site.name}
                </li>
                <li>
                    <span className="material-icons Chat btn">restaurant_menu</span>
                    {dialState.rest.name}
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
    const [isLoading, setIsLoading] = useState(false);
    const [dialState, setDialState] = useState({
        hotel: "",
        site: "",
        rest: "",
        sub: ["", ""],
        taxi: ["", ""]
    });
    const [locations, setLocations] = useState([]);

    const fetchState = useCallback(async () => {
        setIsLoading(true);
        Service.getUserState()
        .then((data) => {
            console.log('Response data: ', data);
            var state = data.data;
            var loc = [];
            if(state.hotel.name === "") {
                state.hotel.name = "未定";
            }
            else{
                loc = [...loc,{
                    name: state.hotel.name,
                    addr: state.hotel.addr
                }];
            }
            if(state.site.name === "") {
                state.site.name = "未定";
            }
            else{
                loc = [...loc,{
                    name: state.site.name,
                    addr: state.site.addr
                }];
            }
            if(state.rest.name === "") {
                state.rest.name = "未定";
            }
            else{
                loc = [...loc,{
                    name: state.rest.name,
                    addr: state.rest.addr
                }];
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
            setLocations(loc);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    }, [dialState, setDialState, locations, setLocations]);

    useEffect(() => fetchState(), [renderCnt]);

    var modalContent;
    if(isLoading) {
        modalContent = (<LoadingSpinner />);
    }
    else {
        modalContent = (<StateModal dialState={dialState} locations={locations}/>);
    }

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
                {modalContent}
            </Modal>
        </div>
    );
};

export default ViewState;
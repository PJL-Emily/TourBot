import 'antd/dist/antd.css';
import '../../../scss/main.scss';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import Service from "../../../services/service";
import GoogleApiWrapper from "./Map";
import LoadingSpinner from "../LoadingSpinner";

function StateModal ({ dialState, locations }) {
    if(!dialState.content) {
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
        taxi: ["", ""],
        content: false
    });
    const [locations, setLocations] = useState([]);

    const fetchState = useCallback(async () => {
        setIsLoading(true);
        Service.getUserState()
        .then((data) => {
            console.log('Response data: ', data);
            if(data.data) {
                var state = data.data;
                var loc = [];
                let emptyCnt = 0;
                if(state.hotel.name === "") {
                    emptyCnt += 1;
                    state.hotel.name = "未定";
                }
                if(state.rest.name === "") {
                    emptyCnt += 1;
                    state.rest.name = "未定";
                }
                if(state.site.name === "") {
                    emptyCnt += 1;
                    state.site.name = "未定";
                }
                if(state.sub[0] === "") {
                    emptyCnt += 1;
                    state.sub[0] = "未定";
                }
                if(state.sub[1] === "") {
                    emptyCnt += 1;
                    state.sub[1] = "未定";
                }
                if(state.taxi[0] === "") {
                    emptyCnt += 1;
                    state.taxi[0] = "未定";
                }
                if(state.taxi[1] === "") {
                    emptyCnt += 1;
                    state.taxi[1] = "未定";
                }
                
                if(emptyCnt === 7) {
                    state.content = false;
                }
                else {
                    state.content = true;
                }

                setDialState(state);
                setLocations(loc);
            }
            else {
                var state = dialState;
                state.content = false;
                // console.log("error state");
                setDialState({
                    hotel: "",
                    site: "",
                    rest: "",
                    sub: ["", ""],
                    taxi: ["", ""],
                    content: false
                });
            }

            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    }, [dialState, setDialState, locations, setLocations]);

    useEffect(() => {
        if(renderCnt > 0) {
            fetchState();
        }
    }, [renderCnt]);

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
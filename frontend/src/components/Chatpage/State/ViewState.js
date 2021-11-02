import 'antd/dist/antd.css';
import '../../../scss/main.scss';
import { useState } from 'react';
import { Modal } from 'antd';
import Service from "../../../services/service";
import GoogleApiWrapper from "./Map";

function StateModal () {
    Service.getUserState()
    .then((data) => {
        console.log('Response data: ', data);
        const state = data;
    })
    .catch((err) => {
        console.log(err);
    });

    const state = {
        hotel: '水晶酒店',
        site: '遊樂園',
        rest: '餛飩',
        sub: ['A_spot', 'B_spot'],
        taxi: ['taxi_A', 'taxi_B']
    };

    return (
        <div class="state-ctnr">
            <GoogleApiWrapper
                locations={[
                    {
                        name: "北京贵都大酒店",
                        addr: "北京西城区广安门内大街217号"
                    },
                    {
                        name: "北京鹏润国际大酒店",
                        addr: "北京朝阳区霄云路26号"
                    },
                    {
                        name: "瑞尔威连锁饭店(北京西客站店)",
                        addr: "北京丰台区莲花池东路116-2号"
                    }
                ]}
            >
                
            </GoogleApiWrapper>
            <ul className="state-list">
                <li>
                    <span className="material-icons Chat btn">bed</span>
                    {state.hotel}
                    
                </li>
                <li>
                    <span className="material-icons Chat btn">museum</span>
                    {state.site}
                </li>
                <li>
                    <span className="material-icons Chat btn">restaurant_menu</span>
                    {state.rest}
                </li>
                <li>
                    <span className="material-icons Chat btn">subway</span>
                    {state.sub[0]}
                    <span className="material-icons Chat btn">arrow_forward</span>
                    {state.sub[1]}
                </li>
                <li>
                    <span className="material-icons Chat btn">local_taxi</span>
                    {state.taxi[0]}
                    <span className="material-icons Chat btn">arrow_forward</span>
                    {state.taxi[1]}
                </li>
            </ul>
        </div>
        
    );
};

const ViewState = () => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <button
                className="info-btn preview-btn"
                onClick={event => {
                    event.preventDefault();
                    setVisible(true);
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
                <StateModal />
            </Modal>
        </div>
    );
};

export default ViewState;
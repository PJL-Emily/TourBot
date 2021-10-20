import 'antd/dist/antd.css';
import '../../scss/main.scss';
import { Modal } from 'antd';
import AuthService from "../../services/auth.service";

function StateModal () {
    AuthService.getUserState()
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
        taxi: ['taxi_A', 'taxi_B']};
    
    Modal.info({
        title: '您目前的對話進度',
        content: (
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
        ),
    });
};

const ViewState = () => {
    return (
        <button
            className="info-btn preview-btn"
            onClick={event => {
                event.preventDefault();
                StateModal();
            }}
        >
            <span className="material-icons Chat btn">
            preview
            </span>
            <span>
            檢視
            </span>
        </button>
    );
};

export default ViewState;
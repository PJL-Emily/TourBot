import '../../../scss/main.scss';

const HotelInfo = (data) => {
    var facilities = data.facility.toString().replace(",", "、");
    var stations = data.near_sub.toString().replace(",", "、");
    
    return (
        <div className="item-info">
            <div className="item-title">
                <h2>{data.name}</h2>
                <div className="rating">
                    <span className="material-icons">star_rate</span>
                    &nbsp;
                    <span>{data.rating}</span>
                </div>
            </div>
            <div className="item-context">
                <span className="material-icons">call</span>
                <a href={"tel:+" + data.tel}>{data.tel}</a>
            </div>
            <div className="item-context">
                <span className="material-icons">place</span>
                <span>{data.addr}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">info</span>
                <span>{facilities}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">subway</span>
                <span>{stations}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">attach_money</span>
                <span>平均價位 {data.price} 人民幣</span>
            </div>
        </div>
    );
};

const SiteInfo = (data) => {
    var stations = data.near_sub.toString().replace(",", "、");
    var ticket_msg = "不需門票入場";
    if (data.ticket) {
        ticket_msg = ticket_msg.replace("不", "");
    }
    
    return (
        <div className="item-info">
            <div className="item-title">
                <h2>{data.name}</h2>
                <div className="rating">
                    <span className="material-icons">star_rate</span>
                    &nbsp;
                    <span>{data.rating}</span>
                </div>
            </div>
            <div className="item-context">
                <span className="material-icons">call</span>
                <a href={"tel:+" + data.tel}>{data.tel}</a>
            </div>
            <div className="item-context">
                <span className="material-icons">place</span>
                <span>{data.addr}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">subway</span>
                <span>{stations}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">schedule</span>
                <span>遊玩時間約 {data.site_time}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">confirmation_number</span>
                <span>{ticket_msg}</span>
            </div>
        </div>
    );
};

const RestInfo = (data) => {
    var stations = data.near_sub.toString().replace(",", "、");
    
    return (
        <div className="item-info">
            <div className="item-title">
                <h2>{data.name}</h2>
                <div className="rating">
                    <span className="material-icons">star_rate</span>
                    &nbsp;
                    <span>{data.rating}</span>
                </div>
            </div>
            <div className="item-context">
                <span className="material-icons">call</span>
                <a href={"tel:+" + data.tel}>{data.tel}</a>
            </div>
            <div className="item-context">
                <span className="material-icons">place</span>
                <span>{data.addr}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">subway</span>
                <span>{stations}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">schedule</span>
                <span>營業時間 {data.open_time}</span>
            </div>
            <div className="item-context">
                <span className="material-icons">attach_money</span>
                <span>平均消費 {data.avg_spend} 人民幣</span>
            </div>
        </div>
    );
};

const InfoCard = ({ type, data }) => {
    const func_dict = {
        "酒店": HotelInfo,
        "景點": SiteInfo,
        "餐廳": RestInfo,
        "none": () => { return null; }
    };
    const info = func_dict[type](data);

    if(data.name === "") {
        return (
            <div className="info-card">
                <p>目前還沒有任何結果哦！</p>
            </div>
        );
    }
    return (
        <div className="info-card">
            <div 
            className="info-img"
            style={{
                backgroundImage: 'url(' +data.img + ')'
            }}></div>
            {info}
            <div className="info-search">
                <p>以下是「{data.name}」的 Google 前三筆搜尋結果：</p>
                {data.search_results.map(aLink => 
                    <div>
                        <a 
                        target="_blank"
                        rel="noreferrer"
                        href={aLink.url}>
                            {aLink.text}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoCard;
import { useRef, useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Service from "../../../services/service";
import { useIsFirstRender } from '../../useIsFirstRender';
import InfoCard from './SlideCard';
import 'swiper/swiper.scss';
import "swiper/components/pagination/pagination.scss";
import "swiper/components/navigation/navigation.scss";
import '../../../scss/main.scss';

// TODO
// 1. loading spinner
// 2. values as list
// 3. ctrl+R send restart!

SwiperCore.use([ Navigation, Pagination, Scrollbar ]);
const func_dict = {
  "酒店": Service.getHotelInfo,
  "景點": Service.getSiteInfo,
  "餐廳": Service.getRestInfo
};
const icon_dict = {
  '酒店': ['bed-btn', 'bed'],
  '餐廳': ['restaurant-btn', 'restaurant_menu'],
  '景點': ['museum-btn', 'museum']
}

const ItemSwiper = ({ type, values }) => {
  return (
      <Swiper
        className="item-swiper"
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        slidesPerView={1}
        spaceBetween={50}
      >
        <SwiperSlide >
            <InfoCard key={values.name} type={type} data={values} />
          </SwiperSlide>
        {/* {values.map(anItem => 
          <SwiperSlide >
            <InfoCard key={anItem.name} type={type} data={anItem} />
          </SwiperSlide>
        )} */}
      </Swiper>
  );
};

const ViewItem = ({type, effect}) => {
  const [visible, setVisible] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const isFirstRender = useIsFirstRender();
  const [renderCnt, setRenderCnt] = useState(0);
  
  //////////////////////////////////////////////////////
  // TODO: change to list
  const [values, setValues] = useState({
    name: "",
    rating: "",
    tel: "",
    addr: "",
    near_sub: "",
    facility: "",
    price: "",
    ticket: "",
    open_time: "",
    site_time: "",
    avg_spend: "",
    img: "",
    search_results: ["", "", ""]
  });
  const fetchValues = useCallback(async () => {
    func_dict[type]()
    .then(data => {
      // TODO: change to list
      console.log("response data:", data.data);

      return data.data;
    })
    .then(data => {
      // rename keys to English
      data['name'] = data["名稱"];
      data['rating'] = data["評分"];
      data['tel'] = data["電話"];
      data['addr'] = data["地址"];
      data['near_sub'] = data["地鐵"];
      data['facility'] = data["酒店設施"];
      data['price'] = data["價格"];
      data['ticket'] = data["門票"];
      data['open_time'] = data["營業時間"];
      data['site_time'] = data["遊玩時間"];
      data['avg_spend'] = data["人均消費"];
      
      // delete
      delete data["名稱"];
      delete data["評分"];
      delete data["電話"];
      delete data["地址"];
      delete data["地鐵"];
      delete data["酒店設施"];
      delete data["價格"];
      delete data["門票"];
      delete data["營業時間"];
      delete data["遊玩時間"];
      delete data["人均消費"];

      setValues(data);
    })
    .catch(error => {
      const resMessage =
        (error.response && error.response.data 
          && error.response.data.message) || 
          error.message || error.toString();
      
      console.log('getInfo error: ', resMessage);
    });
  }, [values, setValues]);

  useEffect(() => {
    fetchValues();
  }, [renderCnt]);

  //////////////////////////////////////////////////////
  var btnClass = "info-btn " + icon_dict[type][0];

  useEffect(() => {
    if (!isFirstRender) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 5000);
    }
  }, [effect]);

  return (
    <div>
      <button
        className={btnClass}
        is-flashing={isFlashing ? "true" : "false"}
        onClick={() => {
          setVisible(true);
          setRenderCnt((renderCnt) => renderCnt + 1);
        }}
      >
        <span className="material-icons Chat btn">{icon_dict[type][1]}</span>
        <span>{type}</span>
      </button>
      <Modal
        className="info-modal"
        style={{ top: 15 }}
        width={600}
        title={type + "資訊"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <ItemSwiper type={type} values={values} />
      </Modal>
    </div>

  );
};

export default ViewItem;
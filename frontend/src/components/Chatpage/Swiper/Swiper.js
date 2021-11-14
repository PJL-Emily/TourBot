import { useRef, useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Service from "../../../services/service";
import { useIsFirstRender } from '../../useIsFirstRender';
import InfoCard from './SlideCard';
import LoadingSpinner from "../LoadingSpinner";
import 'swiper/swiper.scss';
import "swiper/components/pagination/pagination.scss";
import "swiper/components/navigation/navigation.scss";
import '../../../scss/main.scss';

// TODO
// 1. values as list
// 2. ctrl+R send restart!

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
  var swiperContent;
  
  if(values.length === 0) {
    swiperContent = (
    <SwiperSlide >
      <InfoCard type={"none"} data={{
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
      }} />
    </SwiperSlide>);
  }
  else {
    swiperContent = (values[0].map(anItem => 
      <SwiperSlide >
        <InfoCard key={anItem.name} type={type} data={anItem} />
      </SwiperSlide>   
    ));
  }

  return (
      <Swiper
        className="item-swiper"
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        slidesPerView={1}
        spaceBetween={50}
      >
        {swiperContent}
      </Swiper>
  );
};

const ViewItem = ({type, effect}) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const isFirstRender = useIsFirstRender();
  const [renderCnt, setRenderCnt] = useState(0);
  
  //////////////////////////////////////////////////////
  // TODO: change to list
  const [values, setValues] = useState([]);
  const fetchValues = useCallback(async () => {
    setIsLoading(true);
    func_dict[type]()
    .then(data => {
      // TODO: change to list
      console.log("response data:", data.data);

      return data.data;
    })
    .then(data => {
      // rename keys to English
      for(let i = 0; i < data.length; i++) {
        data[i]['name'] = data[i]["名稱"];
        data[i]['rating'] = data[i]["評分"];
        data[i]['tel'] = data[i]["電話"];
        data[i]['addr'] = data[i]["地址"];
        data[i]['near_sub'] = data[i]["地鐵"];
        data[i]['facility'] = data[i]["酒店設施"];
        data[i]['price'] = data[i]["價格"];
        data[i]['ticket'] = data[i]["門票"];
        data[i]['open_time'] = data[i]["營業時間"];
        data[i]['site_time'] = data[i]["遊玩時間"];
        data[i]['avg_spend'] = data[i]["人均消費"];
        
        // delete
        delete data[i]["名稱"];
        delete data[i]["評分"];
        delete data[i]["電話"];
        delete data[i]["地址"];
        delete data[i]["地鐵"];
        delete data[i]["酒店設施"];
        delete data[i]["價格"];
        delete data[i]["門票"];
        delete data[i]["營業時間"];
        delete data[i]["遊玩時間"];
        delete data[i]["人均消費"];
      }
      
      setValues([...values, data]);
      setIsLoading(false);
    })
    .catch(error => {
      const resMessage =
        (error.response && error.response.data 
          && error.response.data.message) || 
          error.message || error.toString();
      
      console.log('getInfo error: ', resMessage);
      setIsLoading(false);
    });
  }, [values, setValues]);

  useEffect(() => {
    if(renderCnt > 0) {
      fetchValues();
    }
  }, [renderCnt]);

  //////////////////////////////////////////////////////
  var btnClass = "info-btn " + icon_dict[type][0];

  useEffect(() => {
    if (!isFirstRender) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 5000);
    }
  }, [effect]);

  var modalContent;
  if(isLoading) {
    modalContent = (<LoadingSpinner />);
  }
  else {
    modalContent = (<ItemSwiper type={type} values={values} />);
  }

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
        {modalContent}
      </Modal>
    </div>

  );
};

export default ViewItem;
import { useState } from 'react';
import { Modal } from 'antd';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import AuthService from "../../services/auth.service";
import InfoCard from './SlideCard';
import 'swiper/swiper.scss';
import "swiper/components/pagination/pagination.scss";
import "swiper/components/navigation/navigation.scss";
import '../../scss/main.scss';

SwiperCore.use([ Navigation, Pagination, Scrollbar ]);

const ItemSwiper = ({ type }) => {
  if (type === "酒店") {
    AuthService.getHotelInfo()
    .then(data => {
        const values = data;
    })
    .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();
        
        console.log('getHotelInfo error: ', resMessage);
    });
  }
  else if (type === "景點") {
    AuthService.getSiteInfo()
    .then(data => {
        const values = data;
    })
    .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();
        
        console.log('getSiteInfo error: ', resMessage);
    });
  }
  else if (type === "餐廳") {
    AuthService.getRestInfo()
    .then(data => {
        const values = data;
    })
    .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();
        
        console.log('getRestInfo error: ', resMessage);
    });
  }
  else {
    alert('unknown type: ' + type);
  }

  const values = [{
    name: "橘子水晶酒店",
    rating: "4.3",
    tel: "012345678",
    addr: "some address...",
    facility: ["游泳池", "健身房"],
    near_sub: ["天安門", "鼓樓"],
    price: "$2000",
    time: "20 分鐘",
    ticket: true,
    avg_spend: "$450",
    img: "https://ak-d.tripcdn.com/images/0205s120008bewqtpC29F_Z_550_412_R5_Q70_D.jpg",
    search_results: [ 
      {text: '桔子水晶北京安貞酒店(北京)訂房,最新優惠・評論和比價',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAMQAQ&url=https%3A%2F%2Ftc.trip.com%2Fhotels%2Fbeijing-hotel-detail-1725911%2Fcrystal-orange-hotel-beijing-anzhen%2F&usg=AOvVaw3YlUvAV959nAEGJItReQQC'},
      {text: '桔子水晶北京安貞酒店 - 全球訂房',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAUQAQ&url=https%3A%2F%2Fhotel.eztravel.com.tw%2Fdetail-beijing-1-1725911%2Fcrystal-orange-hotel-beijing-anzhen%2F&usg=AOvVaw1QD2Caw0X8LUFBOC_4TVa7'},
      {text: '北京桔子水晶酒店安貞店(北京市) Crystal Orange Hotel Beijing ...',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAIQAQ&url=https%3A%2F%2Fwww.tripadvisor.com.tw%2FHotel_Review-g294212-d2327794-Reviews-Crystal_Orange_Hotel_Beijing_Anzhen-Beijing.html&usg=AOvVaw1cxaQ8yccyrFOdggSCJqmJ'}
    ]
  },
  {
    name: "橘子水晶酒店",
    rating: "4.3",
    tel: "012345678",
    addr: "some address...",
    facility: ["游泳池", "健身房"],
    near_sub: ["天安門", "鼓樓"],
    price: "$2000",
    time: "20 分鐘",
    ticket: true,
    avg_spend: "$450",
    img: "https://ak-d.tripcdn.com/images/0205s120008bewqtpC29F_Z_550_412_R5_Q70_D.jpg",
    search_results: [ 
      {text: '桔子水晶北京安貞酒店(北京)訂房,最新優惠・評論和比價',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAMQAQ&url=https%3A%2F%2Ftc.trip.com%2Fhotels%2Fbeijing-hotel-detail-1725911%2Fcrystal-orange-hotel-beijing-anzhen%2F&usg=AOvVaw3YlUvAV959nAEGJItReQQC'},
      {text: '桔子水晶北京安貞酒店 - 全球訂房',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAUQAQ&url=https%3A%2F%2Fhotel.eztravel.com.tw%2Fdetail-beijing-1-1725911%2Fcrystal-orange-hotel-beijing-anzhen%2F&usg=AOvVaw1QD2Caw0X8LUFBOC_4TVa7'},
      {text: '北京桔子水晶酒店安貞店(北京市) Crystal Orange Hotel Beijing ...',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiHx-rQktnzAhXiwosBHUyYB5AQFnoECAIQAQ&url=https%3A%2F%2Fwww.tripadvisor.com.tw%2FHotel_Review-g294212-d2327794-Reviews-Crystal_Orange_Hotel_Beijing_Anzhen-Beijing.html&usg=AOvVaw1cxaQ8yccyrFOdggSCJqmJ'}
    ]
  }];

  return (
      <Swiper
        className="item-swiper"
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        slidesPerView={1}
        spaceBetween={50}
      >
        {values.map(anItem => 
          <SwiperSlide>
            <InfoCard type={type} data={anItem} />
          </SwiperSlide>
        )}
      </Swiper>
  );
};

const ViewItem = ({type}) => {
  const [visible, setVisible] = useState(false);
  const icon_dict = {
    '酒店': ['bed-btn', 'bed'],
    '餐廳': ['restaurant-btn', 'restaurant_menu'],
    '景點': ['museum-btn', 'museum']
  }

  return (
    <div>
      <button
        className={"info-btn " + icon_dict[type][0]}
        onClick={() => {
          setVisible(true);
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
        <ItemSwiper type={type} />
      </Modal>
    </div>

  );
};

export default ViewItem;

/*
  type = {酒店, 餐廳, 景點}
  酒店：
  ‘name’: (str)
  ‘rating’: (int)
  ‘tel’, (str)
  ‘addr’: (str)
  ‘facility’: [(str), ...]
  ‘near_sub’: [(str), ...]
  ‘price’: (str)
  ‘img’: (str)
  ‘search_results’: [ {‘text’: url(str)}, ...]
  景點：
  ‘name’: (str)
  ‘rating’: (int)
  ‘tel’, (str)
  ‘addr’: (str)
  ‘near_sub’: [(str), ...]
  ‘time’: (str)
  ‘ticket’: (bool)
  ‘img’: (str)
  ‘search_results’: [{‘text’: url(str)}, ...]
  餐廳：
  ‘name’: (str)
  ‘rating’: (int)
  ‘tel’: (str)
  ‘addr’: (str)
  ‘near_sub’: [(str), ...]
  ‘time’: (str)
  ‘avg_spend’: (int) } }
  ‘img’: (str)
  ‘search_results’: [{‘text’: url(str)}, ...]
*/
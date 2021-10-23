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
  const func_dict = {
    "酒店": AuthService.getHotelInfo,
    "景點": AuthService.getSiteInfo,
    "餐廳": AuthService.getRestInfo
};
var values = func_dict[type]()
    .then(data => {
        return data;
    })
    .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();
        
        console.log('getInfo error: ', resMessage);
    });

  values = [{
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
    name: "故宮博物院",
    rating: "4.3",
    tel: "012345678",
    addr: "some address...",
    facility: ["游泳池", "健身房"],
    near_sub: ["天安門", "鼓樓"],
    price: "$2000",
    time: "20 分鐘",
    ticket: true,
    avg_spend: "$450",
    img: "https://dimg01.c-ctrip.com/images/100g0x000000let3k0858.jpg?proc=source/trip;namelogo/d_40,https://dimg04.c-ctrip.com/images/350p0x000000l4zjrD475.jpg?proc=source/trip;namelogo/d_40,https://dimg03.c-ctrip.com/images/fd/tg/g6/M05/08/1F/CggYtFbT-CyAfCSlAB_6QJLIIag118.jpg?proc=source/trip;namelogo/d_40,https://dimg08.c-ctrip.com/images/100c10000000plzao4FEC.jpg?proc=source/trip;namelogo/d_40,https://dimg04.c-ctrip.com/images/fd/tg/g2/M06/87/26/CghzgFWwp1yAGQxMAAwPu0zjSPA638.jpg?proc=source/trip;namelogo/d_40,https://dimg02.c-ctrip.com/images/100e0z000000mly1d93A4.jpg?proc=source/trip;namelogo/d_40,https://dimg07.c-ctrip.com/images/100j0y000000m0bhg78DC.jpg?proc=source/trip;namelogo/d_40,https://dimg02.c-ctrip.com/images/100o0m000000dijheDCE3.jpg?proc=source/trip;namelogo/d_40,https://dimg03.c-ctrip.com/images/100411000000r0owl4499.jpg?proc=source/trip;namelogo/d_40,https://dimg01.c-ctrip.com/images/100d0c00000064xd7876C.jpg?proc=source/trip;namelogo/d_40",
    search_results: [ 
      {text: '故宮- 維基百科，自由的百科全書',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi7q9Do99rzAhVPeXAKHW4bCmEQFnoECAMQAQ&url=https%3A%2F%2Fzh.wikipedia.org%2Fzh-tw%2F%25E6%2595%2585%25E5%25AE%25AB&usg=AOvVaw2B34xJLb0tr47T5eTeJEeh'},
      {text: '故宫博物院',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi7q9Do99rzAhVPeXAKHW4bCmEQFnoECAIQAQ&url=http%3A%2F%2Fwww.dpm.org.cn%2FHome.html&usg=AOvVaw2JtaeUugTgTL1voHGSb5Ir'},
      {text: '[北京自助旅行] 中國北京- 北京故宮博物院・紫禁城～ 深度漫遊 ...',
      url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi7q9Do99rzAhVPeXAKHW4bCmEQFnoECAQQAQ&url=https%3A%2F%2Fminghan118.pixnet.net%2Fblog%2Fpost%2F464986343&usg=AOvVaw0oiWLM5THHXNBgQskar_E2'}
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
          <SwiperSlide >
            <InfoCard key={anItem.name} type={type} data={anItem} />
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
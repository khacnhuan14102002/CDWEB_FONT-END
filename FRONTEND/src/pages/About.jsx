// About.jsx
import React from 'react'
import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";
import '../style/About.css'; // Import the CSS file

const About = () =>  {
    return (
        <div>
            <div className='about-title-section'>
                <Title text1={'ABOUT'} text2={' US'}/>
            </div>
            <div className='about-content-section'>
                <img className='about-image' src={assets.about_img} alt=""/>
                <div className='about-text-content'>
                    <p>Hơn Cả Một Cửa Hàng
                        Điều làm nên sự đặc biệt của một pet shop chính là không gian ấm cúng và sự tận tâm của những người làm việc tại đó. Họ không chỉ là người bán hàng mà còn là những người bạn, người tư vấn đáng tin cậy, sẵn sàng chia sẻ kiến thức, kinh nghiệm để bạn có thể chăm sóc thú cưng của mình một cách tốt nhất. Một pet shop đích thực là nơi bạn có thể tìm thấy niềm vui, sự gắn kết và cả một cộng đồng yêu thú cưng đồng điệu.</p>
                    <p>Tại đây, bạn có thể dễ dàng tìm thấy:

                        1. Thức Ăn Cao Cấp và Dinh Dưỡng
                        Đa dạng chủng loại: Từ hạt khô, pate ướt, thức ăn tươi sống, đến các loại thức ăn chức năng đặc biệt dành cho chó, mèo, cá, chim, và các loại thú cưng khác. Dù thú cưng của bạn có chế độ ăn kiêng, nhạy cảm hay cần bổ sung dưỡng chất đặc biệt, bạn đều có thể tìm thấy sản phẩm phù hợp.
                        Thương hiệu uy tín: Các shop thường nhập về những thương hiệu thức ăn nổi tiếng, được nhiều chuyên gia và chủ nuôi tin dùng, đảm bảo chất lượng và an toàn cho sức khỏe của thú cưng.
                        Tư vấn chuyên sâu: Đội ngũ nhân viên có kiến thức sẽ giúp bạn lựa chọn loại thức ăn phù hợp nhất với giống loài, độ tuổi, cân nặng và tình trạng sức khỏe của thú cưng, đảm bảo chúng nhận đủ dinh dưỡng cần thiết để phát triển khỏe mạnh.
                        2. Phụ Kiện Đa Dạng và Tiện Ích
                        Đồ dùng thiết yếu: Bát ăn, bình nước tự động, lồng, chuồng, thảm lót vệ sinh — mọi thứ cần thiết cho cuộc sống hàng ngày của thú cưng đều có sẵn.
                        Đồ chơi và giải trí: Từ bóng, dây kéo, xương gặm, đến các loại đồ chơi tương tác giúp thú cưng vận động, giảm stress và phát triển trí não.
                        Chăm sóc và làm đẹp: Sữa tắm, lược chải lông, cắt móng, bàn chải đánh răng, khăn tắm chuyên dụng, quần áo và phụ kiện thời trang giúp thú cưng luôn sạch sẽ, thơm tho và phong cách.
                        Vòng cổ, dây dắt và phụ kiện đi dạo: Đảm bảo an toàn và thoải mái cho cả bạn và thú cưng trong mỗi chuyến đi chơi.</p>
                </div>
            </div>
            <div className= 'why-choose-us-title'>
                <Title text1={'Why'} text2={'CHOOSE US'}/>
            </div>

            <div className='why-choose-us-items'>
                <div className='why-choose-us-item'>
                    <b>Quality Assurance:</b>
                    <p className='why-choose-us-text'>We meticulously select and vet each product...</p>
                </div>
                <div className='why-choose-us-item'>
                    <b>Convenience:</b>
                    <p className='why-choose-us-text'>We meticulously select and vet each product...</p>
                </div>
                <div className='why-choose-us-item'>
                    <b>Exceptional Customer Service:</b>
                    <p className='why-choose-us-text'>We meticulously select and vet each product...</p>
                </div>
            </div>
            <NewsletterBox/>
        </div>
    )
}

export default About
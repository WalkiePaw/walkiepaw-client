// 잘못된 경로로 요청을 보냈을 시 띄울 컴포넌트
// 이전으로 돌아가는 기능
import { useNavigate } from 'react-router-dom';
// fontawesome 이모지 적용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";


const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FontAwesomeIcon icon={faFaceSadTear} className="text-[#43312A] text-5xl mb-5" />
      <h1 className="text-3xl font-bold text-[#43312A] mb-5">잘못된 페이지를 요청하셨습니다.</h1>
      <p className="text-gray-700 mb-5">존재하지 않는 페이지이거나 예상치 못한 오류가 발생하였습니다.</p>
      <button className="bg-[#E8C5A5] hover:bg-[#E8C5A5] text-white font-bold py-2 px-4 rounded" onClick={() => navigate(-1)} >
        뒤로가기
      </button>
    </div>
  );
}

export default Notfound;

// 잘못된 경로로 요청을 보냈을 시 띄울 컴포넌트
// 이전으로 돌아가는 기능
import { useNavigate } from 'react-router-dom';
// fontawesome 이모지 적용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 8rem; /* 아이콘 사이즈를 크게 조정 */
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 4xl;
  }
`;

const Title = styled.h1`
  font-size: 3xl;
  font-weight: bold;
  color: #43312A;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2xl;
  }
`;

const Description = styled.p`
  color: #707070;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background-color: #E8C5A5;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #D7B392;
  }
`;

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Icon icon={faFaceSadTear} />
      <Title>잘못된 페이지를 요청하셨습니다.</Title>
      <Description>존재하지 않는 페이지이거나 예상치 못한 오류가 발생하였습니다.</Description>
      <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
    </Container>
  );
}

export default Notfound;

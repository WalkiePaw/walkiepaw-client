import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const MemberPhotoWrapper = styled(NavLink)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MemberPhoto = ({ memberPhoto, memberNickName }) => {
  return (
      <MemberPhotoWrapper
          to={{
            pathname: "/dashboard",
            search: memberNickName ? `?nickname=${encodeURIComponent(memberNickName)}` : '',
          }}
      >
        <MemberImage src={memberPhoto || '/default-user-image.jpg'} alt={memberNickName || 'User'} />
      </MemberPhotoWrapper>
  );
};

export default MemberPhoto;
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import default_user from '../../assets/default_user.png'

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
        <MemberImage src={memberPhoto || default_user} alt={memberNickName || 'User'} />
      </MemberPhotoWrapper>
  );
};

export default MemberPhoto;
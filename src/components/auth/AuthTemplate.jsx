import { Children } from "react";
import styled from "styled-components";

/** 
 * 회원가입 페이지의 레이아웃을 담당하는 컴포넌트 
 */

const AuthTemplateBlock = styled.div``;

const AuthTemplate = ({Children}) => {
    return <AuthTemplateBlock>{Children}</AuthTemplateBlock>;
};

export default AuthTemplate;
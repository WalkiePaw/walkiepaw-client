// 회원 탈퇴

import React from 'react';
import { useForm } from 'react-hook-form';

// 팝업창, 모달: sweetalert 적용
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// fontawesome: 이모지 적용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
// 유효성 검사: yup 적용
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// axios 임포트
import axios from 'axios';

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .required("비밀번호는 필수 입력 사항입니다."),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수입니다."),
});

const MembershipWithdrawal = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const MySwal = withReactContent(Swal);

  const onSubmit = async (data) => {
    MySwal.fire({
      title: "정말 탈퇴하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "회원 탈퇴하기",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const memberId = 1; // 테스트용 하드코딩 
          if (!memberId) {
            throw new Error("사용자 ID를 찾을 수 없습니다.");
          }

          // 회원 상태를 WITHDRAWN으로 업데이트하는 API 호출
          await axios.patch(`http://localhost:8080/api/v1/members/${memberId}`, {
            status: "WITHDRAWN"
          });

          MySwal.fire({
            title: "탈퇴되었습니다",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            // 홈 화면으로 리다이렉트
            window.location.href = "/";
          });
        } catch (error) {
          MySwal.fire({
            title: "탈퇴 실패",
            text: error.message || "다시 시도해 주세요.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-3xl font-bold mb-5">회원 탈퇴</h1>
        <h2 className="text-2xl mb-3">
          본인 확인을 위해 비밀번호를 다시 입력해주세요.
          <FontAwesomeIcon icon={faFaceSadTear} className="text-danger ml-2" />
        </h2>
        <div className="flex flex-col space-y-2 mb-2">
          <input
            type="password"
            placeholder="비밀번호 입력"
            {...register("password")}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <input
            type="password"
            placeholder="비밀번호 재입력"
            {...register("passwordConfirmation")}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.passwordConfirmation && (
            <p className="text-red-500">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>
        <div className="mb-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#43312A] text-white rounded-md focus:outline-none"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default MembershipWithdrawal;
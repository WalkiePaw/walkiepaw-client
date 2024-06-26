// 내 정보 수정
import React, { useState, useEffect } from 'react';
// 팝업창, 모달: sweetalert 적용
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useForm } from 'react-hook-form';
// 유효성 검사: yup 적용
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// ImageUpload 컴포넌트 임포트
import ImageUpload from '../../components/ImageUpload';  
// axios 임포트
import axios from 'axios';

const MySwal = withReactContent(Swal);

// 유효성 검사
const schema = yup.object().shape({
  name: yup.string().required("이름은 필수 입력 사항입니다."),
  nickname: yup.string().required("닉네임은 필수 입력 사항입니다."),
  email: yup.string().email("올바른 이메일 주소를 입력해주세요.").required("이메일은 필수 입력 사항입니다."),
  phoneNumber: yup
    .string()
    // .matches(/^\d+$/, "전화번호는 숫자로만 입력해주세요.")
    .required("전화번호는 필수 입력 사항입니다."),
  address: yup.string().required("주소는 필수 입력 사항입니다."),
  birth: yup.date().required("생년월일은 필수 입력 사항입니다."),
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
});

const MyInformation = () => {
  // 유효성 검사
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState("");
  const [birth, setBirth] = useState("");

  // 회원 정보 불러오기
  useEffect(() => {
    const memberId = 1; // 임의로 지정한 ID, 실제로는 로그인 정보에서 가져와야 함

    axios.get(`http://localhost:8080/api/v1/members/${memberId}`)
      .then(response => {
        const memberData = response.data;
        setValue('name', memberData.name);
        setValue('nickname', memberData.nickname);
        setValue('phoneNumber', memberData.phoneNumber);
        setValue('address', memberData.address);
        setValue('birth', memberData.birth);
        setValue('email', memberData.email);
        setValue('profile', memberData.profile);
        console.log(memberData.name);
        // 기타 필요한 필드 설정
        console.log(memberData.nickname);
      })
      .catch(error => {
        console.error('There was an error fetching the member data!', error);
      });
  }, [setValue]);

    // 업데이트된 정보를 서버로 보내는 함수
    const saveInformation = () => {
      const memberId = localStorage.getItem('memberId');
      const updatedData = {
        name: name,
        nickname: nickname,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        profile: profile,
        birth: birth,
        // 기타 필요한 정보들도 동일하게 추가
      };
  
      axios.patch(`http://localhost:8080/api/v1/members/${memberId}`, updatedData)
        .then(response => {
          console.log('User information updated successfully:', response.data);
          // 저장 후 필요한 작업 추가
        })
        .catch(error => {
          console.error('Error updating user information:', error);
        });
    };

    // 비밀번호 변경 팝업
    const handleChangePassword = async () => {
      const { value: formValues } = await MySwal.fire({
        title: '새 비밀번호 입력',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="비밀번호 입력" type="password">' +
          '<input id="swal-input2" class="swal2-input" placeholder="비밀번호 재확인" type="password">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
          ];
        }
      });

      if (formValues) {
        const [password, passwordConfirm] = formValues;
  
        const result = await schema.validate({ password, passwordConfirm }).catch(err => err);
  
        if (result.errors) {
          MySwal.fire({
            icon: 'error',
            title: '오류',
            text: result.errors.join('\n'),
          });
        } else {
          MySwal.fire({
            icon: 'success',
            title: '성공',
            text: '비밀번호가 성공적으로 변경되었습니다!',
          });
          // 비밀번호 변경 로직 추가
        }
      }
    };
  
    // 회원 정보 저장(제출)
    const [isFormValid, setIsFormValid] = useState(false);

    const onSubmit = async (data) => {
      try {
        const memberId = 1; // 임의로 지정한 ID
        await axios.patch(`http://localhost:8080/api/v1/members/${memberId}`, data);
        MySwal.fire({
          title: "회원 정보를 저장했습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
        console.log('회원 정보가 성공적으로 업데이트되었습니다.');
        // 성공 메시지 또는 리다이렉션 등 추가적인 로직
      } catch (error) {
        console.error('회원 정보 업데이트 중 오류가 발생했습니다:', error);
        // 실패 시 처리 로직
      }
    };

    // 닉네임 중복 검사
    const handleCheckDuplicate = () => {
      if (nickname === "existingNickname") {
        MySwal.fire({
          title: "중복 확인 결과",
          text: "이미 사용중인 닉네임입니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
      } else {
        MySwal.fire({
          title: "중복 확인 결과",
          text: "사용 가능한 닉네임입니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValue(name, value); // react-hook-form의 setValue로 입력 필드 상태 업데이트

      // 모든 필수 입력 필드에 값이 있는지 확인
      const formData = register.getValues();
      setIsFormValid(schema.isValidSync(formData)); // yup 스키마에 따라 유효성 검사 수행
    };

    // 이미지 변경 
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        console.log('Selected image:', file);
      }
    };

    return (
      <div className="max-h-screen overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-5">회원 정보 수정</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="block mb-1">이름</label>
            <div className="flex space-x-4">
              <input
                type="text"
                name="name"
                {...register("name")}
                onChange={handleInputChange}
                placeholder="이름"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1">닉네임</label>
            <div className="flex space-x-2">
              <input
                type="nickname"
                name="nickname"
                placeholder="닉네임"
                {...register("nickname")}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
                onClick={handleCheckDuplicate}
              >
                중복확인
              </button>
            </div>
            {errors.nickname && (
              <p className="text-red-500">{errors.nickname.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1">비밀번호</label>
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
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
              onClick={handleChangePassword}
            >
              비밀번호 변경
            </button>
          </div>
          <div className="mb-3">
            <label className="block mb-1">이메일 주소</label>
            <div className="flex space-x-2">
              <input
                type="email"
                name="email"
                {...register("email")}
                placeholder="xxxx@xxxx.com"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              <button
                type="button"
                className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
              >
                인증
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label className="block mb-1">전화번호</label>
            <input
              type="phoneNumber"
              name="phone"
              {...register("phoneNumber")}
              onChange={handleInputChange}
              placeholder="전화번호는 숫자로만 입력해주세요('-'제외)"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-1">주소</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="address"
                placeholder="도로명 주소를 검색하세요."
                {...register("address")}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
              >
                주소 검색
              </button>
            </div>
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1">생년월일</label>
            <input
              type="date"
              name="birth"
              {...register("birth")}
              onChange={handleInputChange}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <ImageUpload onImageChange={handleImageChange} />
          <div className="mb-3">
            <label className="block mb-1">소개</label>
            <div className="flex space-x-4">
              <textarea
                name="profile"
                type="profile"
                placeholder="소개를 작성해주세요."
                {...register("profile")}
                className="w-2/3 h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            <button
          type="submit"
          className={`px-4 py-2 bg-[#43312A] text-white rounded-md hover:bg-yellow-700 ${
            Object.keys(errors).length !== 0 &&
            "opacity-50 cursor-not-allowed"
          }`}
          disabled={Object.keys(errors).length !== 0}
        >
          저장
        </button>
          </div>
        </form>
        {/* 페이지 하단에 여백주기 */}
        <div className="mt-8 pb-8"></div>
      </div>
    );
}

export default MyInformation;
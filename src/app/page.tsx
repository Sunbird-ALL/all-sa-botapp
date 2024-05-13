'use client';
import MySelectInput from '@/components/MySelectInput';
import MyTextInput from '@/components/MyTextInput';
import { ILoginUserInfo, IUserInfo, userInfoAtom } from '@/store/userInfo';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/services/userService';
import { useState } from 'react';
import Spinner from '@/components/Spinner';
import AnimatedPage from '@/components/AnimatedPage';

const FormComponent = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [isFetching, setIsFetching] = useState(false);

  const initialValues = {
    userId: '',
    password: '',
    conversationLanguage: 'en',
    learningLanguage: 'en',
  };

  const validationSchema = Yup.object({
    userId: Yup.string().required('User ID is required'),
    password: Yup.string().required('Password is required'),
    conversationLanguage: Yup.string().required(
      'Please select a conversation language'
    ),
    learningLanguage: Yup.string().required(
      'Please select a learning language'
    ),
  });

  const conversationLanguageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada ' },
  ];

  const learningLanguageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ta', label: 'Tamil' },
    { value: 'kn', label: 'Kannada ' },
  ];

  const handleSubmit = async (values: any) => {
    // Add form submission logic here
    const loginPayload = {
      conversation_language: values.conversationLanguage,
      learning_language: values.learningLanguage,
      password: values.password,
      user_id: values.userId,
    };
    setIsFetching(true);
    fetchUserInfo(loginPayload)
      .then((data) => {
        setIsFetching(false);

        if (data?.user_virtual_id) {
          const userDetails: IUserInfo = {
            conversation_language: values.conversation_language,
            learning_language: values.learningLanguage,
            user_id: values.userId,
            session_id: data.session_id,
            user_virtual_id: data.user_virtual_id,
          };
          setUserInfo(userDetails);

          router.push('/welcome');
        }
      })
      .catch((error) => {
        setIsFetching(false);
      });
  };

  return (
    <AnimatedPage transitionType="spring">
      {isFetching && <Spinner></Spinner>}
      <div className="flex flex-col h-dvh justify-between main-background-color">
        <header className="flex flex-row p-4">
          <div className="flex-grow text-center p-4 font-bold text-lg">
            Bee The Bot
          </div>
        </header>
        <main className="flex flex-col flex-grow items-center">
          <div className="flex flex-row">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="flex flex-col gap-4">
                <div>
                  <MyTextInput
                    label="User ID"
                    name="userId"
                    type="text"
                    placeholder="Enter your User ID"
                  />
                </div>
                <div>
                  <MyTextInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your Password"
                  />
                </div>
                <div>
                  <MySelectInput
                    label="Conversation Language"
                    name="conversationLanguage"
                    options={conversationLanguageOptions}
                  />
                </div>
                <div>
                  <MySelectInput
                    label="Learning Language"
                    name="learningLanguage"
                    options={learningLanguageOptions}
                  />
                </div>
                <button
                  type="submit"
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Login
                </button>
              </Form>
            </Formik>
          </div>
        </main>
        {/* <footer className="p-4 bg-blue-500 text-white"></footer> */}
      </div>
    </AnimatedPage>
  );
};

export default FormComponent;

import api from '../utils/api';

export const fetchUserInfo = async (payload: any) => {
  try {
    const response = await api.post('/login', payload); // Adjust the endpoint as needed

    return response?.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const fetchWelcomeStart = async (
  url: string,
  user_virtual_id: string
): Promise<CommonApiPayload> => {
  try {
    const response = await api.post(url, { user_virtual_id }); // Adjust the endpoint as needed
    return response?.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const fetchWelcomeNext = async (
  url: string,
  payload: IWelcomeNextPayload
): Promise<CommonApiPayload> => {
  try {
    const response = await api.post(url, payload); // Adjust the endpoint as needed
    return response?.data;
  } catch (error) {
    console.error('Failed to fetch welcome next info:', error);
    throw error;
  }
};

export const fetchLearningNext = async (
  payload: IWelcomeNextPayload
): Promise<CommonApiPayload> => {
  try {
    const response = await api.post('/learning_next', payload); // Adjust the endpoint as needed
    return response?.data;
  } catch (error) {
    console.error('Failed to fetch welcome next info:', error);
    throw error;
  }
};

interface IConversation {
  audio: string;
  state?: number;
}

interface IUserInfo {
  session_id: string;
  user_virtual_id: string;
}

interface CommonApiPayload {
  conversation: IConversation;
  content?: IContent;
}

export interface IWelcomeNextPayload {
  user_virtual_id: string;
  user_audio_msg: string;
  content_id?: string;
  original_content_text?: string;
}

export interface IContent {
  audio: string;
  text: string;
  content_id: string;
  milestone: string;
  milestone_level: string;
}

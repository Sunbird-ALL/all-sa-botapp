import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface ApiContextType {
  userInfo?: IUserInfo;
  loading: boolean;
  error: Error | null;
  authStatus: boolean;
  conversationStart: CommonApiPayload | null;
  setAuthStatus: (status: boolean) => void;
  fetchData: (method: string, url: string, payload?: any) => Promise<any>;
  fetchConversationStart: (url: string) => Promise<any>;
  setUserInfo: (data: any) => void;
}

interface Conversation {
  audio: string;
  state: number;
}

interface IUserInfo {
  session_id: string;
  user_virtual_id: string;
}

interface CommonApiPayload {
  conversation: Conversation;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);
const apiBaseUrl = 'https://dev.aiassistant.sunbird.org/all_bot/v1/';
export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean>(false);

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('authStatus');
    if (storedAuthStatus) {
      setAuthStatus(JSON.parse(storedAuthStatus));
    }
  }, []);

  const updateAuthStatus = (status: boolean) => {
    setAuthStatus(status);
    localStorage.setItem('authStatus', JSON.stringify(status));
  };

  const setAuthData = (data: any) => {
    localStorage.setItem('authInfo', JSON.stringify(data));
  };

  const fetchData = async (method: string, url: string, payload?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiBaseUrl + url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result?.user_virtual_id) {
        localStorage.setItem('authInfo', JSON.stringify(result));
        setUserInfo(result);
        updateAuthStatus(true);
      } else {
        setUserInfo(undefined);
        updateAuthStatus(true);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [conversationStart, setConversationStart] =
    useState<CommonApiPayload | null>(null);

  const fetchConversationStart = async (url: string) => {
    const authInfo = localStorage.getItem('authInfo');
    const userVirtualId = authInfo
      ? JSON.parse(authInfo).user_virtual_id
      : null;

    if (userVirtualId) {
      try {
        const response = await fetch(apiBaseUrl + url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_virtual_id: userVirtualId }),
        });
        const data = await response.json();
        return data;
        //setConversationStart(data);
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
      }
    }
  };

  return (
    <ApiContext.Provider
      value={{
        userInfo,
        loading,
        error,
        authStatus,
        setAuthStatus: updateAuthStatus,
        fetchData,
        setUserInfo: setAuthData,
        conversationStart,
        fetchConversationStart,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

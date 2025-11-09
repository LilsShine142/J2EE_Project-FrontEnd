import { Spin } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { useOAuthCallback } from '../../hooks/useOAuthCallback';

const OAuthCallback = () => {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const { isLoading, isError } = useOAuthCallback(provider, code);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Spin
        size="large"
        tip={isError ? 'Xác thực thất bại...' : 'Đang xác thực...'}
      />
    </div>
  );
};

export default OAuthCallback;